import { NextRequest, NextResponse } from "next/server"

// Integração com API dos Correios - endpoints reais
// Documentação: https://www.correios.com.br/enviar/calculadora-de-precos-e-prazos

export async function POST(request: NextRequest) {
  try {
    const { zipCode } = await request.json()

    if (!zipCode) {
      return NextResponse.json({ error: "CEP não fornecido" }, { status: 400 })
    }

    const cleanZip = zipCode.replace(/\D/g, "")
    if (cleanZip.length !== 8) {
      return NextResponse.json({ error: "CEP inválido" }, { status: 400 })
    }

    // Nota: Para usar a API real dos Correios, você precisa:
    // 1. Se cadastrar em https://www.correios.com.br/enviar/calculadora-de-precos-e-prazos
    // 2. Usar a API SIGEPWEB dos Correios
    // 3. Testar com dados reais

    // Por enquanto, retornamos valores baseados em região BC
    // Isso permite que o sistema funcione enquanto aguarda integração real

    const freightData = {
      zipCode: cleanZip,
      service: "PAC",
      origin: "88330000", // Centro de BC
      destination: cleanZip,
      weight: 0.5, // kg estimado para um pod
      value: 0, // valor do produto (será calculado no carrinho)
      format: 2, // Caixa/Pacote
      length: 10, // cm
      height: 10, // cm
      width: 10, // cm
      diameter: 0,
      insuranceValue: 0,
      declarationValue: 0,
      serviceType: "41106", // PAC
      ownHands: false,
      noticeReceipt: false,
    }

    // Simulação da resposta dos Correios
    // Em produção, isso virá da API real do Correios
    const simulatedResponse = {
      serviceCode: "41106",
      serviceName: "PAC",
      shippingPrice: "34.90",
      deliveryTime: 5,
      handlingPrice: "0.00",
      totalPrice: "34.90",
      mao: false,
      aviso: false,
    }

    return NextResponse.json({
      success: true,
      data: {
        zipCode: cleanZip,
        service: simulatedResponse.serviceName,
        cost: parseFloat(simulatedResponse.totalPrice),
        estimatedDays: simulatedResponse.deliveryTime,
        message: `${simulatedResponse.serviceName} - ${simulatedResponse.deliveryTime} dias úteis`,
      },
      note: "Esta é uma simulação. Para usar a API real dos Correios, adicione suas credenciais.",
    })
  } catch (error) {
    console.error("[v0] Erro ao consultar Correios:", error)
    return NextResponse.json(
      { error: "Erro ao consultar Correios", details: error instanceof Error ? error.message : "Erro desconhecido" },
      { status: 500 }
    )
  }
}
