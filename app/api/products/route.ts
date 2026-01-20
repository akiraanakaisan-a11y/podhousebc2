import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createClient();

  const { data: products, error } = await supabase
    .from("products")
    .select(`
      *,
      product_flavors (
        id,
        flavor_pt,
        flavor_en,
        stock_quantity
      )
    `)
    .eq("active", true)
    .order("name");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ products });
}
