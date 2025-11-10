import AudioPlayer from "@/components/player/AudioPlayer";
import Caption from "@/components/player/Caption";
import TimeCode from "@/components/player/TimeCode";
import Translation from "@/components/player/Translation";
import { transcribe } from "@/lib/transcription";

export const dynamic = "force-dynamic";

export default async function PlayerPage() {
  // do check like is this in db already etc, see legacy

  const json = await transcribe()

  return (
    <main>
      <TimeCode />
      <Caption />
      <Translation />
      <AudioPlayer data={json} url="https://storage.googleapis.com/turbo-9892e.firebasestorage.app/test/audio20.mp3" />
    </main>
  );
}
