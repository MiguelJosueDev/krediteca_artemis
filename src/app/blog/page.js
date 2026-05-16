import Header from "../components/Header"
import Footer from "../components/Footer"
import { BadgeCheck, Calculator, ChevronRight, Calendar, Clock } from "lucide-react"
import Link from "next/link"
import { getAllPosts, getAuthor } from "@/lib/blog"

export default async function BlogPostPage() {
  const posts = getAllPosts()
  const latestPost = posts[0]
  const otherPosts = posts.slice(1)

  return (
    <div className="min-h-screen flex flex-col">
      <Header activeLink="Blog" />

      <main className="flex-1 bg-surface-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-navy-900 mb-4">Blog Financiero</h1>
            <p className="text-lg text-navy-600 max-w-2xl">Aprende a tomar mejores decisiones financieras con nuestras guías, análisis y comparativas de mercado.</p>
          </div>

          <div className="flex flex-col lg:flex-row gap-10 xl:gap-16 items-start">
            
            {/* ── Main Content ── */}
            <article className="flex-1 min-w-0 max-w-3xl">
              
              {latestPost && (
                <div className="mb-16">
                  <h2 className="text-xs font-bold text-navy-500 uppercase tracking-wider mb-6">Último Artículo</h2>
                  <Link href={`/blog/${latestPost.category}/${latestPost.slug}`} className="group block">
                    <figure className="mb-6">
                      <div className="w-full h-64 sm:h-80 bg-surface-300 rounded-3xl overflow-hidden shadow-sm">
                        <img 
                          src={latestPost.frontmatter.image} 
                          alt={latestPost.frontmatter.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    </figure>
                    <div>
                      <div className="flex items-center gap-3 mb-3">
                        <span className="bg-navy-100 text-navy-800 text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md">
                          {latestPost.category.replace("-", " ")}
                        </span>
                        <span className="flex items-center gap-1 text-xs font-medium text-navy-500">
                          <Clock size={12} /> {latestPost.frontmatter.readingTime}
                        </span>
                      </div>
                      <h3 className="text-2xl sm:text-3xl font-bold text-navy-900 leading-tight mb-3 group-hover:text-teal-600 transition-colors">
                        {latestPost.frontmatter.title}
                      </h3>
                      <p className="text-navy-600 leading-relaxed mb-4 line-clamp-3">
                        {latestPost.frontmatter.description}
                      </p>
                      <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-teal-600">
                        Leer artículo completo <ChevronRight size={16} />
                      </span>
                    </div>
                  </Link>
                </div>
              )}

              {/* Grid of older posts */}
              {otherPosts.length > 0 && (
                <div>
                  <h2 className="text-xs font-bold text-navy-500 uppercase tracking-wider mb-6">Más Artículos</h2>
                  <div className="grid sm:grid-cols-2 gap-8">
                    {otherPosts.map((post) => (
                      <Link key={post.slug} href={`/blog/${post.category}/${post.slug}`} className="group block">
                        <div className="w-full h-48 bg-surface-300 rounded-2xl overflow-hidden shadow-sm mb-4">
                          <img 
                            src={post.frontmatter.image} 
                            alt={post.frontmatter.title} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-[10px] font-bold text-teal-600 uppercase tracking-wider">
                            {post.category.replace("-", " ")}
                          </span>
                        </div>
                        <h4 className="text-lg font-bold text-navy-900 leading-snug mb-2 group-hover:text-teal-600 transition-colors line-clamp-2">
                          {post.frontmatter.title}
                        </h4>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

            </article>

            {/* ── Right Sidebar (Widgets) ── */}
            <aside className="hidden xl:block w-[300px] shrink-0 space-y-6 sticky top-28">
              
              {/* Simulator CTA Widget */}
              <div className="bg-gradient-to-b from-teal-50 to-surface-100 rounded-3xl p-7 border border-teal-100/50 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/5 rounded-full -mr-10 -mt-10 blur-2xl transition-transform group-hover:scale-150 duration-700"></div>
                <div className="relative z-10">
                  <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center mb-6">
                    <Calculator size={24} className="text-navy-900" />
                  </div>
                  <h3 className="text-lg font-bold text-navy-900 mb-3">
                    Simula tu próximo préstamo
                  </h3>
                  <p className="text-sm text-navy-600 leading-relaxed mb-6">
                    Calcula tus cuotas con transparencia total, sin impacto en tu historial.
                  </p>
                  <a 
                    href="/#calculadoras" 
                    className="w-full flex items-center justify-center bg-teal-700 hover:bg-teal-800 text-white text-sm font-semibold py-3 rounded-xl transition-colors"
                  >
                    Usar Calculadora
                  </a>
                </div>
              </div>

              {/* Related Articles Widget */}
              <div className="bg-white rounded-3xl p-7 border border-surface-300/60 shadow-card">
                <h3 className="text-base font-bold text-navy-900 mb-5">
                  Artículos Relacionados
                </h3>
                <div className="space-y-5">
                  <a href="#" className="block group">
                    <h4 className="text-sm font-semibold text-navy-800 group-hover:text-teal-600 transition-colors line-clamp-2 mb-1.5 leading-snug">
                      Las 5 mejores tarjetas para iniciar tu historial
                    </h4>
                    <p className="text-[11px] text-navy-500">Leer en 4 min</p>
                  </a>
                  <div className="h-px bg-surface-200"></div>
                  <a href="#" className="block group">
                    <h4 className="text-sm font-semibold text-navy-800 group-hover:text-teal-600 transition-colors line-clamp-2 mb-1.5 leading-snug">
                      ¿Qué es el CAT y cómo afecta tus deudas?
                    </h4>
                    <p className="text-[11px] text-navy-500">Leer en 6 min</p>
                  </a>
                </div>
              </div>

            </aside>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
