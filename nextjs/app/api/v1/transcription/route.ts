import { db } from "@/db";
import { episodesTable, segmentsTable, translationsTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest } from "next/server";
import { capitalizeFirstLetter } from "@/lib/utils";
import { randomUUID } from "crypto";
import fs, { writeFileSync } from "fs";
import { spawnSync } from "child_process";
import { getLanguageCodeByName, getLanguageNameById } from "@/lib/languages-legacy";
import { backOff } from "exponential-backoff";
import CodecParser from "codec-parser";
import { Storage } from "@google-cloud/storage";

const serviceAccount = JSON.parse(Buffer.from(process.env.GOOGLE_STORAGE_KEY_FILE!, "base64").toString("utf-8"));

const storage = new Storage({
  projectId: process.env.GOOGLE_CLOUD_PROJECT,
  credentials: serviceAccount,
});

const SEEK_FORWARD_SECONDS = 30;

export const POST = async (req: NextRequest) => {
  const { id, languageCode, itunesId, requestFileName, episodeTitle, from } = await req.json();

  // Client will always request from 0 first
  if (from === 0) {
    let episodeRows = await db.select().from(episodesTable).where(eq(episodesTable.id, id)).limit(1);

    if (episodeRows.length > 0) {
      // Check if other request is processing from 0
      while (episodeRows[0].processed_seconds === -1) {
        console.log("Waiting for transcription " + id);
        await new Promise((resolve) => setTimeout(resolve, 500));
        episodeRows = await db.select().from(episodesTable).where(eq(episodesTable.id, id)).limit(1);
      }

      console.log("Already transcribed and translated " + id);

      // TODO test english
      const segmentsRows = await db
        .select()
        .from(segmentsTable)
        .leftJoin(translationsTable, eq(segmentsTable.id, translationsTable.segment_id));

      return Response.json({
        captions: segmentsRows.map((row) => {
          return {
            id: row.segments.id,
            start: row.segments.start,
            end: row.segments.end,
            text: row.segments.text,
            translation: languageCode === "en" || !row.translations?.translation ? "" : row.translations.translation,
            words: row.segments.words,
          };
        }),
        fileName: episodeRows[0].file_name,
        processedSeconds: episodeRows[0].processed_seconds,
      });
    }
  }

  // At this point we know it's a new episode from 0 or a known episode from > 0

  if (from === 0) {
    // processed_seconds = -1 default means it's being processed
    // TODO itunesId here?
    await db
      .insert(episodesTable)
      .values({ id, language_code: languageCode, show_id: itunesId, title: episodeTitle, file_name: "" });
  }

  // Given the same podcast URL, audio can change just due to time or IP of request, use persisted URL
  const fileData =
    from === 0
      ? await downloadPodcastData(id)
      : { fileName: requestFileName, extension: requestFileName.split(".").pop()!, mime: "" };

  // HTTP not ok
  // TODO handle in client
  if (!fileData) {
    await db.delete(episodesTable).where(eq(episodesTable.id, id));
    return Response.json({
      error: "DOWNLOAD_ERROR",
    });
  }

  const fileName = from === 0 ? fileData.fileName : requestFileName;
  const end = from + SEEK_FORWARD_SECONDS;
  const outputPath = `/tmp/${from}-${end}.${fileData.extension}`;

  console.time("trimAudioToFile");
  spawnSync("ffmpeg", [
    "-i",
    from > 0
      ? `https://storage.googleapis.com/turbo-9892e.firebasestorage.app/${requestFileName}`
      : "/tmp/" + fileData.fileName,
    "-y",
    "-vn",
    "-ss",
    String(from),
    "-t",
    String(SEEK_FORWARD_SECONDS),
    "-c:a",
    "copy",
    outputPath,
  ]);
  console.timeEnd("trimAudioToFile");

  const persistPromise = from === 0 ? persistPodcastPromise(fileName!, fileData.mime) : Promise.resolve();

  console.time("transcribePersist");
  const [transcriptionPromiseResponse] = await Promise.all([transcribePromise(outputPath, languageId), persistPromise]);
  console.timeEnd("transcribePersist");

  const { data: transcriptionResponse } = transcriptionPromiseResponse;

  // Some transcriptions have segments with no text, need to sort them också
  let actualSegments = (transcriptionResponse as CreateTranscriptionResponseVerboseJson).segments
    ?.map((s) => {
      return { ...s, text: s.text.trim() };
    })
    .filter((s) => s.text)
    .sort((a, b) => a.start - b.start);

  // Always at least 1 caption
  if (actualSegments?.length === 0) {
    console.log("No voices detected at " + id, from);

    const fakeCaption = {
      id: randomUUID(),
      start: from,
      end,
      text: "No voices detected",
      tokens: [],
      translation: "",
    };

    await sql`insert into segments (id, episode_id, start, "end", text, language_id, tokens) values (${fakeCaption.id}, ${id}, ${fakeCaption.start}, ${fakeCaption.end}, ${fakeCaption.text}, ${languageId}, ${fakeCaption.tokens})`;

    // Need to make sure segments are inserted first
    await sql`update episodes set processed_seconds = ${end}, file_name = ${fileName} where id = ${id}`;

    res.status(200).json({
      captions: [fakeCaption],
      fileName,
      processedSeconds: end,
    });
    return;
  }

  // Remove duplicated text segments
  const uniqueSegments = [];
  for (let i = 0; i < actualSegments!.length; i++) {
    const segment = actualSegments![i];
    if (i === 0) {
      uniqueSegments.push(segment);
    } else {
      if (segment.text === uniqueSegments[uniqueSegments.length - 1].text) {
        uniqueSegments[uniqueSegments.length - 1].end = segment.end;
      } else {
        uniqueSegments.push(segment);
      }
    }
  }
  actualSegments = uniqueSegments;

  console.time("chatpromises");
  const [translatedSentences, tokenizedSentences] = await Promise.all([
    translateSentencePromises(
      actualSegments!.map((sd) => sd.text),
      languageId
    ),
    tokenizePromise(
      actualSegments!.map((sd) => sd.text),
      languageId
    ),
  ]);
  console.timeEnd("chatpromises");

  const captions: Caption[] = [];

  for (let i = 0; i < actualSegments!.length; i++) {
    const segment = actualSegments![i];

    captions.push({
      id: randomUUID(),
      text: segment.text.trim(),
      start: segment.start + from,
      end: segment.end + from,
      tokens: tokenizedSentences[i],
      translation: translatedSentences[i].data.choices[0].message
        ? translatedSentences[i].data.choices[0].message.content || ""
        : "",
    });
  }

  // If there was a voice cut off the last segment end is >= x
  let newProcessedSeconds = end;
  if (captions.length > 1) {
    // Need at least 1 caption
    const lastCaption = captions[captions.length - 1]!;
    if (lastCaption.end >= end) {
      newProcessedSeconds = lastCaption.start;
      // Remove cutoff segment
      captions.pop();
    }
  }

  await sql`insert into segments ${sql(
    captions.map((caption) => ({
      id: caption.id,
      episode_id: id,
      start: caption.start,
      end: caption.end,
      text: caption.text,
      language_id: languageId,
      tokens: caption.tokens,
      en_translation: caption.translation || null,
    }))
  )}`;

  // Need to make sure segments are inserted first
  await sql`update episodes set processed_seconds = ${newProcessedSeconds}, file_name = ${fileName} where id = ${id}`;

  return Response.json({
    captions,
    fileName,
    processedSeconds: newProcessedSeconds,
  });
};

const downloadPodcastData = async (audioUrl: string) => {
  let fetchResponse;
  let audioDataArrayBuffer;

  try {
    fetchResponse = await fetch(audioUrl, {
      headers: {
        "User-Agent": process.env.USER_AGENT!,
      },
      // Some podcasts cause a timeout, which makes all next requests fail
      signal: AbortSignal.timeout(30000),
    });

    audioDataArrayBuffer = await fetchResponse.arrayBuffer();
  } catch (e) {
    console.error("fetch timeout? error", audioUrl, e);
    return null;
  }

  if (!fetchResponse.ok) {
    return null;
  }

  const mime = fetchResponse.headers.get("content-type");
  const extension = getExtensionForMime(mime, audioUrl);

  const fileName = `${randomUUID()}.${extension}`;
  const audioData = Buffer.from(audioDataArrayBuffer);

  writeFileSync("/tmp/" + fileName, audioData);

  // VBR breaks seeking in players, it looks like the problems happens only in mp3s? https://terrillthompson.com/624
  let isVBR = false;
  if (fileName.endsWith(".mp3")) {
    // use mediainfo to check if it's VBR? just use this, and log false positives
    // I need to download all? frames to check if it's VBR, tools like ffprobe only check the first frame

    const parser = new CodecParser("audio/mpeg", { enableFrameCRC32: false });
    const frames = parser.parseAll(audioData);
    frames.pop(); // Last frame can have different bitrate even if it's CBR?

    //@ts-expect-error fuck
    isVBR = frames.some((frame) => frame.header.bitrate !== frames[0].header.bitrate);

    if (isVBR) {
      console.log("VBR detected, converting to CBR");

      // https://stackoverflow.com/questions/53742145/precise-seek-in-mp3-files-on-android#comment103284050_58216667
      // .mp4 is faster? but breaks groq

      spawnSync("ffmpeg", [
        "-i",
        "/tmp/" + fileName,
        "-y",
        "-acodec",
        "copy",
        "-b:a",
        "128k",
        "/tmp/" + "cbr" + fileName,
      ]);
    }
  }

  return {
    extension,
    mime,
    fileName: isVBR ? "cbr" + fileName : fileName,
  };
};

const getExtensionForMime = (mime: string | null, audioUrl: string) => {
  // Some mimes are deprecated but still used, just replace them
  const legitMime = mime?.replace("/x-", "/");
  // Groq accepts [flac mp3 mp4 mpeg mpga m4a ogg opus wav webm] but only looks at the extension looks like
  // Just match a similar extension and hope for the best

  const knwonExtensionMime: Record<string, string> = {
    "audio/aac": "m4a",
    "audio/mpeg": "mp3",
    "audio/mp4": "m4a",
    "audio/ogg": "ogg",
    "audio/webm": "webm",
    "audio/3gpp": "mp4",
    "audio/m4a": "m4a",
    "audio/mpeg-3": "mp3",
    "audio/mp3": "mp3",
    "audio/mpeg3": "mp3",
    "audio/wav": "wav",
    "video/mp4": "mp4",
    "video/mpeg": "mpeg",
    "video/ogg": "ogg",
    "video/webm": "webm",
    "video/3gpp": "mp4",
    "video/quicktime": "m4a",
  };

  const extension = legitMime ? knwonExtensionMime[legitMime] : null;
  if (!extension) {
    console.error("Unknown mime type", legitMime);

    for (const ext of Object.values(knwonExtensionMime)) {
      if (audioUrl.includes(`.${ext}`)) {
        console.log("Using extension from URL", ext);
        return ext;
      }
    }

    return "mp3";
  }

  return extension;
};

const persistPodcastPromise = async (fileName: string, mime: string | null) => {
  return storage.bucket("turbo-9892e.firebasestorage.app").upload("/tmp/" + fileName, {
    destination: fileName,
    metadata: {
      contentType: mime ? mime : undefined,
    },
  });
};

// const transcribePromise = async (audioPath: string, languageId: number) => {
//   // It needs to be here for firebase to pick up the env
//   const groq = new Groq({
//     apiKey: process.env.GROQ_API_KEY,
//     //maxRetries: 5, // Default is 2 this is linear?
//   });
//   // Has own retry logic
//   return backOff(
//     () =>
//       groq.audio.transcriptions
//         .create({
//           file: fs.createReadStream(audioPath),
//           model: "whisper-large-v3",
//           response_format: "verbose_json",
//           language: getLanguageCodeByName(getLanguageNameById(languageId)),
//           // Not supported in groq
//           //timestamp_granularities: ["segment"], // word granularity have incorrect timestamps related to segments
//         })
//         .withResponse(),
//     {
//       numOfAttempts: 5,
//       retry(e, attemptNumber) {
//         console.error("Transcribe error", e, attemptNumber);
//         return true;
//       },
//     }
//   ).catch((e) => {
//     console.error("from catch", e);
//     return { data: { segments: [] } };
//   });
// };

// const translateSentencePromises = async (sentences: string[], languageId: number) => {
//   const regex = new RegExp("[\\p{Letter}]+", "u");

//   const openai = new AzureOpenAI({
//     apiKey: process.env.AZURE_OPENAI_API_KEY,
//     apiVersion: process.env.AZURE_OPENAI_API_VERSION,
//     endpoint: process.env.AZURE_OPENAI_ENDPOINT,
//     deployment: "gpt-4o-latest",
//     maxRetries: 5, // Default is 2
//     // Ok for whisper and chat
//     //timeout: 20 * 1000, // 20 seconds ,default is 10 minutes,, requests which time out will be retried.
//   });

//   return Promise.all(
//     sentences.map((s) => {
//       // Dont translate if at least not a word character or the audio language is the same as the user language
//       if (!regex.test(s) || languageId === 1) {
//         return Promise.resolve({ data: { choices: [{ message: { content: "" } }] } });
//       }

//       return openai.chat.completions
//         .create({
//           messages: [
//             { role: "system", content: "You are a translator." },
//             {
//               role: "user",
//               content: `Translate from ${capitalizeFirstLetter(
//                 getLanguageNameById(languageId)
//               )} to English and respond only with the translation:\n${s}`,
//             },
//           ],
//           model: "gpt-4o",
//         })
//         .withResponse()
//         .catch((e) => {
//           console.error("from catch", e);

//           // This is needed to fail gracefully
//           return { data: { choices: [{ message: { content: "" } }] } };
//         });
//     })
//   );
// };
