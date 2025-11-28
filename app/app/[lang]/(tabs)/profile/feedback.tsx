import { Stack } from "expo-router";
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
import * as Burnt from "burnt";
import React from "react";
import { postFeedback } from "@/utils/api";
import { useTitle } from "@/utils/hooks";
import { authClient } from "@/utils/auth";

export default function FeedbackScreen() {
  useTitle("Feedback");
  const [feedback, setFeedback] = useState("");
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const { data: session } = authClient.useSession();

  const handleSendFeedback = async () => {
    if (!feedback) {
      return;
    }

    const context =
      Platform.OS + " " + Device.modelName + " " + Device.osName + " " + Device.osVersion + " " + session?.user.id;

    setLoading(true);
    await postFeedback(feedback, context);
    setLoading(false);
    Burnt.toast({
      title: `Thanks for your feedback!`,
      preset: "done",
    });
    setFeedbackSent(true);
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: "Feedback",
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
                onSubmitEditing={handleSendFeedback}
                style={styles.textInput}
                onChangeText={setFeedback}
                value={feedback}
                placeholder="What can be improved? If you want a response you can add your email."
                selectionColor={colorPrimary}
              />
              <RoundButton
                onPress={handleSendFeedback}
                text={feedbackSent ? "Thanks! Feedback Sent" : "Send Feedback"}
                disabled={loading || feedbackSent}
                type="primary"
              />
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
