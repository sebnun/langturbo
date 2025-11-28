import { getUser } from "@/utils/api";
import { authClient } from "@/utils/auth";
import { useAppStore } from "@/utils/store";
import { Stack, useLocalSearchParams } from "expo-router";
import React, { useEffect } from "react";

export default function LangLayout() {
  const { data: session } = authClient.useSession();
  const { lang } = useLocalSearchParams<{ lang: string }>();

  useEffect(() => {
    if (!session) {
      useAppStore.setState({ words: [], playback: [], saved: [] });
    } else {
      getUser(lang).then(({ words, playback, saved }) => useAppStore.setState({ words, playback, saved }));
    }
  }, [session, lang]);

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="player" />
    </Stack>
  );
}
