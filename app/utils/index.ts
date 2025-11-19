import { Platform } from "react-native";
import * as Device from "expo-device";

export function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export const getApiEndpoint = () => {
  if (__DEV__) {
    return Platform.OS === "web" && Device.osName === "Mac OS"
      ? "http://localhost:3000/api/v1/"
      : "http://192.168.1.156:3000/api/v1/";
  } else {
    return "https://www.langturbo.com/api/v1/";
  }
};
