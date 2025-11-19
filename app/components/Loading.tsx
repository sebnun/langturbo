import { sizeElementSpacing, themeStyles } from "@/utils/theme";
import { ActivityIndicator, View, StyleSheet, Text } from "react-native";

export default function Loading({ message }: { message?: string }) {
  return (
    <View style={styles.screen}>
      <ActivityIndicator color="white" />
      {message && <Text style={themeStyles.mutedText}>{message}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  message: {
    marginTop: sizeElementSpacing,
  },
});
