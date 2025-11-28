import { Platform } from "react-native";
import { getApiEndpoint } from ".";
import { authClient } from "./auth";
import { languageIds } from "./languages";

export const fetchOptionsForPlatform = () => {
  return Platform.OS === "web"
    ? { credentials: "include" as RequestCredentials }
    : {
        headers: {
          Cookie: authClient.getCookie(),
        },
        credentials: "omit" as RequestCredentials,
      };
};

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

export const getUser = async (languageCode: string) => {
  return fetch(`${getApiEndpoint()}user?languageCode=${languageCode}`, fetchOptionsForPlatform())
    .then((response) => response.json())
    .then(
      (json) =>
        json as {
          playback: Playback[];
          saved: Podcast[];
          words: string[];
        }
    );
};

export const postSaved = async (showId: string) => {
  return fetch(`${getApiEndpoint()}saved`, {
    method: "POST",
    body: JSON.stringify({ showId }),
    ...fetchOptionsForPlatform(),
  }).then((response) => response.text());
};

export const deleteSaved = async (showId: string) => {
  return fetch(`${getApiEndpoint()}saved?showId=${showId}`, {
    method: "DELETE",
    ...fetchOptionsForPlatform(),
  }).then((response) => response.text());
};

export const postFeedback = async (feedback: string, context: string) => {
  return fetch(`${getApiEndpoint()}feedback`, {
    method: "POST",
    body: JSON.stringify({ feedback, context }),
  }).then((response) => response.text());
};
