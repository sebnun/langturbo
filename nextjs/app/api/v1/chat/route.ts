import { auth } from "@/lib/auth";
import { getLanguageNameById, languageIds } from "@/lib/languages-legacy";
import { capitalizeFirstLetter } from "@/lib/utils";
import { streamText } from "ai";
import { headers } from "next/headers";
import { NextRequest } from "next/server";
import { createVertex, GoogleVertexProvider } from "@ai-sdk/google-vertex";

let vertex: GoogleVertexProvider;

// Need this to avoid docker build error
const initializeVertexClient = () => {
  if (!vertex) {
    const serviceAccount = JSON.parse(Buffer.from(process.env.GOOGLE_KEY_FILE!, "base64").toString("utf-8"));
    vertex = createVertex({
      project: process.env.GOOGLE_CLOUD_PROJECT,
      location: "global",
      googleAuthOptions: {
        credentials: serviceAccount,
      },
    });
  }
};
export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  initializeVertexClient()

  const { word, sentence, languageCode } = await request.json();

  console.log(word, sentence, languageCode);

  const language = capitalizeFirstLetter(getLanguageNameById(languageIds[languageCode]));

  const prompt = `Given the sentence:

  ${sentence}
  
  Provide a definition of "${word}" in the context of the sentence and a couple of example sentences using the word. Be concise and do not use headings.`;

  const result = streamText({
    model: vertex("gemini-3-pro-preview"),
    providerOptions: {
      google: {
        thinkingConfig: {
          thinkingLevel: "low",
        },
      },
    },
    messages: [
      { role: "system", content: `You are a helpful ${language} language teacher.` },
      { role: "user", content: prompt },
    ],
  });

  console.log('chat', session.user.id)

  return result.toUIMessageStreamResponse();
}
