import { StyleSheet, Text, View, Modal, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Gesture, GestureDetector, Directions, GestureHandlerRootView } from "react-native-gesture-handler";
import {
  colorScreenBackground,
  colorTextSubdued,
  radiusBorder,
  sizeIconNavigation,
  sizeScreenPadding,
  sizeTextLarger,
  sizeWidthProfile,
  themeStyles,
} from "@/utils/theme";
import Button from "./button/Button";
import { EpisodeItemSeparator } from "./EpisodeItem";
import { useLocalSearchParams } from "expo-router";
import {
  getRecordingPermissionsAsync,
  RecordingPresets,
  requestRecordingPermissionsAsync,
  setAudioModeAsync,
  useAudioRecorder,
  useAudioRecorderState,
} from "expo-audio";
import RoundButton from "./button/RoundButton";
import { getLanguageNameById, languageIds } from "@/utils/languages";
import { capitalizeFirstLetter } from "@/utils";
import { usePlayerStore } from "@/utils/store";
import { postShadowing } from "@/utils/api";
//@ts-ignore
import dsc from "dice-similarity-coeff";

export default function ShadowinModal({
  onClose,
  isVisible,
  onTutorRequest,
}: {
  onClose: () => void;
  isVisible: boolean;
  onTutorRequest: () => void;
}) {
  const insets = useSafeAreaInsets();
  const { lang } = useLocalSearchParams<{ lang: string }>();
  const caption = usePlayerStore((state) => state.caption);

  const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const recorderState = useAudioRecorderState(audioRecorder);

  const [uiMessage, setUiMessage] = useState("Waiting for microphone access ...");

  const flingGesture = Gesture.Fling().direction(Directions.DOWN).onStart(onClose).runOnJS(true);
  const singleTap = Gesture.Tap().onStart(onClose).runOnJS(true);

  useEffect(() => {}, []);

  useEffect(() => {
    console.log(recorderState.durationMillis);
    if (recorderState.durationMillis > 20 * 1000) {
      onClose();
    }
  }, [recorderState.durationMillis]);

  useEffect(() => {
    if (isVisible) {
      getRecordingPermissionsAsync().then(({ granted }) => {
        if (!granted) {
          requestRecordingPermissionsAsync().then(({ granted }) => {
            if (!granted) {
              setUiMessage("You need to allow microphone access to use this functionality");
            } else {
              setUiMessage("Recording ...");
              setAudioModeAsync({
                playsInSilentMode: true, // iOS
                allowsRecording: true, // iOS
              }).then(() => audioRecorder.prepareToRecordAsync().then(() => audioRecorder.record()));
            }
          });
        } else {
          setUiMessage("Recording ...");
          setAudioModeAsync({
            playsInSilentMode: true, // iOS
            allowsRecording: true, // iOS
          }).then(() => audioRecorder.prepareToRecordAsync().then(() => audioRecorder.record()));
        }
      });
    } else {
      if (recorderState.isRecording) {
        audioRecorder.stop();
      }
      setAudioModeAsync({
        playsInSilentMode: true,
        allowsRecording: false,
      });
      setUiMessage("Waiting for microphone access ...");
    }
  }, [isVisible]);

  const handleStopRecording = async () => {
    setUiMessage("Comparing ...");
    await audioRecorder.stop();
    const blob = await fetch(audioRecorder.uri!).then((r) => r.blob());

    const { text } = await postShadowing(blob, lang);

    const transcriptionToCompare = (text as string)
      .trim()
      .replace(/[^\p{L}\d]/gu, "")
      .toLowerCase();
    const captionToCompare = caption?.text
      .trim()
      .replace(/[^\p{L}\d]/gu, "")
      .toLowerCase();
    const similarityScore = dsc.twoStrings(captionToCompare, transcriptionToCompare);

    setUiMessage(`${text} (${Math.round(similarityScore * 100)}%)`);

    if (similarityScore > 0.75) {
      onClose();
      usePlayerStore.setState({ playbackRequest: "play" });
    }
  };

  const handleOpenTutor = () => {
    onClose();
    onTutorRequest();
  };

  return (
    <Modal animationType="slide" transparent={true} visible={isVisible} onRequestClose={onClose}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View style={styles.modalContainer}>
          <GestureDetector gesture={singleTap}>
            <View style={styles.modalOverlay}></View>
          </GestureDetector>
          <GestureDetector gesture={flingGesture}>
            <View
              style={{
                ...styles.modalContent,
                paddingBottom: Math.max(insets.bottom, sizeScreenPadding),
              }}
            >
              <View style={styles.topBar}>
                <Text style={styles.topBarTitle}>Shadowing</Text>
                <Button onPress={onClose}>
                  <Ionicons name="close" size={sizeIconNavigation} color="white" />
                </Button>
              </View>
              <EpisodeItemSeparator />
              <View style={styles.mainView}>
                <Text style={[themeStyles.mutedText, { textAlign: "center", padding: sizeScreenPadding }]}>
                  Repeat the sentence. Your pronunciation will be compared against an AI model trained with native{" "}
                  {capitalizeFirstLetter(getLanguageNameById(languageIds[lang]))} speakers.
                </Text>
                <View style={[styles.sentencesContainer, styles.modalContainer]}>
                  <Text style={styles.mainText}>{caption?.text}</Text>
                  <Text style={styles.subText}>{uiMessage}</Text>
                </View>
              </View>
              <View style={styles.buttonContainer}>
                <RoundButton
                  type="primary"
                  disabled={uiMessage !== "Recording ..." && !uiMessage.includes("%)")}
                  text={
                    uiMessage === "Recording ..."
                      ? "Stop Recording"
                      : uiMessage.includes("%)")
                      ? "Get Pronunciation Help"
                      : "Loading ..."
                  }
                  onPress={uiMessage === "Recording ..." ? handleStopRecording : handleOpenTutor}
                />
              </View>
            </View>
          </GestureDetector>
        </View>
      </GestureHandlerRootView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    width: "100%",
    height: "100%",
  },
  modalOverlay: {
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    flex: 1,
  },
  modalContent: {
    position: "absolute",
    bottom: 0,
    borderTopLeftRadius: radiusBorder * 2,
    borderTopRightRadius: radiusBorder * 2,
    backgroundColor: colorScreenBackground,
    width: "100%",
  },
  topBar: {
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
    padding: sizeScreenPadding,
  },
  topBarTitle: {
    fontWeight: "bold",
    fontSize: sizeTextLarger,
    color: "white",
  },
  buttonContainer: {
    maxWidth: sizeWidthProfile,
    marginLeft: "auto",
    marginRight: "auto",
    width: "100%",
    padding: sizeScreenPadding,
    paddingBottom: 0,
  },
  mainView: {
    height: 400,
  },
  sentencesContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  mainText: {
    color: "white",
    textAlign: "center",
    fontSize: sizeTextLarger,
    padding: sizeScreenPadding,
    fontWeight: "bold",
  },
  subText: {
    color: colorTextSubdued,
    textAlign: "center",
    fontSize: sizeTextLarger,
    fontWeight: "bold",
  },
});
