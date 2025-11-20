import { Stack, useRouter, useLocalSearchParams, useNavigation } from "expo-router";
// import { activateKeepAwakeAsync, deactivateKeepAwake } from "expo-keep-awake";
import React, { useEffect, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { sizeIconNavigation, sizeScreenPadding, themeStyles } from "@/utils/theme";
// import { useAppStore, usePlayerStore } from "@/utils/store";
// import Loading from "@/components/Loading";
// import TimeCode from "@/components/TimeCode";
// import Progress from "@/components/Progress";
import { StyleSheet, View, ScrollView, Platform, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Button from "@/components/button/Button";
import { usePlayerStore } from "@/utils/store";
import { useTitle } from "@/utils";
import TimeCode from "@/components/TimeCode";
import AudioPlayer from "@/components/AudioPlayer";
// import TrackPlayer from "react-native-track-player";
// import Caption from "@/components/Caption";
// import PressInstructions from "@/components/PressInstructions";
// import SettingsModal from "@/components/SettingsModal";
// import Translation from "@/components/Translation";
// import WordModal from "@/components/WordModal";
// import { decodeUrl, useTitle } from "@/utils";
// import { SEEK_FORWARD_SECONDS } from "@/utils/constants";

export default function PlayerScreen() {
  const router = useRouter();
  const { id, podcastId, title, podcastTitle, podcastImageUrl } =
    useLocalSearchParams() as {
      id: string;
      podcastId: string;
      title: string;
      podcastTitle: string;
      podcastImageUrl: string;
    };
  useTitle(title)

  // const navigation = useNavigation();

  // //useLocalSearchParams decodes the params, but it breaks urls that have other encoded urls in them
  // const decodedId = decodeUrl(id);

  // const loadingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  // const reset = usePlayerStore((state) => state.reset);

  const playing = usePlayerStore((state) => state.playing);
  const player = usePlayerStore(state => state.player)
  // const caption = usePlayerStore((state) => state.caption);
  // const nextStart = usePlayerStore((state) => state.nextStart);
  // const prevStart = usePlayerStore((state) => state.prevStart);
  //const duration = usePlayerStore((state) => state.duration);
  // const error = usePlayerStore((state) => state.error);
  // const slower = useAppStore((state) => state.slower);
  // const queue = useAppStore((state) => state.queue);
  // const showPlayerOnboarding = useAppStore((state) => state.showPlayerOnboarding);
  // const updatePlayback = useAppStore((state) => state.updatePlayback);

  // const [showSettings, setShowSettings] = useState(false);
  // const [selectedWord, setSelectedWord] = useState("");

  // // This runs before the useEffect return, need to explicitly pause due to issues on safari iOS
  // navigation.addListener("beforeRemove", async (e) => {
  //   if (isPlaying) {
  //     e.preventDefault();
  //     usePlayerStore.setState({ isPlaying: false });
  //     await new Promise((resolve, reject) => setTimeout(resolve, 10));
  //     navigation.dispatch(e.data.action);
  //   }
  // });

  // const resetPlayer = () => {
  //   updatePlayback({ episodeId: decodedId, percentage: usePlayerStore.getState().progressPercentage });
  //   if (loadingIntervalRef.current) {
  //     clearInterval(loadingIntervalRef.current);
  //   }

  //   if (Platform.OS !== "web") {
  //     deactivateKeepAwake();
  //   }

  //   reset();
  // };

  // useEffect(() => {
  //   usePlayerStore.setState({
  //     track: {
  //       id: decodedId,
  //       podcastId,
  //       title,
  //       podcastTitle,
  //       podcastImageUrl,
  //       startPercentage: playbackPercentage ? parseFloat(playbackPercentage) : undefined,
  //       startPosition: playbackStart ? parseFloat(playbackStart) : undefined,
  //     },
  //   });

  //   let elapsedTime = 0;
  //   loadingIntervalRef.current = setInterval(() => {
  //     const progress = Math.trunc((Math.atan(elapsedTime / 3e3) / (Math.PI / 2)) * 100);
  //     elapsedTime += 100;
  //     usePlayerStore.setState({ positionLabel: `Transcribing ${progress}%` });
  //   }, 100);

  //   if (Platform.OS !== "web") {
  //     activateKeepAwakeAsync();
  //   }

  //   return () => resetPlayer();
  // }, [id]);

  // useEffect(() => {
  //   if (duration) {
  //     // Ready to play
  //     if (loadingIntervalRef.current) {
  //       clearInterval(loadingIntervalRef.current);
  //     }

  //     if (queue) {
  //       usePlayerStore.setState({ isPlaying: true });
  //     }
  //   }
  // }, [duration]);

  // useEffect(() => {
  //   if (selectedWord) {
  //     usePlayerStore.setState({ isPlaying: false });
  //   }
  // }, [selectedWord]);

  // useEffect(() => {
  //   if (error && error === "DOWNLOAD_ERROR") {
  //     //console.log("download error");
  //     Burnt.toast({
  //       title: `This podcast is offline`,
  //       preset: "error",
  //     });

  //     // Need to reset here, track subscription not called?
  //     resetPlayer();
  //     router.back();
  //   }
  // }, [error]);

  // useEffect(() => {
  //   if (slower) {
  //     TrackPlayer.setRate(0.75);
  //   } else {
  //     TrackPlayer.setRate(1);
  //   }
  // }, [slower]);

  // const handlePrevious = async () => {
  //   const wasAutoPause = useAppStore.getState().autoPause;
  //   if (wasAutoPause) {
  //     useAppStore.setState({ autoPause: false });
  //   }

  //   await TrackPlayer.seekTo(prevStart);
  //   usePlayerStore.setState({ isPlaying: true });

  //   if (wasAutoPause) {
  //     await new Promise((resolve, reject) =>
  //       setTimeout(() => {
  //         useAppStore.setState({ autoPause: true });
  //         resolve(0);
  //       }, 200)
  //     );
  //   }
  // };

  // const handleNext = async () => {

  //   const wasAutoPause = useAppStore.getState().autoPause;
  //   if (wasAutoPause) {
  //     useAppStore.setState({ autoPause: false });
  //   }

  //   await TrackPlayer.seekTo(nextStart);
  //   usePlayerStore.setState({ isPlaying: true });

  //   if (wasAutoPause) {
  //     await new Promise((resolve, reject) =>
  //       setTimeout(() => {
  //         useAppStore.setState({ autoPause: true });
  //         resolve(0);
  //       }, 200)
  //     );
  //   }
  // };

  const handlePlayToogle = async () => {
    if (player?.playing) {
      player.pause()
    } else {
      player?.play()
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          //headerShown: !showPlayerOnboarding,
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
          // headerRight: () => (
          //   <View style={{ paddingRight: Platform.OS === "web" ? sizeScreenPadding : 0 }}>
          //     <Button onPress={() => setShowSettings(true)}>
          //       <Ionicons name="options-sharp" size={sizeIconNavigation} color="white" />
          //     </Button>
          //   </View>
          // ),
        }}
      />
      <SafeAreaView style={themeStyles.screen}>
        <AudioPlayer uri="https://storage.googleapis.com/turbo-9892e.firebasestorage.app/test/audio.mp3" />
        {/* {showPlayerOnboarding ? <PressInstructions /> : null}
        <SettingsModal isVisible={showSettings} onClose={() => setShowSettings(false)} />
        <WordModal onClose={() => setSelectedWord("")} word={selectedWord} /> */}
        {/* {!duration ? (
          <Loading />
        ) : (
          <ScrollView contentContainerStyle={styles.sentencesContainer}>
            <Caption onWordPress={setSelectedWord} />
            <Translation />
          </ScrollView>
        )} */}
        <View style={styles.playbackContainer}>

          <View style={styles.playbackCenterContainer}>
            {/* <Button disabled={!duration || prevStart === -1} onPress={handlePrevious}>
              <Ionicons name="arrow-back-sharp" size={40} color="white" />
            </Button> */}

            <Button onPress={handlePlayToogle} >
              {playing ? (
                <Ionicons name="pause-circle-sharp" size={60} color="white" />
              ) : (
                <Ionicons name="play-circle-sharp" size={60} color="white" />
              )}
            </Button>

            {/* {duration && nextStart === -1 && caption && caption.start + SEEK_FORWARD_SECONDS < duration ? (
              <ActivityIndicator color="white" size="large" />
            ) : (
              <Button disabled={!duration || nextStart === -1} onPress={handleNext}>
                <Ionicons name="arrow-forward-sharp" size={40} color="white" />
              </Button>
            )} */}
          </View>
        </View>
        {/* <Progress /> */}
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
  },
});
