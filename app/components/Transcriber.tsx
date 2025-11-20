import { postTranscription } from "@/utils/api";
import { usePlayerStore } from "@/utils/store";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import AudioPlayer from "./AudioPlayer";
import { fillCaptionsStart } from "@/utils";

export default function Transcriber({
  id,
  sourceId,
  episodeTitle,
}: {
  id: string;
  sourceId: string;
  episodeTitle: string;
}) {
  const [captions, setCaptions] = useState<Caption[]>([]);
  const [processedSeconds, setProcessedSeconds] = useState(0);
  const [fileName, setFileName] = useState("");
  const currentTime = usePlayerStore((state) => state.currentTime);
  const isTranscribing = useRef(false);

  const { lang } = useLocalSearchParams();

  useEffect(() => {
    if (!isTranscribing.current) {
      isTranscribing.current = true;

      postTranscription(id, lang as string, sourceId, episodeTitle, 0)
        .then((from0Response) => {
          setCaptions(fillCaptionsStart(from0Response.captions));
          setProcessedSeconds(from0Response.processedSeconds);
          setFileName(from0Response.fileName);

          usePlayerStore.setState({
            caption: from0Response.captions[0],
            //nextStart: from0Response.captions.length > 1 ? from0Response.captions[1].captionStart : -1,
          });
        })
        .finally(() => {
          isTranscribing.current = false;
        });
    }
  }, []);

  useEffect(() => {}, [currentTime]);

  if (!fileName) {
    return null;
  }

  return <AudioPlayer uri={`https://storage.googleapis.com/turbo-9892e.firebasestorage.app/${fileName}`} />;
}
