import { Stack } from "expo-router";
import "../assets/css/body.css";
import { SourceCodePro_400Regular, useFonts } from "@expo-google-fonts/source-code-pro";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { Platform } from "react-native";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SourceCodePro_400Regular,
  });

  // TODO Breaks forward button
  // useEffect(() => {
  //   // Full page refresh, to have usable navigation
  //   if (Platform.OS === "web" && window.location.pathname !== "/") {
  //     window.location.href = "/";
  //   }
  // }, []);

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <Stack
      screenOptions={{
        contentStyle: {
          backgroundColor: "black",
        },
        headerTintColor: "white",
        headerStyle: {
          backgroundColor: "black",
        },
        headerShadowVisible: false,
        headerBackButtonDisplayMode: "minimal",
      }}
    />
  );
}
