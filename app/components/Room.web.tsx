import * as React from "react";
import { useEffect } from "react";
import { UIAgentState } from "./TutorModal";
import { BarVisualizer, LiveKitRoom, RoomAudioRenderer, useVoiceAssistant } from "@livekit/components-react";

export default function Room({
  token,
  onStateChange,
  onTranscriptionChange,
}: {
  token: string;
  onStateChange: (state: UIAgentState) => void;
  onTranscriptionChange: (transcription: string) => void;
}) {
  return (
    <LiveKitRoom serverUrl={process.env.EXPO_PUBLIC_WS_URL} token={token} audio={true}>
      <VoiceAssistant onStateChange={onStateChange} onTranscriptionChange={onTranscriptionChange} />
      <RoomAudioRenderer />
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

  return <BarVisualizer state={state} track={audioTrack} style={{ flex: 1 }} />;
}
