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
