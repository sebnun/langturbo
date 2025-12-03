import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { activateKeepAwakeAsync, deactivateKeepAwake } from "expo-keep-awake";
import React, { useEffect, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { sizeIconNavigation, sizeScreenPadding, themeStyles } from "@/utils/theme";
import Loading from "@/components/Loading";
import Progress from "@/components/Progress";
import { StyleSheet, View, ScrollView, Platform, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Button from "@/components/button/Button";
import { useAppStore, usePlayerStore } from "@/utils/store";
import TimeCode from "@/components/TimeCode";
import Transcriber, { SEEK_FORWARD_SECONDS } from "@/components/Transcriber";
import Caption from "@/components/Caption";
import Translation from "@/components/Translation";
import { decodeUrl } from "@/utils";
import * as Burnt from "burnt";
import { LinearGradient } from "expo-linear-gradient";
import { useTitle } from "@/utils/hooks";
import SettingsModal from "@/components/SettingsModal";
import { authClient } from "@/utils/auth";
import AuthModal from "@/components/AuthModal";
import WordModal from "@/components/WordModal";
import TutorModal from "@/components/TutorModal";
import PressInstructions from "@/components/PressInstructions";

export default function PlayerScreen() {
  const { id, podcastId, title, podcastTitle, podcastImageUrl, playbackPercentage } = useLocalSearchParams<{
    id: string;
    podcastId: string;
    title: string;
    podcastTitle: string;
    podcastImageUrl: string;
    playbackPercentage?: string;
  }>();
  useTitle(title);
  const router = useRouter();
  const { data: session } = authClient.useSession();

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
  const showPlayerOnboarding = useAppStore((state) => state.showPlayerOnboarding);

  const [showSettings, setShowSettings] = useState(false);
  const [showTutor, setShowTutor] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [selectedWord, setSelectedWord] = useState("");

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

        if (playbackPercentage) {
          const floatPlaybackPercentage = parseFloat(playbackPercentage);
          if (floatPlaybackPercentage < 100) {
            const position = duration * (floatPlaybackPercentage / 100);
            // Seek auto plays
            usePlayerStore.setState({ seekToRequest: position });
            setTimeout(() => usePlayerStore.setState({ playbackRequest: "pause" }), 100);
          }
        }
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

  const handlePlayToogle = () => {
    usePlayerStore.setState({ playbackRequest: playing ? "pause" : "play" });
  };

  const handleReplay = async () => {
    // it needs to be captionStart, not start
    usePlayerStore.setState({ seekToRequest: caption?.captionStart });
  };

  const handleTutor = async () => {
    usePlayerStore.setState({ playbackRequest: "pause" });
    if (!session) {
      setShowAuth(true);
    } else {
      setShowTutor(true);
    }
  };

  const handleSelectWord = (word: string) => {
    usePlayerStore.setState({ playbackRequest: "pause" });
    if (!session) {
      setShowAuth(true);
    } else {
      setSelectedWord(word);
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: !showPlayerOnboarding,
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
          headerRight: () => (
            <View
              style={{
                paddingRight: Platform.OS === "web" ? sizeScreenPadding : undefined,
                paddingLeft: Platform.OS === "ios" ? 6 : undefined, // With the new glass buttons
              }}
            >
              <Button onPress={() => setShowSettings(true)}>
                <Ionicons name="options-sharp" size={sizeIconNavigation} color="white" />
              </Button>
            </View>
          ),
        }}
      />
      <SafeAreaView style={themeStyles.screen}>
        {showPlayerOnboarding ? <PressInstructions /> : null}
        <LinearGradient colors={["black", "#050505"]} style={styles.gradient} />
        <SettingsModal isVisible={showSettings} onClose={() => setShowSettings(false)} />
        <TutorModal onClose={() => setShowTutor(false)} isVisible={showTutor} />
        <WordModal onClose={() => setSelectedWord("")} word={selectedWord} />
        <AuthModal onClose={() => setShowAuth(false)} isVisible={showAuth} />
        <Transcriber id={decodedId} sourceId={podcastId} episodeTitle={title} podcastImageUrl={podcastImageUrl} />
        {!duration ? (
          <Loading />
        ) : (
          <ScrollView contentContainerStyle={styles.sentencesContainer}>
            <Caption onWordPress={handleSelectWord} />
            <Translation />
          </ScrollView>
        )}
        <View style={styles.playbackContainer}>
          <View style={styles.playbackCenterContainer}>
            <Button disabled={!duration || prevStart === -1} onPress={handlePrevious}>
              <Ionicons name="arrow-back-sharp" size={40} color="white" />
            </Button>

            <Button disabled={!duration} onPress={handleReplay}>
              <Ionicons name="repeat-sharp" size={40} color="white" />
            </Button>

            <Button onPress={handlePlayToogle} disabled={!duration}>
              {playing ? (
                <Ionicons name="pause-circle-sharp" size={60} color="white" />
              ) : (
                <Ionicons name="play-circle-sharp" size={60} color="white" />
              )}
            </Button>

            <Button disabled={!duration} onPress={handleTutor}>
              <Ionicons name="mic-sharp" size={40} color="white" />
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
