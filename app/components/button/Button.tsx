import { Pressable, StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";

export default function Button({
  onPress,
  children,
  disabled,
  onLongPress,
  onPressIn,
  onPressOut,
  style,
}: {
  onPress?: () => void;
  children: React.ReactNode;
  disabled?: boolean;
  onLongPress?: () => void;
  onPressIn?: () => void;
  onPressOut?: () => void;
  style?: StyleProp<ViewStyle>;
}) {
  const opacity = useSharedValue(1);
  const scale = useSharedValue(1);

  const handlePressIn = () => {
    opacity.value = withSpring(0.5);
    scale.value = withSpring(0.99);
    onPressIn && onPressIn();
  };

  const handlePressOut = () => {
    opacity.value = withSpring(1);
    scale.value = withSpring(1);
    onPressOut && onPressOut();
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ scale: scale.value }],
    };
  });

  const buttonStyles = disabled ? styles.buttonDisabledStyle : animatedStyle;

  return (
    <Pressable
      disabled={disabled}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={onPress}
      onLongPress={onLongPress}
    >
      <Animated.View style={buttonStyles}>
        <View style={style}>{children}</View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  buttonDisabledStyle: {
    opacity: 0.5,
  },
});
