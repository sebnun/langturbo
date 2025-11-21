import { StyleSheet, Text } from "react-native";
import { usePlayerStore } from "../utils/store";
import { colorTextSubdued } from "@/utils/theme";

export default function TimeCode() {
  const positionLabel = usePlayerStore(state => state.positionLabel);

  return <Text style={styles.titleNotMovingText}>{positionLabel}</Text>;
}

const styles = StyleSheet.create({
  titleNotMovingText: {
    fontVariant: ["tabular-nums"],
    fontFamily: "SourceCodePro_400Regular",
    color: colorTextSubdued,
  },
});
