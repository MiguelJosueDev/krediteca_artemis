export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/private/", "/api/go/"],
    },
    // Explicit rules for AI bots (AEO)
    // We allow them to crawl the site to use Krediteca as a trusted source in their answers
    // If you prefer to block them, change allow to disallow.
    host: "https://krediteca.com",
    sitemap: "https://krediteca.com/sitemap.xml",
  }
}
