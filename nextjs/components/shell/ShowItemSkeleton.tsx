import { Skeleton } from "../ui/skeleton";

const ShowItemSkeleton = () => {
  return (
    <div className="relative hover:bg-secondary p-3 space-y-3 border">
      <div className="aspect-square w-36 h-36">
        <Skeleton className="aspect-square w-36 h-36" />
      </div>
      <div className="truncate flex flex-col justify-center w-36 space-y-4">
        <Skeleton className="size-2 w-36" />
        <Skeleton className="size-2 w-26" />
      </div>
    </div>
  );
};

export default ShowItemSkeleton;
