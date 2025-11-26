import { createAuthClient } from "better-auth/react";
import { expoClient } from "@better-auth/expo/client";
import { emailOTPClient } from "better-auth/client/plugins"
import * as SecureStore from "expo-secure-store";
import { getApiEndpoint } from ".";

export const authClient = createAuthClient({
  baseURL: getApiEndpoint().replace("/api/v1/", ""), // Base URL of your Better Auth backend.
  plugins: [
    emailOTPClient(),
    expoClient({
      scheme: "langturbo",
      storagePrefix: "langturbo",
      storage: SecureStore,
    }),
  ],
});
