import { Text, View, StyleSheet, TouchableHighlight } from "react-native";
import { useAppStore, usePlayerStore } from "../utils/store";
import { getLanguageNameById, languageIds, rtlLanguages } from "../utils/languages";
import { colorCardBackground, colorTextSubdued, radiusBorder } from "@/utils/theme";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import * as Device from "expo-device";

export default function Translation() {
  const caption = usePlayerStore((state) => state.caption);
  const fontSize = useAppStore((state) => state.fontSize);
  const tapTranslation = useAppStore((state) => state.tapTranslation);
  const showTranslation = useAppStore((state) => state.showTranslation);
  const [reveled, setReveled] = useState(false);
  const { lang } = useLocalSearchParams();

  useEffect(() => {
    setReveled(false);
  }, [caption]);

  if (!showTranslation) {
    return null;
  }

  const handelRevealed = () => {
    setReveled(true);
    usePlayerStore.setState({ playbackRequest: "pause" });
  };

  if (tapTranslation && !reveled) {
    return (
      <TouchableHighlight style={styles.captionView} onPress={handelRevealed}>
        <>
          <View style={styles.tapView}>
            <Text style={{ color: colorTextSubdued }}>
              {Device.deviceType === Device.DeviceType.DESKTOP ? "Click" : "Press"} to Reveal
            </Text>
          </View>
          <Text
            adjustsFontSizeToFit
            style={{
              color: "black",
              fontSize,
              textAlign: rtlLanguages.includes(getLanguageNameById(languageIds[lang as string])) ? "right" : "left",
            }}
          >
            {caption?.translation || " "}
          </Text>
        </>
      </TouchableHighlight>
    );
  }

  return (
    <Text
      style={{
        color: colorTextSubdued,
        fontSize,
        textAlign: rtlLanguages.includes(getLanguageNameById(languageIds[lang as string])) ? "right" : "left",
      }}
    >
      {caption?.translation}
    </Text>
  );
}

const styles = StyleSheet.create({
  captionView: {
    position: "relative",
  },
  tapView: {
    position: "absolute",
    flex: 1,
    zIndex: 67567,
    height: "100%",
    width: "100%",
    top: 0,
    bottom: 0,
    borderRadius: radiusBorder * 4,
    justifyContent: "center",
    alignItems: "center",
    borderStyle: "dashed",
    borderColor: colorCardBackground,
    borderWidth: 2,
  },
});
