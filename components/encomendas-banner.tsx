"use client"

import { Package } from "lucide-react"

export function EncomendasBanner() {
  return (
    <section className="bg-zinc-900 border-y border-zinc-800 py-4 px-4">
      <div className="max-w-7xl mx-auto flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center flex-shrink-0">
          <Package className="h-5 w-5 text-orange-400" />
        </div>
        <div className="flex-1">
          <p className="text-white font-semibold text-sm">
            Produto não disponível em estoque?
          </p>
          <p className="text-zinc-400 text-xs">
            Fazemos encomendas de outros modelos! Pedidos de 10h-13h = entrega hoje | Após 13h = entrega no dia útil seguinte
          </p>
        </div>
      </div>
    </section>
  )
}
