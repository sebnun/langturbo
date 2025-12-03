import { Text, View, StyleSheet, Platform } from "react-native";
import { useAppStore } from "../utils/store";
import { EvilIcons } from "@expo/vector-icons";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { useEffect } from "react";
import RoundButton from "./button/RoundButton";
import { sizeScreenPadding, sizeWidthProfile } from "@/utils/theme";
import * as Device from "expo-device";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PressInstructions() {
  const singleScale = useSharedValue(1);
  const longScale = useSharedValue(1);

  const singleAnimatedStyles = useAnimatedStyle(() => ({
    transform: [{ scale: singleScale.value }],
  }));

  const longAnimatedStyles = useAnimatedStyle(() => ({
    transform: [{ scale: longScale.value }],
  }));

  useEffect(() => {
    singleScale.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 200, easing: Easing.cubic }),
        withTiming(0.8, { duration: 400, easing: Easing.cubic }),
        withTiming(1, { duration: 200, easing: Easing.cubic })
      ),
      -1,
      true
    );

    longScale.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 200, easing: Easing.cubic }),
        withTiming(0.8, { duration: 400, easing: Easing.cubic }),
        withTiming(0.8, { duration: 400, easing: Easing.cubic }),
        withTiming(0.8, { duration: 400, easing: Easing.cubic }),
        withTiming(0.8, { duration: 400, easing: Easing.cubic }),
        withTiming(1, { duration: 200, easing: Easing.cubic })
      ),
      -1,
      true
    );
  }, []);

  return (
    <SafeAreaView style={styles.absolute}>
      <View style={styles.container}>
        <View style={styles.handsView}>
          <View style={styles.handsContainer}>
            <View style={styles.handView}>
              <Animated.View style={singleAnimatedStyles}>
                <EvilIcons name="pointer" size={100} color="white" />
              </Animated.View>
              <Text style={styles.text}>
                {Device.deviceType === Device.DeviceType.DESKTOP ? "Click" : "Press"} a word to learn in context
              </Text>
            </View>
            {Platform.OS !== "web" && (
              <View style={styles.handView}>
                <Animated.View style={longAnimatedStyles}>
                  <EvilIcons name="pointer" size={100} color="white" />
                </Animated.View>
                <Text style={styles.text}>
                  {Device.deviceType === Device.DeviceType.DESKTOP ? "Click" : "Press"} and hold a word to mark as known
                  or unknown
                </Text>
              </View>
            )}
          </View>
        </View>

        <RoundButton
          onPress={() => useAppStore.setState({ showPlayerOnboarding: false })}
          text="Get Started"
          type="primary"
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  absolute: {
    backgroundColor: "black",
    position: "absolute",
    width: "100%",
    zIndex: 100,
    top: 0,
    bottom: 0,
  },
  container: {
    width: "100%",
    height: "100%",
    maxWidth: sizeWidthProfile,
    marginLeft: "auto",
    marginRight: "auto",
    padding: sizeScreenPadding,
  },
  handsView: {
    flex: 1,
    justifyContent: "center",
  },
  handsContainer: {
    gap: sizeScreenPadding * 2,
  },
  handView: {
    alignItems: "center",
  },
  text: {
    color: "white",
    textAlign: "center",
  },
});
