import { StyleSheet, Text, View, Modal, ScrollView, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAppStore, usePlayerStore } from "../utils/store";
import * as Haptics from "expo-haptics";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
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
import Markdown from "react-native-markdown-display";
import { useLocalSearchParams } from "expo-router";

export default function TutorModal({ onClose, isVisible }: { onClose: () => void; isVisible: boolean }) {
  const insets = useSafeAreaInsets();
  const { lang } = useLocalSearchParams<{ lang: string }>();

  const flingGesture = Gesture.Fling().direction(Directions.DOWN).onStart(onClose).runOnJS(true);
  const singleTap = Gesture.Tap().onStart(onClose).runOnJS(true);

  

  useEffect(() => {
    if (isVisible) {
      
    } else {
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
                <Text style={styles.topBarTitle}>Recording ...</Text>
                <Button onPress={onClose}>
                  <Ionicons name="close" size={sizeIconNavigation} color="white" />
                </Button>
              </View>
              <EpisodeItemSeparator />
              <View style={styles.mainView}>
                <ScrollView contentContainerStyle={{ padding: sizeScreenPadding }}>
                  {/* <Markdown
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
                  </Markdown> */}
                </ScrollView>
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
