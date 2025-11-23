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
import { Link, Stack, useGlobalSearchParams, useLocalSearchParams, useRouter } from "expo-router";
import { View, StyleSheet, ScrollView, Platform, Text } from "react-native";
import { getLanguageNameById, languageIds } from "@/utils/languages";
import { capitalizeFirstLetter, useTitle } from "@/utils";

import React from "react";
import RoundButton from "@/components/button/RoundButton";

export default function ProfileScreen() {
  const { lang } = useGlobalSearchParams();
  useTitle(`Learning ${capitalizeFirstLetter(getLanguageNameById(languageIds[(lang as string) || "en"]))}`);

  const router = useRouter();

  return (
    <>
      <Stack.Screen
        options={{
          title: `Learning ${capitalizeFirstLetter(getLanguageNameById(languageIds[(lang as string) || "en"]))}`,
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
