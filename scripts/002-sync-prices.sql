-- Sincronizar preços corretos dos produtos
-- Baseado nos dados do products-data.ts

UPDATE products SET price = 104.00 WHERE id = 'ignite-v80';
UPDATE products SET price = 132.00 WHERE id = 'ignite-v300';
UPDATE products SET price = 144.00 WHERE id = 'ignite-v400';
UPDATE products SET price = 113.00 WHERE id = 'ignite-v155';
UPDATE products SET price = 99.00 WHERE id = 'ignite-v55';
UPDATE products SET price = 121.00 WHERE id = 'elfbar-30k';
UPDATE products SET price = 129.00 WHERE id = 'elfbar-40k';
UPDATE products SET price = 118.00 WHERE id = 'elfbar-23k';
UPDATE products SET price = 140.00 WHERE id = 'blacksheep';
