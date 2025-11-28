import { Stack, useRouter } from "expo-router";
import { useState } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import * as Device from "expo-device";
import { colorPrimary, colorTextSubdued, sizeScreenPadding, sizeWidthProfile, themeStyles } from "@/utils/theme";
import RoundButton from "@/components/button/RoundButton";
import React from "react";
import { postFeedback } from "@/utils/api";
import { authClient } from "@/utils/auth";
import { useTitle } from "@/utils/hooks";
import * as Burnt from "burnt";

export default function DeleteScreen() {
  const router = useRouter();
  useTitle("Delete Account");
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);

    if (feedback) {
      const context =
        "Deleting ... " + Platform.OS + " " + Device.modelName + " " + Device.osName + " " + Device.osVersion;
      await postFeedback(feedback, context);
    }

    await authClient.deleteUser();

    Burnt.toast({
      title: "User deleted",
      preset: "done",
    });

    router.back();
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: "Delete Account",
        }}
      />
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={themeStyles.screen}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} disabled={Platform.OS === "web"}>
          <View style={styles.mainContainer}>
            <View style={styles.container}>
              <TextInput
                multiline={true}
                placeholderTextColor={colorTextSubdued}
                autoCapitalize="none"
                style={styles.textInput}
                onChangeText={setFeedback}
                value={feedback}
                placeholder="Your feedback is very important, what can be improved? If you want a response you can add your email."
                selectionColor={colorPrimary}
              />
              <RoundButton onPress={handleDelete} text={"Delete your account"} disabled={loading} type="destructive" />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: "center",
  },
  container: {
    maxWidth: sizeWidthProfile,
    width: "100%",
    marginLeft: "auto",
    marginRight: "auto",
    gap: sizeScreenPadding,
    padding: sizeScreenPadding,
  },
  textInput: { ...themeStyles.textInput, height: 200 },
});
