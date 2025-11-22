import { colorPrimary, sizeScreenPadding, sizeTextLarger, themeStyles } from "@/utils/theme";
import { Link, Stack } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { getLanguageCodeByName, languagesDict } from "@/utils/languages";
import { capitalizeFirstLetter, useTitle } from "@/utils";
import Button from "@/components/button/Button";
import { useWindowDimensions } from "react-native";

export default function Index() {
  useTitle("What language do you want to learn?");
  const { width } = useWindowDimensions();

  const languagesListDict = Object.values(languagesDict)
    .map((language) => ({ label: capitalizeFirstLetter(language), value: getLanguageCodeByName(language) }))
    .sort((a, b) => a.label.localeCompare(b.label));

  return (
    <>
      <Stack.Screen
        options={{
          title: "What language do you want to learn?",
        }}
      />
      <View style={themeStyles.screen}>
        <View style={styles.flashContainer}>
          <FlashList
            numColumns={width < 481 ? 1 : width < 769 ? 2 : 3}
            data={languagesListDict}
            keyExtractor={(item) => item.value}
            ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
            renderItem={({ item }) => (
              <Link href={`/${item.value}`} asChild>
                <Button style={styles.mainButton}>
                  <Text style={styles.itemText}>{item.label}</Text>
                </Button>
              </Link>
            )}
          />
        </View>
      </View>
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
    textAlign: 'center'
  },
  itemSeparator: { height: sizeScreenPadding },
});
