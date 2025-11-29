import { GoogleGenAI } from "@google/genai";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

export const transcribe = async () => {
  const serviceAccount = JSON.parse(Buffer.from(process.env.GOOGLE_KEY_FILE!, "base64").toString("utf-8"));

  const ai = new GoogleGenAI({
    vertexai: true,
    project: process.env.GOOGLE_CLOUD_PROJECT,
    location: "global",
    googleAuthOptions: {
      credentials: serviceAccount,
    },
  });

  const prompt = `Transcribe the audio. For each caption provide a timecode in milliseconds, caption, translation to english, and a words array of the caption`;

  const responseSchema = z.array(
    z.object({
      milliseconds: z.number(),
      caption: z.string(),
      translation: z.string(),
      words: z.array(z.string()),
    })
  );

  // const responseSchema = {
  //   type: "ARRAY",
  //   items: {
  //     type: "OBJECT",
  //     properties: {
  //       milliseconds: { type: "INTEGER" },
  //       caption: { type: "STRING" },
  //       translation: { type: "STRING" },
  //       words: {
  //         type: "ARRAY",
  //         items: {
  //           type: "STRING",
  //         },
  //       },
  //     },
  //     required: ["milliseconds", "caption", "translation", "words"],
  //   },
  // };

  // pro sync
  // Jap 30 sec from url 26.166s
  // jap 30 sec inline 31.362s

  // pro async
  // 1 hour from url, time to first caption 1:52.883

  // flash async
  // 1 hour sec from url, time to first caption 13.245s

  const audioUrl = "https://storage.googleapis.com/turbo-9892e.firebasestorage.app/test/audio20.mp3";

  //console.time('trans')
  // const audioResponse = await fetch(audioUrl30Sec);
  // const textFile = await audioResponse.bytes();
  // const string = new TextDecoder().decode(textFile);
  //const base64String = Buffer.from(textFile).toString('base64')

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [
      { text: prompt },
      {
        fileData: {
          //fileUri: "gs://turbo-9892e.firebasestorage.app/test/jap30sec.mp3",
          fileUri: audioUrl,
          mimeType: "audio/mpeg",
        },
        // 20 mb limit?
        // inlineData: {
        //   data: base64String,
        //   mimeType: "audio/mpeg",
        // }
      },
    ],
    // Required to enable timestamp understanding for audio-only files
    config: {
      audioTimestamp: true,
      responseMimeType: "application/json",
      responseJsonSchema: zodToJsonSchema(responseSchema),
    },
  });

  // let text = ''

  // for await (const chunk of response) {
  //   //console.timeEnd('trans')
  //   text += chunk.text
  // }

  return responseSchema.parse(JSON.parse(response.text!));
};
