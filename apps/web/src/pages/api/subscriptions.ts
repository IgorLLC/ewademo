import type { NextApiRequest, NextApiResponse } from 'next';
import { Subscription } from '@ewa/types';

// Mock database for subscriptions
let subscriptions: Subscription[] = [
  {
    id: 's1',
    planId: 'plan1',
    userId: 'u1',
    status: 'active',
    productId: 'prod1',
    quantity: 2,
    address: '123 Calle Principal, Urb. Los Jardines, San Juan, PR',
    nextDeliveryDate: '2024-03-20',
    frequency: 'monthly',
    createdAt: '2024-01-15T10:00:00Z'
  },
  {
    id: 's2',
    planId: 'plan2',
    userId: 'u1',
    status: 'paused',
    productId: 'prod2',
    quantity: 1,
    address: '123 Calle Principal, Urb. Los Jardines, San Juan, PR',
    nextDeliveryDate: '2024-04-01',
    frequency: 'weekly',
    createdAt: '2024-02-01T14:30:00Z'
  },
  {
    id: 's3',
    planId: 'plan3',
    userId: 'u3',
    status: 'active',
    productId: 'prod1',
    quantity: 5,
    address: '456 Ave. Comercial, Local 12, Bayamón, PR',
    nextDeliveryDate: '2024-03-18',
    frequency: 'biweekly',
    createdAt: '2024-02-15T09:00:00Z'
  }
];

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Subscription[] | Subscription | { error: string }>
) {
  if (req.method === 'GET') {
    // Get subscriptions, optionally filtered by userId
    const { userId } = req.query;
    
    let filteredSubscriptions = subscriptions;
    if (userId && typeof userId === 'string') {
      filteredSubscriptions = subscriptions.filter(s => s.userId === userId);
    }
    
    return res.status(200).json(filteredSubscriptions);
  }
  
  if (req.method === 'POST') {
    // Create a new subscription
    const subscriptionData = req.body;
    
    if (!subscriptionData.planId || !subscriptionData.userId) {
      return res.status(400).json({ error: 'Plan ID and User ID are required' });
    }
    
    // Create new subscription
    const newSubscription: Subscription = {
      id: `s${Date.now()}`, // Simple ID generation
      ...subscriptionData,
      createdAt: new Date().toISOString()
    };
    
    subscriptions.push(newSubscription);
    
    return res.status(201).json(newSubscription);
  }
  
  // Method not allowed
  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).json({ error: `Method ${req.method} not allowed` });
}