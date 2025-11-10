"use client";

import { usePlayerStore } from "@/lib/store";

const Translation = () => {
  const translation = usePlayerStore((state) => state.translation);
  return <h1>{translation}</h1>;
};

export default Translation;
