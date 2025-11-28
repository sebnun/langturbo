import { Ionicons } from "@expo/vector-icons";
import { useAppStore } from "../utils/store";
import { sizeIconNavigation, colorPrimary } from "@/utils/theme";
import Button from "./button/Button";

const SavePodcastHeart = ({ podcast }: { podcast: Podcast }) => {
  const saved = useAppStore((state) => state.saved);
  const savePodcast = useAppStore((state) => state.savePodcast);
  const removePodcast = useAppStore((state) => state.removePodcast);
  const isSaved = saved.some((p) => p.id === podcast.id);

  if (isSaved)
    return (
      <Button onPress={() => removePodcast(podcast.id)}>
        <Ionicons name="heart-sharp" size={sizeIconNavigation} color={colorPrimary} />
      </Button>
    );

  return (
    <Button onPress={() => savePodcast(podcast)}>
      <Ionicons name="heart-outline" size={sizeIconNavigation} color="white" />
    </Button>
  );
};

export default SavePodcastHeart;
