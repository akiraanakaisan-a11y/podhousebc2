"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useParams } from "next/navigation"
import { ArrowLeft, Plus, Minus, ShoppingCart, Check } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { getProductById, type Product } from "@/lib/products-data"
import { useCartStore } from "@/lib/cart-store"

export default function ProductPage() {
  const params = useParams()
  const id = params.id as string

  const [produto, setProduto] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [saborSelecionado, setSaborSelecionado] = useState<string>("")
  const [quantidade, setQuantidade] = useState(1)
  const [adicionado, setAdicionado] = useState(false)

  const adicionarItem = useCartStore((state) => state.adicionarItem)

  useEffect(() => {
    if (id) {
      const p = getProductById(id)
      setProduto(p || null)
    }
    setLoading(false)
  }, [id])

  if (loading) {
    return (
      <main className="min-h-screen bg-zinc-950 text-white">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <p className="text-zinc-400">Carregando...</p>
        </div>
        <Footer />
      </main>
    )
  }

  if (!produto) {
    return (
      <main className="min-h-screen bg-zinc-950 text-white">
        <Header />
        <div className="px-4 pt-20 pb-8 text-center">
          <p className="text-zinc-400 text-lg mb-4">Produto não encontrado.</p>
          <Button asChild className="bg-sunset active:bg-sunset-hover text-white">
            <Link href="/">Voltar para a loja</Link>
          </Button>
        </div>
        <Footer />
      </main>
    )
  }

  const allSabores = [...produto.sabores]
  if (produto.saboresEspeciais) {
    Object.keys(produto.saboresEspeciais).forEach((sabor) => {
      if (!allSabores.includes(sabor)) {
        allSabores.push(sabor)
      }
    })
  }

  const precoFinal =
    produto.saboresEspeciais && saborSelecionado && produto.saboresEspeciais[saborSelecionado]
      ? produto.saboresEspeciais[saborSelecionado]
      : produto.preco

  const handleAdicionarCarrinho = () => {
    if (!saborSelecionado) {
      alert("Por favor, selecione um sabor!")
      return
    }

    adicionarItem({
      produtoId: produto.id,
      nome: produto.nome,
      sabor: saborSelecionado,
      quantidade: quantidade,
      preco: precoFinal,
      imagem: produto.imagem,
    })

    setAdicionado(true)
    setTimeout(() => setAdicionado(false), 2000)
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <Header />

      <div className="px-4 pt-20 pb-8">
        <Link
          href="/#produtos"
          className="inline-flex items-center gap-2 text-zinc-400 active:text-orange-400 transition-colors mb-4 text-sm"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Link>

        {/* Imagem do produto */}
        <div className="relative aspect-square rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800 mb-4">
          <Image src={produto.imagem || "/placeholder.svg"} alt={produto.nome} fill className="object-cover" priority />
          {produto.destaque && (
            <Badge className="absolute top-3 left-3 bg-sunset text-white border-0 text-xs px-2 py-1">
              {produto.destaque}
            </Badge>
          )}
        </div>

        {/* Detalhes do produto */}
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold text-white mb-1">{produto.nome}</h1>
          <p className="text-zinc-400 text-sm mb-3">Capacidade: {produto.capacidade}</p>

          <div className="text-2xl font-bold text-orange-400 mb-6">R$ {precoFinal.toFixed(2).replace(".", ",")}</div>

          {/* Seleção de sabor */}
          <div className="mb-6">
            <h3 className="text-base font-semibold text-white mb-3">Escolha o sabor:</h3>
            <div className="grid grid-cols-2 gap-2">
              {allSabores.map((sabor) => {
                const precoEspecial = produto.saboresEspeciais?.[sabor]
                return (
                  <button
                    key={sabor}
                    onClick={() => setSaborSelecionado(sabor)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      saborSelecionado === sabor
                        ? "border-orange-500 bg-orange-500/10 text-white"
                        : "border-zinc-700 bg-zinc-800/50 text-zinc-300 active:border-zinc-600"
                    }`}
                  >
                    <span className="block text-xs font-medium leading-tight">{sabor}</span>
                    {precoEspecial && (
                      <span className="block text-xs text-green-400 mt-1">
                        R$ {precoEspecial.toFixed(2).replace(".", ",")}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Quantidade */}
          <div className="mb-6">
            <h3 className="text-base font-semibold text-white mb-3">Quantidade:</h3>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setQuantidade(Math.max(1, quantidade - 1))}
                className="w-10 h-10 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-white active:bg-zinc-700"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="text-xl font-semibold text-white w-10 text-center">{quantidade}</span>
              <button
                onClick={() => setQuantidade(quantidade + 1)}
                className="w-10 h-10 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-white active:bg-zinc-700"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Total */}
          <div className="bg-zinc-800/50 rounded-xl p-4 mb-4 border border-zinc-700">
            <div className="flex justify-between items-center">
              <span className="text-zinc-400">Total:</span>
              <span className="text-xl font-bold text-orange-400">
                R$ {(precoFinal * quantidade).toFixed(2).replace(".", ",")}
              </span>
            </div>
          </div>

          {/* Banner de encomendas - apenas informativo e simples */}
          <div className="bg-zinc-800/50 rounded-xl p-3 mb-4 border border-zinc-700 text-center">
            <p className="text-xs text-zinc-400">
              Não encontrou esse sabor em estoque? Faça uma encomenda pelo WhatsApp no carrinho.
            </p>
          </div>

          {/* Botões fixos no bottom */}
          <div className="flex flex-col gap-3">
            <Button
              onClick={handleAdicionarCarrinho}
              disabled={!saborSelecionado}
              className={`w-full h-12 text-base font-semibold ${
                adicionado ? "bg-green-500 active:bg-green-600" : "bg-sunset active:bg-sunset-hover"
              } text-white disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {adicionado ? (
                <>
                  <Check className="h-5 w-5 mr-2" />
                  Adicionado!
                </>
              ) : (
                <>
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Adicionar ao Carrinho
                </>
              )}
            </Button>

            <Button
              asChild
              variant="outline"
              className="w-full h-12 text-base font-semibold border-zinc-700 text-zinc-300 active:bg-zinc-800 bg-transparent"
            >
              <Link href="/carrinho">Ver Carrinho</Link>
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
