import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronDown, Instagram, Truck } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative min-h-[85vh] flex items-center justify-center bg-gradient-to-b from-zinc-900 via-zinc-900 to-zinc-950 pt-14">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl" />
      </div>

      <div className="px-4 relative z-10 w-full">
        <div className="flex flex-col items-center text-center">
          <div className="relative w-48 h-48 mb-6">
            <Image src="/logopodhouse.jpg" alt="PodHouse BC" fill className="object-contain rounded-3xl" priority />
          </div>

          <h1 className="text-3xl font-bold text-white mb-4 leading-tight">
            Os Melhores <span className="text-sunset">Pods</span> de Balneário Camboriú
          </h1>
          <p className="text-base text-zinc-400 mb-6 max-w-sm">
            Produtos originais das melhores marcas: Ignite, Elf Bar, Black Sheep e muito mais.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
            <Button
              asChild
              size="lg"
              className="bg-sunset active:bg-sunset-hover text-white font-semibold px-8 flex-1 h-12"
            >
              <Link href="#produtos">Ver Produtos</Link>
            </Button>

            {/* TAREFA 1: Botão do Instagram em destaque */}
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-pink-500/50 bg-pink-500/10 text-pink-400 active:bg-pink-500/20 px-8 h-12"
            >
              <Link href="https://www.instagram.com/podhousebc/" target="_blank" rel="noopener noreferrer">
                <Instagram className="h-5 w-5 mr-2" />
                @podhousebc
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <Link
        href="#produtos"
        className="absolute bottom-6 left-1/2 -translate-x-1/2 text-zinc-500 active:text-orange-400 animate-bounce"
      >
        <ChevronDown className="h-7 w-7" />
      </Link>
    </section>
  )
}
