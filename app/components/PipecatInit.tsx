import { useAppStore } from "@/utils/store";
import { PipecatClient } from "@pipecat-ai/client-js";
import { RNDailyTransport } from "@pipecat-ai/react-native-daily-transport";
import { useEffect } from "react";

export default function PipecatInit() {
  useEffect(() => {
    useAppStore.setState({
      pipecat: new PipecatClient({
        transport: new RNDailyTransport() as any,
        enableMic: true,
        callbacks: {
          onConnected: () => {
            console.log("connected");
          },
          onDisconnected: () => {
            console.log("disconnected");
          },
          onTransportStateChanged: (state) => {
            console.log(`Transport state changed: ${state}`);
          },
          onError: (error) => {
            console.log("Error:", JSON.stringify(error));
          },
        },
      }),
    });
  }, []);

  return null;
}
