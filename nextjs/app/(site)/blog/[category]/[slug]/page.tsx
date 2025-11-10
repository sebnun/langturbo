import { notFound } from "next/navigation";
import { CustomMDX } from "@/components/site/mdx";
import { getBlogPosts } from "@/lib/blog";

export async function generateStaticParams() {
  const posts = getBlogPosts();

  return posts.map((post) => ({
    category: post.metadata.category,
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string, category: string }> }) {
  const { slug, category } = await params;

  const post = getBlogPosts(category).find((post) => post.slug === slug);
  if (!post) {
    return;
  }

  const { title, publishedAt: publishedTime, summary: description, image } = post.metadata;
  //const ogImage = image ? image : `${baseUrl}/og?title=${encodeURIComponent(title)}`;

  return {
    title: `${title} - ${post.metadata.category}`,
    // description,
    // openGraph: {
    //   title,
    //   description,
    //   type: "article",
    //   publishedTime,
    //   url: `${baseUrl}/blog/${post.slug}`,
    //   images: [
    //     {
    //       url: ogImage,
    //     },
    //   ],
    // },
    // twitter: {
    //   card: "summary_large_image",
    //   title,
    //   description,
    //   images: [ogImage],
    // },
  };
}

export default async function Blog({ params }: { params: Promise<{ slug: string, category: string }> }) {
  const { slug, category } = await params;
  const post = getBlogPosts(category).find((post) => post.slug === slug);

  if (!post) {
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
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl my-6">{post.metadata.title}</h1>
      <article className="prose prose-invert md:prose-lg max-w-none my-12">
        <CustomMDX source={post.content} />
      </article>
    </main>
  );
}
