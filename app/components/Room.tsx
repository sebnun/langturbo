import * as React from "react";
import { useEffect } from "react";
import { AudioSession, LiveKitRoom, useVoiceAssistant, BarVisualizer } from "@livekit/react-native";
import { UIAgentState } from "./TutorModal";
import { colorPrimary } from "@/utils/theme";
import { setAudioModeAsync } from "expo-audio";

export default function Room({
  token,
  onStateChange,
  onTranscriptionChange,
}: {
  token: string;
  onStateChange: (state: UIAgentState) => void;
  onTranscriptionChange: (transcription: string) => void;
}) {
  useEffect(() => {
    let start = async () => {
      await AudioSession.startAudioSession();
    };

    start();
    return () => {
      AudioSession.stopAudioSession().then(() =>
        // Looks livekit sets internally allowsRecording to true
        setAudioModeAsync({
          playsInSilentMode: true,
          allowsRecording: false,
        })
      );
    };
  }, []);

  return (
    <LiveKitRoom serverUrl={process.env.EXPO_PUBLIC_WS_URL} token={token} audio={true}>
      <VoiceAssistant onStateChange={onStateChange} onTranscriptionChange={onTranscriptionChange} />
    </LiveKitRoom>
  );
}

function VoiceAssistant({
  onStateChange,
  onTranscriptionChange,
}: {
  onStateChange: (state: UIAgentState) => void;
  onTranscriptionChange: (transcription: string) => void;
}) {
  const { state, audioTrack, agentTranscriptions } = useVoiceAssistant();

  useEffect(() => {
    if (state === "listening") {
      onStateChange("Listening ...");
    } else if (state === "speaking") {
      onStateChange("Speaking ...");
    } else if (state === "thinking") {
      onStateChange("Thinking ...");
    }
  }, [state]);

  useEffect(() => {
    if (agentTranscriptions.length && agentTranscriptions[agentTranscriptions.length - 1].text)
      onTranscriptionChange(agentTranscriptions[agentTranscriptions.length - 1].text);
  }, [agentTranscriptions]);

  return (
    <BarVisualizer
      state={state}
      trackRef={audioTrack}
      options={{
        barColor: colorPrimary,
      }}
      style={{ flex: 1 }}
    />
  );
}
