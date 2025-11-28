type CategoryResponseItem = {
  id: number;
  name: string;
  podcasts: Podcast[];
};

type Podcast = {
  id: string;
  title: string;
  imageUrl: string;
  author?: string;
  feedUrl: string;
  description?: string;
  country?: string;
};

type PodcastEpisode = {
  title: string;
  id: string; // URL
  description?: string;
  duration?: string; // Human readable
  date: string;
};

type Caption = {
  id: string;
  text: string;
  start: number;
  end: number;
  captionStart?: number;
  words: (Word | Token)[];
  translation?: string;
};

type Word = {
  word: string;
  start: number;
  end: number;
};

type Token = {
  text: string;
  is_punct: boolean;
  idx: number;
  pos: string;
};

type Playback = {
  episodeId: string;
  percentage: number;
};