import { View, Text, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import {
  colorTextSubdued,
  msImageTransition,
  radiusBorder,
  sizeElementSpacing,
  sizeScreenPadding,
  sizeTextDefault,
  sizeTextLarger,
  themeStyles,
} from "@/utils/theme";
import BlockButton from "./button/BlockButton";
import { useLocalSearchParams } from "expo-router/build/hooks";

export const PODCAST_LARGE_IMAGE_SIZE = 180;
export const PODCAST_SMALL_IMAGE_SIZE = 120;

export default function PodcastItem({
  podcast,
  segment,
  full,
}: {
  podcast: Podcast;
  segment: "saved" | "discover";
  full?: boolean;
}) {
  const router = useRouter();
  const { lang } = useLocalSearchParams()

  return (
    <BlockButton
      onPress={() =>
        router.navigate({
          pathname: `/[lang]/episodes`,
          params: {
            lang: lang as string,
            id: podcast.id,
            title: podcast.title,
            imageUrl: podcast.imageUrl,
            author: podcast.author,
            feedUrl: podcast.feedUrl,
            description: podcast.description,
            country: podcast.country,
          },
        })
      }
    >
      {full ? <PodcastItemFull podcast={podcast} /> : <PodcastItemSquare podcast={podcast} />}
    </BlockButton>
  );
}

function PodcastItemFull({ podcast }: { podcast: Podcast }) {
  return (
    <View style={styles.fullContainer}>
      <View style={styles.fullImageContainer}>
        <Image
          source={{ uri: podcast.imageUrl }}
          style={styles.fullImage}
          contentFit="cover"
          transition={msImageTransition}
        />
      </View>
      <View style={styles.fullTextContainer}>
        <Text numberOfLines={1} style={styles.fullTextTitle}>
          {podcast.title}
        </Text>
        {podcast.description && (
          <Text numberOfLines={2} style={styles.fullTextDescription}>
            {podcast.description}
          </Text>
        )}
        <Text numberOfLines={1} style={styles.fullTextAuthor}>
          {podcast.author}
        </Text>
      </View>
    </View>
  );
}

function PodcastItemSquare({ podcast }: { podcast: Podcast }) {
  return (
    <View style={styles.squareContainer}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: podcast.imageUrl }}
          style={styles.image}
          contentFit="cover"
          transition={msImageTransition}
        />
      </View>
      <View>
        <Text numberOfLines={1} style={styles.textTitle}>
          {podcast.title}
        </Text>
        <Text numberOfLines={1} style={[themeStyles.mutedText, styles.textAuthor]}>
          {podcast.author}
        </Text>
      </View>
    </View>
  );
}

export function NoContent({
  text,
  icon,
  onTouch,
}: {
  text: string;
  icon: "void" | "podcasts" | "episodes";
  onTouch?: () => void;
}) {
  return (
    <View style={styles.itemEmptyContainer} onTouchStart={onTouch}>
      <View style={styles.noPodcastsImageContainer}>
        <Image
          transition={msImageTransition}
          contentFit="fill"
          source={
            icon === "void"
              ? require("../assets/images/void.svg")
              : icon === "episodes"
              ? require("../assets/images/episodes.svg")
              : require("../assets/images/podcasts.svg")
          }
          style={styles.noPodcastsImage}
        />
      </View>
      <Text style={styles.noText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  squareContainer: {
    padding: sizeElementSpacing * 2,
  },
  imageContainer: {
    borderRadius: radiusBorder,
    overflow: "hidden",
    width: PODCAST_LARGE_IMAGE_SIZE,
    height: PODCAST_LARGE_IMAGE_SIZE,
  },
  image: {
    // Need to hide borders on images from apple
    width: PODCAST_LARGE_IMAGE_SIZE + 1,
    height: PODCAST_LARGE_IMAGE_SIZE + 1,
  },
  textTitle: {
    paddingTop: sizeElementSpacing * 2,
    width: PODCAST_LARGE_IMAGE_SIZE,
    fontSize: sizeTextDefault,
    color: "white",
  },
  textAuthor: {
    width: PODCAST_LARGE_IMAGE_SIZE,
    paddingTop: sizeElementSpacing,
  },

  fullContainer: {
    height: PODCAST_SMALL_IMAGE_SIZE + sizeElementSpacing * 2 * 4,
    flexDirection: "row",
    gap: sizeScreenPadding,
    alignItems: "center",
    padding: sizeElementSpacing * 2,
  },
  fullImageContainer: {
    borderRadius: radiusBorder,
    overflow: "hidden",
    width: PODCAST_SMALL_IMAGE_SIZE,
    height: PODCAST_SMALL_IMAGE_SIZE,
  },
  fullImage: {
    // Need to hide borders on images from apple
    width: PODCAST_SMALL_IMAGE_SIZE + 1,
    height: PODCAST_SMALL_IMAGE_SIZE + 1,
  },
  fullTextContainer: {
    gap: sizeElementSpacing,
    flex: 1,
    paddingRight: sizeScreenPadding,
  },
  fullTextTitle: {
    fontWeight: "bold",
    fontSize: sizeTextLarger,
    color: "white",
  },
  fullTextAuthor: {
    color: "white",
  },
  fullTextDescription: {
    color: colorTextSubdued,
  },

  itemEmptyContainer: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  noPodcastsImageContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: sizeElementSpacing * 4,
  },
  noPodcastsImage: {
    width: PODCAST_LARGE_IMAGE_SIZE,
    height: PODCAST_LARGE_IMAGE_SIZE,
  },
  noText: {
    color: colorTextSubdued,
  },
});
