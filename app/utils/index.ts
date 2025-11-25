import { Platform } from "react-native";
import * as Device from "expo-device";
import { Buffer } from "buffer/";

export function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export const getApiEndpoint = () => {
  if (__DEV__) {
    return Platform.OS === "web" && Device.osName === "Mac OS"
      ? "http://localhost:3000/api/v1/"
      : "http://192.168.1.156:3000/api/v1/";
  } else {
    return "https://www.langturbo.com/api/v1/";
  }
};

export function convertSecondsDurationToHuman(seconds?: number) {
  if (typeof seconds !== "number" || isNaN(seconds)) {
    return "Unknown duration";
  }

  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor((seconds % 3600) % 60);

  const hDisplay = h > 0 ? h + ":" : "";
  const mDisplay = m > 0 ? (m > 9 ? m + ":" : "0" + m + ":") : "00:";
  const sDisplay = s > 9 ? s : `0${s}`;

  return hDisplay + mDisplay + sDisplay;
}

export const encodeUrl = (url: string) => {
  return encodeURIComponent(Buffer.from(url).toString("base64"));
};

export const decodeUrl = (encodedUrl: string) => {
  return Buffer.from(decodeURIComponent(encodedUrl), "base64").toString();
};

export const fillCaptionsStart = (captions: Caption[]) => {
  const sortedCaptions = captions.sort((a, b) => a.start - b.start);

  for (let i = 0; i < sortedCaptions.length; i++) {
    if (i === 0) {
      sortedCaptions[i].captionStart = 0;
    } else {
      sortedCaptions[i].captionStart = (sortedCaptions[i - 1].end + sortedCaptions[i].start) / 2;
    }
  }

  return sortedCaptions;
};
