import { View, StyleSheet } from "react-native";
import { usePlayerStore } from "../utils/store";
import { colorPrimary, colorSeparator } from "@/utils/theme";

const Progress = () => {
  const progressPercentage = usePlayerStore(state => state.progressPercentage)

  return (
    <View style={styles.container}>
      <View style={{ ...styles.loadedContainer, width: `100%` }} />
      <View style={{ ...styles.progressContainer, width: `${progressPercentage}%` }} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 5,
    position: "relative",
    width: "100%",
  },
  loadedContainer: {
    height: "100%",
    backgroundColor: colorSeparator,
    opacity: 0.2,
    position: "absolute",
    left: 0,
  },
  progressContainer: {
    height: "100%",
    backgroundColor: colorPrimary,
    position: "absolute",
    left: 0,
  },
});

export default Progress;
