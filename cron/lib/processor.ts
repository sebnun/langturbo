import { podcastXmlParser, type Episode, type Podcast } from "podcast-xml-parser";
import { franc } from "franc-all";
import * as he from "he";
import { backOff } from "exponential-backoff";
import { iso6393To1, ISO_LANGUAGE_CODES, LANGUAGES_LIST } from "./languages.ts";
import { showsTable } from "../db/schema.ts";
import { db } from "../db/index.ts";
import { getProxyUrl } from "./utils.ts";

export const processItunesId = async (id: string) => {
  let lookupResponse;

  try {
    lookupResponse = await backOff(
      () => fetch(getProxyUrl(`https://itunes.apple.com/lookup?id=${id}`)).then((res) => res.json()),
      {
        timeMultiple: 2,
        numOfAttempts: 5,
      }
    );
  } catch (e) {
    console.error("Failed to lookup API", id, e);
    // Don't add to db, this is recoverable
    return;
  }

  if (lookupResponse.results.length === 0) {
    // Some valid podcasts do not return data
    // TODO: evaluate if it is worth it to add a dummy placeholder on db to avoid reprocessing like before
    return;
  }

  const podcastJson = lookupResponse.results[0];

  // Better to get this data from itunes than the feed
  const author = podcastJson.artistName;
  const title = podcastJson.collectionName;
  const explicit = podcastJson.collectionExplicitness === "explicit";
  const imageUrl = podcastJson.artworkUrl600; // From itunes so can hotlink?
  const feedUrl = podcastJson.feedUrl;
  // 26 is the primary category for podcasts
  const categories = podcastJson.genreIds.filter((genre: string) => +genre !== 26); // Primary should be first always?

  if (!feedUrl) {
    // Some podcasts can be created entirely on itunes, so no feed
    return;
  }

  let podcast;
  let episodes;

  try {
    const parsedPodcast = await podcastXmlParser(new URL(feedUrl), {
      requestHeaders: {
        "User-Agent": process.env.USER_AGENT,
      },
    });

    podcast = parsedPodcast.podcast;
    episodes = parsedPodcast.episodes;
  } catch (e) {
    console.info("Failed to parse feed", feedUrl, e);
    return;
  }

  // "Apple Podcasts only supports values from the ISO 639 list (two-letter language codes, with some possible modifiers, such as "fr-ca")."
  // A correct ISO code should always be there? https://podcasters.apple.com/support/829-validate-your-podcast
  const language = podcast.language;
  const description = stripHtml(podcast.description);
  const country = getCountry(language);
  const link = podcast.link;

  let languageCode = getLanguageCode(language);
  if (!languageCode || languageCode === "en") {
    const text = makeTextForDetection(podcast, episodes);
    const iso3 = franc(text);
    languageCode = iso6393To1[iso3];

    console.log("language detection", language, id, languageCode);
  }

  await db.insert(showsTable).values({
    source_id: id,
    title,
    description,
    author,
    explicit,
    image_url: imageUrl,
    show_url: link,
    source_url: feedUrl,
    country: country,
    category_ids: categories,
    language_code: languageCode,
  });
};

const getLanguageCode = (languageMetadata: string) => {
  // Some have xx_yy, should be xx-yy, or rather just xx

  if (!languageMetadata) {
    return; // Not a valid language
  }

  let correctIso = languageMetadata;

  if (correctIso.includes("-")) {
    correctIso = correctIso.split("-")[0].toLowerCase().trim();
  } else if (correctIso.includes("_")) {
    correctIso = correctIso.split("_")[0].toLowerCase().trim();
  }

  // "in" is deprecated iso for indonesian, should be "id"
  // "iw" is deprecated iso for hebrew, should be "he"
  if (correctIso === "iw") {
    correctIso = "he";
  } else if (correctIso === "in") {
    correctIso = "id";
  }

  if (!ISO_LANGUAGE_CODES.includes(correctIso)) {
    console.error("Invalid language code", languageMetadata);
    return; // Not a valid language
  }
  return correctIso;
};

const makeTextForDetection = (podcast: Podcast, episodes: Episode[]) => {
  let text = `${podcast.title}
  `;

  for (const episode of episodes) {
    text += `${episode.title}
    `;
  }

  if (podcast.description) {
    text += `${stripHtml(podcast.description)}`;
  }

  return text;
};

const getCountry = (language: string) => {
  if (!language.includes("-") && !language.includes("_")) {
    return;
  }

  let iso31661 = language.replace("_", "-").split("-")[1].toLowerCase();

  return iso31661;
};

const stripHtml = (html: string) => {
  try {
    return he.decode(html.replace(/<[^>]*>?/gi, "")).trim();
  } catch (e) {
    console.error("Failed to strip html", html, e);
    return "";
  }
};
