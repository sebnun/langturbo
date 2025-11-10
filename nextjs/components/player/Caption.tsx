"use client";

import { usePlayerStore } from "@/lib/store";

const Caption = () => {
  const caption = usePlayerStore((state) => state.caption);
  return <h1>{caption}</h1>;
};

export default Caption;
