import { Tabs } from "expo-router";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { colorScreenBackground } from "@/utils/theme";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        popToTopOnBlur: true,
        headerShown: false,
        tabBarActiveTintColor: "white",
        tabBarStyle: {
          borderTopWidth: 0,
          elevation: 0,
          backgroundColor: colorScreenBackground,
        },
      }}
    >
      <Tabs.Screen
        name="(discover)"
        options={{
          title: "Discover",
          tabBarIcon: ({ color, focused, size }) =>
            focused ? (
              <Ionicons name="sparkles-sharp" size={size} color={color} />
            ) : (
              <Ionicons size={size} name="sparkles-outline" color={color} />
            ),
        }}
      />
      <Tabs.Screen
        name="saved"
        options={{
          title: "Saved",
          tabBarIcon: ({ color, focused, size }) =>
            focused ? (
              <Ionicons name="heart-sharp" size={size} color={color} />
            ) : (
              <Ionicons size={size} name="heart-outline" color={color} />
            ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "Search",
          tabBarIcon: ({ color, focused, size }) =>
            focused ? (
              <Ionicons name="search-sharp" size={size} color={color} />
            ) : (
              <Ionicons size={size} name="search-outline" color={color} />
            ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, focused, size }) =>
            focused ? (
              <Ionicons name="person-sharp" size={size} color={color} />
            ) : (
              <Ionicons size={size} name="person-outline" color={color} />
            ),
        }}
      />
    </Tabs>
  );
}
