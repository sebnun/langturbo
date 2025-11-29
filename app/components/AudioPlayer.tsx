import { useAppStore, usePlayerStore } from "@/utils/store";
import { useAudioPlayer, useAudioPlayerStatus } from "expo-audio";
import { use, useEffect, useRef } from "react";
import { Platform } from "react-native";

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

  const seekToRequest = usePlayerStore((state) => state.seekToRequest);
  const playbackRequest = usePlayerStore((state) => state.playbackRequest);
  const slower = useAppStore((state) => state.slower);

  useEffect(() => {
    // TODO
    //player.setActiveForLockScreen
    //console.log('audioplayer', player.id)
    return () => {
      // TODO check memory usage
      if (Platform.OS === "web") {
        player.pause();
        player.release();
      }
    };
  }, []);

  useEffect(() => {
    usePlayerStore.setState({
      duration: status.duration,
      playing: status.playing,
      currentTime: status.currentTime,
    });

    if (status.didJustFinish) {
      player.seekTo(0);
      // Need this to keep in sync
      usePlayerStore.setState({ playbackRequest: 'pause' });
    }
  }, [status]);

  useEffect(() => {
    if (playbackRequest === "play") {
      player.play();
    } else {
      player.pause();
    }
  }, [playbackRequest]);

  useEffect(() => {
    if (slower) {
      player.setPlaybackRate(0.75);
    } else {
      player.setPlaybackRate(1);
    }
  }, [slower]);

  useEffect(() => {
    // Avoid seeking on first load when duration is 0
    if (usePlayerStore.getState().duration) {
      player.seekTo(seekToRequest);
      usePlayerStore.setState({ playbackRequest: "play" });
    }
  }, [seekToRequest]);

  return null;
}
