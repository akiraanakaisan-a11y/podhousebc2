export interface Product {
  id: string
  nome: string
  imagem: string
  capacidade: string
  preco: number
  sabores: string[]
  destaque?: string
  saboresEspeciais?: Record<string, number>
}

export const produtosData: Record<string, Product> = {
  "ignite-v80": {
    id: "ignite-v80",
    nome: "Ignite V80",
    imagem: "/images/ignite-v80.jpg",
    capacidade: "12ml",
    preco: 104.0,
    sabores: ["Manga Lima", "Maracujá Kiwi", "Frutas Cítricas e Menta"],
  },
  "ignite-v300": {
    id: "ignite-v300",
    nome: "Ignite V300",
    imagem: "/images/ignite-v300.jpg",
    capacidade: "18ml",
    preco: 132.0,
    sabores: [
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
  "ignite-v400": {
    id: "ignite-v400",
    nome: "Ignite V400",
    imagem: "/images/ignite-v400.jpg",
    capacidade: "18ml",
    preco: 144.0,
    sabores: ["MixFlavor", "Uva & Pêssego", "Manga & Maracujá Kiwi", "Pêssego Melancia e Manga"],
  },
  "ignite-v155": {
    id: "ignite-v155",
    nome: "Ignite V155",
    imagem: "/images/ignite-v155.jpg",
    capacidade: "12ml",
    preco: 113.0,
    sabores: ["Banana Ice", "Maçã Verde"],
    destaque: "Lançamento SlimDesign",
  },
  "ignite-v55": {
    id: "ignite-v55",
    nome: "Ignite V55",
    imagem: "/images/ignite-v55.jpg",
    capacidade: "5500 puffs",
    preco: 99.0,
    sabores: ["Menta Melão", "Melão Mix", "Uva", "Menta"],
  },
  "elfbar-30k": {
    id: "elfbar-30k",
    nome: "Elfbar 30k",
    imagem: "/images/elfbar-30k.jpg",
    capacidade: "13ml",
    preco: 121.0,
    sabores: ["Tubinhos Fini", "Chiclete de Uva", "Maracujá Kiwi", "Morango Banana", "Maçã Verde"],
    destaque: "MetalSlim",
  },
  "elfbar-40k": {
    id: "elfbar-40k",
    nome: "Elfbar 40k",
    imagem: "/images/elfbar-40k.jpg",
    capacidade: "20ml",
    preco: 129.0,
    sabores: ["Frutas Tropicais", "Cereja", "Maçã Verde", "Tubinhos Fini"],
    destaque: "IceKing",
  },
  "elfbar-23k": {
    id: "elfbar-23k",
    nome: "Elfbar 23k",
    imagem: "/images/elfbar-23k.jpg",
    capacidade: "23ml",
    preco: 118.0,
    sabores: [
      "Pêssego Melancia Manga",
      "Melancia Ice",
      "Baja Splash",
      "Kiwi Pitaya",
      "Uva Ice",
      "Abacaxi Hortelã",
      "Morango Banana",
      "Menta",
    ],
    saboresEspeciais: {
      "Baja Splash (Promo)": 110.0,
      "Lime Grapefruit Ice (Promo)": 110.0,
    },
  },
  blacksheep: {
    id: "blacksheep",
    nome: "BlackSheep 30k",
    imagem: "/images/blacksheep.jpg",
    capacidade: "26ml",
    preco: 140.0,
    sabores: ["Maracujá & Morango Melancia", "Uva & Maracujá", "Menta e Manga Laranja"],
    destaque: "DualTank",
  },
}

export const getProductById = (id: string): Product | undefined => {
  return produtosData[id]
}

export const getAllProducts = (): Product[] => {
  return Object.values(produtosData)
}
