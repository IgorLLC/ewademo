import type { NextApiRequest, NextApiResponse } from 'next';
import { Plan } from '@ewa/types';

// Mock database for plans
const plans: Plan[] = [
  {
    id: 'plan1',
    name: 'Plan Premium Mensual',
    productId: 'prod1',
    frequency: 'monthly',
    minQty: 1
  },
  {
    id: 'plan2',
    name: 'Plan Básico Semanal',
    productId: 'prod2',
    frequency: 'weekly',
    minQty: 1
  },
  {
    id: 'plan3',
    name: 'Plan Empresarial Quincenal',
    productId: 'prod1',
    frequency: 'biweekly',
    minQty: 2
  }
];

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Plan[] | Plan | { error: string }>
) {
  if (req.method === 'GET') {
    return res.status(200).json(plans);
  }
  
  if (req.method === 'POST') {
    const planData = req.body;
    
    if (!planData.name || !planData.productId || !planData.frequency) {
      return res.status(400).json({ error: 'Name, product ID, and frequency are required' });
    }
    
    const newPlan: Plan = {
      id: `plan${Date.now()}`,
      ...planData
    };
    
    plans.push(newPlan);
    
    return res.status(201).json(newPlan);
  }
  
  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).json({ error: `Method ${req.method} not allowed` });
}