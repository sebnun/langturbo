import TextButton from "@/components/button/TextButton";
import Loading from "@/components/Loading";
import PodcastItem from "@/components/PodcastItem";
import { useTitle } from "@/utils";
import { getCategories } from "@/utils/api";
import { getLanguageNameById, languageIds } from "@/utils/languages";
import { sizeElementSpacing, themeStyles } from "@/utils/theme";
import { FlashList } from "@shopify/flash-list";
import * as Device from "expo-device";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import { styles } from "./index";

export default function CategoryScreen() {
  const { lang, categoryId, categoryName, popular } = useLocalSearchParams();
  useTitle(`${categoryName} ${getLanguageNameById(languageIds[lang as string])} podcasts`);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<CategoryResponseItem[]>([]);

  useEffect(() => {
    setLoading(true);
    getCategories(+categoryId, lang as string, !!popular)
      .then(setCategories)
      .finally(() => setLoading(false));
  }, [categoryId, popular]);

  return (
    <>
      <Stack.Screen
        options={{
          title: categoryName as string,
        }}
      />
      <View style={themeStyles.screen}>
        {loading ? (
          <Loading />
        ) : categories.length > 1 ? (
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
                            lang: lang as string,
                            categoryId: category.id,
                            categoryName: category.name,
                            popular: category.name.startsWith("Top ") ? "true" : undefined,
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
                            lang: lang as string,
                            categoryId: category.id,
                            categoryName: category.name,
                            popular: category.name.startsWith("Top ") ? "true" : undefined,
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
        ) : (
          <FlashList
            contentContainerStyle={{ padding: sizeElementSpacing }}
            data={categories[0].podcasts}
            renderItem={({ item }) => <PodcastItem podcast={item} segment="discover" full />}
          />
        )}
      </View>
    </>
  );
}