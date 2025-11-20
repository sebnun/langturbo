import { StyleSheet, Text } from "react-native";
import { usePlayerStore } from "../utils/store";
import { colorTextSubdued } from "@/utils/theme";
import { convertSecondsDurationToHuman } from "@/utils";

export default function TimeCode() {
  const currentTime = usePlayerStore((state) => state.currentTime);
  const positionLabel = convertSecondsDurationToHuman(currentTime);

  return <Text style={styles.titleNotMovingText}>{positionLabel}</Text>;
}

const styles = StyleSheet.create({
  titleNotMovingText: {
    fontVariant: ["tabular-nums"],
    fontFamily: "SourceCodePro_400Regular",
    color: colorTextSubdued,
  },
});
