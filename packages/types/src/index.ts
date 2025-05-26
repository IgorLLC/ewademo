export type Product = {
  id: string;
  name: string;
  sizeOz: number;
  sku: string;
  price: number;
};

export type Plan = {
  id: string;
  name: string;
  productId: string;
  frequency: 'weekly' | 'biweekly' | 'monthly';
  minQty: number;
};

export type Subscription = {
  id: string;
  planId: string;
  userId: string;
  status: 'active' | 'paused';
  productId?: string;
  quantity: number;
  address: string;
  nextDeliveryDate: string;
  frequency: 'weekly' | 'biweekly' | 'monthly';
  createdAt: string;
};

export type OneOffOrder = {
  id: string;
  productId: string;
  userId: string;
  status: 'pending' | 'delivered';
};

export type User = {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'admin';
};

export type Route = {
  id: string;
  date: string;
  stops: Array<{
    orderId: string;
    address: string;
    eta: string;
  }>;
};

export type Metrics = {
  mrr: number;
  churn: number;
  fulfillmentRate: number;
};

export type AuthResponse = {
  token: string;
  user: User;
};
