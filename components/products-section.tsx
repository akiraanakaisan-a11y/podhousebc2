"use client"

import { useState, useEffect } from "react"
import { ProductCard } from "@/components/product-card"
import { Spinner } from "@/components/ui/spinner"

const categorias = [
  { id: "todos", nome: "Todos" },
  { id: "ignite", nome: "Ignite" },
  { id: "elfbar", nome: "Elf Bar" },
  { id: "blacksheep", nome: "Black Sheep" },
]

interface Flavor {
  id: number
  flavor_pt: string
  flavor_en: string
  stock_quantity: number
}

interface Product {
  id: string
  name: string
  brand: string
  price: number
  capacity: string
  image_url: string
  stock_quantity: number
  product_flavors: Flavor[]
}

export function ProductsSection() {
  const [categoriaAtiva, setCategoriaAtiva] = useState("todos")
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [language, setLanguage] = useState<"pt" | "en">("pt")

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.products || [])
        setLoading(false)
      })
      .catch((error) => {
        console.error("[v0] Erro ao carregar produtos:", error)
        setLoading(false)
      })
  }, [])

  const produtosFiltrados = products.filter((produto) => {
    if (categoriaAtiva === "todos") return true
    if (categoriaAtiva === "ignite") return produto.brand.toLowerCase().includes("ignite")
    if (categoriaAtiva === "elfbar") return produto.brand.toLowerCase().includes("elf")
    if (categoriaAtiva === "blacksheep") return produto.brand.toLowerCase().includes("black")
    return true
  })

  if (loading) {
    return (
      <section id="produtos" className="py-12 bg-zinc-950">
        <div className="flex items-center justify-center min-h-[400px]">
          <Spinner className="h-8 w-8 text-orange-500" />
        </div>
      </section>
    )
  }

  return (
    <section id="produtos" className="py-12 bg-zinc-950">
      <div className="px-4">
        <div className="text-center mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1" />
            <h2 className="text-2xl font-bold text-white">Nossos Produtos</h2>
            <div className="flex-1 flex justify-end">
              <button
                onClick={() => setLanguage(language === "pt" ? "en" : "pt")}
                className="text-xs bg-zinc-800 text-zinc-300 px-3 py-1.5 rounded-full hover:bg-zinc-700 transition-colors border border-zinc-700"
                title={language === "pt" ? "Switch to English" : "Mudar para Português"}
              >
                {language === "pt" ? "🇧🇷 PT" : "🇺🇸 EN"}
              </button>
            </div>
          </div>
          <p className="text-zinc-400 text-sm">Clique no produto para ver todos os sabores disponíveis.</p>
        </div>

        {/* Filtros horizontais com scroll */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
          {categorias.map((categoria) => (
            <button
              key={categoria.id}
              onClick={() => setCategoriaAtiva(categoria.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                categoriaAtiva === categoria.id
                  ? "bg-sunset text-white"
                  : "bg-zinc-800 text-zinc-400 border border-zinc-700 active:border-orange-500"
              }`}
            >
              {categoria.nome}
            </button>
          ))}
        </div>

        {/* Grid de produtos 2 colunas no mobile */}
        <div className="grid grid-cols-2 gap-3">
          {produtosFiltrados.map((produto) => (
            <ProductCard key={produto.id} product={produto} language={language} />
          ))}
        </div>
      </div>
    </section>
  )
}
