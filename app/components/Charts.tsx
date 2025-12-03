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
import { CartesianChart, Area, Line } from "victory-native";
import { useFont } from "@shopify/react-native-skia";

export default function Charts({
  wordDataPoints,
  playbackDataPoints,
  wordCount,
}: {
  wordDataPoints: ChartDataPoint[];
  playbackDataPoints: ChartDataPoint[];
  wordCount: number;
}) {
  const font = useFont(require("../assets/fonts/Source-Code-Pro.ttf"), 10);

  return (
    <ScrollView contentContainerStyle={styles.scrollView}>
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.title}>
            {wordCount} {wordCount === 1 ? "Word" : "Words"} Learned
          </Text>
          <View style={styles.chartView}>
            <CartesianChart
              data={wordDataPoints}
              // Shows -0.5 when no words, but has good autoscaling when there are words
              domain={!wordDataPoints.some((dp) => dp.y !== 0) ? { y: [0, 10] } : undefined}
              xKey="x"
              yKeys={["y"]}
              domainPadding={{ left: sizeScreenPadding * 2, right: sizeScreenPadding * 2 }}
              axisOptions={{
                font,
                labelColor: colorSeparator,
                lineColor: colorSeparator,
              }}
            >
              {({ points, chartBounds }) => (
                <Area
                  points={points.y}
                  y0={chartBounds.bottom}
                  color="white"
                  curveType="step"
                  animate={{ type: "timing", duration: msImageTransition }}
                />
              )}
            </CartesianChart>
          </View>
        </View>
        <View style={styles.card}>
          <Text style={styles.title}>Playback Minutes</Text>
          <View style={styles.chartView}>
            <CartesianChart
              data={playbackDataPoints}
              // Shows -0.5 when no words, but has good autoscaling when there are words
              domain={!playbackDataPoints.some((dp) => dp.y !== 0) ? { y: [0, 10] } : undefined}
              xKey="x"
              yKeys={["y"]}
              domainPadding={{ left: sizeScreenPadding * 2, right: sizeScreenPadding * 2 }}
              axisOptions={{
                font,
                labelColor: colorSeparator,
                lineColor: colorSeparator,
              }}
            >
              {({ points, chartBounds }) => (
                <Line points={points.y} color="white" animate={{ type: "timing", duration: msImageTransition }} />
              )}
            </CartesianChart>
          </View>
        </View>

        {/* <Text style={[themeStyles.mutedText, { textAlign: "center", fontFamily: "SourceCodePro_400Regular" }]}>
          v. 1.0.10
        </Text> */}
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
