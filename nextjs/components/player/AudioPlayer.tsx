"use client";

import ReactPlayer from "react-player";
import { usePlayerStore } from "@/lib/store";
import { useCallback, useRef } from "react";

type GeminiResponse = {
  translation: string;
  caption: string;
  milliseconds: number;
};

export default function AudioPlayer({ url, data }: { url: string; data: GeminiResponse[] }) {
  const playing = usePlayerStore((state) => state.playing);

  console.log(data)

  const playerRef = useRef<HTMLVideoElement | null>(null);

  const setPlayerRef = useCallback((player: HTMLVideoElement) => {
    if (!player) return;
    playerRef.current = player;
    console.log(player);
  }, []);

  const handleTimeUpdate = () => {
    const player = playerRef.current;
    // We only want to update time slider if we are not currently seeking
    //if (!player || state.seeking) return;

    console.log("onTimeUpdate", player?.currentTime);

    if (!player?.duration) return;

    if( data.length) {

    const captionIndex = data.findLastIndex((caption) => caption.milliseconds / 1000 <= player?.currentTime);

    console.log(captionIndex)

    usePlayerStore.setState({
      currentTime: player.currentTime,
      translation: data[captionIndex].translation,
      caption: `${data[captionIndex].milliseconds / 1000} ${data[captionIndex].caption}`,
    });
}
  };

  return (
    <ReactPlayer
      src={url}
      ref={setPlayerRef}
      playing={playing}
      controls
      onTimeUpdate={handleTimeUpdate}
      onPause={() => usePlayerStore.setState({ playing: false })}
      onPlay={() => usePlayerStore.setState({ playing: true })}
    />
  );
}
