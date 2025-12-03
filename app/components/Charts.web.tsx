import {
  colorCardBackground,
  colorSeparator,
  msImageTransition,
  radiusBorder,
  sizeScreenPadding,
  sizeTextLarger,
  sizeWidthProfile,
} from "@/utils/theme";
import { View, StyleSheet, ScrollView, Text } from "react-native";
import React from "react";
import { VictoryChart, VictoryArea, VictoryTheme, VictoryLine } from "victory";

const myTheme = VictoryTheme.grayscale;

myTheme.axis!.style!.axis!.stroke = colorSeparator;
myTheme.axis!.style!.axisLabel!.fill = colorSeparator;
myTheme.axis!.style!.grid!.stroke = colorSeparator;
myTheme.legend!.style!.labels!.fill = colorSeparator;

export default function Charts({
  wordDataPoints,
  playbackDataPoints,
  wordCount,
}: {
  wordDataPoints: ChartDataPoint[];
  playbackDataPoints: ChartDataPoint[];
  wordCount: number;
}) {
  return (
    <ScrollView contentContainerStyle={styles.scrollView}>
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.title}>
            {wordCount} {wordCount === 1 ? "Word" : "Words"} Learned
          </Text>
          <View style={styles.chartView}>
            <VictoryChart theme={myTheme}>
              <VictoryArea
                data={wordDataPoints}
                domain={wordDataPoints.some((dp) => dp.y !== 0) ? undefined : { y: [0, 10] }}
                interpolation="step"
                style={{
                  data: { fill: "white" },
                }}
                animate={{
                  duration: msImageTransition,
                }}
              />
            </VictoryChart>
          </View>
        </View>
        <View style={styles.card}>
          <Text style={styles.title}>Playback Minutes</Text>
          <View style={styles.chartView}>
            <VictoryChart theme={myTheme}>
              <VictoryLine
                data={playbackDataPoints}
                domain={playbackDataPoints.some((dp) => dp.y !== 0) ? undefined : { y: [0, 10] }}
                style={{
                  data: { stroke: "white" },
                }}
                animate={{
                  duration: msImageTransition,
                }}
              />
            </VictoryChart>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

export const styles = StyleSheet.create({
  scrollView: {
    padding: sizeScreenPadding,
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    gap: sizeScreenPadding * 2,
    maxWidth: sizeWidthProfile,
    width: "100%",
  },
  card: {
    borderRadius: radiusBorder,
    padding: sizeScreenPadding,
    backgroundColor: colorCardBackground,
    gap: sizeScreenPadding,
  },
  title: {
    fontSize: sizeTextLarger,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
  chartView: {
    width: "100%",
    height: 300,
  },
});
