import { Stack } from "expo-router";
import "../assets/css/body.css";
import { SourceCodePro_400Regular, useFonts } from "@expo-google-fonts/source-code-pro";
import { StatusBar } from "expo-status-bar";
import Loading from "@/components/Loading";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Toaster } from "burnt/web";

export const unstable_settings = {
  // Ensure any route can link back to `/`on full refresh
  initialRouteName: "index",
};

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SourceCodePro_400Regular,
  });

  return (
    <>
      <SafeAreaProvider>
        {loaded ? (
          <Stack>
            <Stack.Screen name="[lang]/(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="[lang]/player" />
            <Stack.Screen name="index" />
          </Stack>
        ) : (
          <Loading />
        )}
      </SafeAreaProvider>
      <StatusBar style="light" />
      <Toaster position="bottom-right" />
    </>
  );
}
