import fs from "fs"
import path from "path"
import matter from "gray-matter"
import readingTime from "reading-time"

const CONTENT_DIR = path.join(process.cwd(), "src/content")
const BLOG_DIR = path.join(CONTENT_DIR, "blog")
const AUTHORS_DIR = path.join(CONTENT_DIR, "authors")

/**
 * Recupera todos los posts del sistema de archivos.
 * Extrae la categoría de la carpeta contenedora.
 */
export function getAllPosts() {
  if (!fs.existsSync(BLOG_DIR)) return []

  const categories = fs.readdirSync(BLOG_DIR)
  const allPosts = []

  categories.forEach((category) => {
    const categoryPath = path.join(BLOG_DIR, category)
    
    // Ignorar si no es directorio
    if (!fs.statSync(categoryPath).isDirectory()) return

    const files = fs.readdirSync(categoryPath).filter(file => file.endsWith('.mdx') || file.endsWith('.md'))

    files.forEach((file) => {
      const slug = file.replace(/\.mdx?$/, "")
      const filePath = path.join(categoryPath, file)
      const fileContent = fs.readFileSync(filePath, "utf-8")
      const { data, content } = matter(fileContent)
      
      // Ignorar posts en borrador
      if (data.draft) return

      allPosts.push({
        slug,
        category,
        frontmatter: {
          ...data,
          readingTime: readingTime(content).text,
        },
        content
      })
    })
  })

  // Ordenar por fecha de publicación descendente
  return allPosts.sort((a, b) => new Date(b.frontmatter.publishedAt) - new Date(a.frontmatter.publishedAt))
}

/**
 * Obtiene un post específico por su categoría y slug.
 */
export function getPostBySlug(category, slug) {
  const filePath = path.join(BLOG_DIR, category, `${slug}.mdx`)
  
  if (!fs.existsSync(filePath)) {
    // Intentar con .md
    const fallbackPath = path.join(BLOG_DIR, category, `${slug}.md`)
    if (!fs.existsSync(fallbackPath)) return null
    return parseFile(fallbackPath, slug, category)
  }

  return parseFile(filePath, slug, category)
}

function parseFile(filePath, slug, category) {
  const fileContent = fs.readFileSync(filePath, "utf-8")
  const { data, content } = matter(fileContent)

  return {
    slug,
    category,
    frontmatter: {
      ...data,
      readingTime: readingTime(content).text,
    },
    content,
  }
}

/**
 * Obtiene todos los posts de una categoría específica.
 */
export function getPostsByCategory(category) {
  const allPosts = getAllPosts()
  return allPosts.filter(post => post.category === category)
}

/**
 * Obtiene la información del autor desde su archivo JSON.
 */
export function getAuthor(id) {
  const filePath = path.join(AUTHORS_DIR, `${id}.json`)
  if (!fs.existsSync(filePath)) return null
  
  const content = fs.readFileSync(filePath, "utf-8")
  return JSON.parse(content)
}

/**
 * Obtiene la lista única de categorías.
 */
export function getAllCategories() {
  const posts = getAllPosts()
  const categories = new Set(posts.map(post => post.category))
  return Array.from(categories)
}
