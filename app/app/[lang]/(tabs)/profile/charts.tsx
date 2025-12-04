import { useAppStore } from "@/utils/store";
import { sizeScreenPadding, themeStyles } from "@/utils/theme";
import { Stack, useGlobalSearchParams, useLocalSearchParams } from "expo-router";
import { View, Text } from "react-native";
import { getLanguageNameById, languageIds } from "@/utils/languages";
import { capitalizeFirstLetter } from "@/utils";
import { useEffect, useState } from "react";
import React from "react";
import { getCharts } from "@/utils/api";
import { getCalendars } from "expo-localization";
import Charts from "@/components/Charts";
import dayjs from "dayjs";
import { useTitle } from "@/utils/hooks";

export default function ChartsScreen() {
  useTitle("Progress");
  const words = useAppStore((state) => state.words);

  const { lang } = useGlobalSearchParams()

  const [wordDataPoints, setWordsDataPoints] = useState<ChartDataPoint[]>([
    { x: dayjs().startOf("month").subtract(4, "month").format("MMMM"), y: 0 },
    { x: dayjs().startOf("month").subtract(4, "month").format("MMMM"), y: 0 },
    { x: dayjs().startOf("month").subtract(2, "month").format("MMMM"), y: 0 },
    { x: dayjs().startOf("month").subtract(1, "month").format("MMMM"), y: 0 },
    { x: dayjs().startOf("month").format("MMMM"), y: 0 },
  ]);
  const [playbackDataPoints, setPlaybackDataPoints] = useState<ChartDataPoint[]>([
    { x: dayjs().startOf("day").subtract(4, "day").format("dddd"), y: 0 },
    { x: dayjs().startOf("day").subtract(3, "day").format("dddd"), y: 0 },
    { x: dayjs().startOf("day").subtract(2, "day").format("dddd"), y: 0 },
    { x: "Yesterday", y: 0 },
    { x: "Today", y: 0 },
  ]);

  useEffect(() => {
    getCharts(lang as string, getCalendars()[0].timeZone || "Etc/UTC").then(({ words, playback }) => {
      setWordsDataPoints(words);
      setPlaybackDataPoints(playback);
    });
  }, [lang]);

  return (
    <>
      <Stack.Screen
        options={{
          title: `Your Progress in ${capitalizeFirstLetter(getLanguageNameById(languageIds[lang as string]))}`,
        }}
      />
      <View style={themeStyles.screen}>
        <Charts wordDataPoints={wordDataPoints} playbackDataPoints={playbackDataPoints} wordCount={words.length} />
      </View>
    </>
  );
}
