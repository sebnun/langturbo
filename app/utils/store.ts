import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

type AppStoreState = {
  autoPause: boolean;
  fontSize: number;
  slower: boolean;
  showTranslation: boolean;
  tapTranslation: boolean
};

const initialAppState: AppStoreState = {
  autoPause: false,
  fontSize: 25,
  slower: false,
  showTranslation: true,
  tapTranslation: false
};

export const useAppStore = create<AppStoreState>()(
  persist(
    (set) => ({
      ...initialAppState,
    }),
    {
      name: "settings", // name of item in the storage (must be unique)
      partialize: (state) => ({
        autoPause: state.autoPause,
        fontSize: state.fontSize,
        slower: state.slower,
        showTranslation: state.showTranslation,
        tapTranslation: state.tapTranslation
      }),
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

type PlayerStoreState = {
  playing: boolean;
  currentTime: number;
  duration: number;
  positionLabel: string;
  progressPercentage: number;
  caption: Caption | null;
  seekToRequest: number;
  playbackRequest: 'play' | 'pause' 
  nextStart: number;
  prevStart: number;
  error: string | null;
};

type PlayerStoreActions = {
  reset: () => void;
};

const initialPlayerState: PlayerStoreState = {
  playing: false,
  currentTime: 0,
  duration: 0,
  positionLabel: "Transcribing 0%",
  progressPercentage: 0,
  caption: null,
  seekToRequest: 0,
  playbackRequest: 'pause',
  nextStart: -1,
  prevStart: -1,
  error: null,
};

export const usePlayerStore = create<PlayerStoreState & PlayerStoreActions>()((set) => ({
  ...initialPlayerState,
  reset: () => set(initialPlayerState),
}));
