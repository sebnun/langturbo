import { formatDate, getBlogPosts } from "@/utils";
import Link from "next/link";

export const metadata = {
  title: "Blog - LangTurbo",
};

export default async function BlogList() {
  const allBlogs = getBlogPosts();

  return (
    <main className="max-w-6xl mx-auto p-6">
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl my-6">Blog</h1>
      <article className="py-12">
        {allBlogs
          .sort((a, b) => {
            if (new Date(a.metadata.publishedAt) > new Date(b.metadata.publishedAt)) {
              return -1;
            }
            return 1;
          })
          .slice(0, 100)
          .map((post) => (
            <div key={post.slug} className="flex flex-col mb-6">
              <div className="w-full flex flex-col md:flex-row space-x-0 space-y-2 md:space-x-2 md:space-y-0 items-center">
                <div className="space-x-2">
                  <code className="inline-block md:w-[150px] text-colortextsubdued tabular-nums text-sm text-center md:text-left">
                    {formatDate(post.metadata.publishedAt, false)}
                  </code>
                  <div className="inline-block md:w-[120px]">
                    <code className="flex justify-center">
                      <Link
                        href={`/blog/${post.metadata.category.toLowerCase()}`}
                        className="rounded-full bg-colorprimary text-sm px-2 tabular-nums"
                      >
                        {post.metadata.category}
                      </Link>
                    </code>
                  </div>
                </div>
                <Link
                  href={`/blog/${post.metadata.category.toLowerCase()}/${post.slug}`}
                  className="py-1 before:block before:content-[''] before:absolute before:h-[1px] before:bg-white before:w-full before:bottom-0 after:bottom-0 relative w-fit block after:block after:content-[''] after:absolute after:h-[1px] after:bg-colorprimary after:w-full after:scale-x-0 after:hover:scale-x-100 after:transition after:duration-300 after:origin-left mx-auto md:mx-0"
                >
                  {post.metadata.title}
                </Link>
              </div>
            </div>
          ))}
      </article>
    </main>
  );
}
