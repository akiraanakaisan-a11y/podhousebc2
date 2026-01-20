import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const orderData = await request.json();

    const {
      customerName,
      customerPhone,
      customerEmail,
      deliveryAddress,
      deliveryCity,
      deliveryState,
      deliveryZipCode,
      items,
      subtotal,
      freightCost,
      total,
    } = orderData;

    // Criar o pedido
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        customer_name: customerName,
        customer_phone: customerPhone,
        customer_email: customerEmail,
        delivery_address: deliveryAddress,
        delivery_city: deliveryCity,
        delivery_state: deliveryState,
        delivery_zip_code: deliveryZipCode,
        subtotal,
        freight_cost: freightCost,
        total,
        status: "pending",
        payment_method: "pix",
      })
      .select()
      .single();

    if (orderError) {
      console.error("[v0] Erro ao criar pedido:", orderError);
      return NextResponse.json({ error: orderError.message }, { status: 500 });
    }

    // Criar itens do pedido
    const orderItems = items.map((item: any) => ({
      order_id: order.id,
      product_id: item.productId,
      product_name: item.productName,
      flavor: item.flavor,
      quantity: item.quantity,
      unit_price: item.unitPrice,
      subtotal: item.subtotal,
    }));

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItems);

    if (itemsError) {
      console.error("[v0] Erro ao criar itens do pedido:", itemsError);
      return NextResponse.json({ error: itemsError.message }, { status: 500 });
    }

    // Atualizar estoque dos produtos
    for (const item of items) {
      const { error: stockError } = await supabase
        .from("product_flavors")
        .update({
          stock_quantity: supabase.rpc("decrement_stock", {
            row_id: item.flavorId,
            qty: item.quantity,
          }),
        })
        .eq("id", item.flavorId);

      if (stockError) {
        console.error("[v0] Erro ao atualizar estoque:", stockError);
      }
    }

    return NextResponse.json({
      success: true,
      orderId: order.id,
      message: "Pedido criado com sucesso!",
    });
  } catch (error) {
    console.error("[v0] Erro ao processar pedido:", error);
    return NextResponse.json(
      { error: "Erro ao processar pedido" },
      { status: 500 }
    );
  }
}

// Buscar estatísticas de pedidos (TAREFA 3)
export async function GET() {
  try {
    const supabase = await createClient();

    const { count, error } = await supabase
      .from("orders")
      .select("*", { count: "exact", head: true });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      totalOrders: count || 0,
    });
  } catch (error) {
    console.error("[v0] Erro ao buscar estatísticas:", error);
    return NextResponse.json(
      { error: "Erro ao buscar estatísticas" },
      { status: 500 }
    );
  }
}
