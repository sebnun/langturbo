import { StyleSheet, Text, View, Modal, ScrollView, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAppStore, usePlayerStore } from "../utils/store";
import * as Haptics from "expo-haptics";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef } from "react";
import { Gesture, GestureDetector, Directions, GestureHandlerRootView } from "react-native-gesture-handler";
import {
  colorScreenBackground,
  radiusBorder,
  sizeIconNavigation,
  sizeScreenPadding,
  sizeTextDefault,
  sizeTextLarger,
  sizeWidthProfile,
} from "@/utils/theme";
import Button from "./button/Button";
import { EpisodeItemSeparator } from "./EpisodeItem";
import RoundButton from "./button/RoundButton";
import Markdown from "react-native-markdown-display";
import { useChat } from "@ai-sdk/react";
import { getApiEndpoint } from "@/utils";
import { useLocalSearchParams } from "expo-router";
import { DefaultChatTransport } from "ai";
import { fetchOptionsForPlatform } from "@/utils/api";
import { fetch as expoFetch } from "expo/fetch";

const HTML_STYLE_OBJECT = {
  body: {
    color: "white",
    fontSize: sizeTextLarger,
  },
};

export default function WordModal({ onClose, word }: { onClose: () => void; word: string }) {
  const insets = useSafeAreaInsets();
  const words = useAppStore((state) => state.words);
  const saveWord = useAppStore((state) => state.saveWord);
  const removeWord = useAppStore((state) => state.removeWord);
  const { lang } = useLocalSearchParams<{ lang: string }>();
  // Need this to capture the word in the body closure
  const wordRef = useRef(word);

  const knownWord = words.find((w) => w === word.toLowerCase());

  const transport = new DefaultChatTransport({
    api: `${getApiEndpoint()}chat`,
    fetch: expoFetch as unknown as typeof globalThis.fetch,
    body: () => ({
      word: wordRef.current,
      sentence: usePlayerStore.getState().caption?.text,
      languageCode: lang,
    }),
    ...fetchOptionsForPlatform(),
  });

  const { messages, setMessages, stop, sendMessage, status } = useChat({
    transport,
    experimental_throttle: 500,
    onError: console.error,
  });

  console.log(status, messages, word);

  const handleAction = async () => {
    // This is not awaited on purpose, to have fast feedback
    Platform.OS !== "web" && Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    onClose();
    if (knownWord) {
      await removeWord(knownWord, lang);
    } else {
      await saveWord(word, lang);
    }
  };

  useEffect(() => {
    if (!word) {
      stop();
      setMessages([]);
    } else {
      wordRef.current = word;
      sendMessage({ text: `` });
    }
  }, [word]);

  const flingGesture = Gesture.Fling().direction(Directions.DOWN).onStart(onClose).runOnJS(true);
  const singleTap = Gesture.Tap().onStart(onClose).runOnJS(true);

  return (
    <Modal animationType="slide" transparent={true} visible={!!word} onRequestClose={onClose}>
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
                <Text style={styles.topBarTitle}>{word}</Text>
                <Button onPress={onClose}>
                  <Ionicons name="close" size={sizeIconNavigation} color="white" />
                </Button>
              </View>
              <EpisodeItemSeparator />
              <View style={styles.mainView}>
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
                    {status === "submitted" || messages.length < 2
                      ? "Loading ..."
                      : `${messages[1].parts.filter((p) => p.type === "text")[0].text} ${
                          status === "streaming" ? "..." : ""
                        }`}
                  </Markdown>
                </ScrollView>
              </View>
              <EpisodeItemSeparator />
              <View style={styles.buttonContainer}>
                <RoundButton
                  type={knownWord ? "secondary" : "primary"}
                  text={knownWord ? "Mark as Unknown" : "Mark as Known"}
                  onPress={handleAction}
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
});
