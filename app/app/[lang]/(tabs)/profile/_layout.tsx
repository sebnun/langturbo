import { Stack } from "expo-router";

export default function ProfileLayout() {
  return (
    <Stack
      screenOptions={{
        contentStyle: {
          backgroundColor: "black",
        },
        headerTintColor: "white",
        headerStyle: {
          backgroundColor: "black",
        },
        headerShadowVisible: false,
        headerBackButtonDisplayMode: "minimal",
      }}
    />
  );
}
