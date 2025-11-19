import { View, Text, StyleSheet } from "react-native";
import { useFocusEffect, useRouter } from "expo-router";
import { colorSeparator, colorTextSubdued, sizeElementSpacing, sizeTextLarger } from "@/utils/theme";
import BlockButton from "./button/BlockButton";
import { Ionicons } from "@expo/vector-icons";


export const EPISODE_ITEM_HEIGHT = 80;

export default function EpisodeItem({
  episode,
  podcastId,
  podcastTitle,
  podcastImageUrl,
}: {
  episode: PodcastEpisode;
  podcastId: string;
  podcastTitle: string;
  podcastImageUrl: string;
}) {
  const router = useRouter();

  return (
    <BlockButton
      onPress={() =>
        router.navigate({
          pathname: `/player`,
          params: {
            id: episode.id,
            podcastId,
            title: episode.title,
            podcastTitle,
            podcastImageUrl,
          },
        })
      }
    >
      <View style={styles.textContainer}>
        <Text numberOfLines={1} style={styles.textTitle}>
          {episode.title}
        </Text>
        {episode.description ? (
          <Text style={styles.textDescription} numberOfLines={2}>
            {episode.description}
          </Text>
        ) : null}

        <View style={styles.bottomContainer}>
          <View style={styles.textBottomContainer}>
            <Text style={styles.textDate} numberOfLines={1}>
              {episode.date}
            </Text>
            <Text style={styles.textTime} numberOfLines={1}>
              {episode.duration}
            </Text>
          </View>
          <Ionicons name="play-circle-sharp" size={40} color="white" />
        </View>
      </View>
    </BlockButton>
  );
}

export function EpisodeItemSeparator() {
  return (
    <View style={styles.itemSeparetor}>
      <View style={styles.itemSeparetorLine} />
    </View>
  );
}

const styles = StyleSheet.create({
  textContainer: {
    flex: 1,
    gap: sizeElementSpacing,
    padding: sizeElementSpacing * 2,
    paddingBottom: sizeElementSpacing * 4,
    paddingTop: sizeElementSpacing * 4,
  },
  textTitle: {
    fontWeight: "bold",
    fontSize: sizeTextLarger,
    color: "white",
  },
  textDescription: {
    color: colorTextSubdued,
  },
  bottomContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: sizeElementSpacing,
    paddingRight: sizeElementSpacing,
  },
  textBottomContainer: {
    gap: sizeElementSpacing * 2,
    flex: 1,
  },
  textDate: {
    color: "white",
  },
  textTime: {
    color: "white",
    fontFamily: "SourceCodePro_400Regular",
  },
  progressRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: sizeElementSpacing,
  },

  itemSeparetor: {
    justifyContent: "center",
  },
  itemSeparetorLine: {
    height: StyleSheet.hairlineWidth,
    borderBottomColor: colorSeparator,
    borderBottomWidth: StyleSheet.hairlineWidth,
    opacity: 0.5,
  },
});
