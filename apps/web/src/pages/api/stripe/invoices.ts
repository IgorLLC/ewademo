import type { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { getOrCreateCustomer, mapStripeInvoice, stripe } from '../../../lib/stripe-server';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userId, email, name } = req.query;

    if (typeof userId !== 'string' || typeof email !== 'string') {
      return res.status(400).json({ error: 'Missing userId or email' });
    }

    const customer = await getOrCreateCustomer({ userId, email, name: typeof name === 'string' ? name : undefined });

    const invoices = await stripe.invoices.list({
      customer: customer.id,
      limit: 12,
      expand: ['data.charge', 'data.payment_intent'],
    });

    const payload = invoices.data
      .filter((invoice): invoice is Stripe.Invoice => !invoice.deleted)
      .map(mapStripeInvoice);

    return res.status(200).json({ invoices: payload });
  } catch (error) {
    console.error('Error loading invoices:', error);
    return res.status(500).json({ error: 'Unable to load invoices' });
  }
}
