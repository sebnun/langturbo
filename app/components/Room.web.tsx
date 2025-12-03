import * as React from "react";
import { useEffect } from "react";
import { UIAgentState } from "./TutorModal";
import { colorPrimary } from "@/utils/theme";
import { BarVisualizer, SessionProvider, useSession, useVoiceAssistant } from "@livekit/components-react";
import { TokenSource } from "livekit-client";

export default function Room({
  token,
  onStateChange,
  onTranscriptionChange,
}: {
  token: string;
  onStateChange: (state: UIAgentState) => void;
  onTranscriptionChange: (transcription: string) => void;
}) {
  const session = useSession(
    TokenSource.literal({ participantToken: token, serverUrl: process.env.EXPO_PUBLIC_WS_URL! })
  );

  useEffect(() => {
    session.start();
    return () => {
      session.end();
    };
  }, []);

  return (
    <SessionProvider session={session}>
      <VoiceAssistant onStateChange={onStateChange} onTranscriptionChange={onTranscriptionChange} />
    </SessionProvider>
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
      track={audioTrack}
      style={{ flex: 1 }}
    />
  );
}
