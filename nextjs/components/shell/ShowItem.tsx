import Image from "next/image";
import Link from "next/link";
import { shimmer, toBase64 } from "@/lib/utils";

const ShowItem = ({
  id,
  imageUrl,
  title,
  author,
  lang,
}: {
  id: string;
  imageUrl: string;
  title: string;
  author?: string | null;
  lang: string;
}) => {
  return (
    <div className="relative hover:bg-secondary p-3 space-y-3 border">
      <div className="aspect-square w-36 h-36">
        <Image
          // This is the intrinsic size, images do not come just from itunes, so this not optimal, but KISS
          width={600}
          height={600}
          src={imageUrl}
          alt={title}
          className="object-cover border"
          placeholder={`data:image/svg+xml;base64,${toBase64(shimmer(600, 600))}`}
        />
      </div>
      <div className="truncate flex flex-col justify-center w-36">
        {/* TODO test show with - in the name */}
        <Link
          href={`/${lang}/show/${encodeURIComponent(`${title}-${id}`)}`}
          title={title}
          className="leading-normal font-medium text-md truncate"
        >
          <span className="absolute inset-0"></span>
          {title}
        </Link>
        <p className="text-muted-foreground truncate">{author}</p>
      </div>
    </div>
  );
};

export default ShowItem;
