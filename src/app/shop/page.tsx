import fs from 'fs';
import path from 'path';
import ShopClient from '@/components/ShopClient';

export const dynamic = 'force-dynamic';

export default function ShopPage() {
  const productsFilePath = path.join(process.cwd(), 'src/data/products.json');
  const productsData = fs.readFileSync(productsFilePath, 'utf-8');
  const products = JSON.parse(productsData);

  // Convert price string to number if needed (it should be number now)
  const formattedProducts = products.map((p: any) => ({
    ...p,
    price: typeof p.price === 'string' ? parseInt(p.price.replace(/,/g, '')) : p.price
  }));

  return <ShopClient products={formattedProducts} />;
}
