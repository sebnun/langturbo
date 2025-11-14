import { formatDate, getBlogPosts } from "@/lib/blog";
import Link from "next/link";

export const metadata = {
  title: "Blog - LangTurbo",
};

export default async function BlogList() {
  const allBlogs = getBlogPosts();

  return (
    <main className="max-w-6xl mx-auto p-6">
      <h1 className="font-old-standard-tt scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl my-6">Blog</h1>
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
                        className="bg-colorprimary text-sm px-2 tabular-nums"
                      >
                        {post.metadata.category}
                      </Link>
                    </code>
                  </div>
                </div>
                <Link
                  href={`/blog/${post.metadata.category.toLowerCase()}/${post.slug}`}
                  className="relative block w-fit mx-auto md:mx-0 py-1
             before:absolute before:bottom-0 before:left-0 before:block before:h-[1px] before:w-full before:bg-white
             after:absolute after:bottom-0 after:left-0 after:block after:h-[1px] after:w-full after:bg-colorprimary after:scale-x-0 hover:after:scale-x-100 after:origin-left after:transition after:duration-300"
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
