import type { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { getOrCreateCustomer, mapStripePaymentMethod, stripe } from '../../../../lib/stripe-server';

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
    const paymentMethods = await stripe.paymentMethods.list({
      customer: customer.id,
      type: 'card',
    });

    const refreshedCustomer = (await stripe.customers.retrieve(customer.id)) as Stripe.Customer;
    const defaultPaymentMethodId = (() => {
      const defaultPm = refreshedCustomer.invoice_settings?.default_payment_method;
      if (!defaultPm) return null;
      if (typeof defaultPm === 'string') return defaultPm;
      if (typeof defaultPm === 'object' && 'id' in defaultPm) {
        return (defaultPm as { id: string }).id;
      }
      return null;
    })();

    const payload = paymentMethods.data.map((pm) => mapStripePaymentMethod(pm, defaultPaymentMethodId));

    return res.status(200).json({ paymentMethods: payload });
  } catch (error) {
    console.error('Error listing payment methods:', error);
    return res.status(500).json({ error: 'Unable to load payment methods' });
  }
}
