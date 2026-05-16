
import Header from "./components/Header"
import Hero from "./components/Hero"
import TrustBadges from "./components/TrustBadges"
import Features from "./components/Features"
import TopLoans from "./components/TopLoans"
import Footer from "./components/Footer"

export default function Home() {

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <Hero />
        <TrustBadges />
        <Features />
        <TopLoans />
      </main>

      <Footer />
    </div>
  )
}
