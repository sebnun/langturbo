import Image from "next/image";
import Link from "next/link";
import { Play } from "lucide-react";

const ShowItem = ({
  id,
  imageUrl,
  title,
  author,
}: {
  id: string;
  imageUrl: string;
  title: string;
  author?: string | null;
}) => {
  return (
    <div className="relative hover:bg-secondary p-3 space-y-3">
      <div className="aspect-square w-36 h-36">
      <Image
        // This is the intrinsic size, images do not come just from itunes, so this not optimal, but KISS
        width={600}
        height={600}
        src={imageUrl}
        alt={title}
        className="object-cover"
      />
      </div>
      <div className="truncate flex flex-col justify-center w-36">
        <Link href="/jhgj" title={title} className="leading-normal font-medium text-md truncate">
          <span className="absolute inset-0"></span>
          {title}
        </Link>
        <p className="text-muted-foreground truncate">{author}</p>
      </div>
    </div>
  );
};

export default ShowItem;
