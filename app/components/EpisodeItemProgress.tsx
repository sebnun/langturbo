import { View, StyleSheet } from "react-native";
import { colorPrimary, colorSeparator } from "@/utils/theme";

export default function EpisodeItemProgress({ progressPercentage }: { progressPercentage: number }) {
  return (
    <View style={styles.progressContainer}>
      <View style={{ ...styles.progressContainerBar, width: `${progressPercentage}%` }} />
    </View>
  );
}

const styles = StyleSheet.create({
  progressContainer: {
    height: 2,
    width: "100%",
    backgroundColor: colorSeparator,
    borderRadius: 50,
  },
  progressContainerBar: {
    height: "100%",
    backgroundColor: colorPrimary,
    borderRadius: 50,
  },
});
