import { create } from "zustand";

export type PlayerStoreState = {
  playing: boolean;
  caption: string;
  translation: string;
  currentTime: number
  duration: number; // This will be set after audio is loaded
};

export const usePlayerStore = create<PlayerStoreState>()((set) => ({
  playing: false,
  caption: "",
  translation: "",
  duration: -1,
  currentTime: 0
}));
