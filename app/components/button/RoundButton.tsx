import { View, StyleSheet, Text, TextStyle } from "react-native";
import Button from "./Button";
import { colorDestructive, colorPrimary, colorSeparator, sizeElementSpacing } from "@/utils/theme";
import React from "react";

// Use disabled as loading state

export default function RoundButton(props: {
  onPress?: () => void;
  text: string;
  type?: "primary" | "secondary" | "destructive" | "ghost";
  disabled?: boolean;
}) {
  let textStyles: TextStyle = {
    ...styles.text,
    color:
      props.type === "primary" || props.type === "ghost"
        ? "white"
        : props.type === "destructive"
        ? colorDestructive
        : "black",
  };

  return (
    <Button onPress={props.onPress} disabled={props.disabled}>
      <View
        style={
          props.type === "primary" && props.disabled
            ? styles.buttonContainerPrimaryDisabled
            : props.disabled
            ? styles.buttonContainerDisabled
            : props.type === "primary"
            ? styles.buttonContainerPrimary
            : props.type === "ghost" || props.type === "destructive"
            ? styles.buttonContainerGhost
            : styles.buttonContainer
        }
      >
        <Text style={textStyles}>{props.text}</Text>
      </View>
    </Button>
  );
}

const buttonContainer = {
  borderRadius: 50,
  padding: sizeElementSpacing * 2,
  backgroundColor: "white",
};

const buttonContainerPrimary = {
  ...buttonContainer,
  backgroundColor: colorPrimary,
};

const buttonContainerGhost = {
  ...buttonContainer,
  backgroundColor: "transparent",
  borderWidth: StyleSheet.hairlineWidth,
  borderColor: colorSeparator,
};

const styles = StyleSheet.create({
  buttonContainer,
  buttonContainerDisabled: {
    ...buttonContainer,
    opacity: 0.5,
  },
  buttonContainerGhost,
  buttonContainerPrimary,
  buttonContainerPrimaryDisabled: {
    ...buttonContainerPrimary,
    opacity: 0.5,
  },
  text: {
    textAlign: "center",
    lineHeight: 22,
    fontWeight: "bold",
  },
});
