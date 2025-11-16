import { Play } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const EpisodeItemSkeleton = () => {
  return (
    <div className="relative hover:bg-secondary flex p-3 space-x-3 min-w-94 border">
      <Skeleton className="h-36 w-36 aspect-square" />
      <div className="truncate flex flex-col justify-center w-full relative space-y-3">
        <Skeleton className="size-2 w-64" />
        <Skeleton className="size-1 w-40" />
        <Skeleton className="size-1 w-28" />

        <div className="bg-white rounded-full p-2 absolute right-0 bottom-0">
          <Play fill="black" />
        </div>
      </div>
    </div>
  );
};

export default EpisodeItemSkeleton;
