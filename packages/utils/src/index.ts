// Utilidades de fecha
import { format, parseISO, addDays, subDays, isAfter, isBefore } from 'date-fns';

// Utilidades de validación
import { z } from 'zod';

export { format, parseISO, addDays, subDays, isAfter, isBefore };
export { z };

// Utilidades de objetos y arrays
export { get, set, cloneDeep, debounce, throttle } from 'lodash';

// Utilidades específicas de EWA
export const formatCurrency = (amount: number, currency = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
};

export const formatPhoneNumber = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  return phone;
};

export const generateOrderNumber = (): string => {
  const timestamp = Date.now().toString();
  const random = Math.random().toString(36).substr(2, 5).toUpperCase();
  return `EWA-${timestamp.slice(-6)}-${random}`;
};

export const calculateDeliveryDate = (frequency: 'weekly' | 'biweekly' | 'monthly'): Date => {
  const today = new Date();
  switch (frequency) {
    case 'weekly':
      return addDays(today, 7);
    case 'biweekly':
      return addDays(today, 14);
    case 'monthly':
      return addDays(today, 30);
    default:
      return addDays(today, 7);
  }
};

// Esquemas de validación comunes
export const phoneSchema = z.string().regex(/^\+?[1-9]\d{1,14}$/, 'Número de teléfono inválido');
export const emailSchema = z.string().email('Email inválido');
export const addressSchema = z.object({
  street: z.string().min(1, 'Dirección requerida'),
  city: z.string().min(1, 'Ciudad requerida'),
  state: z.string().min(1, 'Estado requerido'),
  zipCode: z.string().min(5, 'Código postal requerido'),
}); 