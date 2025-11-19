import { StyleSheet, Text } from "react-native";
import { colorScreenBackground, sizeElementSpacing } from "@/utils/theme";
import { colorCardBackground } from "@/utils/theme";
import { useState } from "react";
import { Pressable } from "react-native";
import Animated, { useSharedValue, withSpring } from "react-native-reanimated";

export default function IconButton(props: { onPress: () => void; text: string; leftNode: React.ReactNode }) {
  const opacity = useSharedValue(1);
  const scale = useSharedValue(1);
  const [backgroundColor, setBackgroundColor] = useState(colorCardBackground);

  const handlePressIn = () => {
    opacity.value = withSpring(0.5);
    scale.value = withSpring(0.99);
  };

  const handlePressOut = () => {
    opacity.value = withSpring(1);
    scale.value = withSpring(1);
  };

  const handleHoverIn = () => {
    setBackgroundColor(colorScreenBackground);
  };

  const handleHoverOut = () => {
    setBackgroundColor(colorCardBackground);
  };

  return (
    <Pressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={props.onPress}
      onHoverIn={handleHoverIn}
      onHoverOut={handleHoverOut}
    >
      <Animated.View style={[styles.buttonContainer, { backgroundColor, opacity, transform: [{ scale }] }]}>
        {props.leftNode}
        <Text style={styles.text}>{props.text}</Text>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    borderRadius: 50,
    padding: sizeElementSpacing,
    paddingLeft: sizeElementSpacing * 2,
    paddingRight: sizeElementSpacing * 2,
    flexDirection: "row",
    alignItems: "center",
    gap: sizeElementSpacing,
  },
  text: {
    textAlign: "center",
    lineHeight: 22,
    color: "white",
  },
});
