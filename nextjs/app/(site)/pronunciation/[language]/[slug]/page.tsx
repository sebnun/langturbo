import { notFound } from "next/navigation";
import { capitalizeFirstLetter, getOrdinal } from "@/lib/utils";
import Link from "next/link";
import { db } from "@/db";
import { listsTable, sentencesTable } from "@/db/schema";
import { eq } from "drizzle-orm";

const affiliateLinks: Record<string, string> = {
  //english: "",
  chinese: "https://amzn.to/4ipgAF6",
  german: "https://amzn.to/4irRJAB",
  spanish: "https://amzn.to/3F6LZhg",
  russian: "https://amzn.to/41OARNV",
  korean: "https://amzn.to/41OAUcz",
  french: "https://amzn.to/3F9W5Om",
  japanese: "https://amzn.to/3XxNT0R",
  portuguese: "https://amzn.to/43k62Tw",
  turkish: "https://amzn.to/4h9rgXn",
  polish: "https://amzn.to/43k66CK",
  catalan: "https://amzn.to/4h5YIhu",
  dutch: "https://amzn.to/3DadDtf",
  arabic: "https://amzn.to/4kvOeuA",
  swedish: "https://amzn.to/4i4PRhu",
  italian: "https://amzn.to/4isUTE7",
  indonesian: "https://amzn.to/4kuQMZX",
  hindi: "https://amzn.to/4kqBQw5",
  finnish: "https://amzn.to/4kvZAia",
  vietnamese: "https://amzn.to/4kuRRRB",
  hebrew: "https://amzn.to/41OB9nZ",
  ukrainian: "https://amzn.to/41s2zQk",
  greek: "https://amzn.to/4bwxLlY",
  malay: "https://amzn.to/3QNLU4x",
  czech: "https://amzn.to/4bwVjHj",
  romanian: "https://amzn.to/3FkEZNJ",
  danish: "https://amzn.to/4itncCl",
  hungarian: "https://amzn.to/41wNDAe",
  tamil: "https://amzn.to/3XxOfVf",
  norwegian: "https://amzn.to/41LaR7g",
  thai: "https://amzn.to/4i5wk09",
  urdu: "https://amzn.to/43pg2uw",
  croatian: "https://amzn.to/3QMRPXH",
  bulgarian: "https://amzn.to/3Dme5o7",
  lithuanian: "https://amzn.to/3XzvL6D",
  slovak: "https://amzn.to/3Do5EZB",
  persian: "https://amzn.to/3XrVy0w",
  latvian: "https://amzn.to/4i8y60y",
  serbian: "https://amzn.to/41vPky0",
  azerbaijani: "https://amzn.to/43r26Au",
  slovenian: "https://amzn.to/43rAyea",
  estonian: "https://amzn.to/43pFeB5",
  macedonian: "https://amzn.to/3QLGzuv",
  icelandic: "https://amzn.to/4iv10bd",
  armenian: "https://amzn.to/4kpnSuh",
  marathi: "https://amzn.to/4heo5xw",
  afrikaans: "https://amzn.to/3F7rKjz",
};

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
    title: `${word} ${capitalizeFirstLetter(language)} Pronunciation & Example Sentences - LangTurbo`,
  };
}

export default async function Word({ params }: { params: Promise<{ slug: string; language: string }> }) {
  const { slug, language } = await params;
  const id = slug.match(/-(.*)/)![1];

  const wordRows = await db.select().from(listsTable).where(eq(listsTable.id, id));
  const sentencesRows = await db.select().from(sentencesTable).where(eq(sentencesTable.lists_id, id));

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
      <h1 className="font-cormorant-garamond scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl my-6">{wordRows[0].word}</h1>
      <article className="prose prose-invert md:prose-lg max-w-none my-12">
        <p>
          This is the {wordRows[0].frequency + 1}
          {getOrdinal(wordRows[0].frequency + 1)} most frequent {capitalizeFirstLetter(language)} word.
        </p>
        {/* <p>
          <a href={affiliateLinks[`${language}`]} rel="sponsored">
            More {capitalizeFirstLetter(language)} resources.
          </a>
        </p> */}
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
