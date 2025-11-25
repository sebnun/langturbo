import { StyleSheet, View, TextInput, Keyboard } from "react-native";
import { Stack, useGlobalSearchParams } from "expo-router";
import { FlashList } from "@shopify/flash-list";
import { useEffect, useState } from "react";
import { colorPrimary, colorTextSubdued, sizeElementSpacing, sizeScreenPadding, themeStyles } from "@/utils/theme";
import { getSearch } from "@/utils/api";
import Loading from "@/components/Loading";
import PodcastItem, { NoContent } from "@/components/PodcastItem";
import React from "react";
import { capitalizeFirstLetter } from "@/utils";
import { getLanguageNameById, languageIds } from "@/utils/languages";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDebounce, useTitle } from "@/utils/hooks";

export default function SearchScreen() {
  useTitle("Search");
  const { lang } = useGlobalSearchParams();

  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 1500);
  const [tabIndex, setTabIndex] = useState(0);

  const [items, setItems] = useState<Podcast[]>([]);
  const [loading, setLoading] = useState(false);

  const insets = useSafeAreaInsets();

  // When a user searchs for "radio ambulante", "radio ambul" has no results
  // so avoid showing results until debauncedQuery is set
  useEffect(() => {
    if (query.trim()) {
      setLoading(true);
    }
  }, [query]);

  useEffect(() => {
    if (debouncedQuery.trim()) {
      getSearch(debouncedQuery, lang as string)
        .then(setItems)
        .finally(() => setLoading(false));
    } else {
      setItems([]);
    }
  }, [debouncedQuery]);

  useEffect(() => {
    setQuery("");
  }, [tabIndex, lang]); // Reset results when language changes

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <View style={[themeStyles.screen, { paddingTop: insets.top }]}>
        <View style={styles.textInputContainer}>
          <TextInput
            placeholderTextColor={colorTextSubdued}
            autoCapitalize="none"
            autoComplete="off"
            autoCorrect={false}
            inputMode="search"
            style={themeStyles.textInput}
            onChangeText={setQuery}
            value={query}
            placeholder={`Search podcasts in ${capitalizeFirstLetter(
              getLanguageNameById(languageIds[lang as string])
            )}`}
            //autoFocus
            selectionColor={colorPrimary}
          />
        </View>
        <View style={styles.flashContainer}>
          {loading ? (
            <Loading />
          ) : items.length === 0 && query !== "" ? (
            <NoContent icon="void" text={"No podcasts found, try typing the full title"} onTouch={Keyboard.dismiss} />
          ) : !query ? (
            <NoContent icon="podcasts" text="Search podcasts" onTouch={Keyboard.dismiss} />
          ) : (
            <FlashList
              contentContainerStyle={{ padding: sizeElementSpacing }}
              data={items as Podcast[]}
              renderItem={({ item }) => <PodcastItem podcast={item} full />}
            />
          )}
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  textInputContainer: {
    padding: sizeScreenPadding,
  },
  flashContainer: {
    flex: 1,
    width: "100%",
  },
});
