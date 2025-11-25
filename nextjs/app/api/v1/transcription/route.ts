import { db } from "@/db";
import { episodesTable, segmentsTable, translationsTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest } from "next/server";
import { capitalizeFirstLetter } from "@/lib/utils";
import { randomUUID } from "crypto";
import fs, { writeFileSync } from "fs";
import { spawnSync } from "child_process";
import { getLanguageNameById, languageIds } from "@/lib/languages-legacy";
import { backOff } from "exponential-backoff";
import CodecParser from "codec-parser";
import { Storage } from "@google-cloud/storage";
import { GoogleGenAI, ThinkingLevel } from "@google/genai";

// Lazy initialization to avoid executing at build time
let storage: Storage;
let ai: GoogleGenAI;

const initializeClients = () => {
  if (!storage) {
    const serviceAccountStorage = JSON.parse(
      Buffer.from(process.env.GOOGLE_STORAGE_KEY_FILE!, "base64").toString("utf-8")
    );
    storage = new Storage({
      projectId: process.env.GOOGLE_CLOUD_PROJECT,
      credentials: serviceAccountStorage,
    });
  }

  if (!ai) {
    const serviceAccountVertex = JSON.parse(Buffer.from(process.env.GOOGLE_KEY_FILE!, "base64").toString("utf-8"));
    ai = new GoogleGenAI({
      vertexai: true,
      project: process.env.GOOGLE_CLOUD_PROJECT,
      location: "global",
      googleAuthOptions: {
        credentials: serviceAccountVertex,
      },
    });
  }
};

const SEEK_FORWARD_SECONDS = 30;

export const POST = async (req: NextRequest) => {
  initializeClients();

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

      const segmentsRows = await db
        .select()
        .from(segmentsTable)
        .where(eq(segmentsTable.episode_id, id))
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
  const [transcriptionPromiseResponse] = await Promise.all([
    transcribePromise(outputPath, languageCode),
    persistPromise,
  ]);
  console.timeEnd("transcribePersist");

  const transcriptionResponse = transcriptionPromiseResponse;

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
      words: [],
      translation: "",
    };

    await db.insert(segmentsTable).values({
      id: fakeCaption.id,
      episode_id: id,
      start: fakeCaption.start,
      end: fakeCaption.end,
      text: fakeCaption.text,
      language_code: languageCode,
      words: fakeCaption.words,
    });

    if (languageCode != "en") {
      await db.insert(translationsTable).values({ segment_id: fakeCaption.id, translation: "", language_code: "en" });
    }

    // Need to make sure segments are inserted first
    await db.update(episodesTable).set({ processed_seconds: end, file_name: fileName }).where(eq(episodesTable.id, id));

    return Response.json({
      captions: [fakeCaption],
      fileName,
      processedSeconds: end,
    });
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

  console.time("translation");
  const translatedSentences = await translateSentencePromises(
    actualSegments!.map((sd) => sd.text),
    languageCode
  );
  console.timeEnd("translation");

  const captions: Caption[] = [];

  for (let i = 0; i < actualSegments!.length; i++) {
    const segment = actualSegments![i];

    captions.push({
      id: randomUUID(),
      text: segment.text.trim(),
      start: segment.start + from,
      end: segment.end + from,
      words: segment.words!.map((w) => ({ ...w, start: w.start + from, end: w.end + from })),
      translation: translatedSentences[i],
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

  await db.insert(segmentsTable).values(
    captions.map((caption) => ({
      id: caption.id,
      episode_id: id,
      start: caption.start,
      end: caption.end,
      text: caption.text,
      language_code: languageCode,
      words: caption.words,
    }))
  );

  if (languageCode != "en") {
    await db.insert(translationsTable).values(
      captions.map((caption) => ({
        segment_id: caption.id,
        translation: caption.translation || "",
        language_code: "en",
      }))
    );
  }

  // Need to make sure segments are inserted first
  await db
    .update(episodesTable)
    .set({ processed_seconds: newProcessedSeconds, file_name: fileName })
    .where(eq(episodesTable.id, id));

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

const transcribePromise = async (audioPath: string, languageCode: string) => {
  const form = new FormData();
  const fileBuffer = fs.readFileSync(audioPath);
  form.append("file", new Blob([fileBuffer]), "audio"); // TODO need to add extension?
  form.append("model", "Systran/faster-whisper-large-v3");
  form.append("timestamp_granularities[]", "word");
  form.append("response_format", "verbose_json");
  form.append("language", languageCode);

  return backOff(
    () =>
      fetch("http://34.26.13.75/v1/audio/transcriptions", {
        method: "POST",
        body: form,
      }).then((r) => r.json()),
    {
      numOfAttempts: 5,
      retry(e, attemptNumber) {
        console.error("Transcribe error", e, attemptNumber);
        return true;
      },
    }
  ).catch((e) => {
    console.error("from catch", e);
    return { segments: [] };
  });
};

const translateSentencePromises = async (sentences: string[], languageCode: string) => {
  if (languageCode === "en") {
    return sentences.map(() => "");
  }

  const text = sentences.join("\n");

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: [
        {
          text: `Translate from ${capitalizeFirstLetter(
            getLanguageNameById(languageIds[languageCode])
          )} to English. Respond only with the translation line by line:\n${text}`,
        },
      ],
      config: {
        thinkingConfig: {
          includeThoughts: false,
          thinkingLevel: ThinkingLevel.LOW,
        },
      },
    });

    const fullTranslation = response?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
    return fullTranslation.split("\n");
  } catch (e) {
    console.error("from catch", e);
    return sentences.map(() => "");
  }
};

/*

{
  "task": "transcribe",
  "language": "sv",
  "duration": 59.99125,
  "text": "Du lyssnar på en podd från Acast. MUNSÅR",
  "words": [
    {
      "start": 0,
      "end": 0.08,
      "word": " Du",
      "probability": 0.998046875
    },
    {
      "start": 0.08,
      "end": 0.6,
      "word": " lyssnar",
      "probability": 0.998209635416667
    },
    {
      "start": 0.6,
      "end": 0.74,
      "word": " på",
      "probability": 1
    },
    {
      "start": 0.74,
      "end": 0.92,
      "word": " en",
      "probability": 1
    },
    {
      "start": 0.92,
      "end": 1.32,
      "word": " podd",
      "probability": 0.99951171875
    },
    {
      "start": 1.32,
      "end": 1.46,
      "word": " från",
      "probability": 1
    },
    {
      "start": 1.46,
      "end": 1.92,
      "word": " Acast.",
      "probability": 0.77685546875
    },
    {
      "start": 58.56,
      "end": 59.96,
      "word": " MUNSÅR",
      "probability": 0.636088053385417
    }
  ],
  "segments": [
    {
      "id": 1,
      "seek": 0,
      "start": 0,
      "end": 1.92,
      "text": " Du lyssnar på en podd från Acast.",
      "tokens": [50365, 5153, 48670, 18860, 289, 4170, 465, 2497, 67, 18669, 316, 3734, 13, 50473],
      "temperature": 0,
      "avg_logprob": -0.0961588541666667,
      "compression_ratio": 0.813953488372093,
      "no_speech_prob": 0.0232696533203125,
      "words": [
        {
          "start": 0,
          "end": 0.08,
          "word": " Du",
          "probability": 0.998046875
        },
        {
          "start": 0.08,
          "end": 0.6,
          "word": " lyssnar",
          "probability": 0.998209635416667
        },
        {
          "start": 0.6,
          "end": 0.74,
          "word": " på",
          "probability": 1
        },
        {
          "start": 0.74,
          "end": 0.92,
          "word": " en",
          "probability": 1
        },
        {
          "start": 0.92,
          "end": 1.32,
          "word": " podd",
          "probability": 0.99951171875
        },
        {
          "start": 1.32,
          "end": 1.46,
          "word": " från",
          "probability": 1
        },
        {
          "start": 1.46,
          "end": 1.92,
          "word": " Acast.",
          "probability": 0.77685546875
        }
      ]
    },
    {
      "id": 2,
      "seek": 3000,
      "start": 58.56,
      "end": 59.96,
      "text": " MUNSÅR",
      "tokens": [50365, 376, 3979, 50, 127, 227, 49, 50415],
      "temperature": 0,
      "avg_logprob": -0.549045138888889,
      "compression_ratio": 0.466666666666667,
      "no_speech_prob": 0.0189361572265625,
      "words": [
        {
          "start": 58.56,
          "end": 59.96,
          "word": " MUNSÅR",
          "probability": 0.636088053385417
        }
      ]
    }
  ]
}

*/
