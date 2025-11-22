import { usePlayerStore } from "@/utils/store";
import { useAudioPlayer, useAudioPlayerStatus } from "expo-audio";
import { useEffect } from "react";

export default function AudioPlayer({
  uri,
  imageUrl,
  episodeTitle,
}: {
  uri: string;
  imageUrl: string;
  episodeTitle: string;
}) {
  const player = useAudioPlayer(uri, { updateInterval: 100 });
  const status = useAudioPlayerStatus(player);


  const playing = usePlayerStore((state) => state.playing);
  const seekToRequest = usePlayerStore((state) => state.seekToRequest);

  useEffect(() => {
    // TODO
    //player.setActiveForLockScreen
    console.log('audioplayer', player.id)
    return () => {
      // TODO check memory usage
      console.log('release', player.id)
      player.pause()
      player.release()
    }
  }, []);

  useEffect(() => {
    usePlayerStore.setState({
      duration: status.duration,
      playing: status.playing,
      currentTime: status.currentTime
    });

    if (status.didJustFinish) {
      player.seekTo(0);
    }
  }, [status]);

  useEffect(() => {
    if (playing && !player.playing) {
      player.play();
    } else if (!playing && player.playing) {
      player.pause();
    }
  }, [playing]);

  useEffect(() => {
    player.seekTo(seekToRequest);
    player.play();
  }, [seekToRequest]);

  return null;
}
