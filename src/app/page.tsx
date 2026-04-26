import fs from 'fs';
import path from 'path';
import HomeClient from '@/components/HomeClient';

export const dynamic = 'force-dynamic';

export default function Home() {
  const productsFilePath = path.join(process.cwd(), 'src/data/products.json');
  const productsData = fs.readFileSync(productsFilePath, 'utf-8');
  const products = JSON.parse(productsData);

  return <HomeClient products={products} />;
}
