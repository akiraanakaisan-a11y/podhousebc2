"use client"

import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

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

interface ProductCardProps {
  product: Product
  language?: "pt" | "en"
}

export function ProductCard({ product, language = "pt" }: ProductCardProps) {
  const totalStock = product.product_flavors?.reduce(
    (sum, flavor) => sum + flavor.stock_quantity,
    0
  ) || 0

  return (
    <Link href={`/produto/${product.id}`} className="block">
      <div className="bg-zinc-800/50 rounded-xl overflow-hidden border border-zinc-700/50 active:border-orange-500/50 transition-all">
        <div className="relative aspect-square overflow-hidden bg-zinc-900">
          <Image
            src={product.image_url || "/placeholder.svg"}
            alt={product.name}
            fill
            className="object-cover"
          />
          {totalStock < 10 && totalStock > 0 && (
            <Badge className="absolute top-2 left-2 bg-yellow-600 text-white border-0 text-[10px] px-2 py-0.5">
              Poucas Unidades
            </Badge>
          )}
          {totalStock === 0 && (
            <Badge className="absolute top-2 left-2 bg-red-600 text-white border-0 text-[10px] px-2 py-0.5">
              Esgotado
            </Badge>
          )}
        </div>
        <div className="p-3">
          <h3 className="text-sm font-semibold text-white mb-0.5 truncate">
            {product.name}
          </h3>
          <p className="text-xs text-zinc-400 mb-1">{product.capacity}</p>
          <div className="flex items-center justify-between">
            <span className="text-base font-bold text-orange-400">
              R$ {product.price.toFixed(2).replace(".", ",")}
            </span>
            <span className="text-[10px] text-zinc-500">
              {product.product_flavors?.length || 0}{" "}
              {language === "pt" ? "sabores" : "flavors"}
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}
