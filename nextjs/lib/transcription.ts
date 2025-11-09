import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  vertexai: true,
  project: process.env.GOOGLE_CLOUD_PROJECT,
  location: process.env.GOOGLE_CLOUD_LOCATION,
//   googleAuthOptions: {
//     clientOptions: {
//         keyFile : 'gcp-service.json'
//     }
//   }
});

export const transcribe = async () => {
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: "why is the sky blue?",
  });
  return response.text
};
