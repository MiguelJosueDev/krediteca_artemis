import { getAllPosts, getPostBySlug, getAuthor } from "@/lib/blog"
import { notFound } from "next/navigation"
import { MDXRemote } from "next-mdx-remote/rsc"
import { MDXComponents } from "@/app/components/mdx"
import Header from "@/app/components/Header"
import Footer from "@/app/components/Footer"
import { BadgeCheck, Calendar, Clock, ChevronRight } from "lucide-react"
import Link from "next/link"

// 1. generateStaticParams para SSG 100% estático
export async function generateStaticParams() {
  const posts = getAllPosts()
  return posts.map((post) => ({
    categoria: post.category,
    slug: post.slug,
  }))
}

// 2. generateMetadata para SEO
export async function generateMetadata({ params }) {
  const { categoria, slug } = await params
  const post = getPostBySlug(categoria, slug)

  if (!post) return {}

  const { title, description, image, publishedAt, updatedAt, author: authorId } = post.frontmatter
  const author = getAuthor(authorId)

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime: publishedAt,
      modifiedTime: updatedAt || publishedAt,
      authors: author ? [author.name] : [],
      images: [image],
    },
    alternates: {
      canonical: `/blog/${categoria}/${slug}`,
    },
  }
}

// 3. Page Component
export default async function BlogPostPage({ params }) {
  const { categoria, slug } = await params
  const post = getPostBySlug(categoria, slug)

  if (!post) notFound()

  const { frontmatter, content } = post
  const author = getAuthor(frontmatter.author)
  const reviewer = frontmatter.reviewedBy ? getAuthor(frontmatter.reviewedBy) : author

  // -- YMYL SCHEMA INJECTION (JSON-LD) --
  // Article Schema
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: frontmatter.title,
    image: frontmatter.image,
    datePublished: frontmatter.publishedAt,
    dateModified: frontmatter.updatedAt || frontmatter.publishedAt,
    author: author ? {
      "@type": "Person",
      name: author.name,
      url: author.linkedin || `https://krediteca.com/autores/${frontmatter.author}`,
      jobTitle: author.role
    } : undefined,
    publisher: {
      "@type": "Organization",
      name: "Krediteca",
      logo: {
        "@type": "ImageObject",
        url: "https://krediteca.com/krediteca_logo_navbar.png"
      }
    },
    reviewedBy: reviewer ? {
      "@type": "Person",
      name: reviewer.name,
      url: reviewer.linkedin || `https://krediteca.com/autores/${frontmatter.reviewedBy}`,
    } : undefined
  }

  // Breadcrumb Schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: "https://krediteca.com" },
      { "@type": "ListItem", position: 2, name: "Blog", item: "https://krediteca.com/blog" },
      { "@type": "ListItem", position: 3, name: categoria, item: `https://krediteca.com/blog/${categoria}` },
      { "@type": "ListItem", position: 4, name: frontmatter.title, item: `https://krediteca.com/blog/${categoria}/${slug}` }
    ]
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header activeLink="Blog" />

      {/* Inject Schema */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <main className="flex-1 bg-surface-100 pb-24">
        {/* Breadcrumbs UI */}
        <div className="bg-white border-b border-surface-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-2 text-xs font-semibold text-navy-500 uppercase tracking-wider overflow-x-auto">
            <Link href="/" className="hover:text-teal-600 shrink-0">Inicio</Link>
            <ChevronRight size={14} className="shrink-0" />
            <Link href="/blog" className="hover:text-teal-600 shrink-0">Blog</Link>
            <ChevronRight size={14} className="shrink-0" />
            <Link href={`/blog/${categoria}`} className="hover:text-teal-600 shrink-0">{categoria}</Link>
          </div>
        </div>

        <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 lg:pt-16">
          <header className="mb-10 text-center sm:text-left">
            <h1 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-bold text-navy-900 leading-tight tracking-tight mb-6">
              {frontmatter.title}
            </h1>

            {/* Author & E-E-A-T Info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 py-6 border-t border-b border-surface-300/60">
              {author && (
                <div className="flex items-center gap-4 text-left">
                  <div className="w-12 h-12 rounded-full bg-surface-300 overflow-hidden shrink-0 shadow-sm">
                    <img src={author.avatar} alt={author.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-navy-900 text-sm">{author.name}</span>
                      <BadgeCheck size={16} className="text-teal-600" />
                    </div>
                    <p className="text-xs text-navy-500 mt-0.5">{author.role}</p>
                  </div>
                </div>
              )}

              <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs font-medium text-navy-500">
                <div className="flex items-center gap-1.5">
                  <Calendar size={14} />
                  Actualizado: {new Date(frontmatter.updatedAt || frontmatter.publishedAt).toLocaleDateString('es-MX', { year: 'numeric', month: 'short', day: 'numeric' })}
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock size={14} />
                  {frontmatter.readingTime}
                </div>
              </div>
            </div>
          </header>

          {/* Featured Image */}
          {frontmatter.image && (
            <figure className="mb-12">
              <div className="w-full aspect-[21/9] sm:aspect-[2/1] bg-surface-300 rounded-3xl overflow-hidden shadow-sm">
                <img 
                  src={frontmatter.image} 
                  alt={frontmatter.title} 
                  className="w-full h-full object-cover"
                />
              </div>
            </figure>
          )}

          {/* MDX Content rendered as Server Components */}
          <div className="prose prose-navy prose-lg max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-teal-600 prose-a:font-semibold hover:prose-a:text-teal-700">
            <MDXRemote source={content} components={MDXComponents} />
          </div>

          {/* Tags */}
          {frontmatter.tags && (
            <div className="flex flex-wrap gap-2 mt-12 pt-8 border-t border-surface-300">
              {frontmatter.tags.map(tag => (
                <span key={tag} className="px-4 py-2 bg-surface-200 text-navy-700 text-xs font-semibold rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </article>
      </main>

      <Footer />
    </div>
  )
}
