import axios from 'axios';
import {
  Product,
  Plan,
  Subscription,
  OneOffOrder,
  Delivery,
  User,
  Route,
  Metrics,
  AuthResponse,
  PaymentMethod,
  Invoice,
} from '@ewa/types';

type ParsePointer = {
  __type: 'Pointer';
  className: string;
  objectId: string;
};

type ParseDateValue = {
  __type: 'Date';
  iso: string;
};

type SignUpInput = {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role?: User['role'];
};

type DeliveryFilters = {
  startDate?: string;
  endDate?: string;
  status?: string;
};

type MetricsFilters = {
  timeRange?: string;
};

type CreatePaymentMethodInput = {
  userId: string;
  type: PaymentMethod['type'];
  isDefault?: boolean;
  cardBrand?: string;
  cardLast4?: string;
  cardExpMonth?: number;
  cardExpYear?: number;
  paypalEmail?: string;
  bankName?: string;
  bankLast4?: string;
  billingAddress?: PaymentMethod['billingAddress'];
};

type UpdatePaymentMethodInput = Partial<{
  isDefault: boolean;
  cardBrand: string;
  cardLast4: string;
  cardExpMonth: number;
  cardExpYear: number;
  billingAddress: PaymentMethod['billingAddress'];
  isActive: boolean;
}>;

const APP_ID = process.env.NEXT_PUBLIC_BACK4APP_APPLICATION_ID;
const JS_KEY = process.env.NEXT_PUBLIC_BACK4APP_JAVASCRIPT_KEY || process.env.NEXT_PUBLIC_BACK4APP_CLIENT_KEY;
const CLIENT_KEY = process.env.NEXT_PUBLIC_BACK4APP_CLIENT_KEY;
const REST_KEY = process.env.NEXT_PUBLIC_BACK4APP_REST_API_KEY;
const SERVER_URL = process.env.NEXT_PUBLIC_BACK4APP_SERVER_URL || 'https://parseapi.back4app.com';

if (!APP_ID || !JS_KEY || !REST_KEY) {
  console.warn('[@ewa/api-client] Missing Back4App credentials. Ensure environment variables are set.');
}

const parseApi = axios.create({
  baseURL: SERVER_URL,
  headers: {
    'X-Parse-Application-Id': APP_ID ?? '',
    'X-Parse-JavaScript-Key': JS_KEY ?? '',
    ...(CLIENT_KEY ? { 'X-Parse-Client-Key': CLIENT_KEY } : {}),
    ...(REST_KEY ? { 'X-Parse-REST-API-Key': REST_KEY } : {}),
    'Content-Type': 'application/json',
  },
});

const shouldSkipSession = (config: { url?: string; method?: string }): boolean => {
  if (!config.url) return false;
  const normalized = config.url.toLowerCase();
  const method = config.method?.toLowerCase();

  if (normalized.includes('/login') || normalized.includes('/requestpasswordreset')) {
    return true;
  }

  if (normalized.includes('/users/me')) {
    return false;
  }

  if (normalized.includes('/users') && method === 'post') {
    return true;
  }

  return false;
};

parseApi.interceptors.request.use((config) => {
  if (!config.headers) config.headers = {};
  if (typeof window !== 'undefined' && !shouldSkipSession(config)) {
    const token = localStorage.getItem('ewa_token');
    if (token) config.headers['X-Parse-Session-Token'] = token;
  }
  return config;
});

const unwrapDate = (value: any): string | undefined => {
  if (!value) return undefined;
  if (typeof value === 'string') return value;
  if (typeof value === 'object' && typeof value.iso === 'string') return value.iso;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed.toISOString();
};

const toParseDate = (value?: string | null): ParseDateValue | undefined => {
  if (!value) return undefined;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return undefined;
  return { __type: 'Date', iso: parsed.toISOString() };
};

const toPointer = (className: string, objectId?: string | null): ParsePointer | undefined =>
  objectId ? { __type: 'Pointer', className, objectId } : undefined;

const stripUndefined = <T>(value: T): T => {
  if (Array.isArray(value)) {
    return value
      .map((item) => stripUndefined(item))
      .filter((item) => item !== undefined) as unknown as T;
  }

  if (value && typeof value === 'object') {
    const entries = Object.entries(value as Record<string, unknown>)
      .filter(([, v]) => v !== undefined && v !== null)
      .map(([k, v]) => [k, typeof v === 'object' ? stripUndefined(v) : v]);
    return Object.fromEntries(entries) as T;
  }

  return value;
};

const handleApiError = (error: unknown): never => {
  if (axios.isAxiosError(error)) {
    const { response, message } = error;
    const payload = response?.data as { error?: string; message?: string } | undefined;
    const finalMessage = payload?.error || payload?.message || message || 'Unexpected API error';
    throw new Error(finalMessage);
  }
  throw error instanceof Error ? error : new Error('Unexpected error');
};

const mapProduct = (item: any): Product => ({
  id: item.objectId ?? item.id,
  name: item.name,
  description: item.description ?? undefined,
  sizeOz: item.sizeOz ?? item.size ?? 0,
  sku: item.sku ?? '',
  price: item.price ?? 0,
});

const mapPlan = (item: any): Plan => ({
  id: item.objectId ?? item.id,
  name: item.name,
  productId: item.productId ?? item.product?.objectId ?? '',
  frequency: item.frequency ?? 'monthly',
  minQty: item.minQty ?? item.minQuantity ?? 1,
});

const mapSubscription = (item: any): Subscription => ({
  id: item.objectId ?? item.id,
  planId: item.planId ?? item.plan?.objectId ?? '',
  userId: item.userId ?? item.user?.objectId ?? '',
  status: item.status ?? 'active',
  productId: item.productId ?? item.product?.objectId ?? undefined,
  quantity: item.quantity ?? 1,
  address: item.address ?? '',
  nextDeliveryDate: unwrapDate(item.nextDeliveryDate) ?? '',
  frequency: item.frequency ?? 'monthly',
  createdAt: unwrapDate(item.createdAt) ?? new Date().toISOString(),
});

const mapOneOffOrder = (item: any): OneOffOrder => ({
  id: item.objectId ?? item.id,
  productId: item.productId ?? item.product?.objectId ?? '',
  userId: item.userId ?? item.user?.objectId ?? '',
  status: item.status ?? 'pending',
});

const mapDelivery = (item: any): Delivery => ({
  id: item.objectId ?? item.id,
  subscriptionId: item.subscriptionId ?? item.subscription?.objectId ?? '',
  userId: item.userId ?? item.user?.objectId ?? '',
  orderId: item.orderId ?? item.order?.objectId ?? '',
  routeId: item.routeId ?? item.route?.objectId ?? undefined,
  pickupPointId: item.pickupPointId ?? item.pickupPoint?.objectId ?? undefined,
  deliveryType: item.deliveryType ?? 'home_delivery',
  status: item.status ?? 'scheduled',
  scheduledDate: unwrapDate(item.scheduledDate) ?? '',
  timeSlotId: item.timeSlotId ?? item.timeSlot?.objectId ?? undefined,
  actualDeliveryDate: unwrapDate(item.actualDeliveryDate),
  estimatedArrivalTime: item.estimatedArrivalTime ?? undefined,
  actualArrivalTime: item.actualArrivalTime ?? undefined,
  deliveryAddress: stripUndefined({
    street: item.deliveryAddress?.street ?? '',
    city: item.deliveryAddress?.city ?? '',
    state: item.deliveryAddress?.state ?? '',
    zipCode: item.deliveryAddress?.zipCode ?? '',
    lat: item.deliveryAddress?.lat,
    lng: item.deliveryAddress?.lng,
    instructions: item.deliveryAddress?.instructions,
  }),
  recipient: stripUndefined({
    name: item.recipient?.name ?? '',
    phone: item.recipient?.phone ?? '',
    email: item.recipient?.email ?? '',
  }),
  items: Array.isArray(item.items)
    ? item.items.map((entry: any) =>
        stripUndefined({
          productId: entry.productId ?? entry.product?.objectId ?? '',
          productName: entry.productName ?? '',
          quantity: entry.quantity ?? 0,
          size: entry.size ?? '',
        })
      )
    : [],
  driverId: item.driverId ?? undefined,
  driverName: item.driverName ?? undefined,
  driverPhone: item.driverPhone ?? undefined,
  notes: item.notes ?? undefined,
  customerNotes: item.customerNotes ?? undefined,
  deliveryPhoto: item.deliveryPhoto ?? undefined,
});

const mapRoute = (item: any): Route => ({
  id: item.objectId ?? item.id,
  name: item.name,
  area: item.area ?? '',
  driverId: item.driverId ?? '',
  driverName: item.driverName ?? '',
  status: item.status ?? 'pending',
  deliveryDate: unwrapDate(item.deliveryDate) ?? '',
  startTime: unwrapDate(item.startTime) ?? '',
  estimatedEndTime: unwrapDate(item.estimatedEndTime) ?? '',
  actualEndTime: unwrapDate(item.actualEndTime),
  stops: Array.isArray(item.stops)
    ? item.stops.map((stop: any) =>
        stripUndefined({
          id: stop.id ?? stop.objectId ?? '',
          address: stop.address ?? '',
          lat: stop.lat ?? 0,
          lng: stop.lng ?? 0,
          status: stop.status ?? 'pending',
          eta: stop.eta ?? '',
        })
      )
    : [],
  details: item.details
    ? {
        stops: Array.isArray(item.details.stops)
          ? item.details.stops.map((stop: any) =>
              stripUndefined({
                id: stop.id ?? stop.objectId ?? '',
                address: stop.address ?? '',
                lat: stop.lat ?? 0,
                lng: stop.lng ?? 0,
                status: stop.status ?? 'pending',
                eta: stop.eta ?? '',
              })
            )
          : [],
      }
    : undefined,
});

const mapMetrics = (item: any): Metrics => ({
  mrr: item.mrr ?? item.monthlyRecurringRevenue ?? 0,
  churn: item.churn ?? item.monthlyChurn ?? 0,
  fulfillmentRate: item.fulfillmentRate ?? item.onTimeRate ?? 0,
});

const mapPaymentMethod = (item: any): PaymentMethod => ({
  id: item.objectId ?? item.id,
  userId: item.userId ?? item.user?.objectId ?? '',
  type: item.type ?? 'card',
  isDefault: Boolean(item.isDefault),
  cardLast4: item.cardLast4 ?? item.cardLastFour ?? item.last4 ?? undefined,
  cardBrand: item.cardBrand ?? item.brand ?? undefined,
  cardExpMonth: item.cardExpMonth ?? item.expMonth ?? undefined,
  cardExpYear: item.cardExpYear ?? item.expYear ?? undefined,
  paypalEmail: item.paypalEmail ?? undefined,
  bankName: item.bankName ?? undefined,
  bankLast4: item.bankLast4 ?? undefined,
  billingAddress: {
    street: item.billingAddress?.street ?? '',
    city: item.billingAddress?.city ?? '',
    state: item.billingAddress?.state ?? '',
    zipCode: item.billingAddress?.zipCode ?? '',
    country: item.billingAddress?.country ?? 'PR',
  },
  isActive: item.isActive ?? true,
  createdAt: unwrapDate(item.createdAt) ?? new Date().toISOString(),
  updatedAt: unwrapDate(item.updatedAt) ?? new Date().toISOString(),
});

const mapInvoice = (item: any): Invoice => ({
  id: item.objectId ?? item.id,
  subscriptionId: item.subscriptionId ?? item.subscription?.objectId ?? '',
  userId: item.userId ?? item.user?.objectId ?? '',
  invoiceNumber: item.invoiceNumber ?? item.number ?? '',
  status: item.status ?? 'pending',
  amount: item.amount ?? 0,
  taxAmount: item.taxAmount ?? 0,
  totalAmount: item.totalAmount ?? item.amount + (item.taxAmount ?? 0) ?? 0,
  currency: item.currency ?? 'USD',
  dueDate: unwrapDate(item.dueDate) ?? new Date().toISOString(),
  paidAt: unwrapDate(item.paidAt),
  paymentMethodId: item.paymentMethodId ?? item.paymentMethod?.objectId ?? undefined,
  items: Array.isArray(item.items)
    ? item.items.map((entry: any) => ({
        description: entry.description ?? '',
        quantity: entry.quantity ?? 1,
        unitPrice: entry.unitPrice ?? entry.price ?? 0,
        totalPrice: entry.totalPrice ?? entry.amount ?? 0,
      }))
    : [],
});

const mapUser = (item: any): User => {
  const addressSource = item.address ?? item.addressInfo;
  const businessSource = item.businessInfo ?? item.business ?? undefined;
  const preferencesSource = item.preferences ?? item.preference ?? undefined;

  return stripUndefined({
    id: item.objectId ?? item.id,
    name: item.name ?? item.fullName ?? item.username ?? '',
    email: item.email ?? item.username ?? '',
    phone: item.phone ?? item.phoneNumber ?? undefined,
    role: (item.role ?? (item.isAdmin ? 'admin' : 'customer')) as User['role'],
    address: addressSource
      ? {
          street: addressSource.street ?? addressSource.line1 ?? '',
          city: addressSource.city ?? '',
          state: addressSource.state ?? addressSource.region ?? '',
          zip: addressSource.zip ?? addressSource.zipCode ?? '',
          country: addressSource.country ?? 'PR',
          instructions: addressSource.instructions ?? addressSource.notes ?? undefined,
          lat: addressSource.lat ?? addressSource.latitude ?? undefined,
          lng: addressSource.lng ?? addressSource.longitude ?? undefined,
        }
      : undefined,
    businessInfo: businessSource
      ? {
          businessName: businessSource.businessName ?? businessSource.name ?? undefined,
          businessType: businessSource.businessType ?? businessSource.type ?? undefined,
          taxId: businessSource.taxId ?? undefined,
          contactPerson: businessSource.contactPerson ?? undefined,
        }
      : undefined,
    preferences: preferencesSource
      ? {
          deliveryPreference: preferencesSource.deliveryPreference ?? 'home_delivery',
          communicationPreference: preferencesSource.communicationPreference ?? 'email',
          timeSlotPreference: preferencesSource.timeSlotPreference ?? 'morning',
        }
      : undefined,
    notes: item.notes ?? undefined,
    createdAt: unwrapDate(item.createdAt),
    updatedAt: unwrapDate(item.updatedAt),
    isActive: typeof item.isActive === 'boolean' ? item.isActive : undefined,
  }) as User;
};

const fetchCreatedObject = async <T>(path: string, mapper: (item: any) => T): Promise<T> => {
  const { data } = await parseApi.get(path);
  return mapper(data);
};

export const login = async (email: string, password: string): Promise<AuthResponse> => {
  try {
    const { data } = await parseApi.get('/login', {
      params: { username: email, password },
      headers: { 'X-Parse-Revocable-Session': '1' },
    });

    const token = data.sessionToken as string;
    let user = mapUser(data);

    if (!user.id && data.objectId) {
      user = await fetchCreatedObject<User>(`/users/${data.objectId}`, mapUser);
    }

    if (typeof window !== 'undefined') {
      localStorage.setItem('ewa_token', token);
      localStorage.setItem('ewa_user', JSON.stringify(user));
    }

    return { token, user };
  } catch (error) {
    handleApiError(error);
  }
  throw new Error('Unhandled login error');
};

export const logout = async (): Promise<void> => {
  try {
    await parseApi.post('/logout');
  } catch (error) {
    console.warn('Logout failed:', error);
  } finally {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('ewa_token');
      localStorage.removeItem('ewa_user');
    }
  }
};

export const signUp = async ({ name, email, password, phone, role = 'customer' }: SignUpInput): Promise<AuthResponse> => {
  try {
    const payload = stripUndefined({
      username: email,
      email,
      password,
      name,
      phone,
      role,
      isActive: true,
    });

    const { data } = await parseApi.post('/users', payload, {
      headers: { 'X-Parse-Revocable-Session': '1' },
    });

    const token = data.sessionToken as string;

    const meResponse = await parseApi.get('/users/me', {
      headers: {
        'X-Parse-Session-Token': token,
        'X-Parse-Application-Id': APP_ID ?? '',
        'X-Parse-JavaScript-Key': JS_KEY ?? '',
      },
    });

    const user = mapUser(meResponse.data);

    if (typeof window !== 'undefined') {
      localStorage.setItem('ewa_token', token);
      localStorage.setItem('ewa_user', JSON.stringify(user));
    }

    return { token, user };
  } catch (error) {
    handleApiError(error);
  }
  throw new Error('Unhandled sign-up error');
};

export const requestPasswordReset = async (email: string): Promise<void> => {
  try {
    await parseApi.post('/requestPasswordReset', { email });
  } catch (error) {
    handleApiError(error);
  }
};

export const changePassword = async (email: string, oldPassword: string, newPassword: string): Promise<void> => {
  try {
    const loginResponse = await parseApi.get('/login', {
      params: { username: email, password: oldPassword },
      headers: { 'X-Parse-Revocable-Session': '1' },
    });

    const sessionToken = loginResponse.data.sessionToken as string;
    const userId = loginResponse.data.objectId as string;

    await parseApi.put(
      `/users/${userId}`,
      stripUndefined({ password: newPassword }),
      {
        headers: {
          'X-Parse-Session-Token': sessionToken,
        },
      }
    );

    if (typeof window !== 'undefined') {
      localStorage.setItem('ewa_token', sessionToken);
      try {
        const me = await parseApi.get('/users/me', {
          headers: {
            'X-Parse-Session-Token': sessionToken,
            'X-Parse-Application-Id': APP_ID ?? '',
            'X-Parse-JavaScript-Key': JS_KEY ?? '',
          },
        });
        localStorage.setItem('ewa_user', JSON.stringify(mapUser(me.data)));
      } catch (error) {
        console.warn('Unable to refresh user after password change:', error);
      }
    }
  } catch (error) {
    handleApiError(error);
  }
};

export const getProducts = async (): Promise<Product[]> => {
  try {
    const { data } = await parseApi.get('/classes/Product', {
      params: { order: 'name' },
    });
    return Array.isArray(data.results) ? data.results.map(mapProduct) : [];
  } catch (error) {
    handleApiError(error);
  }
  return [];
};

export const createProduct = async (product: Omit<Product, 'id'>): Promise<Product> => {
  try {
    const payload = stripUndefined({
      name: product.name,
      description: product.description,
      sizeOz: product.sizeOz,
      sku: product.sku,
      price: product.price,
    });

    const { data } = await parseApi.post('/classes/Product', payload);
    return fetchCreatedObject(`/classes/Product/${data.objectId}`, mapProduct);
  } catch (error) {
    handleApiError(error);
  }
  throw new Error('Unhandled createProduct error');
};

export const getPlans = async (): Promise<Plan[]> => {
  try {
    const { data } = await parseApi.get('/classes/SubscriptionPlan', {
      params: { order: 'name' },
    });
    return Array.isArray(data.results) ? data.results.map(mapPlan) : [];
  } catch (error) {
    handleApiError(error);
  }
  return [];
};

export const createPlan = async (plan: Omit<Plan, 'id'>): Promise<Plan> => {
  try {
    const payload = stripUndefined({
      name: plan.name,
      productId: plan.productId,
      product: toPointer('Product', plan.productId),
      frequency: plan.frequency,
      minQty: plan.minQty,
    });

    const { data } = await parseApi.post('/classes/SubscriptionPlan', payload);
    return fetchCreatedObject(`/classes/SubscriptionPlan/${data.objectId}`, mapPlan);
  } catch (error) {
    handleApiError(error);
  }
  throw new Error('Unhandled createPlan error');
};

export const getSubscriptions = async (userId?: string): Promise<Subscription[]> => {
  try {
    const params: Record<string, string> = { order: '-createdAt' };

    if (userId) {
      const pointer = toPointer('_User', userId);
      const orFilters: unknown[] = [{ userId }];
      if (pointer) orFilters.push({ user: pointer });
      params.where = JSON.stringify({ $or: orFilters });
    }

    const { data } = await parseApi.get('/classes/Subscription', { params });
    return Array.isArray(data.results) ? data.results.map(mapSubscription) : [];
  } catch (error) {
    handleApiError(error);
  }
  return [];
};

export const createSubscription = async (subscription: Omit<Subscription, 'id' | 'createdAt'>): Promise<Subscription> => {
  try {
    const payload = stripUndefined({
      planId: subscription.planId,
      plan: toPointer('SubscriptionPlan', subscription.planId),
      userId: subscription.userId,
      user: toPointer('_User', subscription.userId),
      status: subscription.status,
      productId: subscription.productId,
      product: toPointer('Product', subscription.productId),
      quantity: subscription.quantity,
      address: subscription.address,
      nextDeliveryDate: toParseDate(subscription.nextDeliveryDate),
      frequency: subscription.frequency,
    });

    const { data } = await parseApi.post('/classes/Subscription', payload);
    return fetchCreatedObject(`/classes/Subscription/${data.objectId}`, mapSubscription);
  } catch (error) {
    handleApiError(error);
  }
  throw new Error('Unhandled createSubscription error');
};

export const updateSubscription = async (id: string, subscription: Partial<Subscription>): Promise<Subscription> => {
  try {
    const payload = stripUndefined({
      planId: subscription.planId,
      plan: toPointer('SubscriptionPlan', subscription.planId),
      userId: subscription.userId,
      user: toPointer('_User', subscription.userId),
      status: subscription.status,
      productId: subscription.productId,
      product: toPointer('Product', subscription.productId),
      quantity: subscription.quantity,
      address: subscription.address,
      nextDeliveryDate: toParseDate(subscription.nextDeliveryDate),
      frequency: subscription.frequency,
    });

    await parseApi.put(`/classes/Subscription/${id}`, payload);
    return fetchCreatedObject(`/classes/Subscription/${id}`, mapSubscription);
  } catch (error) {
    handleApiError(error);
  }
  throw new Error('Unhandled updateSubscription error');
};

export const getOneOffOrders = async (userId?: string): Promise<OneOffOrder[]> => {
  try {
    const params: Record<string, string> = { order: '-createdAt' };
    if (userId) {
      const pointer = toPointer('_User', userId);
      const orFilters: unknown[] = [{ userId }];
      if (pointer) orFilters.push({ user: pointer });
      params.where = JSON.stringify({ $or: orFilters });
    }

    const { data } = await parseApi.get('/classes/OneOffOrder', { params });
    return Array.isArray(data.results) ? data.results.map(mapOneOffOrder) : [];
  } catch (error) {
    handleApiError(error);
  }
  return [];
};

export const createOneOffOrder = async (order: Omit<OneOffOrder, 'id'>): Promise<OneOffOrder> => {
  try {
    const payload = stripUndefined({
      productId: order.productId,
      product: toPointer('Product', order.productId),
      userId: order.userId,
      user: toPointer('_User', order.userId),
      status: order.status,
    });

    const { data } = await parseApi.post('/classes/OneOffOrder', payload);
    return fetchCreatedObject(`/classes/OneOffOrder/${data.objectId}`, mapOneOffOrder);
  } catch (error) {
    handleApiError(error);
  }
  throw new Error('Unhandled createOneOffOrder error');
};

export const getPaymentMethods = async (userId?: string): Promise<PaymentMethod[]> => {
  try {
    const params: Record<string, string> = { order: '-isDefault,-updatedAt' };
    if (userId) {
      const pointer = toPointer('_User', userId);
      params.where = JSON.stringify(
        pointer
          ? { $or: [{ userId }, { user: pointer }] }
          : { userId },
      );
    }

    const { data } = await parseApi.get('/classes/PaymentMethod', { params });
    return Array.isArray(data.results) ? data.results.map(mapPaymentMethod) : [];
  } catch (error) {
    handleApiError(error);
  }
  return [];
};

export const createPaymentMethod = async (
  input: CreatePaymentMethodInput,
): Promise<PaymentMethod> => {
  try {
    const payload = stripUndefined({
      userId: input.userId,
      user: toPointer('_User', input.userId),
      type: input.type,
      isDefault: input.isDefault ?? false,
      cardBrand: input.cardBrand,
      cardLast4: input.cardLast4,
      cardExpMonth: input.cardExpMonth,
      cardExpYear: input.cardExpYear,
      paypalEmail: input.paypalEmail,
      bankName: input.bankName,
      bankLast4: input.bankLast4,
      billingAddress: input.billingAddress,
      isActive: true,
    });

    const { data } = await parseApi.post('/classes/PaymentMethod', payload);
    return fetchCreatedObject(`/classes/PaymentMethod/${data.objectId}`, mapPaymentMethod);
  } catch (error) {
    handleApiError(error);
  }
  throw new Error('Unhandled createPaymentMethod error');
};

export const updatePaymentMethod = async (
  id: string,
  input: UpdatePaymentMethodInput,
): Promise<PaymentMethod> => {
  try {
    await parseApi.put(`/classes/PaymentMethod/${id}`, stripUndefined(input));
    return fetchCreatedObject(`/classes/PaymentMethod/${id}`, mapPaymentMethod);
  } catch (error) {
    handleApiError(error);
  }
  throw new Error('Unhandled updatePaymentMethod error');
};

export const getInvoices = async (userId?: string): Promise<Invoice[]> => {
  try {
    const params: Record<string, string> = { order: '-dueDate' };
    if (userId) {
      const pointer = toPointer('_User', userId);
      params.where = JSON.stringify(
        pointer
          ? { $or: [{ userId }, { user: pointer }] }
          : { userId },
      );
    }

    const { data } = await parseApi.get('/classes/Invoice', { params });
    return Array.isArray(data.results) ? data.results.map(mapInvoice) : [];
  } catch (error) {
    handleApiError(error);
  }
  return [];
};

export const getDeliveries = async (filters?: DeliveryFilters): Promise<Delivery[]> => {
  try {
    const where: Record<string, unknown> = {};

    if (filters?.status) {
      where.status = filters.status;
    }

    if (filters?.startDate || filters?.endDate) {
      const dateConditions: Record<string, unknown> = {};
      if (filters?.startDate) {
        dateConditions.$gte = toParseDate(filters.startDate);
      }
      if (filters?.endDate) {
        dateConditions.$lte = toParseDate(filters.endDate);
      }
      where.scheduledDate = dateConditions;
    }

    const params: Record<string, string> = { order: '-scheduledDate' };
    if (Object.keys(where).length > 0) {
      params.where = JSON.stringify(where);
    }

    const { data } = await parseApi.get('/classes/Delivery', { params });
    return Array.isArray(data.results) ? data.results.map(mapDelivery) : [];
  } catch (error) {
    handleApiError(error);
  }
  return [];
};

export const updateDeliveryStatus = async (id: string, status: string): Promise<Delivery> => {
  try {
    const payload = stripUndefined({ status });
    await parseApi.put(`/classes/Delivery/${id}`, payload);
    return fetchCreatedObject(`/classes/Delivery/${id}`, mapDelivery);
  } catch (error) {
    handleApiError(error);
  }
  throw new Error('Unhandled updateDeliveryStatus error');
};

export const getRoutes = async (date?: string): Promise<Route[]> => {
  try {
    const params: Record<string, string> = { order: '-deliveryDate' };
    if (date) {
      params.where = JSON.stringify({
        deliveryDate: {
          $eq: toParseDate(date),
        },
      });
    }

    const { data } = await parseApi.get('/classes/Route', { params });
    return Array.isArray(data.results) ? data.results.map(mapRoute) : [];
  } catch (error) {
    handleApiError(error);
  }
  return [];
};

export const createRoute = async (route: Omit<Route, 'id'>): Promise<Route> => {
  try {
    const payload = stripUndefined({
      name: route.name,
      area: route.area,
      driverId: route.driverId,
      driverName: route.driverName,
      status: route.status,
      deliveryDate: toParseDate(route.deliveryDate),
      startTime: toParseDate(route.startTime),
      estimatedEndTime: toParseDate(route.estimatedEndTime),
      actualEndTime: toParseDate(route.actualEndTime),
      stops: route.stops,
      details: route.details,
    });

    const { data } = await parseApi.post('/classes/Route', payload);
    return fetchCreatedObject(`/classes/Route/${data.objectId}`, mapRoute);
  } catch (error) {
    handleApiError(error);
  }
  throw new Error('Unhandled createRoute error');
};

const fetchMetrics = async (filters?: MetricsFilters): Promise<Metrics | null> => {
  const params: Record<string, string> = {
    limit: '1',
    order: '-createdAt',
  };

  if (filters?.timeRange) {
    params.where = JSON.stringify({ timeRange: filters.timeRange });
  }

  const { data } = await parseApi.get('/classes/MetricsSnapshot', { params });
  if (Array.isArray(data.results) && data.results.length > 0) {
    return mapMetrics(data.results[0]);
  }
  return null;
};

export const getMRR = async (): Promise<number> => {
  try {
    const metrics = await fetchMetrics();
    return metrics?.mrr ?? 0;
  } catch (error) {
    handleApiError(error);
  }
  return 0;
};

export const getChurn = async (): Promise<number> => {
  try {
    const metrics = await fetchMetrics();
    return metrics?.churn ?? 0;
  } catch (error) {
    handleApiError(error);
  }
  return 0;
};

export const getFulfillmentRate = async (): Promise<number> => {
  try {
    const metrics = await fetchMetrics();
    return metrics?.fulfillmentRate ?? 0;
  } catch (error) {
    handleApiError(error);
  }
  return 0;
};

export const getMetrics = async (): Promise<Metrics> => {
  try {
    const metrics = await fetchMetrics();
    return metrics ?? { mrr: 0, churn: 0, fulfillmentRate: 0 };
  } catch (error) {
    handleApiError(error);
  }
  return { mrr: 0, churn: 0, fulfillmentRate: 0 };
};

export const getMetricsByTimeRange = async (timeRange: string): Promise<Metrics> => {
  try {
    const metrics = await fetchMetrics({ timeRange });
    return metrics ?? { mrr: 0, churn: 0, fulfillmentRate: 0 };
  } catch (error) {
    handleApiError(error);
  }
  return { mrr: 0, churn: 0, fulfillmentRate: 0 };
};

export const getCurrentUser = (): User | null => {
  if (typeof window === 'undefined') return null;
  const userJson = localStorage.getItem('ewa_user');
  return userJson ? (JSON.parse(userJson) as User) : null;
};

export const getUsers = async (): Promise<User[]> => {
  try {
    const { data } = await parseApi.get('/users', {
      params: { order: '-createdAt' },
    });
    return Array.isArray(data.results) ? data.results.map(mapUser) : [];
  } catch (error) {
    handleApiError(error);
  }
  return [];
};

export const getUserById = async (id: string): Promise<User> => {
  try {
    const { data } = await parseApi.get(`/users/${id}`);
    return mapUser(data);
  } catch (error) {
    handleApiError(error);
  }
  throw new Error('Unhandled getUserById error');
};

export const createUser = async (user: Omit<User, 'id'> & { password: string }): Promise<User> => {
  try {
    const payload = stripUndefined({
      username: user.email,
      email: user.email,
      password: user.password,
      name: user.name,
      phone: user.phone,
      role: user.role,
      isAdmin: user.role !== 'customer',
      isActive: user.isActive ?? true,
      address: user.address,
      businessInfo: user.businessInfo,
      preferences: user.preferences,
      notes: user.notes,
    });

    const { data } = await parseApi.post('/users', payload);
    return fetchCreatedObject(`/users/${data.objectId}`, mapUser);
  } catch (error) {
    handleApiError(error);
  }
  throw new Error('Unhandled createUser error');
};

export const updateUser = async (id: string, user: Partial<User>): Promise<User> => {
  try {
    const payload = stripUndefined({
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      isAdmin: user.role ? user.role !== 'customer' : undefined,
      isActive: user.isActive,
      address: user.address,
      businessInfo: user.businessInfo,
      preferences: user.preferences,
      notes: user.notes,
    });

    await parseApi.put(`/users/${id}`, payload);
    return fetchCreatedObject(`/users/${id}`, mapUser);
  } catch (error) {
    handleApiError(error);
  }
  throw new Error('Unhandled updateUser error');
};

export const deleteUser = async (id: string): Promise<void> => {
  try {
    await parseApi.delete(`/users/${id}`);
  } catch (error) {
    handleApiError(error);
  }
};

export default {
  login,
  logout,
  signUp,
  requestPasswordReset,
  changePassword,
  getProducts,
  createProduct,
  getPlans,
  createPlan,
  getSubscriptions,
  createSubscription,
  updateSubscription,
  getOneOffOrders,
  createOneOffOrder,
  getPaymentMethods,
  createPaymentMethod,
  updatePaymentMethod,
  getInvoices,
  getDeliveries,
  updateDeliveryStatus,
  getRoutes,
  createRoute,
  getMRR,
  getChurn,
  getFulfillmentRate,
  getMetrics,
  getMetricsByTimeRange,
  getCurrentUser,
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
