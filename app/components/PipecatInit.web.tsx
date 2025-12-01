import { useAppStore } from "@/utils/store";
import { PipecatClient } from "@pipecat-ai/client-js";
import { DailyTransport } from "@pipecat-ai/daily-transport";
import { useEffect } from "react";

export default function PipecatInit() {
  useEffect(() => {
    useAppStore.setState({
      pipecat: new PipecatClient({
        transport: new DailyTransport(),
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
