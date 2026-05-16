import { getPostsByCategory, getAllCategories } from "@/lib/blog"
import Header from "@/app/components/Header"
import Footer from "@/app/components/Footer"
import Link from "next/link"
import { Clock, ChevronRight } from "lucide-react"

export async function generateStaticParams() {
  const categories = getAllCategories()
  return categories.map((cat) => ({
    categoria: cat,
  }))
}

export async function generateMetadata({ params }) {
  const { categoria } = await params
  const formatName = categoria.replace("-", " ").replace(/\b\w/g, l => l.toUpperCase())

  return {
    title: `Artículos sobre ${formatName}`,
    description: `Descubre nuestros mejores consejos y análisis financieros sobre ${formatName}.`,
    alternates: {
      canonical: `/blog/${categoria}`,
    },
  }
}

export default async function CategoryPage({ params }) {
  const { categoria } = await params
  const posts = getPostsByCategory(categoria)
  const formatName = categoria.replace("-", " ").replace(/\b\w/g, l => l.toUpperCase())

  return (
    <div className="min-h-screen flex flex-col">
      <Header activeLink="Blog" />

      <main className="flex-1 bg-surface-100">
        {/* Breadcrumbs */}
        <div className="bg-white border-b border-surface-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-2 text-xs font-semibold text-navy-500 uppercase tracking-wider">
            <Link href="/" className="hover:text-teal-600">Inicio</Link>
            <ChevronRight size={14} />
            <Link href="/blog" className="hover:text-teal-600">Blog</Link>
            <ChevronRight size={14} />
            <span className="text-navy-800">{formatName}</span>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-navy-900 mb-4">{formatName}</h1>
            <p className="text-lg text-navy-600 max-w-2xl">
              Explora todos nuestros artículos relacionados con {formatName.toLowerCase()} y toma el control de tus finanzas.
            </p>
          </div>

          {posts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-navy-500">No hay artículos publicados en esta categoría todavía.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <Link key={post.slug} href={`/blog/${post.category}/${post.slug}`} className="group block bg-white rounded-3xl p-5 border border-surface-300 shadow-sm hover:shadow-md transition-all">
                  <div className="w-full h-48 bg-surface-300 rounded-2xl overflow-hidden mb-5">
                    <img 
                      src={post.frontmatter.image} 
                      alt={post.frontmatter.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="flex items-center gap-1 text-xs font-medium text-navy-500">
                      <Clock size={12} /> {post.frontmatter.readingTime}
                    </span>
                  </div>
                  <h4 className="text-xl font-bold text-navy-900 leading-snug mb-3 group-hover:text-teal-600 transition-colors line-clamp-2">
                    {post.frontmatter.title}
                  </h4>
                  <p className="text-sm text-navy-600 line-clamp-2">
                    {post.frontmatter.description}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
