import Link from "next/link"
import { Instagram, MessageCircle } from "lucide-react"

const WHATSAPP_NUMBER = "5547999892801"

export function Footer() {
  return (
    <footer id="contato" className="py-8 bg-zinc-900 border-t border-zinc-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-6">
          <Link href="/" className="inline-block mb-3">
            <span className="text-xl font-bold tracking-tight text-white">
              PodHouse<span className="text-sunset">BC</span>
            </span>
          </Link>
          <p className="text-xs text-zinc-400 leading-relaxed max-w-xs mx-auto">
            A melhor seleção de pods descartáveis de Balneário Camboriú.
          </p>
        </div>

        <div className="flex justify-center gap-4 mb-6">
          <a
            href="https://www.instagram.com/podhousebc/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 active:bg-sunset active:text-white transition-colors"
          >
            <Instagram className="h-5 w-5" />
          </a>
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 active:bg-green-500 active:text-white transition-colors"
          >
            <MessageCircle className="h-5 w-5" />
          </a>
        </div>

        <div className="text-center pt-4 border-t border-zinc-800">
          <p className="text-xs text-zinc-500">{new Date().getFullYear()} PodHouse BC</p>
          <p className="text-[10px] text-zinc-600 mt-1">Venda proibida para menores de 18 anos.</p>
        </div>
      </div>
    </footer>
  )
}
