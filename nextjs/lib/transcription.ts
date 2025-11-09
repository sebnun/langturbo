import { GoogleGenAI } from "@google/genai";

const serviceAccount = JSON.parse(process.env.GOOGLE_KEY_FILE!);

const ai = new GoogleGenAI({
  vertexai: true,
  project: process.env.GOOGLE_CLOUD_PROJECT,
  location: process.env.GOOGLE_CLOUD_LOCATION,
  googleAuthOptions: {
    credentials: serviceAccount
  }
});

export const transcribe = async () => {
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: "why is the sky blue?",
  });
  return response.text
};
