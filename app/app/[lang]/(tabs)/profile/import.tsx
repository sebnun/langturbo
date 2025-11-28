import { Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Text, View, StyleSheet } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { useTitle } from "@/utils/hooks";
import {
  colorPrimary,
  colorSeparator,
  sizeElementSpacing,
  sizeScreenPadding,
  sizeTextLarger,
  sizeWidthProfile,
  themeStyles,
} from "@/utils/theme";
import Button from "@/components/button/Button";
import React from "react";
import * as Device from "expo-device";
import { getList } from "@/utils/api";
import Loading from "@/components/Loading";
import { useAppStore } from "@/utils/store";

export default function ImportScreen() {
  useTitle("Add Known Words");
  const words = useAppStore((state) => state.words);
  const [frequencyWords, setFrequencyWords] = useState<string[]>([]);
  const saveWord = useAppStore((state) => state.saveWord);
  const removeWord = useAppStore((state) => state.removeWord);

  const { lang } = useLocalSearchParams<{ lang: string }>();

  const data = frequencyWords.map((word) => ({
    value: word,
    saved: words.includes(word),
  }));

  useEffect(() => {
    getList(lang).then(setFrequencyWords);
  }, []);

  return (
    <>
      <Stack.Screen
        options={{
          title: `${Device.deviceType === Device.DeviceType.DESKTOP ? "Click" : "Press"} to Add Word as Known`,
        }}
      />
      <View style={themeStyles.screen}>
        <View style={styles.flashContainer}>
          {!frequencyWords.length ? (
            <Loading />
          ) : (
            <FlashList
              contentContainerStyle={{
                padding: sizeScreenPadding,
                width: "100%",
                maxWidth: sizeWidthProfile,
                marginLeft: "auto",
                marginRight: "auto",
              }}
              data={data}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <Button onPress={() => (item.saved ? removeWord(item.value, lang) : saveWord(item.value, lang))}>
                  <View style={[styles.item, { backgroundColor: item.saved ? colorPrimary : "transparent" }]}>
                    <Text style={styles.itemText}>{item.value}</Text>
                  </View>
                </Button>
              )}
              ItemSeparatorComponent={({ leadingItem, trailingItem }) => <View style={styles.itemSeparator} />}
            />
          )}
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  flashContainer: {
    width: "100%",
    flex: 1,
  },
  item: {
    padding: sizeScreenPadding,
    flexDirection: "row",
    alignItems: "center",
    gap: sizeElementSpacing * 2,
  },
  itemText: {
    fontSize: sizeTextLarger,
    color: "white",
  },
  itemSeparator: { height: StyleSheet.hairlineWidth, backgroundColor: colorSeparator },
  listItemImage: {
    height: 20,
    width: 20,
  },
});
