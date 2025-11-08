import { baseUrl } from '../sitemap'
import { getBlogPosts } from '@/lib/blog'

export async function GET() {
  const allBlogs = await getBlogPosts()

  const itemsXml = allBlogs
    .sort((a, b) => {
      if (new Date(a.metadata.publishedAt) > new Date(b.metadata.publishedAt)) {
        return -1
      }
      return 1
    })
    .map(
      (post) =>
        `<item>
          <title><![CDATA[${post.metadata.title}]]></title>
          <link>${baseUrl}/blog/${post.metadata.category.toLowerCase()}/${post.slug}</link>
          <description><![CDATA[${post.metadata.summary || ''}]]></description>
          <pubDate>${new Date(
            post.metadata.publishedAt
          ).toUTCString()}</pubDate>
        </item>`
    )
    .join('\n')

  const rssFeed = `<?xml version="1.0" encoding="UTF-8" ?>
  <rss version="2.0">
    <channel>
        <title>LangTurbo</title>
        <link>${baseUrl}</link>
        <description>LangTurbo RSS feed</description>
        ${itemsXml}
    </channel>
  </rss>`

  return new Response(rssFeed, {
    headers: {
      'Content-Type': 'text/xml',
    },
  })
}