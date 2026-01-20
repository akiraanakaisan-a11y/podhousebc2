-- Tabela de produtos com controle de estoque
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  puffs INTEGER NOT NULL,
  capacity TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  stock_quantity INTEGER NOT NULL DEFAULT 0,
  image_url TEXT NOT NULL,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de sabores dos produtos (bilíngue)
CREATE TABLE IF NOT EXISTS product_flavors (
  id SERIAL PRIMARY KEY,
  product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  flavor_pt TEXT NOT NULL,
  flavor_en TEXT NOT NULL,
  stock_quantity INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(product_id, flavor_pt)
);

-- Tabela de pedidos
CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT,
  delivery_address TEXT NOT NULL,
  delivery_city TEXT NOT NULL,
  delivery_state TEXT NOT NULL,
  delivery_zip_code TEXT NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  freight_cost DECIMAL(10,2) NOT NULL DEFAULT 0,
  total DECIMAL(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  payment_method TEXT NOT NULL DEFAULT 'pix',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de itens do pedido
CREATE TABLE IF NOT EXISTS order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL,
  product_name TEXT NOT NULL,
  flavor TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de configurações do site
CREATE TABLE IF NOT EXISTS site_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  description TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inserir configurações iniciais
INSERT INTO site_settings (key, value, description) VALUES
  ('free_delivery_city', 'Balneário Camboriú', 'Cidade com entrega gratuita'),
  ('free_delivery_radius', '10', 'Raio em km para entrega gratuita'),
  ('instagram_url', 'https://www.instagram.com/podhousebc/', 'URL do Instagram'),
  ('whatsapp_number', '5547999892801', 'Número do WhatsApp'),
  ('pix_key', '47999892801', 'Chave PIX para pagamento')
ON CONFLICT (key) DO NOTHING;

-- Inserir produtos iniciais
INSERT INTO products (id, name, brand, model, puffs, capacity, price, stock_quantity, image_url) VALUES
  ('ignite-v80', 'Ignite V80', 'Ignite', 'V80', 8000, '12ml', 69.90, 50, '/images/ignite-v80.jpg'),
  ('ignite-v155', 'Ignite V155', 'Ignite', 'V155', 15500, '12ml', 89.90, 40, '/images/ignite-v155.jpg'),
  ('ignite-v300', 'Ignite V300', 'Ignite', 'V300', 30000, '18ml', 129.90, 35, '/images/ignite-v300.jpg'),
  ('ignite-v400', 'Ignite V400', 'Ignite', 'V400', 40000, '18ml', 149.90, 30, '/images/ignite-v400.jpg'),
  ('ignite-v55', 'Ignite V55', 'Ignite', 'V55', 5500, '10ml', 59.90, 60, '/images/ignite-v55.jpg'),
  ('elfbar-23k', 'Elf Bar 23K', 'Elf Bar', '23K', 23000, '23ml', 119.90, 45, '/images/elfbar-23k.jpg'),
  ('elfbar-30k', 'Elf Bar 30K', 'Elf Bar', '30K', 30000, '13ml', 139.90, 25, '/images/elfbar-30k.jpg'),
  ('elfbar-40k', 'Elf Bar 40K', 'Elf Bar', '40K', 40000, '20ml', 159.90, 20, '/images/elfbar-40k.jpg'),
  ('blacksheep-30k', 'Black Sheep 30K', 'Black Sheep', '30K', 30000, '26ml', 149.90, 30, '/images/blacksheep.jpg')
ON CONFLICT (id) DO NOTHING;

-- Inserir sabores para cada produto
INSERT INTO product_flavors (product_id, flavor_pt, flavor_en, stock_quantity) VALUES
  ('ignite-v80', 'Morango', 'Strawberry', 10),
  ('ignite-v80', 'Melancia Ice', 'Watermelon Ice', 10),
  ('ignite-v80', 'Uva', 'Grape', 10),
  ('ignite-v155', 'Menta Ice', 'Mint Ice', 8),
  ('ignite-v155', 'Morango Banana', 'Strawberry Banana', 8),
  ('ignite-v300', 'Melão', 'Melon', 7),
  ('ignite-v300', 'Maracujá', 'Passion Fruit', 7),
  ('ignite-v400', 'Manga Ice', 'Mango Ice', 6),
  ('ignite-v400', 'Frutas Vermelhas', 'Mixed Berries', 6),
  ('ignite-v55', 'Hortelã', 'Mint', 12),
  ('ignite-v55', 'Limão', 'Lemon', 12),
  ('elfbar-23k', 'Pêssego Manga Melancia', 'Peach Mango Watermelon', 9),
  ('elfbar-23k', 'Morango Kiwi', 'Strawberry Kiwi', 9),
  ('elfbar-30k', 'Melancia', 'Watermelon', 5),
  ('elfbar-30k', 'Uva', 'Grape', 5),
  ('elfbar-40k', 'Maçã Ice', 'Apple Ice', 4),
  ('elfbar-40k', 'Cereja', 'Cherry', 4),
  ('blacksheep-30k', 'Uva', 'Grape', 6),
  ('blacksheep-30k', 'Maracujá', 'Passion Fruit', 6)
ON CONFLICT (product_id, flavor_pt) DO NOTHING;

-- Habilitar RLS (Row Level Security)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_flavors ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Políticas de segurança - leitura pública
CREATE POLICY "Public read access for products" ON products FOR SELECT USING (true);
CREATE POLICY "Public read access for product_flavors" ON product_flavors FOR SELECT USING (true);
CREATE POLICY "Public read access for site_settings" ON site_settings FOR SELECT USING (true);

-- Políticas para pedidos - apenas criar
CREATE POLICY "Public can create orders" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can create order_items" ON order_items FOR INSERT WITH CHECK (true);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_products_active ON products(active);
CREATE INDEX IF NOT EXISTS idx_product_flavors_product_id ON product_flavors(product_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
