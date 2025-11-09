import { transcribe } from "@/lib/transcription";

export const dynamic = 'force-dynamic'

export default async function PlayerPage() {

  // do check like is this in db already etc, see legacy

  const data = await transcribe()

  return <main className="">{data}</main>;
}
