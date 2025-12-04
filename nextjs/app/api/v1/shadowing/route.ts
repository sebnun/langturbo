import { NextResponse, type NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { backOff } from "exponential-backoff";

export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  const searchParams = request.nextUrl.searchParams;
  const languageCode = searchParams.get("languageCode");
  const blob = await request.blob();

  // audio/mpeg from Android, audio/x-m4a from iOS, audio/webm from web
  const file = new File([blob], "test", { type: request.headers.get('content-type')! });


  console.log(file)

  // About 20 seconds
  if (file.size > 300000) {
    return NextResponse.json({ error: "File too large" }, { status: 400 });
  }
  
  const form = new FormData();
  form.append("file", file);
  form.append("model", "Systran/faster-whisper-large-v3");
  form.append("language", languageCode!);

  const response = await backOff(
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
    return { text: "" };
  });

  return NextResponse.json({ text: response.text });
}
