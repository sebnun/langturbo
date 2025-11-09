import { GoogleGenAI } from "@google/genai";

export const transcribe = async () => {
  const serviceAccount = JSON.parse(Buffer.from(process.env.GOOGLE_KEY_FILE!, "base64").toString("utf-8"));

  const ai = new GoogleGenAI({
    vertexai: true,
    project: process.env.GOOGLE_CLOUD_PROJECT,
    location: process.env.GOOGLE_CLOUD_LOCATION,
    googleAuthOptions: {
      credentials: serviceAccount,
    },
  });

  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: "write the name of a color",
  });
  return response.text;
};
