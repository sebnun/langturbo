import { StyleSheet, View, ScrollView } from "react-native";
import { Redirect, Stack, useLocalSearchParams, useRouter } from "expo-router";
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
import PodcastItem from "@/components/PodcastItem";
import Loading from "@/components/Loading";
import * as Device from "expo-device";
import TextButton from "@/components/button/TextButton";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { getLanguageNameById, languageIds } from "@/utils/languages";
import { getCategories } from "@/utils/api";
import { useTitle } from "@/utils";

export default function DiscoverScreen() {
  const { lang } = useLocalSearchParams<{ lang: string }>();
  useTitle(`Discover ${getLanguageNameById(languageIds[lang])} podcasts`);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<CategoryResponseItem[]>([]);

  const insets = useSafeAreaInsets();

  if (!languageIds[lang]) {
    // Not found not reached
    return <Redirect href={"/"} />;
  }

  useEffect(() => {
    getCategories(0, lang)
      .then(setCategories)
      .finally(() => setLoading(false));
  }, [lang]);

  return (
    <>
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
                      onPress={() =>
                        router.navigate({
                          pathname: `/[lang]/category`,
                          params: {
                            lang,
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
                          pathname: `/[lang]/category`,
                          params: {
                            lang,
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
