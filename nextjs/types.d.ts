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
  words: Word[];
  translation?: string;
};

type Word = {
  word: string;
  start: number;
  end: number;
};

///////

type CreateTranscriptionResponseVerboseJson = {
  /** @description The language of the input audio. */
  language: string;
  /** @description The duration of the input audio. */
  duration: string;
  /** @description The transcribed text. */
  text: string;
  /** @description Extracted words and their corresponding timestamps. */
  words?: TranscriptionWord[];
  /** @description Segments of the transcribed text and their corresponding details. */
  segments?: TranscriptionSegment[];
  [key: string]: unknown;
};

type TranscriptionWord = {
  /** @description The text content of the word. */
  word: string;
  /**
   * Format: float
   * @description Start time of the word in seconds.
   */
  start: number;
  /**
   * Format: float
   * @description End time of the word in seconds.
   */
  end: number;


  [key: string]: unknown;
};

type TranscriptionSegment = {
  /** @description Unique identifier of the segment. */
  id: number;
  /** @description Seek offset of the segment. */
  seek: number;
  /**
   * Format: float
   * @description Start time of the segment in seconds.
   */
  start: number;
  /**
   * Format: float
   * @description End time of the segment in seconds.
   */
  end: number;
  /** @description Text content of the segment. */
  text: string;
  /** @description Array of token IDs for the text content. */
  tokens: number[];
  /**
   * Format: float
   * @description Temperature parameter used for generating the segment.
   */
  temperature: number;
  /**
   * Format: float
   * @description Average logprob of the segment. If the value is lower than -1, consider the logprobs failed.
   */
  avg_logprob: number;
  /**
   * Format: float
   * @description Compression ratio of the segment. If the value is greater than 2.4, consider the compression failed.
   */
  compression_ratio: number;
  /**
   * Format: float
   * @description Probability of no speech in the segment. If the value is higher than 1.0 and the `avg_logprob` is below -1, consider this segment silent.
   */
  no_speech_prob: number;

    // Added by me
  words?: TranscriptionWord[];

  [key: string]: unknown;
};
