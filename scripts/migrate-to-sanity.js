const fs = require("fs")
const path = require("path")
const matter = require("gray-matter")

const CONTENT_DIR = path.join(__dirname, "../src/content")
const BLOG_DIR = path.join(CONTENT_DIR, "blog")
const AUTHORS_DIR = path.join(CONTENT_DIR, "authors")
const OUTPUT_FILE = path.join(__dirname, "output.ndjson")

// Helper to generate a random key for Sanity blocks
function genKey() {
  return Math.random().toString(36).substring(2, 10)
}

function processAuthors() {
  const authors = []
  if (!fs.existsSync(AUTHORS_DIR)) return authors

  const files = fs.readdirSync(AUTHORS_DIR).filter((f) => f.endsWith(".json"))
  for (const file of files) {
    const data = JSON.parse(fs.readFileSync(path.join(AUTHORS_DIR, file), "utf8"))
    authors.push({
      _id: `author-${data.id}`,
      _type: "author",
      id: data.id,
      name: data.name,
      role: data.role,
      bio: data.bio,
      avatar: data.avatar,
      linkedin: data.linkedin,
      twitter: data.twitter,
    })
  }
  return authors
}

function markdownToPortableText(markdown) {
  const blocks = []
  
  // A very rough parser for the Dry-Run.
  // In production, @portabletext/remark-slate or a proper AST parser should be used.
  const lines = markdown.split("\n")
  
  let currentParagraph = []
  
  function flushParagraph() {
    if (currentParagraph.length > 0) {
      blocks.push({
        _type: "block",
        _key: genKey(),
        style: "normal",
        markDefs: [],
        children: [{ _type: "span", _key: genKey(), text: currentParagraph.join("\n").trim(), marks: [] }]
      })
      currentParagraph = []
    }
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    // Catch <OfferCard slug="xxx" />
    const offerMatch = line.match(/<OfferCard\s+slug=["']([^"']+)["']\s*\/>/)
    if (offerMatch) {
      flushParagraph()
      blocks.push({
        _type: "offerCard",
        _key: genKey(),
        slug: offerMatch[1]
      })
      continue
    }

    // Catch <Disclaimer text="xxx" />
    const disclaimerMatch = line.match(/<Disclaimer\s+text=["']([^"']+)["']\s*\/>/)
    if (disclaimerMatch) {
      flushParagraph()
      blocks.push({
        _type: "disclaimer",
        _key: genKey(),
        text: disclaimerMatch[1]
      })
      continue
    }

    // Catch <Callout ...>
    if (line.includes("<Callout")) {
      flushParagraph()
      const typeMatch = line.match(/type=["']([^"']+)["']/)
      const titleMatch = line.match(/title=["']([^"']+)["']/)
      
      let calloutText = ""
      i++ // Skip opening tag line
      while (i < lines.length && !lines[i].includes("</Callout>")) {
        calloutText += lines[i] + "\n"
        i++
      }

      blocks.push({
        _type: "callout",
        _key: genKey(),
        type: typeMatch ? typeMatch[1] : "info",
        title: titleMatch ? titleMatch[1] : "",
        text: calloutText.trim()
      })
      continue
    }

    // Headers
    const headerMatch = line.match(/^(#{1,6})\s+(.*)/)
    if (headerMatch) {
      flushParagraph()
      blocks.push({
        _type: "block",
        _key: genKey(),
        style: `h${headerMatch[1].length}`,
        markDefs: [],
        children: [{ _type: "span", _key: genKey(), text: headerMatch[2], marks: [] }]
      })
      continue
    }

    // Normal text
    if (line.trim() === "") {
      flushParagraph()
    } else {
      currentParagraph.push(line)
    }
  }
  
  flushParagraph()

  return blocks
}

function processPosts() {
  const posts = []
  if (!fs.existsSync(BLOG_DIR)) return posts

  const categories = fs.readdirSync(BLOG_DIR)
  for (const category of categories) {
    const categoryPath = path.join(BLOG_DIR, category)
    if (!fs.statSync(categoryPath).isDirectory()) continue

    const files = fs.readdirSync(categoryPath).filter(file => file.endsWith('.mdx') || file.endsWith('.md'))
    for (const file of files) {
      const slug = file.replace(/\.mdx?$/, "")
      const filePath = path.join(categoryPath, file)
      const { data, content } = matter(fs.readFileSync(filePath, "utf8"))

      posts.push({
        _id: `post-${slug}`,
        _type: "post",
        title: data.title,
        slug: { _type: "slug", current: slug },
        description: data.description,
        category: data.category,
        tags: data.tags || [],
        author: data.author ? { _type: "reference", _ref: `author-${data.author}` } : undefined,
        reviewedBy: data.reviewedBy ? { _type: "reference", _ref: `author-${data.reviewedBy}` } : undefined,
        publishedAt: data.publishedAt,
        updatedAt: data.updatedAt,
        image: data.image,
        draft: data.draft || false,
        body: markdownToPortableText(content)
      })
    }
  }
  return posts
}

function main() {
  const authors = processAuthors()
  const posts = processPosts()
  
  const allDocs = [...authors, ...posts]
  
  // Create ndjson content
  const ndjson = allDocs.map(doc => JSON.stringify(doc)).join("\n")
  
  fs.writeFileSync(OUTPUT_FILE, ndjson, "utf8")
  console.log(`✅ Migration Dry-Run Complete!`)
  console.log(`✅ Extracted ${authors.length} authors and ${posts.length} posts.`)
  console.log(`✅ Output written to: ${OUTPUT_FILE}`)
}

main()
