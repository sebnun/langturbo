import { getApiEndpoint } from ".";
import { languageIds } from "./languages";

export const getCategories = async (categoryId: number, languageCode: string, popular = false) => {
  const languageId = languageIds[languageCode];
  return fetch(
    `${getApiEndpoint()}categories?categoryId=${categoryId}&languageId=${languageId}&popular=${popular}`
  )
    .then((response) => response.json())
    .then((json) => json.categories as CategoryResponseItem[]);
};
