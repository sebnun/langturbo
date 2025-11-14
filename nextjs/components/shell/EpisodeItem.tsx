import Image from "next/image";
import Link from "next/link";

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
    <div className="relative hover:bg-black flex justify-between items-center space-x-2 min-w-xl">
      <div className="rounded-md flex-none">
        <Image width={120} height={120} src={showImageUrl} alt={showTitle} className="object-cover aspect-square" />
      </div>
      <div className="flex-1 overflow-clip">
        <Link href="jhgj" title={title} className="leading-normal font-medium text-md truncate">
          <span className="absolute inset-0"></span>
          {title}
        </Link>

        <div>
          <div>
            <p className="text-xs">{showTitle}</p>
            <p className="text-xs">{showAuthor}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EpisodeItem;
