import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { deleteSaved, deleteWord, patchPlayback, postPlayback, postSaved, postWord } from "./api";

type AppStoreState = {
  autoPause: boolean;
  fontSize: number;
  slower: boolean;
  showTranslation: boolean;
  tapTranslation: boolean;
  shadowing: boolean;

  words: string[];
  saved: Podcast[];
  playback: Playback[];

  showPlayerOnboarding: boolean;
};

const initialAppState: AppStoreState = {
  autoPause: false,
  fontSize: 25,
  slower: false,
  showTranslation: true,
  tapTranslation: false,
  shadowing: false,

  words: [],
  saved: [],
  playback: [],

  showPlayerOnboarding: true,
};

type AppStoreActions = {
  savePodcast: (podcast: Podcast) => void;
  removePodcast: (podcastId: string) => void;
  saveWord: (word: string, languageCode: string) => void;
  removeWord: (word: string, languageCode: string) => void;
  updatePlayback: (playback: Playback, languageCode: string) => void;
};

export const useAppStore = create<AppStoreState & AppStoreActions>()(
  persist(
    (set) => ({
      ...initialAppState,
      savePodcast: async (podcast: Podcast) => {
        set((state) => ({ saved: [...state.saved, podcast] }));
        await postSaved(podcast.id);
      },
      removePodcast: async (podcastId: string) => {
        set((state) => ({ saved: state.saved.filter((p) => p.id !== podcastId) }));
        await deleteSaved(podcastId);
      },
      saveWord: async (word: string, languageCode: string) => {
        const sanitizedWord = word.toLowerCase().trim();
        set((state) => ({ words: [...state.words, sanitizedWord] }));
        await postWord(sanitizedWord, languageCode);
      },
      removeWord: async (word: string, languageCode: string) => {
        const sanitizedWord = word.toLowerCase().trim();
        set((state) => ({ words: state.words.filter((w) => w !== sanitizedWord) }));
        await deleteWord(sanitizedWord, languageCode);
      },
      updatePlayback: async (playback: Playback, languageCode: string) => {
        if (playback.percentage > 0 && playback.percentage <= 100) {
          const statePlayback = useAppStore.getState().playback.find((p) => p.episodeId === playback.episodeId);

          if (statePlayback && playback.percentage > statePlayback.percentage) {
            set((state) => ({
              playback: state.playback.map((p) =>
                p.episodeId === playback.episodeId ? { ...p, percentage: playback.percentage } : p
              ),
            }));
            await patchPlayback(playback.episodeId, playback.percentage);
          } else if (!statePlayback) {
            set((state) => ({
              playback: [...state.playback, { ...playback, percentage: playback.percentage }],
            }));
            await postPlayback(playback.episodeId, playback.percentage, languageCode);
          }
        }
      },
    }),
    {
      name: "settings",
      partialize: (state) => ({
        autoPause: state.autoPause,
        fontSize: state.fontSize,
        slower: state.slower,
        showTranslation: state.showTranslation,
        tapTranslation: state.tapTranslation,
        showPlayerOnboarding: state.showPlayerOnboarding,
        shadowing: state.shadowing
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
  playbackRequest: "play" | "pause";
  nextStart: number;
  prevStart: number;
  error: string | null;
  currentCaptionAllKnown: boolean;
  showShadowingModal: boolean
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
  seekToRequest: -1,
  playbackRequest: "pause",
  nextStart: -1,
  prevStart: -1,
  error: null,
  currentCaptionAllKnown: false,
  showShadowingModal: false
};

export const usePlayerStore = create<PlayerStoreState & PlayerStoreActions>()((set) => ({
  ...initialPlayerState,
  reset: () => set(initialPlayerState),
}));
