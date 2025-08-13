import type { NextApiRequest, NextApiResponse } from 'next';
import { Product } from '@ewa/types';

// Mock database for products
const products: Product[] = [
  {
    id: 'prod1',
    name: 'Agua Premium',
    sizeOz: 160, // 5 galones
    sku: 'EWA-PREM-5GAL',
    price: 25.99
  },
  {
    id: 'prod2',
    name: 'Agua Básica',
    sizeOz: 96, // 3 galones
    sku: 'EWA-BASIC-3GAL',
    price: 18.99
  },
  {
    id: 'prod3',
    name: 'Agua Alcalina',
    sizeOz: 128, // 4 galones
    sku: 'EWA-ALK-4GAL',
    price: 32.99
  }
];

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Product[] | Product | { error: string }>
) {
  if (req.method === 'GET') {
    return res.status(200).json(products);
  }
  
  if (req.method === 'POST') {
    const productData = req.body;
    
    if (!productData.name || !productData.sizeOz || !productData.sku || !productData.price) {
      return res.status(400).json({ error: 'Name, size, SKU, and price are required' });
    }
    
    const newProduct: Product = {
      id: `prod${Date.now()}`,
      ...productData
    };
    
    products.push(newProduct);
    
    return res.status(201).json(newProduct);
  }
  
  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).json({ error: `Method ${req.method} not allowed` });
}