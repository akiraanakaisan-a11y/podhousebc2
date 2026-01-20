import { NextRequest, NextResponse } from "next/server"

// Mapeamento de CEPs por região - PREÇOS CORRETOS
const FREIGHT_CONFIG = {
  "Balneário Camboriú": { value: 18.9, days: 1, cepRanges: [[88330000, 88340000]] },
  "Itajaí": { value: 24.9, days: 1, cepRanges: [[88300000, 88329999]] },
  "Camboriú": { value: 21.9, days: 1, cepRanges: [[88340001, 88360000]] },
  "Itapema": { value: 24.9, days: 1, cepRanges: [[88350000, 88360000]] },
}

interface FreightConfig {
  value: number
  days: number
  cepRanges: number[][]
}

function getFreightByZipCode(zipCode: string): {
  value: number
  days: number
  city: string
  method: string
  isFree: boolean
} | null {
  const cepNum = parseInt(zipCode.replace(/\D/g, ""))

  for (const [city, config] of Object.entries(FREIGHT_CONFIG)) {
    const typedConfig = config as FreightConfig
    for (const [min, max] of typedConfig.cepRanges) {
      if (cepNum >= min && cepNum <= max) {
        return {
          value: typedConfig.value,
          days: typedConfig.days,
          city,
          method: `Entrega em ${city}`,
          isFree: false,
        }
      }
    }
  }

  // Se não encontrar na região, usa Correios (simulado com valor padrão)
  return {
    value: 34.9,
    days: 5,
    city: "Fora da região",
    method: "Entrega via Correios",
    isFree: false,
  }
}

export async function POST(request: NextRequest) {
  try {
    const { zipCode, items } = await request.json()

    if (!zipCode) {
      return NextResponse.json({ error: "CEP não fornecido" }, { status: 400 })
    }

    // Validar formato do CEP
    const cleanZip = zipCode.replace(/\D/g, "")
    if (cleanZip.length !== 8) {
      return NextResponse.json({ error: "CEP inválido" }, { status: 400 })
    }

    const freightInfo = getFreightByZipCode(cleanZip)

    if (!freightInfo) {
      return NextResponse.json({ error: "CEP não encontrado" }, { status: 400 })
    }

    // NÃO é entrega grátis em BC - aplicar preço correto
    return NextResponse.json({
      zipCode: cleanZip,
      freight: {
        value: freightInfo.value,
        days: freightInfo.days,
        method: `Entrega em ${freightInfo.city}`,
        city: freightInfo.city,
        isFree: false,
      },
    })
  } catch (error) {
    console.error("[v0] Erro ao calcular frete:", error)
    return NextResponse.json({ error: "Erro ao calcular frete" }, { status: 500 })
  }
}
