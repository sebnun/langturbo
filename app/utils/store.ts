import { type AudioPlayer } from "expo-audio";
import { create } from "zustand";

type PlayerStoreState = {
  playing: boolean;
  currentTime: number;
  duration: number;
  player: null | AudioPlayer;
};

type PlayerStoreActions = {
  reset: () => void;
};

const initialPlayerState: PlayerStoreState = {
  playing: false,
  currentTime: 0,
  duration: 0,
  player: null,
};

export const usePlayerStore = create<PlayerStoreState & PlayerStoreActions>()((set) => ({
  ...initialPlayerState,
  reset: () => set(initialPlayerState),
}));
