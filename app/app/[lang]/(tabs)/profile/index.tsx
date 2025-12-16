import {
  colorTextSubdued,
  msImageTransition,
  sizeIconNavigation,
  sizeScreenPadding,
  sizeWidthProfile,
  themeStyles,
} from "@/utils/theme";
import { Link, Stack, useGlobalSearchParams, useRouter } from "expo-router";
import { View, StyleSheet, ScrollView, Linking, Platform } from "react-native";
import { getLanguageNameById, languageIds } from "@/utils/languages";
import { capitalizeFirstLetter } from "@/utils";
import React, { useState } from "react";
import RoundButton from "@/components/button/RoundButton";
import { useTitle } from "@/utils/hooks";
import TextButton from "@/components/button/TextButton";
import { authClient } from "@/utils/auth";
import AuthModal from "@/components/AuthModal";
import Button from "@/components/button/Button";
import { Ionicons } from "@expo/vector-icons";
import * as Device from "expo-device";
import { Image } from "expo-image";
import { useAppStore } from "@/utils/store";

export default function ProfileScreen() {
  // When navigating to / global params change to empty, causing an error
  // So use only the first value
  const [globalParams, _] = useState(useGlobalSearchParams());
  const { lang } = globalParams;
  useTitle(`Learning ${capitalizeFirstLetter(getLanguageNameById(languageIds[lang as string]))}`);
  const { data: session } = authClient.useSession();

  const [showAuth, setShowAuth] = useState(false);

  const router = useRouter();

  const handleChangeLanguage = () => {
    useAppStore.setState({ language: null });
    router.dismissTo("/");
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: `Learning ${capitalizeFirstLetter(getLanguageNameById(languageIds[lang as string]))}`,
          headerRight: () => (
            <View
              style={{
                paddingRight: Platform.OS === "web" ? sizeScreenPadding : undefined,
                paddingLeft: Platform.OS === "ios" ? 6 : undefined, // With the new glass buttons
              }}
            >
              <Button onPress={() => (session ? router.navigate("../profile/charts") : setShowAuth(true))}>
                <Ionicons name="stats-chart-sharp" size={sizeIconNavigation} color="white" />
              </Button>
            </View>
          ),
        }}
      />
      <View style={themeStyles.screen}>
        <AuthModal onClose={() => setShowAuth(false)} isVisible={showAuth} isProfile />
        <ScrollView contentContainerStyle={styles.scrollView}>
          <View style={styles.container}>
            <View style={styles.cardLikeWidth}>
              <RoundButton type="primary" text="Change Language" onPress={handleChangeLanguage} />
              {Platform.OS !== "ios" && ( // iOS app review rejected
                <Link href="https://www.patreon.com/cw/sebnun" asChild>
                  <RoundButton text="Support me on Patreon" />
                </Link>
              )}
              <RoundButton
                onPress={() => (session ? router.navigate("../profile/import") : setShowAuth(true))}
                text="Add Known Words"
              />
              <RoundButton onPress={() => router.navigate("../profile/feedback")} text="Send Feedback" />
              {!session ? (
                <RoundButton onPress={() => setShowAuth(true)} text="Sign In" />
              ) : (
                <>
                  <RoundButton onPress={async () => await authClient.signOut()} text="Sign Out" type="ghost" />
                  <RoundButton
                    type="ghost"
                    onPress={() => router.navigate("../profile/delete")}
                    text="Delete Account"
                  />
                </>
              )}
            </View>
          </View>

          {Platform.OS === "web" && Device.osName === "iOS" && (
            <View style={styles.linkContainer}>
              <Button onPress={() => Linking.openURL("https://itunes.apple.com/app/id6756127477?mt=8")}>
                <Image
                  style={{
                    width: 169,
                    height: 50,
                  }}
                  contentFit="scale-down"
                  transition={msImageTransition}
                  source={require("../../../../assets/images/ios.svg")}
                />
              </Button>
            </View>
          )}

          <View style={styles.linkContainer}>
            <TextButton
              onPress={() => Linking.openURL("https://www.langturbo.com/contact")}
              style={styles.link}
              text="Contact"
            />
            <TextButton
              onPress={() => Linking.openURL("https://www.langturbo.com/privacy")}
              style={styles.link}
              text="Privacy"
            />

            <TextButton
              onPress={() => Linking.openURL("https://www.langturbo.com/terms")}
              style={styles.link}
              text="Terms"
            />
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
  linkContainer: {
    marginVertical: sizeScreenPadding * 2,
    gap: sizeScreenPadding,
  },
  link: {
    color: colorTextSubdued,
    textAlign: "center",
  },
});
