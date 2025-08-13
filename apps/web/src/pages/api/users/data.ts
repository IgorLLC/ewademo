import { User } from '@ewa/types';

// Shared mock database for users
export let users: User[] = [
  {
    id: 'u1',
    name: 'Juan Rivera',
    email: 'juan@cliente.com',
    phone: '(787) 123-4567',
    role: 'customer',
    address: {
      street: '123 Calle Principal, Urb. Los Jardines',
      city: 'San Juan',
      state: 'San Juan',
      zipCode: '00901',
      country: 'PR',
      instructions: 'Casa azul con portón negro'
    },
    preferences: {
      deliveryPreference: 'home_delivery',
      communicationPreference: 'both',
      timeSlotPreference: 'morning'
    },
    createdAt: '2024-01-15T10:00:00Z',
    isActive: true
  },
  {
    id: 'u2',
    name: 'María López',
    email: 'admin@ewa.com',
    phone: '(787) 987-6543',
    role: 'admin',
    createdAt: '2024-01-01T08:00:00Z',
    isActive: true
  },
  {
    id: 'u3',
    name: 'Carlos Méndez',
    email: 'sobao@business.com',
    phone: '(787) 555-0123',
    role: 'customer',
    address: {
      street: '456 Ave. Comercial, Local 12',
      city: 'Bayamón',
      state: 'Bayamón',
      zipCode: '00961',
      country: 'PR',
      instructions: 'Entrada por el estacionamiento lateral'
    },
    businessInfo: {
      businessName: 'Restaurante El Sobao',
      businessType: 'restaurant',
      taxId: '66-1234567',
      contactPerson: 'Carlos Méndez (Propietario)'
    },
    preferences: {
      deliveryPreference: 'home_delivery',
      communicationPreference: 'email',
      timeSlotPreference: 'afternoon'
    },
    notes: 'Cliente comercial - pedidos grandes los viernes',
    createdAt: '2024-02-01T14:30:00Z',
    isActive: true
  }
];