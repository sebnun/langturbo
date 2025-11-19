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
// import PodcastItem, { PODCAST_LARGE_IMAGE_SIZE } from "@/components/PodcastItem";
// import Loading from "@/components/Loading";
// import * as Device from "expo-device";
// import Banner from "@/components/Banner";
// import { capitalizeFirstLetter, useTitle } from "@/utils";
// import { getLanguageNameById } from "@/utils/languages";
// import TextButton from "@/components/Button/TextButton";
// import React from "react";
// import RoundButton from "@/components/Button/RoundButton";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Linking from "expo-linking";
import WebTitle from "@/components/WebTitle";
import { getLanguageIdByName, getLanguageNameById, languageIds } from "@/utils/languages";

export default function DiscoverScreen() {
  // const router = useRouter();
  // useTitle("Discover");
  // const languageId = useAppStore((state) => state.languageId);
  // const [loading, setLoading] = useState(true);
  // const [categories, setCategories] = useState<CategoryResponseItem[]>([]);
  // const showDiscoverBanner = useAppStore((state) => state.showDiscoverBanner);

  // const insets = useSafeAreaInsets();

  // useEffect(() => {
  //   getCategories(0, languageId)
  //     .then(setCategories)
  //     .finally(() => setLoading(false));
  // }, [languageId]); // This updates when changing from profile

  const { lang } = useLocalSearchParams<{ lang: string }>();
  console.log(lang);

  return (
    <>
      <WebTitle title={`Discover ${getLanguageNameById(languageIds[lang])} podcasts`} />
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />

      <View>
        <Text>{lang}</Text>
      </View>

      {/* <View style={[themeStyles.screen, { paddingTop: insets.top }]}>
        {loading ? (
          <Loading />
        ) : (
          <ScrollView style={styles.scrollView}>
            {categories.map((category) => {
              return (
                <View key={category.id}>
                  <View style={styles.categoryView}>
                    <TextButton
                      onPress={() =>
                        router.navigate({
                          pathname: `/discover/category`,
                          params: {
                            categoryId: category.id,
                            categoryName: category.name,
                          },
                        })
                      }
                      style={styles.categoryTitle}
                      text={category.name}
                    />
                    <TextButton
                      onPress={() =>
                        router.navigate({
                          pathname: `/discover/category`,
                          params: {
                            categoryId: category.id,
                            categoryName: category.name,
                          },
                        })
                      }
                      style={styles.showMoreText}
                      text="Show more"
                    />
                  </View>
                  <FlashList
                    horizontal
                    contentContainerStyle={{ padding: sizeElementSpacing }}
                    data={category.podcasts}
                    renderItem={({ item, index }) => <PodcastItem podcast={item} segment="discover" />}
                    estimatedItemSize={PODCAST_LARGE_IMAGE_SIZE} // In this case if horizontal, it's the width
                    showsHorizontalScrollIndicator={!Device.DeviceType.DESKTOP} // On desktop horizontal scrollbars have bad UX and there is a bug with the FlashList component
                  />
                </View>
              );
            })}
          </ScrollView>
        )}

         {showDiscoverBanner && (
          <Banner
            title={`You are learning ${capitalizeFirstLetter(getLanguageNameById(languageId))}`}
            message={`Choose a new language in your profile.`}
            nodes={
              <RoundButton
                type="ghost"
                text="What is LangTurbo?"
                onPress={() => Linking.openURL("https://www.langturbo.com/blog/getting-started")}
              />
            }
            onClosed={() => useAppStore.setState({ showDiscoverBanner: false })}
          />
        )} 
      </View> */}
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
