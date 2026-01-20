import { NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function PUT(request: NextRequest) {
  try {
    const supabase = createServerClient()
    const body = await request.json()
    const { productId, price, flavorId, stock } = body

    console.log("[v0] Atualizando produto/sabor:", { productId, price, flavorId, stock })

    // Atualizar preço do produto
    if (productId && price !== undefined) {
      const { error: priceError } = await supabase
        .from("products")
        .update({ price: Number(price) })
        .eq("id", productId)

      if (priceError) {
        console.error("[v0] Erro ao atualizar preço:", priceError)
        return NextResponse.json({ error: priceError.message }, { status: 500 })
      }

      console.log("[v0] Preço atualizado com sucesso")
    }

    // Atualizar estoque do sabor
    if (flavorId && stock !== undefined) {
      const { error: stockError } = await supabase
        .from("product_flavors")
        .update({ stock_quantity: Number(stock) })
        .eq("id", flavorId)

      if (stockError) {
        console.error("[v0] Erro ao atualizar estoque:", stockError)
        return NextResponse.json({ error: stockError.message }, { status: 500 })
      }

      console.log("[v0] Estoque atualizado com sucesso")
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Erro geral na API:", error)
    return NextResponse.json({ error: "Erro ao processar solicitação" }, { status: 500 })
  }
}
