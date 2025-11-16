import { Suspense } from "react";
import ShowsLoader from "@/components/shell/ShowsLoader";
import ShowItemSkeleton from "@/components/shell/ShowItemSkeleton";
import Image from "next/image";
import { db } from "@/db";
import { showsTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { shimmer, toBase64 } from "@/lib/utils";

export async function generateMetadata({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const { slug, lang } = await params;
  const name = decodeURIComponent(slug.split("-")[0]);

  return {
    title: `${name}`,
  };
}

export default async function ShowPage({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const { lang, slug } = await params;
  const title = decodeURIComponent(slug.split("-")[0]);
  const id = slug.replace(slug.split("-")[0] + "-", "");

  console.log("wat", title, id);

  const [showRow] = await db.select().from(showsTable).where(eq(showsTable.id, id)).limit(1);

  return (
    <main className="pb-6">
      <section>
        <Image
          // This is the intrinsic size, images do not come just from itunes, so this not optimal, but KISS
          width={600}
          height={600}
          src={showRow.image_url}
          alt={showRow.title}
          className="aspect-square w-64 h-64 object-cover"
          placeholder={`data:image/svg+xml;base64,${toBase64(shimmer(600, 600))}`}
        />
        <div>
          <h1>{showRow.title}</h1>
          <p>{showRow.author}</p>
          <p>{showRow.description}</p>
        </div>
      </section>

      <section>
        
      </section>
    </main>
  );
}
