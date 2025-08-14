import { User } from '@ewa/types';

// Base de datos mock compartida para usuarios (15 usuarios PR con nombres reales y lat/lng)
export let users: User[] = [
  {
    id: 'u1',
    name: 'Carmen Isabel Rodríguez Morales',
    email: 'carmen.rodriguez@gmail.com',
    phone: '(787) 555-0123',
    role: 'customer',
    address: {
      street: '123 Calle Loíza',
      city: 'San Juan',
      state: 'PR',
      zip: '00911',
      country: 'PR',
      instructions: 'Apartamento 2B, timbre azul',
      lat: 18.4526,
      lng: -66.0515
    },
    preferences: { deliveryPreference: 'home_delivery', communicationPreference: 'both', timeSlotPreference: 'morning' },
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-08-14T14:30:00Z',
    isActive: true
  },
  {
    id: 'u2',
    name: 'María Elena López Santos',
    email: 'maria.admin@ewa.com',
    phone: '(787) 555-0456',
    role: 'admin',
    address: {
      street: '456 Ave. Ponce de León',
      city: 'San Juan',
      state: 'PR',
      zip: '00907',
      country: 'PR',
      lat: 18.4514,
      lng: -66.0730
    },
    createdAt: '2024-01-10T08:00:00Z',
    updatedAt: '2024-08-14T12:15:00Z',
    isActive: true
  },
  {
    id: 'u3',
    name: 'José Carlos Vega Mendoza',
    email: 'carlos@sobaorestaurant.com',
    phone: '(787) 555-0789',
    role: 'customer',
    address: {
      street: '789 Calle Fortaleza',
      city: 'San Juan',
      state: 'PR',
      zip: '00901',
      country: 'PR',
      instructions: 'Entrada por la plaza',
      lat: 18.4653,
      lng: -66.1120
    },
    businessInfo: { businessName: 'Restaurante Sobao', businessType: 'restaurant', taxId: '66-1234567', contactPerson: 'José C. Vega' },
    preferences: { deliveryPreference: 'home_delivery', communicationPreference: 'email', timeSlotPreference: 'afternoon' },
    notes: 'Cliente comercial con pedidos regulares',
    createdAt: '2024-02-01T09:00:00Z',
    updatedAt: '2024-08-14T11:45:00Z',
    isActive: true
  },
  {
    id: 'u4',
    name: 'Ana Sofía Torres Rivera',
    email: 'anasofia.torres@outlook.com',
    phone: '(787) 555-0234',
    role: 'customer',
    address: {
      street: '234 Calle San Sebastián',
      city: 'San Juan',
      state: 'PR',
      zip: '00901',
      country: 'PR',
      instructions: 'Casa verde con portón negro',
      lat: 18.4669,
      lng: -66.1150
    },
    preferences: { deliveryPreference: 'home_delivery', communicationPreference: 'email', timeSlotPreference: 'afternoon' },
    createdAt: '2024-03-20T09:30:00Z',
    updatedAt: '2024-08-14T16:00:00Z',
    isActive: true
  },
  {
    id: 'u5',
    name: 'Miguel Ángel Díaz Fernández',
    email: 'miguel.diaz@yahoo.com',
    phone: '(787) 555-0345',
    role: 'customer',
    address: {
      street: '567 Calle del Cristo',
      city: 'San Juan',
      state: 'PR',
      zip: '00901',
      country: 'PR',
      instructions: 'Edificio azul, 3er piso',
      lat: 18.4644,
      lng: -66.1177
    },
    preferences: { deliveryPreference: 'pickup_point', communicationPreference: 'sms', timeSlotPreference: 'evening' },
    createdAt: '2024-04-05T11:15:00Z',
    updatedAt: '2024-08-14T10:45:00Z',
    isActive: true
  },
  {
    id: 'u6',
    name: 'Isabella Marie Ortega Ruiz',
    email: 'isabella.ortega@gmail.com',
    phone: '(787) 555-0456',
    role: 'customer',
    address: {
      street: '890 Ave. Ashford',
      city: 'San Juan',
      state: 'PR',
      zip: '00907',
      country: 'PR',
      instructions: 'Condominio Ocean View, Torre A',
      lat: 18.4568,
      lng: -66.0722
    },
    preferences: { deliveryPreference: 'home_delivery', communicationPreference: 'both', timeSlotPreference: 'morning' },
    createdAt: '2024-05-12T14:20:00Z',
    updatedAt: '2024-08-14T13:30:00Z',
    isActive: true
  },
  {
    id: 'u7',
    name: 'Luis Alberto Santiago Colón',
    email: 'luis.santiago@icloud.com',
    phone: '(787) 555-0678',
    role: 'customer',
    address: {
      street: '321 Calle Comercio',
      city: 'Bayamón',
      state: 'PR',
      zip: '00961',
      country: 'PR',
      lat: 18.3985,
      lng: -66.1557
    },
    preferences: { deliveryPreference: 'home_delivery', communicationPreference: 'email', timeSlotPreference: 'afternoon' },
    createdAt: '2024-05-22T10:00:00Z',
    isActive: true
  },
  {
    id: 'u8',
    name: 'Valeria Nicole Pérez García',
    email: 'valeria.perez@gmail.com',
    phone: '(787) 555-0890',
    role: 'customer',
    address: {
      street: '55 Calle Betances',
      city: 'Caguas',
      state: 'PR',
      zip: '00725',
      country: 'PR',
      lat: 18.2341,
      lng: -66.0485
    },
    preferences: { deliveryPreference: 'home_delivery', communicationPreference: 'sms', timeSlotPreference: 'morning' },
    createdAt: '2024-06-01T09:45:00Z',
    isActive: true
  },
  {
    id: 'u9',
    name: 'Javier Antonio Ramos Ortiz',
    email: 'javier.ramos@outlook.com',
    phone: '(787) 555-0912',
    role: 'customer',
    address: {
      street: '78 Calle Hostos',
      city: 'Ponce',
      state: 'PR',
      zip: '00730',
      country: 'PR',
      lat: 18.0111,
      lng: -66.6141
    },
    preferences: { deliveryPreference: 'pickup_point', communicationPreference: 'email', timeSlotPreference: 'evening' },
    createdAt: '2024-06-10T12:00:00Z',
    isActive: true
  },
  {
    id: 'u10',
    name: 'Paola Adriana Cruz Méndez',
    email: 'paola.cruz@gmail.com',
    phone: '(787) 555-0934',
    role: 'customer',
    address: {
      street: '12 Calle Luna',
      city: 'San Juan',
      state: 'PR',
      zip: '00901',
      country: 'PR',
      lat: 18.4659,
      lng: -66.1125
    },
    preferences: { deliveryPreference: 'home_delivery', communicationPreference: 'both', timeSlotPreference: 'afternoon' },
    createdAt: '2024-06-18T15:30:00Z',
    isActive: true
  },
  {
    id: 'u11',
    name: 'Fernando José Morales Ríos',
    email: 'fernando.morales@gmail.com',
    phone: '(787) 555-0956',
    role: 'customer',
    address: {
      street: '90 Calle Unión',
      city: 'Arecibo',
      state: 'PR',
      zip: '00612',
      country: 'PR',
      lat: 18.4736,
      lng: -66.7161
    },
    preferences: { deliveryPreference: 'home_delivery', communicationPreference: 'sms', timeSlotPreference: 'morning' },
    createdAt: '2024-06-25T11:10:00Z',
    isActive: true
  },
  {
    id: 'u12',
    name: 'Sofía Lucía Hernández Báez',
    email: 'sofia.hernandez@gmail.com',
    phone: '(787) 555-0978',
    role: 'customer',
    address: {
      street: '22 Calle Marina',
      city: 'Fajardo',
      state: 'PR',
      zip: '00738',
      country: 'PR',
      lat: 18.3258,
      lng: -65.6524
    },
    preferences: { deliveryPreference: 'pickup_point', communicationPreference: 'email', timeSlotPreference: 'afternoon' },
    createdAt: '2024-07-01T10:20:00Z',
    isActive: true
  },
  {
    id: 'u13',
    name: 'Diego Manuel Ruiz Figueroa',
    email: 'diego.ruiz@gmail.com',
    phone: '(787) 555-0990',
    role: 'customer',
    address: {
      street: '15 Calle Sol',
      city: 'Mayagüez',
      state: 'PR',
      zip: '00680',
      country: 'PR',
      lat: 18.2010,
      lng: -67.1396
    },
    preferences: { deliveryPreference: 'home_delivery', communicationPreference: 'sms', timeSlotPreference: 'evening' },
    createdAt: '2024-07-08T09:40:00Z',
    isActive: true
  },
  {
    id: 'u14',
    name: 'Camila Andrea Navarro León',
    email: 'camila.navarro@gmail.com',
    phone: '(787) 555-1001',
    role: 'customer',
    address: {
      street: '8 Calle Luna',
      city: 'Old San Juan',
      state: 'PR',
      zip: '00901',
      country: 'Puerto Rico',
      lat: 18.4657,
      lng: -66.1149
    },
    preferences: { deliveryPreference: 'home_delivery', communicationPreference: 'both', timeSlotPreference: 'morning' },
    createdAt: '2024-07-15T13:55:00Z',
    isActive: true
  },
  {
    id: 'u15',
    name: 'Sebastián Alejandro Cortés Nieves',
    email: 'sebastian.cortes@gmail.com',
    phone: '(787) 555-1023',
    role: 'customer',
    address: {
      street: '44 Calle Norzagaray',
      city: 'San Juan',
      state: 'PR',
      zip: '00901',
      country: 'Puerto Rico',
      lat: 18.4720,
      lng: -66.1202
    },
    preferences: { deliveryPreference: 'home_delivery', communicationPreference: 'email', timeSlotPreference: 'afternoon' },
    createdAt: '2024-07-20T16:10:00Z',
    isActive: true
  }
];