"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Trash2, Plus, Minus, ShoppingBag, MessageCircle, AlertCircle } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { useCartStore } from "@/lib/cart-store"

const WHATSAPP_NUMBER = "5547999892801"
const HORARIO_ABERTURA = 10
const HORARIO_ENCOMENDA_LIMITE = 13

export default function CarrinhoPage() {
  const [mounted, setMounted] = useState(false)
  const [zipCode, setZipCode] = useState("")
  const [addressNumber, setAddressNumber] = useState("")
  const [freight, setFreight] = useState<{
    value: number
    days: number
    method: string
    isFree: boolean
  } | null>(null)
  const [calculatingFreight, setCalculatingFreight] = useState(false)
  const [freightError, setFreightError] = useState("")

  const { itens, removerItem, atualizarQuantidade, limparCarrinho, getTotal } = useCartStore()

  useEffect(() => {
    setMounted(true)
  }, [])

  const calculateFreight = async () => {
    if (!zipCode || zipCode.replace(/\D/g, "").length !== 8) {
      setFreightError("Digite um CEP válido")
      return
    }

    setCalculatingFreight(true)
    setFreightError("")

    try {
      const response = await fetch("/api/freight", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ zipCode, items: itens }),
      })

      const data = await response.json()

      if (response.ok) {
        setFreight(data.freight)
      } else {
        setFreightError(data.error || "Erro ao calcular frete")
      }
    } catch (error) {
      console.error("[v0] Erro ao calcular frete:", error)
      setFreightError("Erro ao calcular frete")
    } finally {
      setCalculatingFreight(false)
    }
  }

  const formatZipCode = (value: string) => {
    const numbers = value.replace(/\D/g, "")
    if (numbers.length <= 5) return numbers
    return `${numbers.slice(0, 5)}-${numbers.slice(5, 8)}`
  }

  const canFinalize = zipCode && addressNumber && freight

  const subtotal = getTotal()
  const freightValue = freight?.value || 0
  const total = subtotal + freightValue

  const gerarMensagemWhatsApp = () => {
    let mensagem = "🛒 *NOVO PEDIDO*\n\n"

    itens.forEach((item, index) => {
      mensagem += `${index + 1}. ${item.nome}\n`
      mensagem += `   Sabor: ${item.sabor}\n`
      mensagem += `   Qtd: ${item.quantidade}x\n`
      mensagem += `   Preço: R$ ${(item.preco * item.quantidade).toFixed(2).replace(".", ",")}\n\n`
    })

    mensagem += `━━━━━━━━━━━━━━━━\n`
    mensagem += `Subtotal: R$ ${subtotal.toFixed(2).replace(".", ",")}\n`
    mensagem += `Frete (${freight?.method || ""}): R$ ${freightValue.toFixed(2).replace(".", ",")}\n`
    mensagem += `*TOTAL: R$ ${total.toFixed(2).replace(".", ",")}*\n\n`
    
    mensagem += `📍 *ENDEREÇO DE ENTREGA:*\n`
    mensagem += `CEP: ${zipCode}\n`
    mensagem += `Número: ${addressNumber}\n\n`
    
    mensagem += `Aguardo confirmação!`

    return encodeURIComponent(mensagem)
  }

  const handleFinalizarPedido = () => {
    const mensagem = gerarMensagemWhatsApp()
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${mensagem}`, "_blank")
  }

  if (!mounted) {
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

  return (
    <main className="min-h-screen bg-zinc-950 text-white pb-8">
      <Header />

      <div className="px-4 pt-20">
        <Link
          href="/#produtos"
          className="inline-flex items-center gap-2 text-zinc-400 hover:text-orange-400 transition-colors mb-6 text-sm"
        >
          <ArrowLeft className="h-4 w-4" />
          Continuar comprando
        </Link>

        <h1 className="text-2xl font-bold text-white mb-6">Seu Carrinho</h1>

        {itens.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingBag className="h-14 w-14 text-zinc-600 mx-auto mb-4" />
            <p className="text-zinc-400 text-base mb-6">Seu carrinho está vazio</p>
            <Button asChild className="bg-sunset hover:bg-sunset-hover text-white w-full max-w-xs">
              <Link href="/#produtos">Ver Produtos</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Lista de itens */}
            <div className="space-y-3">
              {itens.map((item) => (
                <div key={item.id} className="bg-zinc-900 rounded-xl p-3 border border-zinc-800 flex gap-3">
                  <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-zinc-800 flex-shrink-0">
                    <Image src={item.imagem || "/placeholder.svg"} alt={item.nome} fill className="object-cover" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-white truncate">{item.nome}</h3>
                    <p className="text-xs text-zinc-400 truncate">Sabor: {item.sabor}</p>
                    <p className="text-orange-400 font-semibold text-sm mt-1">
                      R$ {item.preco.toFixed(2).replace(".", ",")}
                    </p>

                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => atualizarQuantidade(item.id, Math.max(1, item.quantidade - 1))}
                          className="w-7 h-7 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-white active:bg-zinc-700"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="text-white font-medium w-6 text-center text-sm">{item.quantidade}</span>
                        <button
                          onClick={() => atualizarQuantidade(item.id, item.quantidade + 1)}
                          className="w-7 h-7 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-white active:bg-zinc-700"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => removerItem(item.id)}
                        className="p-2 text-red-400 active:text-red-300 rounded-lg"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              <button onClick={limparCarrinho} className="text-xs text-zinc-500 active:text-red-400 transition-colors">
                Limpar carrinho
              </button>
            </div>

            {/* Formulário de CEP e Endereço */}
            <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800 space-y-4">
              <h2 className="text-lg font-semibold text-white">Informações de Entrega</h2>

              <div className="space-y-3">
                <div>
                  <label className="text-sm text-zinc-400 block mb-2">CEP</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="00000-000"
                      maxLength={9}
                      value={zipCode}
                      onChange={(e) => setZipCode(formatZipCode(e.target.value))}
                      className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm placeholder:text-zinc-500 focus:outline-none focus:border-orange-500"
                    />
                    <Button
                      onClick={calculateFreight}
                      disabled={calculatingFreight}
                      className="bg-orange-600 hover:bg-orange-700 text-white px-4 text-sm"
                    >
                      {calculatingFreight ? "..." : "Calcular"}
                    </Button>
                  </div>
                  {freightError && <p className="text-xs text-red-400 mt-1">{freightError}</p>}
                </div>

                {freight && (
                  <div className="bg-zinc-800/50 rounded-lg p-3 border border-zinc-700">
                    <p className="text-sm text-white font-medium">{freight.method}</p>
                    <p className="text-xs text-zinc-400">Entrega em até {freight.days} dia(s) útil(eis)</p>
                    <p className="text-sm font-semibold text-orange-400 mt-1">
                      {freight.isFree ? "GRÁTIS" : `R$ ${freight.value.toFixed(2).replace(".", ",")}`}
                    </p>
                  </div>
                )}

                <div>
                  <label className="text-sm text-zinc-400 block mb-2">Número da Residência</label>
                  <input
                    type="text"
                    placeholder="Ex: 123"
                    value={addressNumber}
                    onChange={(e) => setAddressNumber(e.target.value)}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm placeholder:text-zinc-500 focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              {!freight && (
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 flex gap-2">
                  <AlertCircle className="h-5 w-5 text-yellow-500 flex-shrink-0" />
                  <p className="text-sm text-yellow-200">Informe o CEP para calcular o frete</p>
                </div>
              )}

              {freight && !addressNumber && (
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 flex gap-2">
                  <AlertCircle className="h-5 w-5 text-yellow-500 flex-shrink-0" />
                  <p className="text-sm text-yellow-200">Informe o número da residência</p>
                </div>
              )}
            </div>

            {/* Resumo Final */}
            <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800 space-y-4">
              <h2 className="text-lg font-semibold text-white">Resumo do Pedido</h2>

              <div className="space-y-2">
                <div className="flex justify-between text-sm text-zinc-400">
                  <span>Subtotal ({itens.length} item)</span>
                  <span>R$ {subtotal.toFixed(2).replace(".", ",")}</span>
                </div>
                <div className="flex justify-between text-sm text-zinc-400">
                  <span>Frete</span>
                  <span>{freight ? `R$ ${freight.value.toFixed(2).replace(".", ",")}` : "Pendente"}</span>
                </div>
                <div className="border-t border-zinc-800 pt-2">
                  <div className="flex justify-between text-white font-semibold">
                    <span>Total</span>
                    <span className="text-orange-400 text-lg">
                      R$ {total.toFixed(2).replace(".", ",")}
                    </span>
                  </div>
                </div>
              </div>

              {/* Botões de Ação */}
              <div className="space-y-2">
                <Button
                  onClick={handleFinalizarPedido}
                  disabled={!canFinalize}
                  className="w-full h-12 bg-green-500 hover:bg-green-600 disabled:bg-zinc-700 disabled:text-zinc-500 text-white font-semibold"
                >
                  <MessageCircle className="h-5 w-5 mr-2" />
                  Finalizar Pedido via WhatsApp
                </Button>

                <Button
                  onClick={() => {
                    const mensagem = gerarMensagemEncomenda()
                    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${mensagem}`, "_blank")
                  }}
                  variant="outline"
                  className="w-full h-12 border-orange-500/30 text-orange-400 hover:bg-orange-500/10"
                >
                  📦 Encomendar Outro Modelo
                </Button>
              </div>

              <p className="text-xs text-zinc-500 text-center">
                Horário de atendimento: 10h às 22h | Encomendas 10h-13h = entrega hoje
              </p>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </main>
  )
}

function gerarMensagemEncomenda() {
  let mensagem = "🎁 *SOLICITAR ENCOMENDA DE OUTRO MODELO*\n\n"
  mensagem += `Olá! Gostaria de fazer encomenda de um produto que vocês não têm em estoque.\n\n`
  mensagem += `Qual é o modelo e sabor que desejo?\n`
  
  return encodeURIComponent(mensagem)
}
