import { usePlayerStore } from "@/utils/store";
import { Text, StyleSheet } from "react-native";

export default function UtterableText({ word, start }: { word: string; start: number }) {
  const currentTime = usePlayerStore((state) => state.currentTime);

  return <Text style={currentTime >= start ? styles.captionUtterance : undefined}>{word}</Text>;
}

const styles = StyleSheet.create({
  captionUtterance: {
    color: "white",
  },
});
