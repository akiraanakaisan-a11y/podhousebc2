"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Send } from "lucide-react"

type Message = {
  id: string
  role: "user" | "assistant"
  content: string
}

type ConversationState = {
  step:
    | "greeting"
    | "browsing"
    | "product_selected"
    | "confirming_quantity"
    | "requesting_address"
    | "showing_total"
    | "sending_pix"
    | "awaiting_payment"
  selectedProduct?: string
  selectedFlavor?: string
  quantity?: number
  address?: string
  total?: number
}

const PRODUCTS = {
  "ignite v80": { price: 104, ml: "12ml", flavors: ["Manga Lima", "Maracujá Kiwi", "Frutas Cítricas e Menta"] },
  "ignite v300": {
    price: 132,
    ml: "18ml",
    flavors: [
      "Abacaxi Ice",
      "Maçã Verde",
      "Manga Abacaxi",
      "Uva Ice",
      "Menta Ice",
      "Morango Kiwi",
      "Abacaxi Manga",
      "Morango Banana",
      "Melancia Mix",
      "Menta Melão",
    ],
  },
  "ignite v400": {
    price: 144,
    ml: "18ml",
    flavors: ["MixFlavor", "Uva & Pêssego", "Manga & Maracujá Kiwi", "Pêssego Melancia e Manga"],
  },
  "ignite v155": { price: 113, ml: "12ml", flavors: ["Banana Ice", "Maçã Verde"], extra: "(Lançamento Slim Design)" },
  "elfbar 30k": {
    price: 121,
    ml: "13ml",
    flavors: ["Tubinhos Fini", "Chiclete de Uva", "Maracujá Kiwi", "Morango Banana", "Maçã Verde"],
  },
  "elfbar 40k": { price: 129, ml: "20ml", flavors: ["Frutas Tropicais", "Cereja", "Maçã Verde", "Tubinhos Fino"] },
  "elfbar 23k": {
    price: 118,
    ml: "23ml",
    flavors: [
      "Pêssego Melancia Manga",
      "Melancia Ice",
      "Baja Splash",
      "Kiwi Pitaya",
      "Uva Ice",
      "Abacaxi Hortelã",
      "Morango Banana",
    ],
  },
  "elfbar 23k eco": {
    price: 110,
    ml: "23ml",
    flavors: ["Baja Splash", "Lime Grapefruit Ice"],
    extra: "(versão econômica)",
  },
  blacksheep: {
    price: 140,
    ml: "26ml",
    flavors: ["Maracujá & Morango Melancia", "Uva & Maracujá", "Menta e Manga Laranja"],
    extra: "(Dual Tank)",
  },
  "ignite v55": { price: 99, ml: "", flavors: ["Menta Melão", "Melão Mix", "Uva", "Menta"] },
}

const DELIVERY_FEE = 18.9

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [state, setState] = useState<ConversationState>({ step: "greeting" })
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const addAssistantMessage = (content: string) => {
    setIsTyping(true)
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "assistant",
          content,
        },
      ])
      setIsTyping(false)
    }, 800)
  }

  const processMessage = (userMessage: string) => {
    const msg = userMessage.toLowerCase().trim()

    // Saudação inicial
    if (state.step === "greeting") {
      if (msg.match(/oi|olá|ola|hey|alo|bom dia|boa tarde|boa noite/)) {
        addAssistantMessage(
          "Olá! Bem-vindo(a) à PodHouseBC 😊\nEstamos aqui para ajudar com os melhores pods descartáveis da região.\nEm que posso ajudar você hoje?",
        )
        setState({ step: "browsing" })
        return
      }
    }

    // Navegação e seleção de produtos
    if (state.step === "browsing" || state.step === "greeting") {
      // Listar produtos
      if (msg.match(/produtos|catálogo|o que tem|tem o que|lista|opções|modelos|qual tem/)) {
        const productList = Object.entries(PRODUCTS)
          .map(([key, data]) => {
            const name = key
              .split(" ")
              .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
              .join(" ")
            return `${name} ${data.ml ? `– ${data.ml}` : ""} – R$ ${data.price.toFixed(2)} ${data.extra || ""}`
          })
          .join("\n")

        addAssistantMessage(`Temos ótimas opções disponíveis! ✨\n\n${productList}\n\nQual modelo te interessa?`)
        setState({ step: "browsing" })
        return
      }

      // Verificar se mencionou algum produto
      for (const [productKey, productData] of Object.entries(PRODUCTS)) {
        if (msg.includes(productKey.replace(" ", "")) || msg.includes(productKey)) {
          // Mostrar sabores disponíveis
          const name = productKey
            .split(" ")
            .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
            .join(" ")
          const flavorList = productData.flavors.map((f, i) => `${i + 1}. ${f}`).join("\n")

          addAssistantMessage(
            `Ótima escolha! O ${name} ${productData.ml ? `(${productData.ml})` : ""} está disponível por R$ ${productData.price.toFixed(2)} ${productData.extra || ""}\n\nSabores disponíveis:\n${flavorList}\n\nQual sabor você prefere?`,
          )
          setState({ step: "product_selected", selectedProduct: productKey })
          return
        }
      }

      // Perguntas sobre preço
      if (msg.match(/preço|valor|quanto custa|quanto é|quanto sai/)) {
        addAssistantMessage(
          "Claro! Nossos pods variam de R$ 99,00 a R$ 144,00 dependendo do modelo.\n\nPosso mostrar nossa lista completa de produtos? Digite 'produtos' para ver todas as opções! 😊",
        )
        return
      }

      // Perguntas sobre entrega
      if (msg.match(/entrega|entregar|taxa|frete|envio/)) {
        addAssistantMessage(
          "Nossa taxa de entrega é de R$ 18,90 para Itapema e região próxima.\nO prazo de entrega é de até 90 minutos após a confirmação do pagamento! ⚡\n\nGostaria de fazer um pedido?",
        )
        return
      }
    }

    // Seleção de sabor após escolher produto
    if (state.step === "product_selected" && state.selectedProduct) {
      const product = PRODUCTS[state.selectedProduct as keyof typeof PRODUCTS]

      // Verificar se mencionou um sabor válido
      const matchedFlavor = product.flavors.find(
        (flavor) => msg.includes(flavor.toLowerCase()) || flavor.toLowerCase().includes(msg),
      )

      if (matchedFlavor) {
        const name = state.selectedProduct
          .split(" ")
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(" ")
        addAssistantMessage(
          `Ótima escolha! Você selecionou o ${name} sabor ${matchedFlavor}.\nÉ só essa unidade mesmo ou gostaria de levar mais alguma?`,
        )
        setState({
          ...state,
          step: "confirming_quantity",
          selectedFlavor: matchedFlavor,
          quantity: 1,
        })
        return
      }

      // Se não entendeu o sabor
      addAssistantMessage(
        "Desculpe, não encontrei esse sabor. Poderia escolher um dos sabores disponíveis da lista? 😊",
      )
      return
    }

    // Confirmação de quantidade
    if (state.step === "confirming_quantity") {
      // Verificar se quer mais unidades
      const quantityMatch = msg.match(/(\d+)\s*(unidade|unidades|pod|pods)?/)
      if (quantityMatch) {
        const qty = Number.parseInt(quantityMatch[1])
        setState({ ...state, quantity: qty })
        addAssistantMessage(
          `Perfeito! ${qty} ${qty > 1 ? "unidades" : "unidade"}. Para enviar seu pedido, poderia me informar o endereço completo de entrega?\n(Rua, número, bairro, complemento, se houver)`,
        )
        setState({ ...state, step: "requesting_address", quantity: qty })
        return
      }

      // Se confirmar apenas uma unidade
      if (msg.match(/sim|só|somente|apenas|só essa|é isso|confirmo|pode ser|ok/)) {
        addAssistantMessage(
          "Perfeito! Para enviar seu pedido, poderia me informar o endereço completo de entrega?\n(Rua, número, bairro, complemento, se houver)",
        )
        setState({ ...state, step: "requesting_address" })
        return
      }

      // Se quiser mais produtos
      if (msg.match(/não|quero mais|outros|adicionar/)) {
        addAssistantMessage(
          "Claro! Qual outro produto você gostaria de adicionar? Digite 'produtos' para ver a lista completa! 😊",
        )
        setState({ step: "browsing" })
        return
      }
    }

    // Recebendo endereço
    if (state.step === "requesting_address") {
      if (
        msg.length > 10 &&
        (msg.includes("rua") || msg.match(/\d+/) || msg.includes("avenida") || msg.includes("av"))
      ) {
        const name = state
          .selectedProduct!.split(" ")
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(" ")
        const product = PRODUCTS[state.selectedProduct! as keyof typeof PRODUCTS]
        const subtotal = product.price * (state.quantity || 1)
        const total = subtotal + DELIVERY_FEE

        const summary = `Anotei seu endereço! 📍\n\nSeu pedido:\n• ${name} - ${state.selectedFlavor}\n• Quantidade: ${state.quantity || 1}\n\nValor ${state.quantity! > 1 ? "dos produtos" : "do produto"}: R$ ${subtotal.toFixed(2)}\nTaxa de entrega: R$ ${DELIVERY_FEE.toFixed(2)}\n━━━━━━━━━━━━━━━━\nTotal a pagar: R$ ${total.toFixed(2)}\n\nEstá tudo certo com o pedido e o valor? Posso enviar a chave PIX para pagamento?`

        addAssistantMessage(summary)
        setState({ ...state, step: "showing_total", address: userMessage, total })
        return
      }

      addAssistantMessage("Por favor, me informe um endereço completo para a entrega (Rua, número, bairro) 😊")
      return
    }

    // Confirmando total e enviando PIX
    if (state.step === "showing_total") {
      if (msg.match(/sim|confirmo|está certo|tudo certo|ok|pode enviar|correto|isso mesmo/)) {
        addAssistantMessage(
          "Obrigado pela confirmação! ✅\n\nPode realizar o pagamento via PIX para:\n📱 chavepix@gmail.com\n(Favorecido: PodHouseBC)\n\nAssim que o pagamento for confirmado, seu pedido será preparado imediatamente.\nPor favor, envie o comprovante aqui quando o pagamento for realizado.",
        )
        setState({ ...state, step: "sending_pix" })
        return
      }
    }

    // Aguardando comprovante
    if (state.step === "sending_pix") {
      if (msg.match(/paguei|pago|comprovante|enviado|feito|transferi|realizei/)) {
        addAssistantMessage(
          "Pagamento recebido com sucesso! Muito obrigado pela preferência. ✨\n\nSeu pedido já está sendo preparado e será entregue em até 90 minutos.\n\nQualquer dúvida é só nos chamar.\nBoa sessão! 😊",
        )
        setState({ ...state, step: "awaiting_payment" })
        return
      }
    }

    // Resposta padrão para mensagens não reconhecidas
    addAssistantMessage(
      "Desculpe, não entendi sua mensagem. 😊\n\nPosso ajudar com:\n• Ver produtos disponíveis (digite 'produtos')\n• Informações sobre entrega\n• Fazer um pedido\n\nO que você gostaria?",
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isTyping) return

    // Adicionar mensagem do usuário
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    }
    setMessages((prev) => [...prev, userMessage])

    // Processar mensagem
    processMessage(input)
    setInput("")
  }

  useEffect(() => {
    if (messages.length === 0) {
      setTimeout(() => {
        addAssistantMessage(
          "Olá! Bem-vindo(a) à PodHouseBC 😊\nEstamos aqui para ajudar com os melhores pods descartáveis da região.\nEm que posso ajudar você hoje?",
        )
        setState({ step: "browsing" })
      }, 500)
    }
  }, [])

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col">
      {/* Header */}
      <div className="bg-zinc-900/95 backdrop-blur-md border-b border-zinc-800 px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <Link href="/" className="p-2 text-zinc-400 hover:text-white transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-lg font-bold text-white">Atendimento PodHouse BC</h1>
            <p className="text-xs text-zinc-400">Atendimento Automático</p>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                  message.role === "user"
                    ? "bg-gradient-to-br from-sunset to-ocean text-white"
                    : "bg-zinc-800/50 text-zinc-100"
                }`}
              >
                <div className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-zinc-800/50 rounded-2xl px-4 py-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <div
                    className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  />
                  <div
                    className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Form */}
      <div className="border-t border-zinc-800 bg-zinc-900/95 backdrop-blur-md px-4 py-4">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Digite sua mensagem..."
              disabled={isTyping}
              className="flex-1 bg-zinc-800 text-white placeholder:text-zinc-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sunset/50 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="bg-gradient-to-br from-sunset to-ocean text-white rounded-xl px-4 py-3 font-medium text-sm hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
