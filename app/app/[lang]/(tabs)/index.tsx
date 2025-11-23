import { Redirect, useLocalSearchParams } from "expo-router";
import React from "react";

const RedirectScreen = () => {
  const { lang } = useLocalSearchParams();
  return <Redirect href={`/${lang as string}/discover`} />;
};

export default RedirectScreen;
