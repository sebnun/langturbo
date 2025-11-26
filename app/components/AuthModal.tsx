import {
  View,
  Text,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Modal,
} from "react-native";
import { useAppStore } from "../utils/store";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import { Ionicons } from "@expo/vector-icons";
import { Directions, GestureHandlerRootView } from "react-native-gesture-handler";
import { GestureDetector, Gesture } from "react-native-gesture-handler";
import React, { useEffect, useState } from "react";
import Button from "./button/Button";
import {
  colorPrimary,
  colorScreenBackground,
  colorTextSubdued,
  radiusBorder,
  sizeElementSpacing,
  sizeIconNavigation,
  sizeScreenPadding,
  sizeTextLarger,
  sizeTextSmall,
  sizeWidthProfile,
  themeStyles,
} from "@/utils/theme";
import { EpisodeItemSeparator } from "./EpisodeItem";
import { useLocalSearchParams } from "expo-router";
import RoundButton from "./button/RoundButton";
import { authClient } from "@/utils/auth";
import Loading from "./Loading";

export default function AuthModal({ isVisible, onClose }: { isVisible: boolean; onClose: () => void }) {
  const { lang } = useLocalSearchParams();
  const [screen, setScreen] = useState<"signIn" | "verification">("signIn");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const insets = useSafeAreaInsets();

  const singleTap = Gesture.Tap().onStart(onClose).runOnJS(true);
  const flingGesture = Gesture.Fling().direction(Directions.DOWN).onStart(onClose).runOnJS(true);

  useEffect(() => {
    if (!isVisible) {
      setScreen("signIn");
      setEmail("");
      setCode("");
      setLoading(false);
    }
  }, [isVisible]);

  const handleSignIn = async () => {
    if (!email) {
      return;
    }

    setLoading(true)
    const { data, error } = await authClient.emailOtp.sendVerificationOtp({
      email,
      type: "sign-in",
    });

    if (error) {
      // TODO
      console.error(error);
      return;
    }

    console.log(data);

    setScreen("verification");
    setLoading(false)
  };

  const handleVerification = async () => {
    if (!code) {
      return;
    }

    setLoading(true)
    const { data, error } = await authClient.signIn.emailOtp({
      email,
      otp: code,
    });

    if (error) {
      // TODO
      console.error(error);
      return;
    }

    console.log(data);

    onClose();
  };

  return (
    <Modal animationType="slide" transparent={true} visible={isVisible} onRequestClose={onClose}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View style={styles.modalContainer}>
          <GestureDetector gesture={singleTap}>
            <View style={styles.modalOverlay}></View>
          </GestureDetector>
          <GestureDetector gesture={flingGesture}>
            <View
              style={{
                ...styles.modalContent,
                paddingBottom: Math.max(insets.bottom, sizeScreenPadding),
                top: insets.top + 70,
              }}
            >
              <View style={styles.topBar}>
                <Text style={styles.topBarTitle}>Sign In</Text>
                <Button onPress={onClose}>
                  <Ionicons name="close" size={sizeIconNavigation} color="white" />
                </Button>
              </View>
              <EpisodeItemSeparator />

              <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.mainView}>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss} disabled={Platform.OS === "web"}>
                  <View style={styles.mainContainer}>
                    <View style={styles.container}>
                      {loading ? (
                        <Loading />
                      ) : screen === "signIn" ? (
                        <>
                          <Text style={styles.textSub}>You need to sign in to use this feature.</Text>
                          <TextInput
                            autoComplete="email"
                            autoCorrect={false}
                            inputMode="email"
                            keyboardType="email-address"
                            placeholderTextColor={colorTextSubdued}
                            autoCapitalize="none"
                            onSubmitEditing={handleSignIn}
                            style={themeStyles.textInput}
                            onChangeText={setEmail}
                            value={email}
                            placeholder="Your Email"
                            selectionColor={colorPrimary}
                          />
                          <RoundButton
                            disabled={loading}
                            onPress={handleSignIn}
                            text={"Send verification code"}
                            type="primary"
                          />
                          <Text style={styles.textSub}>An account will be created if you don't have one.</Text>
                        </>
                      ) : (
                        <>
                          <Text style={styles.textSub}>{`Enter the code sent to ${email}.`}</Text>
                          <TextInput
                            autoComplete="one-time-code"
                            autoCorrect={false}
                            inputMode="numeric"
                            keyboardType="numeric"
                            placeholderTextColor={colorTextSubdued}
                            autoCapitalize="none"
                            onSubmitEditing={handleVerification}
                            style={themeStyles.textInput}
                            onChangeText={setCode}
                            value={code}
                            placeholder="Code from your email"
                            selectionColor={colorPrimary}
                          />
                          <RoundButton
                            disabled={loading}
                            onPress={handleVerification}
                            text={"Sign In"}
                            type="primary"
                          />
                        </>
                      )}
                    </View>
                  </View>
                </TouchableWithoutFeedback>
              </KeyboardAvoidingView>
            </View>
          </GestureDetector>
        </View>
      </GestureHandlerRootView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    width: "100%",
    height: "100%",
  },
  modalOverlay: {
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    flex: 1,
  },
  modalContent: {
    position: "absolute",
    bottom: 0,
    borderTopLeftRadius: radiusBorder * 2,
    borderTopRightRadius: radiusBorder * 2,
    backgroundColor: colorScreenBackground,
    width: "100%",
  },
  topBar: {
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
    padding: sizeScreenPadding,
  },
  topBarTitle: {
    fontWeight: "bold",
    fontSize: sizeTextLarger,
    color: "white",
  },

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
  textSub: {
    color: colorTextSubdued,
    textAlign: "center",
  },
  mainText: {
    color: "white",
    textAlign: "center",
    fontSize: sizeTextLarger,
  },
  mainView: {
    flex: 1,
  },
});
