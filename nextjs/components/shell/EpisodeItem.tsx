import Image from "next/image";
import Link from "next/link";
import { Play } from "lucide-react";

const EpisodeItem = ({
  id,
  showId,
  showImageUrl,
  title,
  showTitle,
  showAuthor,
}: {
  id: string;
  showId: string;
  showImageUrl: string;
  title: string;
  showTitle: string;
  showAuthor?: string | null;
}) => {
  return (
    <div className="relative hover:bg-secondary flex p-3 space-x-3 w-full">
      <Image
        // This is the intrinsic size, images do not come just from itunes, so this not optimal, but KISS
        width={600}
        height={600}
        src={showImageUrl}
        alt={showTitle}
        className="aspect-square w-24 h-24 object-cover"
      />
      <div className="truncate flex flex-col justify-center w-full">
        <Link href="/jhgj" title={title} className="leading-normal font-medium text-md truncate">
          <span className="absolute inset-0"></span>
          {title}
        </Link>
        <div className="flex items-center justify-between w-full">
          <div className="w-full flex-1 truncate">
            <p className="text-muted-foreground truncate">{showTitle}</p>
            <p className="text-muted-foreground truncate">{showAuthor}</p>
          </div>
          <div className="bg-white rounded-full p-1">
            <Play fill="black" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EpisodeItem;
