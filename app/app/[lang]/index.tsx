import { StyleSheet, View, ScrollView, Text } from "react-native";
import { Stack, useLocalSearchParams, useRouter, useSegments } from "expo-router";
import { FlashList } from "@shopify/flash-list";
import {
  colorTextSubdued,
  sizeElementSpacing,
  sizeScreenPadding,
  sizeTextLargest,
  sizeTextSmall,
  themeStyles,
} from "@/utils/theme";
import { useEffect, useState } from "react";
// import { useAppStore } from "@/utils/store";
// import { getCategories } from "@/utils/api";
// import type { CategoryResponseItem } from "@/utils/types";
import PodcastItem, { PODCAST_LARGE_IMAGE_SIZE } from "@/components/PodcastItem";
import Loading from "@/components/Loading";
import * as Device from "expo-device";
// import Banner from "@/components/Banner";
// import { capitalizeFirstLetter, useTitle } from "@/utils";
// import { getLanguageNameById } from "@/utils/languages";
import TextButton from "@/components/button/TextButton";
// import React from "react";
import MainButton from "@/components/button/MainButton";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Linking from "expo-linking";
import WebTitle from "@/components/WebTitle";
import { getLanguageIdByName, getLanguageNameById, languageIds } from "@/utils/languages";
import { getCategories } from "@/utils/api";

export default function DiscoverScreen() {
  const { lang } = useLocalSearchParams<{ lang: string }>();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<CategoryResponseItem[]>([]);

  const insets = useSafeAreaInsets();

  useEffect(() => {
    getCategories(0, lang)
      .then(setCategories)
      .finally(() => setLoading(false));
  }, [lang]); 


  return (
    <>
      <WebTitle title={`Discover ${getLanguageNameById(languageIds[lang])} podcasts`} />
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />

      <View style={[themeStyles.screen, { paddingTop: insets.top }]}>
        {loading ? (
          <Loading />
        ) : (
          <ScrollView style={styles.scrollView}>
            {categories.map((category) => {
              return (
                <View key={category.id}>
                  <View style={styles.categoryView}>
                    <TextButton
                      // onPress={() =>
                      //   router.navigate({
                      //     pathname: `/discover/category`,
                      //     params: {
                      //       categoryId: category.id,
                      //       categoryName: category.name,
                      //     },
                      //   })
                      // }
                      style={styles.categoryTitle}
                      text={category.name}
                    />
                    <TextButton
                      // onPress={() =>
                      //   router.navigate({
                      //     pathname: `/discover/category`,
                      //     params: {
                      //       categoryId: category.id,
                      //       categoryName: category.name,
                      //     },
                      //   })
                      // }
                      style={styles.showMoreText}
                      text="Show more"
                    />
                  </View>
                  <FlashList
                    horizontal
                    contentContainerStyle={{ padding: sizeElementSpacing }}
                    data={category.podcasts}
                    renderItem={({ item, index }) => <PodcastItem podcast={item} segment="discover" />}
                    showsHorizontalScrollIndicator={!Device.DeviceType.DESKTOP} // On desktop horizontal scrollbars have bad UX and there is a bug with the FlashList component
                  />
                </View>
              );
            })}
          </ScrollView>
        )}
      </View>
    </>
  );
}

export const styles = StyleSheet.create({
  scrollView: { flex: 1 },
  categoryView: {
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    padding: sizeScreenPadding,
    paddingBottom: sizeElementSpacing,
  },
  categoryTitle: {
    color: "white",
    fontSize: sizeTextLargest,
    fontWeight: "bold",
  },
  showMoreText: {
    color: colorTextSubdued,
    fontSize: sizeTextSmall,
    fontWeight: "bold",
  },
});
