import { Platform } from "react-native";
import * as Device from "expo-device";
import { useFocusEffect } from "expo-router";
import { useCallback } from "react";

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

export const useTitle = (title: string) => {
  useFocusEffect(
    useCallback(() => {
      if (Platform.OS === "web") {
        document.title = `${title} | LangTurbo`;
      }
    }, [title])
  );
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