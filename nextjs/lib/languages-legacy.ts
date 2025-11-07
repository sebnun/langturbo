export const getLanguageCodeByName = (language: string) => {
  return Object.keys(languagesDict)[Object.values(languagesDict).indexOf(language)];
};

export const getLanguageIdByName = (language: string) => {
  return languageIds[getLanguageCodeByName(language)];
};

export const getLanguageNameById = (id: number) => {
  return languagesDict[Object.keys(languageIds).find((key) => languageIds[key] === id)!];
};

export const getLanguageCodeById = (id: number) => {
  return Object.keys(languageIds).find((key) => languageIds[key] === id);
};

export const rtlLanguages = ["arabic", "hebrew", "persian", "urdu"];

// https://github.com/openai/whisper/blob/main/whisper/tokenizer.py
// And > 3 million L1 native speakers
// BCP 47 identifiers (these work on tts as BCP 47) start with a 2 letter ISO 639-1 or 3 letter 639-2
// so these are ISO 639-1
// A language can have several country codes, so several flags

// We currently support the following languages through both the transcriptions and translations endpoint:
// Afrikaans, Arabic, Armenian, Azerbaijani, Belarusian, Bosnian, Bulgarian, Catalan, Chinese, Croatian, Czech, Danish, Dutch, English, Estonian,
// Finnish, French, Galician, German, Greek, Hebrew, Hindi, Hungarian, Icelandic, Indonesian, Italian, Japanese, Kannada, Kazakh,
// Korean, Latvian, Lithuanian, Macedonian, Malay, Marathi, Maori, Nepali, Norwegian, Persian, Polish, Portuguese, Romanian, Russian,
// Serbian, Slovak, Slovenian, Spanish, Swahili, Swedish, Tagalog, Tamil, Thai, Turkish, Ukrainian, Urdu, Vietnamese, and Welsh.
// These are <50% WER, just use these

export const languagesDict: { [key: string]: string } = {
  en: "english",
  zh: "chinese",
  de: "german",
  es: "spanish",
  ru: "russian",
  ko: "korean",
  fr: "french",
  ja: "japanese",
  pt: "portuguese",
  tr: "turkish",
  pl: "polish",
  ca: "catalan",
  nl: "dutch",
  ar: "arabic",
  sv: "swedish",
  it: "italian",
  id: "indonesian",
  hi: "hindi",
  fi: "finnish",
  vi: "vietnamese",
  he: "hebrew",
  uk: "ukrainian",
  el: "greek",
  ms: "malay",
  cs: "czech",
  ro: "romanian",
  da: "danish",
  hu: "hungarian",
  ta: "tamil",
  // Need to send as nb to spacy
  // on db there is "norwegian" "norwegian bokmål" and "norwegian nynorsk"?
  no: "norwegian", // spacy has nb for bokmål and no support for nynorsk, but tokenization should be the same?
  th: "thai",
  ur: "urdu",
  hr: "croatian",
  bg: "bulgarian",
  lt: "lithuanian",
  // "la": "latin",
  // "mi": "maori", // spacy not supported
  // "ml": "malayalam",
  // "cy": "welsh",  // spacy not supported
  sk: "slovak",
  // "te": "telugu",
  fa: "persian",
  lv: "latvian",
  // "bn": "bengali",
  sr: "serbian",
  az: "azerbaijani",
  sl: "slovenian",
  // kn: "kannada", // not supported lingua
  et: "estonian",
  mk: "macedonian",
  // "br": "breton",
  // "eu": "basque",
  is: "icelandic",
  hy: "armenian",
  // ne: "nepali", // not supported lingua
  // "mn": "mongolian",
  // "bs": "bosnian", // spacy not supported
  // "kk": "kazakh", // spacy not supported
  // "sq": "albanian",
  // "sw": "swahili", // spacy not supported
  // "gl": "galician", // spacy not supported
  mr: "marathi",
  // "pa": "punjabi",
  // "si": "sinhala",
  // "km": "khmer",
  // "sn": "shona",
  // "yo": "yoruba",
  // "so": "somali",
  af: "afrikaans",
  // "oc": "occitan",
  // "ka": "georgian",
  // "be": "belarusian", // spacy not supported
  // "tg": "tajik",
  // "sd": "sindhi",
  // "gu": "gujarati",
  // "am": "amharic",
  // "yi": "yiddish",
  // "lo": "lao",
  // "uz": "uzbek",
  // "fo": "faroese",
  // "ht": "haitian creole",
  // "ps": "pashto",
  // "tk": "turkmen",
  // "nn": "nynorsk",
  // "mt": "maltese",
  // "sa": "sanskrit",
  // "lb": "luxembourgish",
  // "my": "myanmar",
  // "bo": "tibetan",
  //tl: "tagalog", // No podcasts on db wtf
  // "mg": "malagasy",
  // "as": "assamese",
  // "tt": "tatar",
  // "haw": "hawaiian",
  // "ln": "lingala",
  // "ha": "hausa",
  // "ba": "bashkir",
  // "jw": "javanese",
  // "su": "sundanese",
  // "yue": "cantonese",
};

export const languagesNames: { [key: string]: string } = {
  en: "English",
  zh: "中文",
  de: "Deutsch",
  es: "Español",
  ru: "русский",
  ko: "한국어",
  fr: "français",
  ja: "日本語",
  pt: "português",
  tr: "Türkçe",
  pl: "polski",
  ca: "català",
  nl: "Nederlands",
  ar: "اَلْعَرَبِيَّة",
  sv: "Svenska",
  it: "italiano",
  id: "bahasa Indonesia",
  hi: "मानक",
  fi: "suomi",
  vi: "tiếng Việt",
  he: "עִבְֿרִית",
  uk: "українська",
  el: "ελληνικά",
  ms: "Bahasa Melayu",
  cs: "čeština",
  ro: "lìmba romầnă",
  da: "dansk",
  hu: "magyar nyelv",
  ta: "தமிழ்",
  no: "norsk",
  th: "ภาษาไทย",
  ur: "اردو",
  hr: "hrvatski",
  bg: "български език",
  lt: "lietuvių kalba",
  sk: "slovenčina",
  fa: "فارسی",
  lv: "latviešu valoda",
  sr: "српски",
  az: "Azərbaycan dili",
  sl: "slovenščina",
  et: "eesti keel",
  mk: "македонски",
  is: "íslenska",
  hy: "հայերէն",
  mr: "Marāṭhī",
  af: "Afrikaans",
  //tl: "Wikang Tagalog",
};

export const languageIds: { [key: string]: number } = {
  en: 1,
  zh: 2,
  es: 4,
  de: 3,
  ru: 5,
  ko: 6,
  fr: 7,
  ja: 8,
  pt: 9,
  tr: 10,
  pl: 11,
  ca: 12,
  nl: 13,
  ar: 14,
  sv: 15,
  it: 16,
  id: 17,
  hi: 18,
  fi: 19,
  vi: 20,
  he: 21,
  uk: 22,
  el: 23,
  ms: 24,
  cs: 25,
  ro: 26,
  da: 27,
  hu: 28,
  ta: 29,
  no: 30, // ATTN
  nb: 30, // ATTN
  nn: 30, // ATTN
  th: 31,
  ur: 32,
  hr: 33,
  bg: 34,
  lt: 35,
  sk: 36,
  fa: 37,
  lv: 38,
  sr: 39,
  az: 40,
  sl: 41,
  et: 43,
  mk: 44,
  is: 45,
  hy: 46,
  mr: 48,
  af: 49,
  //tl: 50,
};
