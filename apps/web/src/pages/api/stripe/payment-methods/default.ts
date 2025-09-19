import type { NextApiRequest, NextApiResponse } from 'next';
import { getOrCreateCustomer, stripe } from '../../../../lib/stripe-server';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userId, email, name, paymentMethodId } = req.body as {
      userId?: string;
      email?: string;
      name?: string;
      paymentMethodId?: string;
    };

    if (!userId || !email || !paymentMethodId) {
      return res.status(400).json({ error: 'Missing userId, email or paymentMethodId' });
    }

    const customer = await getOrCreateCustomer({ userId, email, name });

    await stripe.customers.update(customer.id, {
      invoice_settings: { default_payment_method: paymentMethodId },
    });

    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error('Error setting default payment method:', error);
    return res.status(500).json({ error: 'Unable to set default payment method' });
  }
}
