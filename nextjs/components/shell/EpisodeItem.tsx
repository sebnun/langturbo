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
  console.log(showImageUrl);
  return (
    <div className="relative hover:bg-colorcardbackground flex flex-col p-3 space-y-2">
      <div className="relative w-38">
        <Image
          // This is the intrinsic size, images do not come just from itunes, so this not optimal, but KISS
          width={600}
          height={600}
          src={showImageUrl}
          alt={showTitle}
          objectFit="cover"
          className="aspect-square rounded-full"
        />
        <Play size={62} color="black" fill="white" className="absolute w-full mr-auto ml-auto top-0 bottom-0 mt-auto mb-auto" />
      </div>
      <div className="truncate max-w-38">
        <Link href="/jhgj" title={title} className="leading-normal font-medium text-md">
          <span className="absolute inset-0"></span>
          {title}
        </Link>
      </div>
    </div>
  );
};

export default EpisodeItem;
