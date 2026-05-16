import { getAllPosts } from "@/lib/blog"
import { NextResponse } from "next/server"

export async function GET() {
  const posts = getAllPosts()
  const site_url = "https://krediteca.com"

  const feedItems = posts.map((post) => {
    return `
    <item>
      <title><![CDATA[${post.frontmatter.title}]]></title>
      <link>${site_url}/blog/${post.category}/${post.slug}</link>
      <guid>${site_url}/blog/${post.category}/${post.slug}</guid>
      <pubDate>${new Date(post.frontmatter.publishedAt).toUTCString()}</pubDate>
      <description><![CDATA[${post.frontmatter.description}]]></description>
      ${post.frontmatter.image ? `<enclosure url="${post.frontmatter.image}" type="image/jpeg" />` : ""}
    </item>
    `
  }).join("")

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
    <channel>
      <title>Krediteca Blog</title>
      <link>${site_url}</link>
      <description>Comparador financiero en México. Guías y artículos sobre finanzas personales.</description>
      <language>es-MX</language>
      <atom:link href="${site_url}/feed.xml" rel="self" type="application/rss+xml" />
      ${feedItems}
    </channel>
  </rss>`

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "s-maxage=86400, stale-while-revalidate",
    },
  })
}
