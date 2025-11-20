import { Text, StyleSheet } from "react-native";
import { useAppStore, usePlayerStore } from "../utils/store";
import { getLanguageNameById, languageIds, rtlLanguages } from "../utils/languages";
import { useLocalSearchParams } from "expo-router";

export default function Caption() {
  const fontSize = useAppStore((state) => state.fontSize);
  const caption = usePlayerStore((state) => state.caption);
  const { lang } = useLocalSearchParams();

  return (
    <Text
      style={{
        ...styles.captionNormal,
        fontSize,
        textAlign: rtlLanguages.includes(getLanguageNameById(languageIds[lang as string])) ? "right" : "left",
      }}
    >
      {caption?.text}
    </Text>
  );
}

const styles = StyleSheet.create({
  captionNormal: {
    color: "white",
  },
});
