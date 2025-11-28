import IconButton from "@/components/button//IconButton";
import EpisodeItem, { EpisodeItemSeparator } from "@/components/EpisodeItem";
import Loading from "@/components/Loading";
import { NoContent, PODCAST_SMALL_IMAGE_SIZE } from "@/components/PodcastItem";
import { useTitle } from "@/utils/hooks";
import { getEpisodes } from "@/utils/api";
import { getCountryNameForLocale } from "@/utils/languages";
import {
  colorTextSubdued,
  msImageTransition,
  radiusBorder,
  sizeElementSpacing,
  sizeIconNavigation,
  sizeScreenPadding,
  themeStyles,
} from "@/utils/theme";
import { Ionicons } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import { Image } from "expo-image";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import SavePodcastHeart from "@/components/SavePodcastHeart";
import { authClient } from "@/utils/auth";
import Button from "@/components/button/Button";
import AuthModal from "@/components/AuthModal";

// Can't use non strings as params in expo router
const convertRouteParamsToPodcast = (params: any) => {
  const podcast: Podcast = {
    id: params.id,
    title: params.title,
    imageUrl: params.imageUrl,
    author: params.author,
    feedUrl: params.feedUrl,
    description: params.description,
    country: params.country,
  };

  return podcast;
};

export default function EpisodesScreen() {
  const params = useLocalSearchParams();
  useTitle(params.title as string);
  const router = useRouter();
  const podcast = convertRouteParamsToPodcast(params);
  const [loading, setLoading] = useState(true);
  const [episodes, setEpisodes] = useState<PodcastEpisode[]>([]);
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  const { data: session } = authClient.useSession();

  const [showAuth, setShowAuth] = useState(false);

  useEffect(() => {
    getEpisodes(podcast.feedUrl, podcast.id)
      .then(({ episodes, categories }) => {
        setEpisodes(episodes);
        setCategories(categories);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [podcast.id]); // Looks like I need a dependency on every screen to not get stale data while navigating

  return (
    <>
      <Stack.Screen
        options={{
          title: podcast.title,
          headerRight: () => (
            <View
              style={{
                paddingRight: Platform.OS === "web" ? sizeScreenPadding : undefined,
                paddingLeft: Platform.OS === "ios" ? 6 : undefined, // With the new glass buttons
              }}
            >
              {session ? (
                <SavePodcastHeart podcast={podcast} />
              ) : (
                <Button onPress={() => setShowAuth(true)}>
                  <Ionicons name="heart-outline" size={sizeIconNavigation} color="white" />
                </Button>
              )}
            </View>
          ),
        }}
      />
      <View style={themeStyles.screen}>
        <AuthModal onClose={() => setShowAuth(false)} isVisible={showAuth} />
        <View style={styles.flashContainer}>
          {loading ? (
            <Loading />
          ) : episodes.length === 0 ? (
            <NoContent icon="void" text="No podcast episodes found" />
          ) : (
            <FlashList
              ListHeaderComponent={() => (
                <View style={styles.headerContainer}>
                  <View style={styles.metaContainer}>
                    <View style={styles.imageContainer}>
                      <Image
                        source={{ uri: podcast.imageUrl }}
                        style={styles.image}
                        contentFit="cover"
                        transition={msImageTransition}
                      />
                    </View>
                    <View style={styles.metaTextContainer}>
                      {podcast.description && (
                        <Text numberOfLines={4} style={styles.description}>
                          {podcast.description}
                        </Text>
                      )}
                      <Text style={styles.author}>{podcast.author}</Text>
                      {podcast.country && getCountryNameForLocale(podcast.country) && (
                        <Text style={styles.author}>From {getCountryNameForLocale(podcast.country)}</Text>
                      )}
                    </View>
                  </View>
                  <ScrollView horizontal>
                    <View style={styles.categoryView}>
                      {categories.map((category) => (
                        <IconButton
                          key={category.id}
                          onPress={() =>
                            router.navigate({
                              pathname: `/[lang]/category`,
                              params: {
                                lang: params.lang as string,
                                categoryId: category.id,
                                categoryName: category.name,
                              },
                            })
                          }
                          text={category.name}
                          leftNode={<Ionicons size={12} name="sparkles-sharp" color="white" />}
                        />
                      ))}
                    </View>
                  </ScrollView>
                </View>
              )}
              contentContainerStyle={{ padding: sizeElementSpacing }}
              data={episodes}
              renderItem={({ item }) => (
                <EpisodeItem
                  episode={item}
                  podcastId={podcast.id}
                  podcastTitle={podcast.title}
                  podcastImageUrl={podcast.imageUrl}
                />
              )}
              ItemSeparatorComponent={() => <EpisodeItemSeparator />}
            />
          )}
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    gap: sizeElementSpacing * 2,
  },
  metaContainer: {
    padding: sizeElementSpacing * 2,
    flexDirection: "row",
    alignItems: "center",
  },
  metaTextContainer: {
    flex: 1,
    paddingLeft: sizeScreenPadding,
    gap: sizeElementSpacing,
  },
  author: {
    color: colorTextSubdued,
  },
  description: {
    color: "white",
  },
  categoryView: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: sizeElementSpacing,
    paddingRight: sizeElementSpacing,
    paddingBottom: sizeElementSpacing * 2,
    gap: sizeElementSpacing * 2,
  },
  imageContainer: {
    borderRadius: radiusBorder,
    overflow: "hidden",
    width: PODCAST_SMALL_IMAGE_SIZE,
    height: PODCAST_SMALL_IMAGE_SIZE,
  },
  image: {
    width: PODCAST_SMALL_IMAGE_SIZE + 1,
    height: PODCAST_SMALL_IMAGE_SIZE + 1,
  },
  flashContainer: { flex: 1, width: "100%" },
});
