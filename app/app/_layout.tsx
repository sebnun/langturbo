import { Stack } from "expo-router";
import "../assets/css/body.css";
import { SourceCodePro_400Regular, useFonts } from "@expo-google-fonts/source-code-pro";
import { StatusBar } from "expo-status-bar";
import Loading from "@/components/Loading";
import { SafeAreaProvider } from "react-native-safe-area-context";

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
    </>
  );
}
