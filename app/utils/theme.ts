import { StyleSheet } from "react-native";

export const colorPrimary = "#0064e6";
export const colorBlue = "#0064e6";
export const colorGreen = "#a0b8ae";
export const colorScreenBackground = "#121212";
export const colorCardBackground = "#1e1e1e";
export const colorTextSubdued = "#a7a7a7";
export const colorSeparator = "#dddddd80";
export const colorDestructive = "#ff6b56";
export const sizeIconNavigation = 24;
export const sizeIconCategory = 16;
export const sizeTextDefault = 14;
export const sizeTextLargest = sizeTextDefault + 8;
export const sizeTextLarger = sizeTextDefault + 4;
export const sizeTextSmall = sizeTextDefault - 2;
export const msImageTransition = 500;
export const radiusBorder = StyleSheet.hairlineWidth * 5;
export const sizeElementSpacing = 5;
export const sizeScreenPadding = 15;
export const sizeWidthProfile = 750;

export const themeStyles = StyleSheet.create({
  mutedText: {
    color: colorTextSubdued,
    fontSize: sizeTextSmall,
  },
  screen: {
    flex: 1,
    backgroundColor: "black",
  },
  textInput: {
    color: "black",
    backgroundColor: "white",
    borderRadius: radiusBorder,
    padding: sizeElementSpacing * 2,
    paddingTop: sizeElementSpacing * 2,
    paddingBottom: sizeElementSpacing * 2,
    width: "100%",
  },
});
