import type { NextApiRequest, NextApiResponse } from 'next';
import { stripe, getOrCreateCustomer } from '../../../lib/stripe-server';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userId, email, name } = req.body as {
      userId?: string;
      email?: string;
      name?: string;
    };

    if (!userId || !email) {
      return res.status(400).json({ error: 'Missing userId or email' });
    }

    const customer = await getOrCreateCustomer({ userId, email, name });

    const setupIntent = await stripe.setupIntents.create({
      customer: customer.id,
      usage: 'off_session',
      automatic_payment_methods: { enabled: true },
    });

    return res.status(200).json({ clientSecret: setupIntent.client_secret });
  } catch (error) {
    console.error('Error creating setup intent:', error);
    return res.status(500).json({ error: 'Unable to create setup intent' });
  }
}
