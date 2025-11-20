import { usePlayerStore } from "@/utils/store";
import { useAudioPlayer, useAudioPlayerStatus } from "expo-audio";
import { useEffect } from "react";

export default function AudioPlayer({ uri }: { uri: string }) {
  // TODO need to release it manually to avoid memory leaks?

  usePlayerStore.setState({ player: useAudioPlayer(uri, { updateInterval: 100 }) });
  const status = useAudioPlayerStatus(usePlayerStore.getState().player!);

  useEffect(() => {
    usePlayerStore.setState({
      duration: status.duration,
      playing: status.playing,
      currentTime: status.currentTime,
    });
  }, [status]);

  //console.log(status);
  return null;
}
