import { colorCardBackground, radiusBorder } from "@/utils/theme";
import { useState } from "react";
import { StyleSheet, Pressable } from "react-native";
import Animated, { useSharedValue, withSpring } from "react-native-reanimated";

export default function BlockButton({
  onPress,
  children,
  disabled,
}: {
  onPress?: () => void;
  children: React.ReactNode;
  disabled?: boolean;
}) {
  const opacity = useSharedValue(1);
  const scale = useSharedValue(1);
  const [backgroundColor, setBackgroundColor] = useState("inherit");

  const handlePressIn = () => {
    opacity.value = withSpring(0.5);
    scale.value = withSpring(0.99);
  };

  const handlePressOut = () => {
    opacity.value = withSpring(1);
    scale.value = withSpring(1);
  };

  const handleHoverIn = () => {
    setBackgroundColor(colorCardBackground);
  };

  const handleHoverOut = () => {
    setBackgroundColor("inherit");
  };

  const buttonStyles = disabled
    ? styles.buttonDisabledStyle
    : { ...styles.buttonStyle, opacity, transform: [{ scale }], backgroundColor };

  return (
    <Pressable
      disabled={disabled}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={onPress}
      onHoverIn={handleHoverIn}
      onHoverOut={handleHoverOut}
    >
      <Animated.View style={buttonStyles}>{children}</Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  buttonStyle: {
    borderRadius: radiusBorder,
  },
  buttonDisabledStyle: {
    opacity: 0.5,
  },
});
