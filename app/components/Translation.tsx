import { Text } from "react-native";
import { useAppStore, usePlayerStore } from "../utils/store";
import { getLanguageNameById, languageIds, rtlLanguages } from "../utils/languages";
import { colorTextSubdued } from "@/utils/theme";
import React from "react";
import { useLocalSearchParams } from "expo-router";

export default function Translation() {
  const caption = usePlayerStore((state) => state.caption);
  const fontSize = useAppStore((state) => state.fontSize);
  const { lang } = useLocalSearchParams();

  return (
    <Text
      style={{
        color: colorTextSubdued,
        fontSize,
        textAlign: rtlLanguages.includes(getLanguageNameById(languageIds[lang as string])) ? "right" : "left",
      }}
    >
      {caption?.translation}
    </Text>
  );
}
