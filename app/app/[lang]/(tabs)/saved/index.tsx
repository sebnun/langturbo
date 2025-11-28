import { Stack } from "expo-router";
import { View, StyleSheet } from "react-native";
import { sizeElementSpacing, themeStyles } from "@/utils/theme";
import { useAppStore } from "@/utils/store";
import PodcastItem, { NoContent, PODCAST_SMALL_IMAGE_SIZE } from "@/components/PodcastItem";
import { FlashList } from "@shopify/flash-list";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTitle } from "@/utils/hooks";

export default function SavedScreen() {
  useTitle("Saved");
  const saved = useAppStore((state) => state.saved);
  const insets = useSafeAreaInsets();

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />

      <View style={[themeStyles.screen, { paddingTop: insets.top }]}>
        <View style={styles.flashContainer}>
          {saved.length === 0 ? (
            <NoContent icon="void" text="Your saved podcasts will appear here" />
          ) : (
            <FlashList
              contentContainerStyle={{ padding: sizeElementSpacing }}
              data={saved}
              renderItem={({ item }) => <PodcastItem podcast={item} full />}
            />
          )}
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  flashContainer: {
    flex: 1,
    width: "100%",
  },
});
