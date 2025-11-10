'use client'

import { usePlayerStore } from "@/lib/store";

const TimeCode = () => {
  const currentTime = usePlayerStore((state) => state.currentTime);
  return <code>{currentTime}</code>;
};

export default TimeCode;
