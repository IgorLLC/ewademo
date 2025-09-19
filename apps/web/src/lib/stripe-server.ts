import Stripe from 'stripe';

const secretKey = process.env.STRIPE_SECRET_KEY;

if (!secretKey) {
  throw new Error('STRIPE_SECRET_KEY is not set.');
}

export const stripe = new Stripe(secretKey, {
  apiVersion: '2022-11-15',
});

type CustomerIdentity = {
  userId: string;
  email: string;
  name?: string;
};

export const getOrCreateCustomer = async ({
  userId,
  email,
  name,
}: CustomerIdentity): Promise<Stripe.Customer> => {
  let customer: Stripe.Customer | null = null;

  try {
    const search = await stripe.customers.search({
      query: `metadata['parseUserId']:'${userId}'`,
      limit: 1,
    });
    if (search.data.length > 0) {
      customer = search.data[0];
    }
  } catch (error) {
    console.warn('Stripe customer search not available, falling back to list', error);
  }

  if (!customer) {
    const list = await stripe.customers.list({ email, limit: 1 });
    if (list.data.length > 0 && !list.data[0].deleted) {
      customer = list.data[0] as Stripe.Customer;
    }
  }

  if (!customer) {
    customer = await stripe.customers.create({
      email,
      name,
      metadata: { parseUserId: userId },
    });
    return customer;
  }

  if (!customer.metadata?.parseUserId) {
    await stripe.customers.update(customer.id, {
      metadata: { ...customer.metadata, parseUserId: userId },
    });
    customer = (await stripe.customers.retrieve(customer.id)) as Stripe.Customer;
  }

  return customer;
};

export const mapStripePaymentMethod = (
  paymentMethod: Stripe.PaymentMethod,
  defaultPaymentMethodId: string | null,
) => ({
  id: paymentMethod.id,
  brand: paymentMethod.card?.brand ?? 'card',
  last4: paymentMethod.card?.last4 ?? '',
  expMonth: paymentMethod.card?.exp_month ?? null,
  expYear: paymentMethod.card?.exp_year ?? null,
  isDefault: paymentMethod.id === defaultPaymentMethodId,
});

export const mapStripeInvoice = (invoice: Stripe.Invoice) => ({
  id: invoice.id,
  invoiceNumber: invoice.number ?? invoice.id,
  status: invoice.status ?? 'open',
  amount: (invoice.subtotal ?? 0) / 100,
  taxAmount: (invoice.tax ?? 0) / 100,
  totalAmount: (invoice.total ?? 0) / 100,
  currency: invoice.currency?.toUpperCase() ?? 'USD',
  dueDate: invoice.due_date
    ? new Date(invoice.due_date * 1000).toISOString()
    : invoice.created
    ? new Date(invoice.created * 1000).toISOString()
    : new Date().toISOString(),
});
