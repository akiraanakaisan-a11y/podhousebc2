import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { EncomendasBanner } from "@/components/encomendas-banner"
import { ProductsSection } from "@/components/products-section"
import { AboutSection } from "@/components/about-section"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <Header />
      <HeroSection />
      <EncomendasBanner />
      <ProductsSection />
      <AboutSection />
      <Footer />
    </main>
  )
}
