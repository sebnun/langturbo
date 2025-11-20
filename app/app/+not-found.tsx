import { Stack, useRouter } from "expo-router";
import { StyleSheet, View, Text } from "react-native";
import React from "react";
import RoundButton from "@/components/button/RoundButton";
import { sizeScreenPadding, sizeTextLarger, sizeWidthProfile } from "@/utils/theme";

export default function NotFoundScreen() {
  const router = useRouter();
  return (
    <>
      <Stack.Screen
        options={{
          contentStyle: {
            backgroundColor: "black",
          },
          headerTintColor: "white",
          headerStyle: {
            backgroundColor: "black",
          },
          headerShadowVisible: false,
          headerBackButtonDisplayMode: "minimal",
          title: "Opps!",
        }}
      />
      <View style={styles.mainContainer}>
        <View style={styles.container}>
          <Text style={styles.afterMailText}>This screen does not exist.</Text>
          <RoundButton type="ghost" text="Go to the home screen" onPress={() => router.replace("/")} />
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: "center",
  },
  container: {
    maxWidth: sizeWidthProfile,
    width: "100%",
    marginLeft: "auto",
    marginRight: "auto",
    gap: sizeScreenPadding,
    padding: sizeScreenPadding,
  },
  afterMailText: {
    color: "white",
    textAlign: "center",
    fontSize: sizeTextLarger,
  },
});
