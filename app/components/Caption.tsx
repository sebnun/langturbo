import { Text, StyleSheet, Platform } from "react-native";
import { useAppStore, usePlayerStore } from "../utils/store";
import { getLanguageNameById, languageIds, rtlLanguages } from "../utils/languages";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { colorPrimary, colorTextSubdued } from "@/utils/theme";
import UtterableText from "./UtterableText";
import * as Haptics from "expo-haptics";

/*
legacy word data format:
[{"idx": 0, "text": "And", "is_punct": false}, {"idx": 4, "text": "listen", "is_punct": false}, {"idx": 10, "text": ".", "is_punct": true}]

new word data format:
[{"end": 13.12, "word": " Med", "start": 12.68, "probability": 0.99462890625}, {"end": 13.3, "word": " mig,", "start": 13.12, "probability": 1}, {"end": 13.72, "word": " Ameriko", "start": 13.4, "probability": 0.672607421875}, {"end": 14.26, "word": " Fernandes.", "start": 13.72, "probability": 0.97998046875}]
*/

export default function Caption({ onWordPress }: { onWordPress: (word: string) => void }) {
  const fontSize = useAppStore((state) => state.fontSize);
  const caption = usePlayerStore((state) => state.caption);
  const { lang } = useLocalSearchParams();

  const [textNodes, setTextNodes] = useState<React.ReactNode[]>([]);

  useEffect(() => {
    if (!caption) {
      return;
    }

    if (!caption.words.length) {
      setTextNodes([
        <Text style={styles.captionNormal} key="full-text">
          {caption.text}
        </Text>,
      ]);
      return;
    }

    if ("idx" in caption.words[0]) {
      const usableTokens = caption.words.filter(
        (token) => !(token as Token).is_punct && !/\d/.test((token as Token).text)
      );
      const nodes: React.ReactNode[] = [];
      let processedCharacters = 0; // In relation to text

      for (const token of usableTokens) {
        const usableText = caption.text.substring(processedCharacters);
        const tokenIdx = usableText.indexOf((token as Token).text); // In relation to substring

        if (tokenIdx > 0) {
          nodes.push(<Text key={`text-${(token as Token).idx}`}>{usableText.substring(0, tokenIdx)}</Text>);
        }
        nodes.push(
          <Text
            onPress={async () => {
              onWordPress((token as Token).text);
              Platform.OS !== "web" && (await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light));
            }}
            key={`token-${(token as Token).idx}`}
            style={styles.captionHighlighted}
          >
            {(token as Token).text}
          </Text>
        );
        processedCharacters = caption.text.length - usableText.length + tokenIdx + (token as Token).text.length;
      }

      if (processedCharacters < caption.text.length) {
        nodes.push(<Text key={`last`}>{caption.text.substring(processedCharacters)}</Text>);
      }

      setTextNodes(nodes);
    } else {
      const usableWords = caption.words
        // Have spaces and punctuation from whisper
        .map((w) => ({ ...w, word: (w as Word).word.trim().replace(/[^\p{L}\p{N}\s]/gu, "") }))
        .filter((w) => {
          // skip words containing digits
          return (w as Word).word.length > 0 && !/\d/.test((w as Word).word);
        });
      const nodes: React.ReactNode[] = [];
      let processedCharacters = 0;

      for (const w of usableWords) {
        const usableText = caption.text.substring(processedCharacters);

        let searchWord = (w as Word).word;
        let wordIdx = usableText.indexOf(searchWord);

        // Text before word
        if (wordIdx > 0) {
          nodes.push(
            <Text key={`text-${(w as Word).start}-${processedCharacters}`}>{usableText.substring(0, wordIdx)}</Text>
          );
        }

        nodes.push(
          <Text
            onPress={async () => {
              onWordPress(w.word);
              Platform.OS !== "web" && (await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light));
            }}
            key={`token-${(w as Word).start}-${nodes.length}`}
            style={styles.captionHighlighted}
          >
            <UtterableText start={(w as Word).start} word={w.word} />
          </Text>
        );

        processedCharacters += wordIdx + searchWord.length;
      }

      if (processedCharacters < caption.text.length) {
        nodes.push(<Text key={`last`}>{caption.text.substring(processedCharacters)}</Text>);
      }

      setTextNodes(nodes);
    }
  }, [caption]);

  return (
    <Text
      style={{
        ...styles.captionNormal,
        fontSize,
        textAlign: rtlLanguages.includes(getLanguageNameById(languageIds[lang as string])) ? "right" : "left",
      }}
    >
      {textNodes}
    </Text>
  );
}

// Can't make multline text to have a gap between lines
const styles = StyleSheet.create({
  captionHighlighted: {
    textDecorationLine: "underline",
    textDecorationColor: colorPrimary, // This is not supported on Android
  },
  captionNormal: {
    color: colorTextSubdued,
  },
});
