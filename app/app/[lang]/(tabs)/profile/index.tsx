import {
  sizeScreenPadding,
  sizeWidthProfile,
  themeStyles,
} from "@/utils/theme";
import { Link, Stack, useGlobalSearchParams, useRouter } from "expo-router";
import { View, StyleSheet, ScrollView } from "react-native";
import { getLanguageNameById, languageIds } from "@/utils/languages";
import { capitalizeFirstLetter, useTitle } from "@/utils";
import React, { useState } from "react";
import RoundButton from "@/components/button/RoundButton";

export default function ProfileScreen() {
  // When navigating to / global params change to empty, causing an error
  // So use only the first value
  const [globalParams, _] = useState(useGlobalSearchParams());
  const { lang } = globalParams;
  useTitle(`Learning ${capitalizeFirstLetter(getLanguageNameById(languageIds[lang as string]))}`);

  const router = useRouter();

  return (
    <>
      <Stack.Screen
        options={{
          title: `Learning ${capitalizeFirstLetter(getLanguageNameById(languageIds[lang as string]))}`,
        }}
      />
      <View style={themeStyles.screen}>
        <ScrollView contentContainerStyle={styles.scrollView}>
          <View style={styles.container}>
            <View style={styles.cardLikeWidth}>
              <RoundButton type="primary" text="Change Language" onPress={() => router.dismissTo("/")} />
              <Link href="https://www.patreon.com/cw/sebnun" asChild>
                <RoundButton text="Support me on Patreon" />
              </Link>
            </View>
          </View>
        </ScrollView>
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
});
