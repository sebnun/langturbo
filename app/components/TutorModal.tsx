import { StyleSheet, Text, View, Modal, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Gesture, GestureDetector, Directions, GestureHandlerRootView } from "react-native-gesture-handler";
import {
  colorScreenBackground,
  radiusBorder,
  sizeIconNavigation,
  sizeScreenPadding,
  sizeTextLarger,
  sizeWidthProfile,
} from "@/utils/theme";
import Button from "./button/Button";
import { EpisodeItemSeparator } from "./EpisodeItem";
import { useLocalSearchParams } from "expo-router";
import { postToken } from "@/utils/api";
import { usePlayerStore } from "@/utils/store";
import Room from "./Room";
import Loading from "./Loading";
import Markdown from "react-native-markdown-display";
import { getRecordingPermissionsAsync, requestRecordingPermissionsAsync, setAudioModeAsync } from "expo-audio";

export type UIAgentState = "Loading ..." | "Thinking ..." | "Speaking ..." | "Listening ...";

const HTML_STYLE_OBJECT = {
  body: {
    color: "white",
    fontSize: sizeTextLarger,
  },
};

export default function TutorModal({ onClose, isVisible }: { onClose: () => void; isVisible: boolean }) {
  const insets = useSafeAreaInsets();
  const { lang } = useLocalSearchParams<{ lang: string }>();
  const [agentState, setAgentState] = useState<UIAgentState>("Loading ...");
  const [agentTranscription, setAgentTranscription] = useState("");

  const flingGesture = Gesture.Fling().direction(Directions.DOWN).onStart(onClose).runOnJS(true);
  const singleTap = Gesture.Tap().onStart(onClose).runOnJS(true);

  const [token, setToken] = useState("");

  useEffect(() => {
    let timer;

    if (isVisible) {
      postToken(usePlayerStore.getState().caption!.text, lang).then(setToken);
      setAgentTranscription(`Start by saying **${usePlayerStore.getState().caption?.text}**`);
      setAgentState("Loading ...");
      getRecordingPermissionsAsync().then((permissions) => {
        if (!permissions.granted) {
          requestRecordingPermissionsAsync();
        }
      });

      timer = setTimeout(onClose, 5 * 60 * 1000);
    } else {
      setToken("");
      clearInterval(timer);
      // Looks livekit sets internally allowsRecording to true
      setAudioModeAsync({
        playsInSilentMode: true,
        allowsRecording: false,
      });
    }
  }, [isVisible]);

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
                <Text style={styles.topBarTitle}>{agentState}</Text>
                <Button onPress={onClose}>
                  <Ionicons name="close" size={sizeIconNavigation} color="white" />
                </Button>
              </View>
              <EpisodeItemSeparator />
              <View style={styles.mainView}>
                {token ? (
                  <>
                    <ScrollView contentContainerStyle={{ padding: sizeScreenPadding }}>
                      <Markdown
                        style={HTML_STYLE_OBJECT}
                        // Selectable text
                        rules={{
                          textgroup: (node, children) => (
                            <Text key={node.key} selectable={true}>
                              {children}
                            </Text>
                          ),
                        }}
                      >
                        {agentTranscription}
                      </Markdown>
                    </ScrollView>
                    <View style={{ height: 100 }}>
                      <Room token={token} onStateChange={setAgentState} onTranscriptionChange={setAgentTranscription} />
                    </View>
                  </>
                ) : (
                  <Loading />
                )}
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
});
