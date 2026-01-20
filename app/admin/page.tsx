"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Package, TrendingUp, Users, DollarSign } from "lucide-react";

interface Product {
  id: string;
  name: string;
  price: number;
  stock_quantity: number;
  product_flavors: Array<{
    id: number;
    flavor_pt: string;
    flavor_en: string;
    stock_quantity: number;
  }>;
}

export default function AdminPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
  });
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      // Carregar produtos
      const { data: productsData } = await supabase
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
        .order("name");

      if (productsData) {
        setProducts(productsData);
        setStats((prev) => ({ ...prev, totalProducts: productsData.length }));
      }

      // Carregar estatísticas de pedidos
      const { count } = await supabase
        .from("orders")
        .select("*", { count: "exact", head: true });

      const { data: ordersSum } = await supabase
        .from("orders")
        .select("total");

      const revenue = ordersSum?.reduce((sum, order) => sum + Number(order.total), 0) || 0;

      setStats({
        totalOrders: count || 0,
        totalRevenue: revenue,
        totalProducts: productsData?.length || 0,
      });
    } catch (error) {
      console.error("[v0] Erro ao carregar dados:", error);
    } finally {
      setLoading(false);
    }
  }

  async function updateStock(flavorId: number, newStock: number) {
    try {
      console.log("[v0] Atualizando estoque do sabor", flavorId, "para", newStock)
      
      const { error } = await supabase
        .from("product_flavors")
        .update({ stock_quantity: newStock })
        .eq("id", flavorId)

      if (error) {
        console.error("[v0] Erro ao atualizar estoque:", error)
        alert(`Erro ao atualizar estoque: ${error.message}`)
        return
      }

      console.log("[v0] Estoque atualizado com sucesso")
      await loadData()
      alert("Estoque atualizado com sucesso!")
    } catch (error) {
      console.error("[v0] Erro ao atualizar estoque:", error)
      alert("Erro ao atualizar estoque")
    }
  }

  async function updatePrice(productId: string, newPrice: number) {
    try {
      console.log("[v0] Atualizando preço do produto", productId, "para", newPrice)
      
      const { error } = await supabase
        .from("products")
        .update({ price: newPrice })
        .eq("id", productId)

      if (error) {
        console.error("[v0] Erro ao atualizar preço:", error)
        alert(`Erro ao atualizar preço: ${error.message}`)
        return
      }

      console.log("[v0] Preço atualizado com sucesso")
      await loadData()
      alert("Preço atualizado com sucesso!")
    } catch (error) {
      console.error("[v0] Erro ao atualizar preço:", error)
      alert("Erro ao atualizar preço")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950">
        <p className="text-white">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Painel Administrativo</h1>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-zinc-400">
                Total de Pedidos
              </CardTitle>
              <Package className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.totalOrders}</div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-zinc-400">
                Receita Total
              </CardTitle>
              <DollarSign className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                R$ {stats.totalRevenue.toFixed(2)}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-zinc-400">
                Total de Produtos
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{stats.totalProducts}</div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-zinc-400">
                Clientes Atendidos
              </CardTitle>
              <Users className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">2000+</div>
            </CardContent>
          </Card>
        </div>

        {/* Gestão de Produtos e Estoque */}
        <Tabs defaultValue="products" className="w-full">
          <TabsList className="bg-zinc-900">
            <TabsTrigger value="products">Produtos e Preços</TabsTrigger>
            <TabsTrigger value="stock">Controle de Estoque</TabsTrigger>
          </TabsList>

          <TabsContent value="products">
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-white">Gestão de Produtos</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="border-zinc-800">
                      <TableHead className="text-zinc-400">Produto</TableHead>
                      <TableHead className="text-zinc-400">Preço Atual</TableHead>
                      <TableHead className="text-zinc-400">Novo Preço</TableHead>
                      <TableHead className="text-zinc-400">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((product) => (
                      <TableRow key={product.id} className="border-zinc-800">
                        <TableCell className="text-white">{product.name}</TableCell>
                        <TableCell className="text-white">
                          R$ {product.price.toFixed(2)}
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            step="0.01"
                            defaultValue={product.price}
                            className="w-32 bg-zinc-800 border-zinc-700 text-white"
                            id={`price-${product.id}`}
                          />
                        </TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            className="bg-orange-600 hover:bg-orange-700"
                            onClick={() => {
                              const input = document.getElementById(
                                `price-${product.id}`
                              ) as HTMLInputElement;
                              updatePrice(product.id, parseFloat(input.value));
                            }}
                          >
                            Atualizar
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="stock">
            <Card className="bg-zinc-900 border-zinc-800">
              <CardHeader>
                <CardTitle className="text-white">Controle de Estoque por Sabor</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {products.map((product) => (
                    <div key={product.id} className="border border-zinc-800 rounded-lg p-4">
                      <h3 className="text-lg font-semibold text-white mb-4">
                        {product.name}
                      </h3>
                      <Table>
                        <TableHeader>
                          <TableRow className="border-zinc-800">
                            <TableHead className="text-zinc-400">Sabor (PT)</TableHead>
                            <TableHead className="text-zinc-400">Sabor (EN)</TableHead>
                            <TableHead className="text-zinc-400">Estoque</TableHead>
                            <TableHead className="text-zinc-400">Novo Estoque</TableHead>
                            <TableHead className="text-zinc-400">Ações</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {product.product_flavors.map((flavor) => (
                            <TableRow key={flavor.id} className="border-zinc-800">
                              <TableCell className="text-white">
                                {flavor.flavor_pt}
                              </TableCell>
                              <TableCell className="text-zinc-400">
                                {flavor.flavor_en}
                              </TableCell>
                              <TableCell>
                                <Badge
                                  variant={
                                    flavor.stock_quantity > 10
                                      ? "default"
                                      : flavor.stock_quantity > 5
                                      ? "secondary"
                                      : "destructive"
                                  }
                                >
                                  {flavor.stock_quantity} unid.
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Input
                                  type="number"
                                  defaultValue={flavor.stock_quantity}
                                  className="w-24 bg-zinc-800 border-zinc-700 text-white"
                                  id={`stock-${flavor.id}`}
                                />
                              </TableCell>
                              <TableCell>
                                <Button
                                  size="sm"
                                  className="bg-orange-600 hover:bg-orange-700"
                                  onClick={() => {
                                    const input = document.getElementById(
                                      `stock-${flavor.id}`
                                    ) as HTMLInputElement;
                                    updateStock(flavor.id, parseInt(input.value));
                                  }}
                                >
                                  Atualizar
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
