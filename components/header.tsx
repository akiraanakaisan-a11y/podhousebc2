"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu, X, ShoppingCart } from "lucide-react"
import { useCartStore } from "@/lib/cart-store"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const getTotalItens = useCartStore((state) => state.getTotalItens)

  useEffect(() => {
    setMounted(true)
  }, [])

  const totalItens = mounted ? getTotalItens() : 0

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-zinc-900/95 backdrop-blur-md border-b border-zinc-800">
      <div className="px-4">
        <div className="flex items-center justify-between h-14">
          <Link href="/" className="flex items-center gap-2">
            <img src="/logopodhouse.jpg" alt="PodHouse BC" className="w-9 h-9 rounded-lg object-cover" />
            <span className="text-lg font-bold tracking-tight text-white">
              PodHouse<span className="text-sunset">BC</span>
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <Link href="/carrinho" className="relative p-2 text-zinc-400 active:text-white">
              <ShoppingCart className="h-6 w-6" />
              {totalItens > 0 && (
                <span className="absolute -top-1 -right-1 bg-sunset text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItens}
                </span>
              )}
            </Link>
            <button className="p-2" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu">
              {isMenuOpen ? <X className="h-6 w-6 text-white" /> : <Menu className="h-6 w-6 text-white" />}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="bg-zinc-900 border-t border-zinc-800">
          <nav className="px-4 py-4 flex flex-col gap-4">
            <Link
              href="/"
              className="text-base font-medium text-zinc-400 active:text-white transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Início
            </Link>
            <Link
              href="/#produtos"
              className="text-base font-medium text-zinc-400 active:text-white transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Produtos
            </Link>
            <Link
              href="/#sobre"
              className="text-base font-medium text-zinc-400 active:text-white transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Sobre
            </Link>
            <Link
              href="/chat"
              className="text-base font-medium text-zinc-400 active:text-white transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Chat
            </Link>
            <Link
              href="/carrinho"
              className="text-base font-medium text-zinc-400 active:text-white transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Carrinho
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
