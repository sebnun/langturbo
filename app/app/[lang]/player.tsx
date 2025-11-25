import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { activateKeepAwakeAsync, deactivateKeepAwake } from "expo-keep-awake";
import React, { useEffect, useRef } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { sizeScreenPadding, themeStyles } from "@/utils/theme";
import Loading from "@/components/Loading";
import Progress from "@/components/Progress";
import { StyleSheet, View, ScrollView, Platform, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Button from "@/components/button/Button";
import { usePlayerStore } from "@/utils/store";
import TimeCode from "@/components/TimeCode";
import Transcriber, { SEEK_FORWARD_SECONDS } from "@/components/Transcriber";
import Caption from "@/components/Caption";
import Translation from "@/components/Translation";
import { decodeUrl, useTitle } from "@/utils";
import * as Burnt from "burnt";
import { LinearGradient } from "expo-linear-gradient";

export default function PlayerScreen() {
  const { id, podcastId, title, podcastTitle, podcastImageUrl } = useLocalSearchParams() as {
    id: string;
    podcastId: string;
    title: string;
    podcastTitle: string;
    podcastImageUrl: string;
  };
  useTitle(title);
  const router = useRouter();

  //useLocalSearchParams decodes the params, but it breaks urls that have other encoded urls in them
  const decodedId = decodeUrl(id);

  const loadingIntervalRef = useRef<number | null>(null);

  const caption = usePlayerStore((state) => state.caption);
  const playing = usePlayerStore((state) => state.playing);
  const nextStart = usePlayerStore((state) => state.nextStart);
  const prevStart = usePlayerStore((state) => state.prevStart);
  const duration = usePlayerStore((state) => state.duration);
  const error = usePlayerStore((state) => state.error);

  const reset = usePlayerStore((state) => state.reset);

  const resetPlayer = () => {
    if (loadingIntervalRef.current) {
      clearInterval(loadingIntervalRef.current);
    }

    if (Platform.OS !== "web") {
      deactivateKeepAwake();
    }

    reset();
  };

  useEffect(() => {
    let elapsedTime = 0;
    loadingIntervalRef.current = setInterval(() => {
      const progress = Math.trunc((Math.atan(elapsedTime / 3e3) / (Math.PI / 2)) * 100);
      elapsedTime += 100;
      usePlayerStore.setState({ positionLabel: `Transcribing ${progress}%` });
    }, 100);

    if (Platform.OS !== "web") {
      activateKeepAwakeAsync();
    }

    return () => resetPlayer();
  }, [id]);

  useEffect(() => {
    if (duration) {
      // Ready to play
      if (loadingIntervalRef.current) {
        clearInterval(loadingIntervalRef.current);
        usePlayerStore.setState({ positionLabel: `00:00` });
      }
    }
  }, [duration]);

  useEffect(() => {
    if (error && error === "DOWNLOAD_ERROR") {
      Burnt.toast({
        title: `This podcast is offline`,
        preset: "error",
      });

      resetPlayer();
      router.back();
    }
  }, [error]);

  const handlePrevious = async () => {
    usePlayerStore.setState({ seekToRequest: prevStart });
  };

  const handleNext = async () => {
    usePlayerStore.setState({ seekToRequest: nextStart });
  };

  const handlePlayToogle = async () => {
    usePlayerStore.setState({ playbackRequest: playing ? "pause" : "play" });
  };

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
          headerTitle: () => <TimeCode />,
          headerShadowVisible: false,
          headerBackButtonDisplayMode: "minimal",
          headerTitleAlign: "center",
        }}
      />
      <SafeAreaView style={themeStyles.screen}>
        <LinearGradient colors={["black", "#050505"]} style={styles.gradient} />
        <Transcriber id={decodedId} sourceId={podcastId} episodeTitle={title} podcastImageUrl={podcastImageUrl} />
        {!duration ? (
          <Loading />
        ) : (
          <ScrollView contentContainerStyle={styles.sentencesContainer}>
            <Caption />
            <Translation />
          </ScrollView>
        )}
        <View style={styles.playbackContainer}>
          <View style={styles.playbackCenterContainer}>
            <Button disabled={!duration || prevStart === -1} onPress={handlePrevious}>
              <Ionicons name="arrow-back-sharp" size={40} color="white" />
            </Button>

            <Button onPress={handlePlayToogle} disabled={!duration}>
              {playing ? (
                <Ionicons name="pause-circle-sharp" size={60} color="white" />
              ) : (
                <Ionicons name="play-circle-sharp" size={60} color="white" />
              )}
            </Button>

            {duration && nextStart === -1 && caption && caption.start + SEEK_FORWARD_SECONDS < duration ? (
              <ActivityIndicator color="white" size="large" />
            ) : (
              <Button disabled={!duration || nextStart === -1} onPress={handleNext}>
                <Ionicons name="arrow-forward-sharp" size={40} color="white" />
              </Button>
            )}
          </View>
        </View>
        <Progress />
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  sentencesContainer: {
    // This breaks Safari
    //flex: 1,
    //justifyContent: "center",
    marginTop: "auto",
    marginBottom: "auto",
    padding: sizeScreenPadding,
    gap: sizeScreenPadding,
  },
  gradient: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  playbackContainer: {
    alignItems: "center",
    justifyContent: "space-between",
    padding: sizeScreenPadding,
    flexDirection: "row",
  },
  playbackCenterContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: sizeScreenPadding,
    flex: 1,
  },
});
