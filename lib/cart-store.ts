"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface CartItem {
  id: string
  produtoId: string
  nome: string
  sabor: string
  quantidade: number
  preco: number
  imagem: string
}

interface CartStore {
  itens: CartItem[]
  adicionarItem: (item: Omit<CartItem, "id">) => void
  removerItem: (id: string) => void
  atualizarQuantidade: (id: string, quantidade: number) => void
  limparCarrinho: () => void
  getTotal: () => number
  getTotalItens: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      itens: [],

      adicionarItem: (item) => {
        const novoItem: CartItem = {
          ...item,
          id: Date.now().toString(),
        }
        set((state) => ({ itens: [...state.itens, novoItem] }))
      },

      removerItem: (id) => {
        set((state) => ({
          itens: state.itens.filter((item) => item.id !== id),
        }))
      },

      atualizarQuantidade: (id, quantidade) => {
        set((state) => ({
          itens: state.itens.map((item) => (item.id === id ? { ...item, quantidade } : item)),
        }))
      },

      limparCarrinho: () => {
        set({ itens: [] })
      },

      getTotal: () => {
        return get().itens.reduce((total, item) => total + item.preco * item.quantidade, 0)
      },

      getTotalItens: () => {
        return get().itens.reduce((sum, item) => sum + item.quantidade, 0)
      },
    }),
    {
      name: "podhouse-cart",
    },
  ),
)
