"use client"

import { useEffect, useState } from "react"
import { Truck, Shield, Clock, MessageCircle, Users, Package, RotateCcw } from "lucide-react"

export function AboutSection() {
  const [orderCount, setOrderCount] = useState(30000)

  useEffect(() => {
    fetch("/api/orders")
      .then((res) => res.json())
      .then((data) => {
        // Adiciona 30000 aos pedidos reais para mostrar o total histórico
        setOrderCount(30000 + (data.totalOrders || 0))
      })
      .catch((error) => {
        console.error("[v0] Erro ao carregar estatísticas:", error)
      })
  }, [])

  const features = [
    {
      icon: Shield,
      title: "Produtos Originais",
      description: "100% autênticos e lacrados",
    },
    {
      icon: Truck,
      title: "Entrega Rápida",
      description: "Em toda Balneário Camboriú",
    },
    {
      icon: Clock,
      title: "Disponibilidade",
      description: "Todos os dias da semana",
    },
    {
      icon: MessageCircle,
      title: "Suporte",
      description: "Atendimento via WhatsApp",
    },
    {
      icon: Package,
      title: "Encomendas",
      description: "Produtos sob encomenda",
    },
    {
      icon: RotateCcw,
      title: "Devoluções",
      description: "Política de devoluções",
    },
    {
      icon: Users,
      title: "2000+ Clientes Atendidos",
      description: "BC e região com qualidade e excelência",
    },
    {
      icon: Package,
      title: "30mil+ Pedidos Realizados",
      description: "Confiança e satisfação garantidas",
    },
  ]

  return (
    <section id="sobre" className="py-12 bg-zinc-900">
      <div className="px-4">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">Por que escolher a PodHouse BC?</h2>
          <p className="text-zinc-400 text-sm">Qualidade, excelência e compromisso com o cliente.</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {features.map((feature) => (
            <div key={feature.title} className="bg-zinc-800/50 rounded-xl p-4 border border-zinc-700/50">
              <div className="w-10 h-10 bg-orange-500/10 rounded-lg flex items-center justify-center mb-3">
                <feature.icon className="h-5 w-5 text-orange-400" />
              </div>
              <h3 className="text-sm font-semibold text-white mb-1">{feature.title}</h3>
              <p className="text-zinc-400 text-xs">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
