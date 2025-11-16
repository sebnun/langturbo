import { Play } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const EpisodeItemSkeleton = () => {
  return (
    <div className="relative hover:bg-secondary flex p-3 space-x-3 w-full">
      <Skeleton className="h-24 w-24 aspect-square" />
      <div className="truncate flex flex-col justify-center w-full space-y-2">
        <Skeleton className="size-2 w-64" />
        <div className="flex items-center justify-between w-full">
          <div className="w-full flex-1 truncate space-y-2">
            <Skeleton className="size-1 w-40" />
            <Skeleton className="size-1 w-28" />
          </div>
          <div className="bg-white rounded-full p-1">
            <Play fill="black" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EpisodeItemSkeleton;
