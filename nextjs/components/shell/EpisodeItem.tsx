import Image from "next/image";
import Link from "next/link";

const EpisodeItem = ({
  id,
  showId,
  showImageUrl,
  title,
  showTitle,
  duration,
  date,
}: {
  id: string;
  showId: string;
  showImageUrl: string;
  title: string;
  showTitle: string;
  duration?: string;
  date?: string;
}) => {
  return (
    <Link
      prefetch={false}
      key={id}
      href={`/player?id=${encodeURIComponent(id)}&podcastId=${"todo"}&title=${encodeURIComponent(title)}`}
      className="m-4 border-red-200 border-4 flex flex-1"
    >
      <div className="rounded-md flex-1">
        <Image
          unoptimized // This count towards the free limit
          width={200}
          height={200}
          src={showImageUrl}
          alt={showTitle}
          className="object-cover transition-all hover:scale-105 aspect-square"
        />
      </div>
      <div className="space-y-1 text-sm">
        <h3 title={title} className="leading-normal font-medium text-md truncate">
          {title}
        </h3>
        {date && duration && (
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">{date}</span>
            <code className="text-xs">{duration}</code>
          </div>
        )}
      </div>
    </Link>
  );
};

export default EpisodeItem