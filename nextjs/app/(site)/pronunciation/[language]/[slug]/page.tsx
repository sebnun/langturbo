import { notFound } from "next/navigation";
import { affiliateLinks, capitalizeFirstLetter, getOrdinal } from "@/lib/utils";
import Link from "next/link";
import { db } from "@/db";
import { listsTable, sentencesTable } from "@/db/schema";
import { eq } from "drizzle-orm";

// Generate static pages for each word in the list at runtime
export const dynamic = "force-static";

// To statically render all paths the first time they're visited
export async function generateStaticParams() {
  return [];
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string; language: string }> }) {
  const { slug, language } = await params;
  const word = decodeURIComponent(slug.split("-")[0]);

  return {
    title: `${word} ${capitalizeFirstLetter(language)} Pronunciation & Example Sentences`,
  };
}

export default async function Word({ params }: { params: Promise<{ slug: string; language: string }> }) {
  const { slug, language } = await params;
  const id = slug.match(/-(.*)/)![1];

  const [wordRows, sentencesRows] = await Promise.all([
    db.select().from(listsTable).where(eq(listsTable.id, id)),
    db.select().from(sentencesTable).where(eq(sentencesTable.lists_id, id)),
  ]);

  if (!id) {
    notFound();
  }

  return (
    <main className="max-w-6xl mx-auto p-6">
      {/* // TODO
      // 
      // <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: post.metadata.title,
            datePublished: post.metadata.publishedAt,
            dateModified: post.metadata.publishedAt,
            description: post.metadata.summary,
            image: post.metadata.image
              ? `${baseUrl}${post.metadata.image}`
              : `/og?title=${encodeURIComponent(post.metadata.title)}`,
            url: `${baseUrl}/blog/${post.slug}`,
            author: {
              "@type": "Person",
              name: "Pablo",
            },
          }),
        }}
      /> */}
      <h1 className="font-cormorant-garamond scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl my-6">
        {wordRows[0].word}
      </h1>
      <article className="prose prose-invert md:prose-lg max-w-none my-12">
        <p>
          This is the {wordRows[0].frequency + 1}
          {getOrdinal(wordRows[0].frequency + 1)} most frequent {capitalizeFirstLetter(language)} word.
        </p>
        <hr />
        <div style={{ textAlign: "center" }}>
          <h3 style={{ margin: "2rem" }}>{wordRows[0].word}</h3>
          <audio controls style={{ marginRight: "auto", marginLeft: "auto", display: "block" }}>
            <source
              src={`https://storage.googleapis.com/turbo-9892e.firebasestorage.app/words/${wordRows[0].id}.mp3`}
              type="audio/mpeg"
            />
          </audio>
          <h3 style={{ margin: "2rem", fontWeight: "normal" }}>{wordRows[0].en_translation}</h3>
        </div>
        <hr />
        <div style={{ textAlign: "center" }}>
          <p>{sentencesRows[0].context}</p>
          <h3 style={{ margin: "2rem" }}>{sentencesRows[0].sentence}</h3>
          <audio controls style={{ marginRight: "auto", marginLeft: "auto", display: "block" }}>
            <source
              src={`https://storage.googleapis.com/turbo-9892e.firebasestorage.app/sentences/${sentencesRows[0].id}.mp3`}
              type="audio/mpeg"
            />
          </audio>
          <h3 style={{ margin: "2rem", fontWeight: "normal" }}>{sentencesRows[0].en_translation}</h3>
        </div>
        <hr />
        <div style={{ textAlign: "center" }}>
          <p>{sentencesRows[1].context}</p>
          <h3 style={{ margin: "2rem" }}>{sentencesRows[1].sentence}</h3>
          <audio controls style={{ marginRight: "auto", marginLeft: "auto", display: "block" }}>
            <source
              src={`https://storage.googleapis.com/turbo-9892e.firebasestorage.app/sentences/${sentencesRows[1].id}.mp3`}
              type="audio/mpeg"
            />
          </audio>
          <h3 style={{ margin: "2rem", fontWeight: "normal" }}>{sentencesRows[1].en_translation}</h3>
        </div>
        <hr />
        <div style={{ textAlign: "center" }}>
          <p>{sentencesRows[2].context}</p>
          <h3 style={{ margin: "2rem" }}>{sentencesRows[2].sentence}</h3>
          <audio controls style={{ marginRight: "auto", marginLeft: "auto", display: "block" }}>
            <source
              src={`https://storage.googleapis.com/turbo-9892e.firebasestorage.app/sentences/${sentencesRows[2].id}.mp3`}
              type="audio/mpeg"
            />
          </audio>
          <h3 style={{ margin: "2rem", fontWeight: "normal" }}>{sentencesRows[2].en_translation}</h3>
        </div>
        <hr />
        <div className="flex justify-center">
          <Link
            href={affiliateLinks[`${language}`]}
            rel="sponsored"
            className="no-underline relative block w-fit mx-auto md:mx-0 py-1
             before:absolute before:bottom-0 before:left-0 before:block before:h-[1px] before:w-full before:bg-white
             after:absolute after:bottom-0 after:left-0 after:block after:h-[1px] after:w-full after:bg-primary after:scale-x-0 hover:after:scale-x-100 after:origin-left after:transition after:duration-300"
          >
            {capitalizeFirstLetter(language)} Language Learning Resources at Amazon
          </Link>
        </div>
      </article>
    </main>
  );
}
