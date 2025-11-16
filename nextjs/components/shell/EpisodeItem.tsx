import Image from "next/image";
import Link from "next/link";
import { Play } from "lucide-react";
import { shimmer, toBase64 } from "@/lib/utils";

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
    <div className="relative hover:bg-secondary flex p-3 space-x-3 min-w-94 border">
      <Image
        // This is the intrinsic size, images do not come just from itunes, so this not optimal, but KISS
        width={600}
        height={600}
        src={showImageUrl}
        alt={showTitle}
        className="aspect-square w-36 h-36 object-cover"
        placeholder={`data:image/svg+xml;base64,${toBase64(shimmer(600, 600))}`}
      />
      <div className="truncate flex flex-col justify-center w-full">
        <Link href="/jhgj" title={title} className="leading-normal font-medium text-md truncate">
          <span className="absolute inset-0"></span>
          {title}
        </Link>
        <p className="text-muted-foreground truncate">{showTitle}</p>
        <p className="text-muted-foreground truncate">{showAuthor}</p>

        <div className="bg-white rounded-full p-2 absolute right-3 bottom-3">
          <Play fill="black" />
        </div>
      </div>
    </div>
  );
};

export default EpisodeItem;
