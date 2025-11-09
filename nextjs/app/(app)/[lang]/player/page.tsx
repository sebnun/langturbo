import { transcribe } from "@/lib/transcription";

export default async function PlayerPage({ params }: { params: { lang: string } }) {
  const { lang } = await params;

  // do check like is this in db already etc, see legacy

  const data = await transcribe()

  return <main className="">{data}</main>;
}
