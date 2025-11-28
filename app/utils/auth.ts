import { createAuthClient } from "better-auth/react";
import { expoClient } from "@better-auth/expo/client";
import { emailOTPClient } from "better-auth/client/plugins";
import * as SecureStore from "expo-secure-store";
import { getApiEndpoint } from ".";
import { Platform } from "react-native";

export const authClient = createAuthClient({
  baseURL: getApiEndpoint().replace("/api/v1/", ""),
  plugins: [
    emailOTPClient(),
    expoClient({
      scheme: "langturbo",
      storagePrefix: "langturbo",
      storage: Platform.OS === "web" ? localStorage : SecureStore,
    }),
  ],
});
