import { StyleSheet, Text, View, Switch, Modal, Platform } from "react-native";
import { useAppStore } from "../utils/store";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import { Ionicons } from "@expo/vector-icons";
import { Directions, GestureHandlerRootView } from "react-native-gesture-handler";
import { GestureDetector, Gesture } from "react-native-gesture-handler";
import React from "react";
import Button from "./button/Button";
import {
  colorPrimary,
  colorScreenBackground,
  colorTextSubdued,
  radiusBorder,
  sizeElementSpacing,
  sizeIconNavigation,
  sizeScreenPadding,
  sizeTextSmall,
  themeStyles,
} from "@/utils/theme";
import { EpisodeItemSeparator } from "./EpisodeItem";
import { useLocalSearchParams } from "expo-router";

export default function SettingsModal({ isVisible, onClose }: { isVisible: boolean; onClose: () => void }) {
  const { lang } = useLocalSearchParams();

  const tapTranslation = useAppStore((state) => state.tapTranslation);
  const showTranslation = useAppStore((state) => state.showTranslation);
  const slower = useAppStore((state) => state.slower);
  const autoPause = useAppStore((state) => state.autoPause);
  const shadowing = useAppStore((state) => state.shadowing);

  const insets = useSafeAreaInsets();

  const singleTap = Gesture.Tap().onStart(onClose).runOnJS(true);
  const flingGesture = Gesture.Fling().direction(Directions.DOWN).onStart(onClose).runOnJS(true);

  return (
    <Modal animationType="slide" transparent={true} visible={isVisible} onRequestClose={onClose}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View style={styles.modalContainer}>
          <GestureDetector gesture={singleTap}>
            <View style={styles.modalOverlay}></View>
          </GestureDetector>
          <GestureDetector gesture={flingGesture}>
            <View style={{ ...styles.modalContent, paddingBottom: Math.max(insets.bottom, sizeScreenPadding) }}>
              <View style={styles.topBar}>
                <Button onPress={onClose}>
                  <Ionicons name="close" size={sizeIconNavigation} color="white" />
                </Button>
              </View>
              <EpisodeItemSeparator />

              <View style={[styles.row, styles.buttonsContainer]}>
                <Button
                  onPress={async () => {
                    useAppStore.setState((state) => ({ fontSize: Math.max(15, state.fontSize - 2) }));
                    Platform.OS !== "web" && (await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light));
                  }}
                >
                  <View style={styles.buttonContainer}>
                    <Ionicons name="remove" size={sizeIconNavigation} color="white" />
                  </View>
                </Button>

                <Text style={styles.label}>Text Size</Text>

                <Button
                  onPress={async () => {
                    useAppStore.setState((state) => ({ fontSize: Math.min(40, state.fontSize + 2) }));
                    Platform.OS !== "web" && (await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light));
                  }}
                >
                  <View style={styles.buttonContainer}>
                    <Ionicons name="add" size={sizeIconNavigation} color="white" />
                  </View>
                </Button>
              </View>
              <EpisodeItemSeparator />
              {lang !== "en" && (
                <>
                  <View style={styles.row}>
                    <Switch
                      style={styles.switch}
                      trackColor={{ true: colorPrimary, false: colorTextSubdued }}
                      thumbColor="white"
                      value={showTranslation}
                      onValueChange={async (v) => {
                        useAppStore.setState({ showTranslation: v });
                        Platform.OS !== "web" && (await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light));
                      }}
                      {...Platform.select({
                        web: {
                          activeThumbColor: "white",
                        },
                      })}
                    />
                    <Text style={styles.label}>Show Translation</Text>
                  </View>

                  <View style={styles.row}>
                    <Switch
                      style={styles.switch}
                      // Android doesn't change colors on disabled
                      trackColor={
                        showTranslation
                          ? { true: colorPrimary, false: colorTextSubdued }
                          : { true: colorTextSubdued, false: colorTextSubdued }
                      }
                      thumbColor={showTranslation ? "white" : Platform.OS === "web" ? colorTextSubdued : "white"}
                      value={tapTranslation}
                      disabled={!showTranslation}
                      onValueChange={async (v) => {
                        useAppStore.setState({ tapTranslation: v });
                        Platform.OS !== "web" && (await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light));
                      }}
                      {...Platform.select({
                        web: {
                          activeThumbColor: showTranslation ? "white" : colorTextSubdued,
                        },
                      })}
                    />
                    <Text style={{ ...styles.label, color: showTranslation ? "white" : colorTextSubdued }}>
                      {Platform.OS === "web" ? "Click" : "Press"} to Reveal Translation
                    </Text>
                  </View>
                  <EpisodeItemSeparator />
                </>
              )}

              <View style={styles.row}>
                <Switch
                  style={styles.switch}
                  trackColor={{ true: colorPrimary, false: colorTextSubdued }}
                  thumbColor="white"
                  value={slower}
                  onValueChange={async (v) => {
                    useAppStore.setState({ slower: v });
                    Platform.OS !== "web" && (await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light));
                  }}
                  {...Platform.select({
                    web: {
                      activeThumbColor: "white",
                    },
                  })}
                />
                <Text style={styles.label}>Slower</Text>
              </View>

              <EpisodeItemSeparator />
              <View style={styles.row}>
                <Switch
                  style={styles.switch}
                  trackColor={{ true: colorPrimary, false: colorTextSubdued }}
                  thumbColor="white"
                  value={autoPause}
                  onValueChange={async (v) => {
                    useAppStore.setState({ autoPause: v });
                    Platform.OS !== "web" && (await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light));
                  }}
                  {...Platform.select({
                    web: {
                      activeThumbColor: "white",
                    },
                  })}
                />
                <Text style={styles.label}>Auto Pause</Text>
              </View>
              <View style={[styles.row, { paddingTop: 0 }]}>
                <Text style={[themeStyles.mutedText, styles.textSmaller]}>
                  Pauses on every sentence, except when all words in a sentence are known.
                </Text>
              </View>
              <View style={styles.row}>
                <Switch
                  style={styles.switch}
                  // Android doesn't change colors on disabled
                  trackColor={
                    autoPause
                      ? { true: colorPrimary, false: colorTextSubdued }
                      : { true: colorTextSubdued, false: colorTextSubdued }
                  }
                  thumbColor={autoPause ? "white" : Platform.OS === "web" ? colorTextSubdued : "white"}
                  value={shadowing}
                  disabled={!autoPause}
                  onValueChange={async (v) => {
                    useAppStore.setState({ shadowing: v });
                    Platform.OS !== "web" && (await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light));
                  }}
                  {...Platform.select({
                    web: {
                      activeThumbColor: autoPause ? "white" : colorTextSubdued,
                    },
                  })}
                />
                <Text style={{ ...styles.label, color: autoPause ? "white" : colorTextSubdued }}>Shadowing</Text>
              </View>
              <View style={[styles.row, { paddingTop: 0 }]}>
                <Text style={[themeStyles.mutedText, styles.textSmaller]}>
                  Records and compares your pronunciation to the speaker after each auto pause. If it matches it auto
                  plays the next sentence.
                </Text>
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
    marginLeft: "auto",
    padding: sizeScreenPadding,
  },
  row: {
    padding: sizeScreenPadding,
    flexDirection: "row",
    alignItems: "center",
    gap: sizeScreenPadding,
  },
  buttonsContainer: {
    justifyContent: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderColor: "white",
    borderRadius: 50,
    borderWidth: 1,
    padding: sizeElementSpacing * 2,
  },
  switch: {
    transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }],
  },
  label: {
    color: "white",
  },
  textSmaller: {
    fontSize: sizeTextSmall,
  },
});
