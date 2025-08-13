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
} from '@ewa/types';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('ewa_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const login = async (email: string, password: string): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/login', { email, password });
  localStorage.setItem('ewa_token', response.data.token);
  localStorage.setItem('ewa_user', JSON.stringify(response.data.user));
  return response.data;
};

export const logout = async (): Promise<void> => {
  await api.post('/logout');
  localStorage.removeItem('ewa_token');
  localStorage.removeItem('ewa_user');
};

// Products & Plans API
export const getProducts = async (): Promise<Product[]> => {
  const response = await api.get<Product[]>('/products');
  return response.data;
};

export const createProduct = async (product: Omit<Product, 'id'>): Promise<Product> => {
  const response = await api.post<Product>('/products', product);
  return response.data;
};

export const getPlans = async (): Promise<Plan[]> => {
  const response = await api.get<Plan[]>('/plans');
  return response.data;
};

export const createPlan = async (plan: Omit<Plan, 'id'>): Promise<Plan> => {
  const response = await api.post<Plan>('/plans', plan);
  return response.data;
};

// Subscriptions API
export const getSubscriptions = async (userId?: string): Promise<Subscription[]> => {
  const params = userId ? { userId } : undefined;
  const response = await api.get<Subscription[]>('/subscriptions', { params });
  return response.data;
};

export const createSubscription = async (subscription: Omit<Subscription, 'id'>): Promise<Subscription> => {
  const response = await api.post<Subscription>('/subscriptions', subscription);
  return response.data;
};

export const updateSubscription = async (id: string, subscription: Partial<Subscription>): Promise<Subscription> => {
  const response = await api.patch<Subscription>(`/subscriptions/${id}`, subscription);
  return response.data;
};

// One-off Orders API
export const getOneOffOrders = async (userId?: string): Promise<OneOffOrder[]> => {
  const params = userId ? { userId } : undefined;
  const response = await api.get<OneOffOrder[]>('/oneoffs', { params });
  return response.data;
};

export const createOneOffOrder = async (order: Omit<OneOffOrder, 'id'>): Promise<OneOffOrder> => {
  const response = await api.post<OneOffOrder>('/oneoffs', order);
  return response.data;
};

// Deliveries API
export const getDeliveries = async (params?: { startDate?: string; endDate?: string; status?: string }): Promise<Delivery[]> => {
  const response = await api.get<Delivery[]>('/deliveries', { params });
  return response.data;
};

export const updateDeliveryStatus = async (id: string, status: string): Promise<Delivery> => {
  const response = await api.patch<Delivery>(`/deliveries/${id}`, { status });
  return response.data;
};

// Routes API
export const getRoutes = async (date?: string): Promise<Route[]> => {
  const params = date ? { date } : undefined;
  const response = await api.get<Route[]>('/routes', { params });
  return response.data;
};

export const createRoute = async (route: Omit<Route, 'id'>): Promise<Route> => {
  const response = await api.post<Route>('/routes', route);
  return response.data;
};

// Metrics API
export const getMRR = async (): Promise<number> => {
  const response = await api.get<Metrics>('/metrics/mrr');
  return response.data.mrr;
};

export const getChurn = async (): Promise<number> => {
  const response = await api.get<Metrics>('/metrics/churn');
  return response.data.churn;
};

export const getFulfillmentRate = async (): Promise<number> => {
  const response = await api.get<Metrics>('/metrics/fulfillmentRate');
  return response.data.fulfillmentRate;
};

export const getMetrics = async (): Promise<Metrics> => {
  const response = await api.get<Metrics>('/metrics');
  return response.data;
};

export const getMetricsByTimeRange = async (timeRange: string): Promise<Metrics> => {
  const response = await api.get<Metrics>('/metrics', { params: { timeRange } });
  return response.data;
};

// Current user helper
export const getCurrentUser = (): User | null => {
  const userJson = localStorage.getItem('ewa_user');
  return userJson ? JSON.parse(userJson) : null;
};

// Users API
export const getUsers = async (): Promise<User[]> => {
  const response = await api.get<User[]>('/users');
  return response.data;
};

export const getUserById = async (id: string): Promise<User> => {
  const response = await api.get<User>(`/users/${id}`);
  return response.data;
};

export const createUser = async (user: Omit<User, 'id'>): Promise<User> => {
  const response = await api.post<User>('/users', user);
  return response.data;
};

export const updateUser = async (id: string, user: Partial<User>): Promise<User> => {
  const response = await api.patch<User>(`/users/${id}`, user);
  return response.data;
};

export const deleteUser = async (id: string): Promise<void> => {
  await api.delete(`/users/${id}`);
};

export default {
  login,
  logout,
  getProducts,
  createProduct,
  getPlans,
  createPlan,
  getSubscriptions,
  createSubscription,
  updateSubscription,
  getOneOffOrders,
  createOneOffOrder,
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
  deleteUser
};
