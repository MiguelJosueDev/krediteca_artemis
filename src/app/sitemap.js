import { getAllPosts } from "@/lib/blog"

export default function sitemap() {
  const baseUrl = "https://krediteca.com"
  const posts = getAllPosts()

  const staticRoutes = [
    "",
    "/comparador",
    "/calculadoras",
    "/calculadoras/prestamos",
    "/calculadoras/cat",
    "/calculadoras/capacidad",
    "/calculadoras/consolidacion",
    "/blog",
    "/contacto",
  ]

  const staticUrls = staticRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: route === "/blog" ? "daily" : "weekly",
    priority: route === "" ? 1.0 : 0.8,
  }))

  const postUrls = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.category}/${post.slug}`,
    lastModified: new Date(post.frontmatter.updatedAt || post.frontmatter.publishedAt).toISOString(),
    changeFrequency: "monthly",
    priority: 0.7,
  }))

  return [...staticUrls, ...postUrls]
}
