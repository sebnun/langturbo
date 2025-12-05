import { useAppStore, usePlayerStore } from "@/utils/store";
import { useAudioPlayer, useAudioPlayerStatus } from "expo-audio";
import { useLocalSearchParams } from "expo-router";
import { use, useEffect, useRef } from "react";
import { Platform } from "react-native";

export default function AudioPlayer({
  episodeId,
  uri,
  imageUrl,
  episodeTitle,
}: {
  episodeId: string;
  uri: string;
  imageUrl: string;
  episodeTitle: string;
}) {
  const player = useAudioPlayer(uri, { updateInterval: 50 });
  const status = useAudioPlayerStatus(player);

  const seekToRequest = usePlayerStore((state) => state.seekToRequest);
  const playbackRequest = usePlayerStore((state) => state.playbackRequest);
  const slower = useAppStore((state) => state.slower);
  const updatePlayback = useAppStore((state) => state.updatePlayback);

  const { lang } = useLocalSearchParams();

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
      playbackRequest: null,
    });

    if (status.didJustFinish) {
      player.seekTo(0);
      updatePlayback({ episodeId, percentage: 100 }, lang as string);
    }
  }, [status]);

  useEffect(() => {
    if (playbackRequest === "play") {
      player.play();
    } else if (playbackRequest === "pause") {
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
    if (seekToRequest !== -1) {
      // Need to disable auto pause, or it gets blocked
      const prevAutoPause = useAppStore.getState().autoPause;
      if (prevAutoPause) {
        useAppStore.setState({ autoPause: false });
      }

      player.seekTo(seekToRequest);
      usePlayerStore.setState({ playbackRequest: "play", seekToRequest: -1 });

      if (prevAutoPause) {
        setTimeout(() => useAppStore.setState({ autoPause: true }), 300);
      }
    }
  }, [seekToRequest]);

  return null;
}
