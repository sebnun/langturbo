import { Stack } from "expo-router";
import "../assets/css/body.css";
import { SourceCodePro_400Regular, useFonts } from "@expo-google-fonts/source-code-pro";
import { StatusBar } from "expo-status-bar";
import Loading from "@/components/Loading";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Toaster } from "burnt/web";
import * as Sentry from "@sentry/react-native";

Sentry.init({
  dsn: "https://1656437e7840e162a26b5a97b19ac7fc@o4510416598269952.ingest.us.sentry.io/4510416604299264",
  sendDefaultPii: true,
  enableLogs: true,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1,
  profilesSampleRate: 1.0,
  tracesSampleRate: 1.0,
  integrations: [Sentry.mobileReplayIntegration()],
  enabled: !__DEV__,
});

export const unstable_settings = {
  // Ensure any route can link back to `/`on full refresh
  initialRouteName: "index",
};

export default Sentry.wrap(function RootLayout() {
  const [loaded, error] = useFonts({
    SourceCodePro_400Regular,
  });

  return (
    <>
      <SafeAreaProvider>
        {loaded ? (
          <Stack>
            <Stack.Screen name="[lang]" options={{ headerShown: false }} />
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
});
