import { colorPrimary, sizeScreenPadding, sizeTextLarger, themeStyles } from "@/utils/theme";
import { Stack, useRouter } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { getLanguageCodeByName, languagesDict } from "@/utils/languages";
import { capitalizeFirstLetter } from "@/utils";
import Button from "@/components/button/Button";
import { useWindowDimensions } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useTitle } from "@/utils/hooks";
import { useAppStore } from "@/utils/store";
import { useEffect } from "react";

export default function Index() {
  useTitle("What language do you want to learn?");
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const language = useAppStore((state) => state.language);
  const router = useRouter();

  const languagesListDict = Object.values(languagesDict)
    .map((language) => ({ label: capitalizeFirstLetter(language), value: getLanguageCodeByName(language) }))
    .sort((a, b) => a.label.localeCompare(b.label));

  useEffect(() => {
    if (language) {
      router.replace(`/${language}`);
    }
  }, []);

  const handleLanguageSelect = (language: string) => {
    useAppStore.setState({ language });
    router.replace(`/${language}`);
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: "What language do you want to learn?",
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
      <SafeAreaView style={themeStyles.screen}>
        <View style={[styles.flashContainer, { marginTop: -insets.top }]}>
          <FlashList
            numColumns={width < 481 ? 1 : width < 769 ? 2 : 3}
            data={languagesListDict}
            keyExtractor={(item) => item.value}
            ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
            renderItem={({ item }) => (
              <Button style={styles.mainButton} onPress={() => handleLanguageSelect(item.value)}>
                <Text style={styles.itemText}>{item.label}</Text>
              </Button>
            )}
          />
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  flashContainer: {
    width: "100%",
    flex: 1,
  },
  mainButton: {
    backgroundColor: colorPrimary,
    padding: sizeScreenPadding,
    margin: sizeScreenPadding,
    marginBottom: 0,
    marginTop: 0,
    borderRadius: 50,
  },
  itemText: {
    fontSize: sizeTextLarger,
    color: "white",
    textAlign: "center",
  },
  itemSeparator: { height: sizeScreenPadding },
});
