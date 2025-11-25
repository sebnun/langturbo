import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Platform } from "react-native";

export function useDebounce<T>(value: T, delay?: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay || 500);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

export const useTitle = (title: string) => {
  useFocusEffect(
    useCallback(() => {
      if (Platform.OS === "web") {
        document.title = `${title} | LangTurbo`;
      }
    }, [title])
  );
};
