import { postTranscription } from "@/utils/api";
import { usePlayerStore } from "@/utils/store";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import AudioPlayer from "./AudioPlayer";
import { convertSecondsDurationToHuman, fillCaptionsStart } from "@/utils";

const SEEK_FORWARD_SECONDS = 30;

export default function Transcriber({
  id,
  sourceId,
  episodeTitle,
  podcastImageUrl,
}: {
  id: string;
  sourceId: string;
  episodeTitle: string;
  podcastImageUrl: string;
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
            nextStart: from0Response.captions.length > 1 ? from0Response.captions[1].captionStart : -1,
            error: from0Response.error,
            positionLabel: "00:00",
          });
        })
        .finally(() => {
          isTranscribing.current = false;
        });
    }
  }, []);

  useEffect(() => {
    const realCaptionIndex = captions.findLastIndex((caption) => caption.captionStart! <= currentTime);

    usePlayerStore.setState({
      caption: captions[realCaptionIndex],
      positionLabel: convertSecondsDurationToHuman(currentTime),
      progressPercentage: Math.min((currentTime / usePlayerStore.getState().duration) * 100, 100),
      nextStart: captions.length > realCaptionIndex + 1 ? captions[realCaptionIndex + 1].captionStart : -1,
      prevStart: realCaptionIndex > 0 ? captions[realCaptionIndex - 1].captionStart : -1,
    });

    if (
      !isTranscribing.current &&
      currentTime + SEEK_FORWARD_SECONDS > processedSeconds &&
      processedSeconds < usePlayerStore.getState().duration
    ) {
      isTranscribing.current = true;

      postTranscription(id, lang as string, sourceId, episodeTitle, processedSeconds, fileName)
        .then((response) => {
          const newCaptions = fillCaptionsStart([...captions, ...response.captions]);
          setCaptions(newCaptions);
          setProcessedSeconds(response.processedSeconds);

          // TODO Ignore reponse errors here?

          // To trigger nextButton disabled update when paused
          // ATTN This can cause issues when seeking fast, it sets an incorrect caption
          if (!usePlayerStore.getState().playing) {
            const realCaptionIndex = captions.findLastIndex((caption) => caption.captionStart! <= currentTime);
            usePlayerStore.setState({
              nextStart: captions.length > realCaptionIndex + 1 ? captions[realCaptionIndex + 1].captionStart : -1,
            });
          }
        })
        .finally(() => {
          isTranscribing.current = false;
        });
    }
  }, [currentTime]);

  if (!fileName) {
    return null;
  }

  return (
    <AudioPlayer
      episodeTitle={episodeTitle}
      imageUrl={podcastImageUrl}
      uri={`https://storage.googleapis.com/turbo-9892e.firebasestorage.app/${fileName}`}
    />
  );
}
