import { getApiEndpoint } from ".";
import { languageIds } from "./languages";

export const getCategories = async (categoryId: number, languageCode: string, popular = false) => {
  const languageId = languageIds[languageCode];
  return fetch(`${getApiEndpoint()}categories?categoryId=${categoryId}&languageId=${languageId}&popular=${popular}`)
    .then((response) => response.json())
    .then((json) => json.categories as CategoryResponseItem[]);
};

export const getEpisodes = async (id: string, podcastId: string) => {
  return fetch(`${getApiEndpoint()}episodes?sourceUrl=${encodeURIComponent(id)}&showId=${podcastId}`)
    .then((response) => response.json())
    .then((json) => ({
      episodes: json.episodes as PodcastEpisode[],
      categories: json.categories as { id: number; name: string }[],
    }));
};

export const postTranscription = async (
  id: string,
  languageCode: string,
  itunesId: string,
  episodeTitle: string,
  from: number,
  requestFileName?: string
) => {
  return fetch(`${getApiEndpoint()}transcription`, {
    method: "POST",
    body: JSON.stringify({ id, languageCode, itunesId, requestFileName, episodeTitle, from }),
  }).then((response) => response.json());
};

export const getSearch = async (query: string, languageCode: string) => {
  return fetch(`${getApiEndpoint()}search?query=${query}&languageCode=${languageCode}`)
    .then((response) => response.json())
    .then((json) => json.results as Podcast[]);
};
