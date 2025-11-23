import { useAppStore } from "@/utils/store";
import {
  colorCardBackground,
  colorTextSubdued,
  msImageTransition,
  radiusBorder,
  sizeIconNavigation,
  sizeScreenPadding,
  sizeTextLarger,
  sizeWidthProfile,
  themeStyles,
} from "@/utils/theme";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { View, StyleSheet, ScrollView, Platform, Text } from "react-native";
import { getLanguageNameById, languageIds } from "@/utils/languages";
import { capitalizeFirstLetter, useTitle } from "@/utils";

import React from "react";

export default function DiscoverScreen() {
  const { lang } = useLocalSearchParams();

  return (
    <>
      <Stack.Screen
        options={{
          title: `Learning ${capitalizeFirstLetter(getLanguageNameById(languageIds[lang as string]))}`,
        }}
      />
      <View style={themeStyles.screen}>
        <Text style={{ color: 'white'}}>discover</Text>
      </View>
    </>
  );
}

export const styles = StyleSheet.create({
  scrollView: {
    padding: sizeScreenPadding,
    paddingBottom: sizeScreenPadding,
    paddingTop: sizeScreenPadding,
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    gap: sizeScreenPadding,
    maxWidth: sizeWidthProfile,
    width: "100%",
  },
  cardLikeWidth: {
    paddingLeft: sizeScreenPadding,
    paddingRight: sizeScreenPadding,
    gap: sizeScreenPadding,
  },
  card: {
    borderRadius: radiusBorder,
    padding: sizeScreenPadding,
    backgroundColor: colorCardBackground,
    gap: sizeScreenPadding,
  },
  title: {
    fontSize: sizeTextLarger,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
  linkContainer: {
    marginVertical: sizeScreenPadding * 2,
    gap: sizeScreenPadding,
  },
  link: {
    color: colorTextSubdued,
    textAlign: "center",
  },
});
