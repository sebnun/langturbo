import { useState } from "react";
import { Pressable, type StyleProp, type TextStyle, Text } from "react-native";
import Animated, { useSharedValue, withSpring } from "react-native-reanimated";

export default function TextButton({
  onPress,
  disabled,
  style,
  text,
}: {
  onPress?: () => void;
  disabled?: boolean;
  style: StyleProp<TextStyle>;
  text: string;
}) {
  const opacity = useSharedValue(1);
  const scale = useSharedValue(1);
  const [textDecorationLine, setTextDecorationLine] = useState<"none" | "underline">("none");

  const handlePressIn = () => {
    opacity.value = withSpring(0.5);
    scale.value = withSpring(0.99);
  };

  const handlePressOut = () => {
    opacity.value = withSpring(1);
    scale.value = withSpring(1);
  };

  const handleHoverIn = () => {
    setTextDecorationLine("underline");
  };

  const handleHoverOut = () => {
    setTextDecorationLine("none");
  };

  return (
    <Pressable
      disabled={disabled}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={onPress}
      onHoverIn={handleHoverIn}
      onHoverOut={handleHoverOut}
    >
      <Animated.View style={{ opacity, transform: [{ scale }] }}>
        <Text style={[style, { textDecorationLine }]}>{text}</Text>
      </Animated.View>
    </Pressable>
  );
}
