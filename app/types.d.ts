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