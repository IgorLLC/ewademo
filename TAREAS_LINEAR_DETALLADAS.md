# 🎯 Tareas Específicas para Linear - EWA Platform

## 🔴 FASE 1: CRÍTICAS (Semanas 1-2)

---

### **TASK-001: Stripe Payment Integration Setup**

**Prioridad:** Critical  
**Estimado:** 3-4 días  
**Labels:** `backend`, `payments`, `stripe`, `critical`

#### **Descripción:**
Implementar sistema completo de pagos con Stripe para suscripciones recurrentes y pagos únicos.

#### **Archivos a Modificar/Crear:**
```
📁 apps/web/src/
  ├── pages/api/
  │   ├── stripe/
  │   │   ├── create-payment-intent.ts    [NUEVO]
  │   │   ├── webhooks.ts                 [NUEVO]
  │   │   └── create-subscription.ts      [NUEVO]
  │   └── checkout/
  │       └── session.ts                  [NUEVO]
  ├── pages/
  │   ├── checkout.tsx                    [NUEVO]
  │   └── success.tsx                     [NUEVO]
  └── components/
      ├── CheckoutForm.tsx                [NUEVO]
      └── PaymentMethodCard.tsx           [NUEVO]

📁 packages/
  ├── api-client/src/
  │   └── stripe.ts                       [NUEVO]
  └── types/src/
      └── payment.ts                      [MODIFICAR - agregar tipos Stripe]
```

#### **Implementación Step-by-Step:**

1. **Instalar dependencias:**
```bash
cd apps/web
npm install stripe @stripe/stripe-js
npm install --save-dev @types/stripe
```

2. **Configurar variables de entorno:**
```env
# .env.local
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

3. **Crear API de Stripe:**
```typescript
// apps/web/src/pages/api/stripe/create-subscription.ts
import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { priceId, customerId, quantity = 1 } = req.body;

    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId, quantity }],
      payment_behavior: 'default_incomplete',
      payment_settings: { save_default_payment_method: 'on_subscription' },
      expand: ['latest_invoice.payment_intent'],
    });

    res.json({
      subscriptionId: subscription.id,
      clientSecret: (subscription.latest_invoice as Stripe.Invoice)?.payment_intent?.client_secret,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
```

#### **Criterios de Aceptación:**
- [ ] Checkout funcional con Stripe Elements
- [ ] Suscripciones recurrentes creadas correctamente
- [ ] Webhooks configurados para eventos críticos
- [ ] Gestión de errores de pago implementada
- [ ] Testing en ambiente de desarrollo completado
- [ ] Métodos de pago guardados y reutilizables

---

### **TASK-002: EWA Product SKUs Configuration**

**Prioridad:** Critical  
**Estimado:** 1-2 días  
**Labels:** `products`, `data`, `configuration`

#### **Descripción:**
Configurar productos específicos de EWA con SKUs, precios y disponibilidad según reunión.

#### **Archivos a Modificar:**
```
📁 mock/
  └── db.json                            [MODIFICAR - agregar productos EWA]

📁 packages/types/src/
  └── index.ts                           [MODIFICAR - actualizar Product type]

📁 apps/web/src/pages/
  ├── plans.tsx                          [MODIFICAR - mostrar productos reales]
  └── admin/
      └── products/
          ├── index.tsx                  [NUEVO]
          └── [id].tsx                   [NUEVO]
```

#### **Implementación:**

1. **Actualizar mock data:**
```json
// mock/db.json
{
  "products": [
    {
      "id": "ewa-18pack-current",
      "name": "EWA Box Water 18-Pack",
      "sizeOz": 16,
      "sku": "EWA-18-16OZ",
      "price": 24.99,
      "isActive": true,
      "availableDate": "2025-01-01",
      "description": "Agua premium en caja, pack de 18 unidades"
    },
    {
      "id": "ewa-24pack-8oz",
      "name": "EWA Box Water 24-Pack (8oz)",
      "sizeOz": 8,
      "sku": "EWA-24-8OZ", 
      "price": 19.99,
      "isActive": false,
      "availableDate": "2025-08-01",
      "description": "Agua premium en caja, pack de 24 unidades de 8oz"
    },
    {
      "id": "ewa-12pack-32oz",
      "name": "EWA Box Water 12-Pack (32oz)",
      "sizeOz": 32,
      "sku": "EWA-12-32OZ",
      "price": 29.99,
      "isActive": false,
      "availableDate": "2025-08-01",
      "description": "Agua premium en caja, pack de 12 unidades de 32oz"
    }
  ],
  "plans": [
    {
      "id": "weekly-18pack",
      "name": "Plan Semanal - 18 Pack",
      "productId": "ewa-18pack-current",
      "frequency": "weekly",
      "minQty": 1,
      "maxQty": 10,
      "discount": 0.05
    }
  ]
}
```

2. **Actualizar tipos:**
```typescript
// packages/types/src/index.ts
export type Product = {
  id: string;
  name: string;
  sizeOz: number;
  sku: string;
  price: number;
  isActive: boolean;
  availableDate: string;
  description: string;
  category: 'standard' | 'premium' | 'bulk';
  inventory?: number;
  images?: string[];
};
```

#### **Criterios de Aceptación:**
- [ ] 3 productos EWA configurados correctamente
- [ ] SKUs únicos y descriptivos
- [ ] Precios configurados según especificaciones
- [ ] Disponibilidad por fechas (agosto para nuevos)
- [ ] Admin puede gestionar productos
- [ ] Productos se muestran correctamente en frontend

---

### **TASK-003: Pickup Points System Implementation**

**Prioridad:** High  
**Estimado:** 3-4 días  
**Labels:** `features`, `admin`, `logistics`, `mapbox`

#### **Descripción:**
Implementar sistema completo de puntos de recogida como alternativa a entrega a domicilio.

#### **Archivos a Crear/Modificar:**
```
📁 apps/web/src/pages/
  ├── pickup-points.tsx                  [MODIFICAR - expandir funcionalidad]
  └── admin/
      └── pickup-points/
          ├── index.tsx                  [NUEVO]
          ├── [id].tsx                   [NUEVO]
          └── new.tsx                    [NUEVO]

📁 apps/web/src/components/
  ├── PickupPointCard.tsx                [NUEVO]
  ├── PickupPointMap.tsx                 [NUEVO]
  └── PickupPointSchedule.tsx            [NUEVO]

📁 packages/api-client/src/
  └── pickup-points.ts                   [NUEVO]

📁 mock/
  └── db.json                            [MODIFICAR - agregar pickup points]
```

#### **Implementación:**

1. **Agregar datos mock:**
```json
// mock/db.json - agregar sección
{
  "pickupPoints": [
    {
      "id": "pp-parque-central",
      "name": "Parque Central",
      "address": "Parque Central, San Juan, PR 00901",
      "city": "San Juan",
      "state": "PR",
      "zipCode": "00901",
      "lat": 18.4037,
      "lng": -66.0637,
      "isActive": true,
      "operatingHours": {
        "monday": { "open": "09:00", "close": "17:00" },
        "tuesday": { "open": "09:00", "close": "17:00" },
        "wednesday": { "closed": true },
        "thursday": { "open": "09:00", "close": "17:00" },
        "friday": { "open": "09:00", "close": "17:00" },
        "saturday": { "closed": true },
        "sunday": { "closed": true }
      },
      "capacity": 50,
      "currentLoad": 12,
      "contactPhone": "+1-787-555-0123",
      "instructions": "Punto de recogida en la entrada principal del parque",
      "features": ["secure_storage", "extended_hours", "weekend_access"],
      "deliveryDays": ["monday", "thursday"]
    }
  ]
}
```

2. **Crear API client:**
```typescript
// packages/api-client/src/pickup-points.ts
import { PickupPoint } from '@ewa/types';
import { api } from './index';

export const getPickupPoints = async (): Promise<PickupPoint[]> => {
  const response = await api.get<PickupPoint[]>('/pickup-points');
  return response.data;
};

export const getPickupPointById = async (id: string): Promise<PickupPoint> => {
  const response = await api.get<PickupPoint>(`/pickup-points/${id}`);
  return response.data;
};

export const createPickupPoint = async (pickupPoint: Omit<PickupPoint, 'id'>): Promise<PickupPoint> => {
  const response = await api.post<PickupPoint>('/pickup-points', pickupPoint);
  return response.data;
};
```

3. **Componente de selección:**
```typescript
// apps/web/src/components/PickupPointCard.tsx
import React from 'react';
import { PickupPoint } from '@ewa/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface PickupPointCardProps {
  pickupPoint: PickupPoint;
  onSelect: (point: PickupPoint) => void;
  isSelected: boolean;
}

export const PickupPointCard: React.FC<PickupPointCardProps> = ({
  pickupPoint,
  onSelect,
  isSelected
}) => {
  return (
    <Card 
      className={`cursor-pointer transition-all ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
      onClick={() => onSelect(pickupPoint)}
    >
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          {pickupPoint.name}
          <span className={`px-2 py-1 rounded text-xs ${
            pickupPoint.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {pickupPoint.isActive ? 'Activo' : 'Inactivo'}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 mb-2">{pickupPoint.address}</p>
        <p className="text-xs text-gray-500">
          Capacidad: {pickupPoint.currentLoad}/{pickupPoint.capacity}
        </p>
        {pickupPoint.deliveryDays && (
          <p className="text-xs text-blue-600 mt-1">
            Entregas: {pickupPoint.deliveryDays.join(', ')}
          </p>
        )}
      </CardContent>
    </Card>
  );
};
```

#### **Criterios de Aceptación:**
- [ ] Admin puede crear/editar pickup points
- [ ] Clientes pueden seleccionar pickup point en checkout
- [ ] Horarios de operación configurables
- [ ] Integración con MapBox para mostrar ubicaciones
- [ ] Capacidad y carga actual trackeable
- [ ] Instrucciones especiales por punto
- [ ] Filtros por disponibilidad y cercanía

---

### **TASK-004: Route Optimization Engine**

**Prioridad:** High  
**Estimado:** 4-5 días  
**Labels:** `logistics`, `mapbox`, `algorithms`, `optimization`

#### **Descripción:**
Implementar sistema de optimización de rutas con límite de 20 entregas y integración MapBox mejorada.

#### **Archivos a Crear/Modificar:**
```
📁 apps/web/src/
  ├── pages/admin/routes/
  │   ├── index.tsx                      [MODIFICAR - expandir funcionalidad]
  │   ├── optimizer.tsx                  [NUEVO]
  │   └── [id].tsx                       [MODIFICAR]
  ├── components/
  │   ├── RouteOptimizer.tsx             [NUEVO]
  │   ├── RouteMap.tsx                   [NUEVO]
  │   └── RouteStopCard.tsx              [NUEVO]
  └── utils/
      ├── routeOptimization.ts           [NUEVO]
      └── mapboxHelpers.ts               [NUEVO]

📁 packages/api-client/src/
  └── routes.ts                          [MODIFICAR - agregar optimización]
```

#### **Implementación:**

1. **Algoritmo de optimización básico:**
```typescript
// apps/web/src/utils/routeOptimization.ts
import { PickupPoint } from '@ewa/types';

interface RouteStop {
  id: string;
  address: string;
  lat: number;
  lng: number;
  priority: number;
  timeWindow?: {
    start: string;
    end: string;
  };
}

interface OptimizationResult {
  routes: Array<{
    id: string;
    stops: RouteStop[];
    estimatedDuration: number;
    estimatedDistance: number;
  }>;
  unassigned: RouteStop[];
}

export class RouteOptimizer {
  private readonly MAX_STOPS_PER_ROUTE = 20;
  private readonly mapboxToken: string;

  constructor(mapboxToken: string) {
    this.mapboxToken = mapboxToken;
  }

  async optimizeRoutes(stops: RouteStop[], startPoint: { lat: number; lng: number }): Promise<OptimizationResult> {
    // Dividir en grupos de máximo 20 paradas
    const chunks = this.chunkStops(stops, this.MAX_STOPS_PER_ROUTE);
    const routes = [];

    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      const optimizedOrder = await this.optimizeChunk(chunk, startPoint);
      
      routes.push({
        id: `route-${i + 1}`,
        stops: optimizedOrder,
        estimatedDuration: await this.calculateDuration(optimizedOrder, startPoint),
        estimatedDistance: await this.calculateDistance(optimizedOrder, startPoint)
      });
    }

    return {
      routes,
      unassigned: []
    };
  }

  private chunkStops(stops: RouteStop[], chunkSize: number): RouteStop[][] {
    const chunks = [];
    for (let i = 0; i < stops.length; i += chunkSize) {
      chunks.push(stops.slice(i, i + chunkSize));
    }
    return chunks;
  }

  private async optimizeChunk(stops: RouteStop[], startPoint: { lat: number; lng: number }): Promise<RouteStop[]> {
    // Implementación de algoritmo nearest neighbor mejorado
    const optimized = [];
    const remaining = [...stops];
    let currentPoint = startPoint;

    while (remaining.length > 0) {
      let nearestIndex = 0;
      let nearestDistance = Infinity;

      for (let i = 0; i < remaining.length; i++) {
        const distance = this.calculateHaversineDistance(
          currentPoint.lat, currentPoint.lng,
          remaining[i].lat, remaining[i].lng
        );
        
        // Considerar prioridad en la selección
        const adjustedDistance = distance / (remaining[i].priority || 1);
        
        if (adjustedDistance < nearestDistance) {
          nearestDistance = adjustedDistance;
          nearestIndex = i;
        }
      }

      const nearestStop = remaining.splice(nearestIndex, 1)[0];
      optimized.push(nearestStop);
      currentPoint = { lat: nearestStop.lat, lng: nearestStop.lng };
    }

    return optimized;
  }

  private calculateHaversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Radio de la Tierra en km
    const dLat = this.toRad(lat2 - lat1);
    const dLon = this.toRad(lon2 - lon1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(this.toRad(lat1)) * Math.cos(this.toRad(lat2)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRad(value: number): number {
    return value * Math.PI / 180;
  }

  private async calculateDuration(stops: RouteStop[], startPoint: { lat: number; lng: number }): Promise<number> {
    // Integración con MapBox Directions API
    const coordinates = [
      [startPoint.lng, startPoint.lat],
      ...stops.map(stop => [stop.lng, stop.lat])
    ];

    try {
      const response = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/driving/${coordinates.map(c => c.join(',')).join(';')}?access_token=${this.mapboxToken}&overview=false`
      );
      const data = await response.json();
      return data.routes[0]?.duration || 0;
    } catch (error) {
      console.error('Error calculating route duration:', error);
      return stops.length * 600; // Fallback: 10 min por parada
    }
  }

  private async calculateDistance(stops: RouteStop[], startPoint: { lat: number; lng: number }): Promise<number> {
    // Similar al cálculo de duración pero para distancia
    const coordinates = [
      [startPoint.lng, startPoint.lat],
      ...stops.map(stop => [stop.lng, stop.lat])
    ];

    try {
      const response = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/driving/${coordinates.map(c => c.join(',')).join(';')}?access_token=${this.mapboxToken}&overview=false`
      );
      const data = await response.json();
      return data.routes[0]?.distance || 0;
    } catch (error) {
      console.error('Error calculating route distance:', error);
      return 0;
    }
  }
}
```

2. **Componente de optimización:**
```typescript
// apps/web/src/components/RouteOptimizer.tsx
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RouteOptimizer } from '@/utils/routeOptimization';

interface RouteOptimizerProps {
  deliveries: Array<{
    id: string;
    address: string;
    lat: number;
    lng: number;
    priority?: number;
  }>;
  onOptimizationComplete: (routes: any[]) => void;
}

export const RouteOptimizerComponent: React.FC<RouteOptimizerProps> = ({
  deliveries,
  onOptimizationComplete
}) => {
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [results, setResults] = useState<any>(null);

  const handleOptimize = async () => {
    setIsOptimizing(true);
    try {
      const optimizer = new RouteOptimizer(process.env.NEXT_PUBLIC_MAPBOX_TOKEN!);
      const startPoint = { lat: 18.4037, lng: -66.0637 }; // San Juan centro
      
      const optimizationResult = await optimizer.optimizeRoutes(deliveries, startPoint);
      setResults(optimizationResult);
      onOptimizationComplete(optimizationResult.routes);
    } catch (error) {
      console.error('Error optimizing routes:', error);
    } finally {
      setIsOptimizing(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          Optimización de Rutas
          <Button 
            onClick={handleOptimize} 
            disabled={isOptimizing || deliveries.length === 0}
          >
            {isOptimizing ? 'Optimizando...' : 'Optimizar Rutas'}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <span className="font-medium">Total Entregas:</span>
              <p className="text-lg">{deliveries.length}</p>
            </div>
            <div>
              <span className="font-medium">Rutas Generadas:</span>
              <p className="text-lg">{results?.routes?.length || 0}</p>
            </div>
            <div>
              <span className="font-medium">Max por Ruta:</span>
              <p className="text-lg">20 entregas</p>
            </div>
          </div>

          {results && (
            <div className="space-y-3">
              <h4 className="font-medium">Rutas Optimizadas:</h4>
              {results.routes.map((route: any, index: number) => (
                <div key={route.id} className="border rounded p-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">Ruta {index + 1}</span>
                    <span className="text-sm text-gray-500">
                      {route.stops.length} paradas
                    </span>
                  </div>
                  <div className="text-xs text-gray-600">
                    Duración est: {Math.round(route.estimatedDuration / 60)} min | 
                    Distancia est: {(route.estimatedDistance / 1000).toFixed(1)} km
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
```

#### **Criterios de Aceptación:**
- [ ] Algoritmo respeta límite de 20 entregas por ruta
- [ ] Integración con MapBox Directions API funcional
- [ ] Optimización considera prioridades de entrega
- [ ] Interface admin muestra rutas optimizadas
- [ ] Estimaciones de tiempo y distancia precisas
- [ ] Exportación de rutas para conductores
- [ ] Tracking de eficiencia de rutas

---

## 🟡 FASE 2: INTEGRACIONES (Semanas 3-4)

---

### **TASK-005: QuickBooks Integration Implementation**

**Prioridad:** High  
**Estimado:** 3-4 días  
**Labels:** `integrations`, `finance`, `quickbooks`, `accounting`

#### **Descripción:**
Implementar integración bidireccional con QuickBooks para sincronización de transacciones, inventario y reportes financieros.

#### **Archivos a Crear:**
```
📁 apps/web/src/
  ├── pages/api/
  │   └── quickbooks/
  │       ├── oauth.ts                   [NUEVO]
  │       ├── sync-transactions.ts       [NUEVO]
  │       ├── sync-inventory.ts          [NUEVO]
  │       └── webhooks.ts                [NUEVO]
  ├── pages/admin/
  │   └── integrations/
  │       └── quickbooks.tsx             [NUEVO]
  └── components/
      ├── QuickBooksConnect.tsx          [NUEVO]
      └── SyncStatus.tsx                 [NUEVO]

📁 packages/api-client/src/
  └── quickbooks.ts                      [NUEVO]

📁 packages/types/src/
  └── quickbooks.ts                      [NUEVO]
```

#### **Implementación:**

1. **Instalar dependencias:**
```bash
npm install node-quickbooks oauth-1.0a
npm install --save-dev @types/node-quickbooks
```

2. **Configurar variables de entorno:**
```env
QUICKBOOKS_CLIENT_ID=your_client_id
QUICKBOOKS_CLIENT_SECRET=your_client_secret
QUICKBOOKS_SANDBOX=true
QUICKBOOKS_REDIRECT_URI=http://localhost:3005/api/quickbooks/oauth
```

3. **Tipos QuickBooks:**
```typescript
// packages/types/src/quickbooks.ts
export interface QuickBooksConnection {
  id: string;
  companyId: string;
  accessToken: string;
  refreshToken: string;
  tokenExpiresAt: string;
  isActive: boolean;
  lastSyncAt?: string;
  createdAt: string;
}

export interface QuickBooksTransaction {
  id: string;
  quickbooksId?: string;
  type: 'invoice' | 'payment' | 'credit_memo';
  customerId: string;
  customerName: string;
  amount: number;
  description: string;
  transactionDate: string;
  syncStatus: 'pending' | 'synced' | 'error';
  errorMessage?: string;
}

export interface QuickBooksInventoryItem {
  id: string;
  quickbooksId?: string;
  sku: string;
  name: string;
  quantityOnHand: number;
  unitPrice: number;
  lastUpdated: string;
}
```

#### **Criterios de Aceptación:**
- [ ] OAuth flow con QuickBooks Online funcional
- [ ] Sincronización automática de transacciones
- [ ] Inventario se actualiza en ambas direcciones
- [ ] Panel admin muestra estado de sincronización
- [ ] Manejo de errores de API robusto
- [ ] Logs de sincronización detallados

---

### **TASK-006: Delivery Skip/Reschedule System**

**Prioridad:** Medium  
**Estimado:** 2-3 días  
**Labels:** `customer-portal`, `features`, `subscriptions`

#### **Descripción:**
Permitir a clientes pausar, reprogramar o cancelar entregas específicas desde su portal.

#### **Archivos a Crear/Modificar:**
```
📁 apps/web/src/pages/customer/
  └── subscriptions.tsx                  [MODIFICAR - agregar skip/reschedule]

📁 apps/web/src/components/
  ├── DeliverySkipModal.tsx              [NUEVO]
  ├── DeliveryRescheduleModal.tsx        [NUEVO]
  └── DeliveryCalendar.tsx               [NUEVO]

📁 packages/api-client/src/
  └── deliveries.ts                      [NUEVO]
```

#### **Implementación en subscriptions.tsx:**

```typescript
// Agregar al componente existente en apps/web/src/pages/customer/subscriptions.tsx

// Agregar estos imports
import { useState } from 'react';
import DeliverySkipModal from '../../components/DeliverySkipModal';
import DeliveryRescheduleModal from '../../components/DeliveryRescheduleModal';

// Agregar estos estados en el componente
const [showSkipModal, setShowSkipModal] = useState(false);
const [showRescheduleModal, setShowRescheduleModal] = useState(false);
const [selectedDelivery, setSelectedDelivery] = useState<any>(null);

// Agregar estas funciones
const handleSkipDelivery = (deliveryId: string) => {
  setSelectedDelivery(deliveryId);
  setShowSkipModal(true);
};

const handleRescheduleDelivery = (deliveryId: string) => {
  setSelectedDelivery(deliveryId);
  setShowRescheduleModal(true);
};

// Modificar la sección de próxima entrega para incluir botones:
// Buscar esta línea aproximada (línea 380):
<p className="font-semibold text-gray-800">
  {new Date(subscriptions[0].nextDeliveryDate).toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric', 
    month: 'long',
    day: 'numeric'
  })}
</p>

// Agregar después de esa línea:
<div className="flex gap-2 mt-2">
  <button
    onClick={() => handleSkipDelivery(subscriptions[0].id)}
    className="text-xs bg-yellow-100 hover:bg-yellow-200 text-yellow-800 px-2 py-1 rounded-full transition-colors"
  >
    Pausar próxima entrega
  </button>
  <button
    onClick={() => handleRescheduleDelivery(subscriptions[0].id)}
    className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-800 px-2 py-1 rounded-full transition-colors"
  >
    Reprogramar
  </button>
</div>

// Agregar antes del cierre del componente (antes de la línea 835):
{showSkipModal && (
  <DeliverySkipModal
    deliveryId={selectedDelivery}
    onClose={() => setShowSkipModal(false)}
    onConfirm={(reason) => {
      // Lógica para pausar entrega
      console.log('Pausar entrega:', selectedDelivery, 'Razón:', reason);
      setShowSkipModal(false);
    }}
  />
)}

{showRescheduleModal && (
  <DeliveryRescheduleModal
    deliveryId={selectedDelivery}
    onClose={() => setShowRescheduleModal(false)}
    onConfirm={(newDate) => {
      // Lógica para reprogramar entrega
      console.log('Reprogramar entrega:', selectedDelivery, 'Nueva fecha:', newDate);
      setShowRescheduleModal(false);
    }}
  />
)}
```

#### **Crear componente DeliverySkipModal:**
```typescript
// apps/web/src/components/DeliverySkipModal.tsx
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface DeliverySkipModalProps {
  deliveryId: string;
  onClose: () => void;
  onConfirm: (reason: string) => void;
}

const DeliverySkipModal: React.FC<DeliverySkipModalProps> = ({
  deliveryId,
  onClose,
  onConfirm
}) => {
  const [reason, setReason] = useState('');
  const [customReason, setCustomReason] = useState('');

  const reasons = [
    { value: 'vacation', label: 'Estoy de vacaciones' },
    { value: 'business_trip', label: 'Viaje de negocios' },
    { value: 'not_needed', label: 'No necesito agua esta semana' },
    { value: 'address_change', label: 'Cambio de dirección' },
    { value: 'other', label: 'Otro motivo' }
  ];

  const handleConfirm = () => {
    const finalReason = reason === 'other' ? customReason : reason;
    onConfirm(finalReason);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md mx-4">
        <CardHeader>
          <CardTitle>Pausar próxima entrega</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600">
            ¿Por qué necesitas pausar tu próxima entrega?
          </p>
          
          <div className="space-y-2">
            {reasons.map((reasonOption) => (
              <label key={reasonOption.value} className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="skip-reason"
                  value={reasonOption.value}
                  checked={reason === reasonOption.value}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="text-sm">{reasonOption.label}</span>
              </label>
            ))}
          </div>

          {reason === 'other' && (
            <textarea
              placeholder="Especifica el motivo..."
              value={customReason}
              onChange={(e) => setCustomReason(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
              rows={3}
            />
          )}

          <div className="flex gap-2 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancelar
            </Button>
            <Button 
              onClick={handleConfirm}
              disabled={!reason || (reason === 'other' && !customReason.trim())}
              className="flex-1 bg-yellow-600 hover:bg-yellow-700"
            >
              Pausar entrega
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DeliverySkipModal;
```

#### **Criterios de Aceptación:**
- [ ] Clientes pueden pausar entregas específicas
- [ ] Sistema de razones predefinidas + texto libre
- [ ] Reprogramación con selección de nueva fecha
- [ ] Confirmación por email de cambios
- [ ] Admin puede ver y aprobar cambios
- [ ] Historial de modificaciones visible

---

## 🟢 FASE 3: OPTIMIZACIÓN (Semanas 5-6)

### **TASK-007: Mobile Responsiveness & UX Improvements**

**Prioridad:** Medium  
**Estimado:** 2-3 días  
**Labels:** `frontend`, `mobile`, `ux`, `responsive`

#### **Descripción:**
Optimizar toda la aplicación para dispositivos móviles y mejorar la experiencia de usuario.

#### **Archivos a Modificar:**
```
📁 apps/web/src/pages/
  ├── index.tsx                          [MODIFICAR - mobile hero]
  ├── customer/subscriptions.tsx         [MODIFICAR - mobile layout]
  └── admin/dashboard.tsx                [MODIFICAR - mobile admin]

📁 apps/web/src/components/
  ├── Layout.tsx                         [MODIFICAR - mobile nav]
  └── ui/                                [MODIFICAR - mobile components]

📁 apps/web/src/styles/
  └── globals.css                        [MODIFICAR - mobile styles]
```

#### **Implementación específica para subscriptions.tsx:**

Buscar y modificar estas secciones:

1. **Grid responsivo (línea ~319):**
```typescript
// BUSCAR:
<div className="grid grid-cols-1 md:grid-cols-3 gap-8">

// CAMBIAR POR:
<div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8">
```

2. **Header responsive (línea ~219):**
```typescript
// BUSCAR:
<header className="bg-white/95 backdrop-blur-sm border-b border-gray-200/60 sticky top-0 z-50 shadow-sm">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">

// CAMBIAR POR:
<header className="bg-white/95 backdrop-blur-sm border-b border-gray-200/60 sticky top-0 z-50 shadow-sm">
  <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-3 md:py-4 flex justify-between items-center">
```

3. **Navegación móvil (línea ~227):**
```typescript
// BUSCAR:
<nav className="hidden md:flex space-x-8">

// CAMBIAR POR:
<nav className="hidden lg:flex space-x-4 xl:space-x-8">
```

4. **Agregar menú hamburguesa después de la navegación:**
```typescript
// AGREGAR después de </nav> (aproximadamente línea 240):
{/* Mobile menu button */}
<div className="lg:hidden">
  <button
    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
    className="text-gray-600 hover:text-gray-900 p-2"
  >
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  </button>
</div>
```

5. **Agregar estado móvil al inicio del componente (línea ~20):**
```typescript
// AGREGAR después de los otros useState:
const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
```

6. **Menú móvil desplegable (agregar después del header, línea ~265):**
```typescript
{/* Mobile menu */}
{isMobileMenuOpen && (
  <div className="lg:hidden bg-white border-b border-gray-200 shadow-lg">
    <div className="px-4 py-3 space-y-2">
      <a 
        href="/customer/subscriptions" 
        className="block px-3 py-2 text-blue-600 font-semibold bg-blue-50 rounded-lg"
      >
        Suscripciones
      </a>
      <a 
        href="/customer/oneoffs" 
        className="block px-3 py-2 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-colors"
      >
        Pedidos Únicos
      </a>
      <a 
        href="/customer/profile" 
        className="block px-3 py-2 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-colors"
      >
        Perfil
      </a>
    </div>
  </div>
)}
```

#### **Criterios de Aceptación:**
- [ ] Navegación móvil funcional con menú hamburguesa
- [ ] Grids adaptables a diferentes tamaños de pantalla
- [ ] Texto legible en dispositivos móviles
- [ ] Botones táctiles de tamaño adecuado (min 44px)
- [ ] Chat de soporte optimizado para móvil
- [ ] Forms completables en móvil
- [ ] Testing en dispositivos reales

---

### **TASK-008: Analytics Dashboard & KPI Reports**

**Prioridad:** Medium  
**Estimado:** 2-3 días  
**Labels:** `analytics`, `dashboard`, `reports`, `metrics`

#### **Descripción:**
Crear dashboard avanzado de métricas y sistema de exportación de reportes para análisis de negocio.

#### **Archivos a Crear/Modificar:**
```
📁 apps/web/src/pages/admin/
  ├── dashboard.tsx                      [MODIFICAR - métricas avanzadas]
  ├── analytics/
  │   ├── index.tsx                      [NUEVO]
  │   ├── customers.tsx                  [NUEVO]
  │   ├── revenue.tsx                    [NUEVO]
  │   └── deliveries.tsx                 [NUEVO]
  └── reports/
      ├── index.tsx                      [NUEVO]
      └── export.tsx                     [NUEVO]

📁 apps/web/src/components/
  ├── charts/
  │   ├── RevenueChart.tsx               [NUEVO]
  │   ├── CustomerGrowthChart.tsx        [NUEVO]
  │   └── DeliveryEfficiencyChart.tsx    [NUEVO]
  └── ReportExporter.tsx                 [NUEVO]
```

#### **Implementación en dashboard.tsx existente:**

1. **Agregar imports para charts (línea ~6):**
```typescript
// AGREGAR después de los imports existentes:
import { useState } from 'react';
import RevenueChart from '@/components/charts/RevenueChart';
import CustomerGrowthChart from '@/components/charts/CustomerGrowthChart'; 
import DeliveryEfficiencyChart from '@/components/charts/DeliveryEfficiencyChart';
```

2. **Agregar estado para timeframe (línea ~29):**
```typescript
// AGREGAR después del estado metrics:
const [timeframe, setTimeframe] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
const [chartData, setChartData] = useState<any>({
  revenue: [],
  customers: [],
  deliveries: []
});
```

3. **Modificar sección después de KPI cards (buscar línea ~310, después de </div> que cierra KPI Cards):**
```typescript
// AGREGAR después de las KPI cards:
{/* Analytics Charts Section */}
<div className="mt-8">
  <div className="flex justify-between items-center mb-6">
    <h2 className="text-lg font-medium text-gray-900">Análisis y Tendencias</h2>
    <div className="flex space-x-2">
      {(['7d', '30d', '90d', '1y'] as const).map((period) => (
        <button
          key={period}
          onClick={() => setTimeframe(period)}
          className={`px-3 py-1 text-sm rounded-md transition-colors ${
            timeframe === period
              ? 'bg-ewa-blue text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          {period === '7d' ? '7 días' : period === '30d' ? '30 días' : period === '90d' ? '90 días' : '1 año'}
        </button>
      ))}
    </div>
  </div>

  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
    {/* Revenue Chart */}
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Ingresos por Período</h3>
      <RevenueChart timeframe={timeframe} />
    </div>

    {/* Customer Growth Chart */}
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Crecimiento de Clientes</h3>
      <CustomerGrowthChart timeframe={timeframe} />
    </div>
  </div>

  {/* Delivery Efficiency Chart - Full Width */}
  <div className="bg-white rounded-lg shadow p-6">
    <h3 className="text-lg font-medium text-gray-900 mb-4">Eficiencia de Entregas</h3>
    <DeliveryEfficiencyChart timeframe={timeframe} />
  </div>
</div>
```

4. **Crear componente RevenueChart:**
```typescript
// apps/web/src/components/charts/RevenueChart.tsx
import React, { useEffect, useState } from 'react';

interface RevenueChartProps {
  timeframe: '7d' | '30d' | '90d' | '1y';
}

const RevenueChart: React.FC<RevenueChartProps> = ({ timeframe }) => {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    // Mock data generation based on timeframe
    const generateMockData = () => {
      const periods = timeframe === '7d' ? 7 : timeframe === '30d' ? 30 : timeframe === '90d' ? 90 : 365;
      const mockData = [];
      
      for (let i = periods; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        
        const baseRevenue = 1000;
        const variance = Math.random() * 500;
        const revenue = baseRevenue + variance;
        
        mockData.push({
          date: date.toISOString().split('T')[0],
          revenue: Math.round(revenue),
          subscriptions: Math.round(revenue / 25), // Aprox $25 por suscripción
        });
      }
      
      setData(mockData);
    };

    generateMockData();
  }, [timeframe]);

  return (
    <div className="h-64">
      {/* Simplified chart visualization */}
      <div className="flex items-end justify-between h-48 bg-gray-50 rounded p-4">
        {data.slice(-10).map((item, index) => (
          <div key={index} className="flex flex-col items-center">
            <div 
              className="bg-ewa-blue rounded-t w-6 transition-all duration-300 hover:bg-ewa-dark-blue"
              style={{ 
                height: `${(item.revenue / Math.max(...data.map(d => d.revenue))) * 100}%`,
                minHeight: '4px'
              }}
              title={`$${item.revenue} - ${item.date}`}
            />
            <span className="text-xs text-gray-500 mt-1 transform -rotate-45 origin-top-left">
              {new Date(item.date).getDate()}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-4 flex justify-between text-sm text-gray-600">
        <span>Total: ${data.reduce((sum, item) => sum + item.revenue, 0).toLocaleString()}</span>
        <span>Promedio: ${Math.round(data.reduce((sum, item) => sum + item.revenue, 0) / data.length).toLocaleString()}</span>
      </div>
    </div>
  );
};

export default RevenueChart;
```

#### **Criterios de Aceptación:**
- [ ] Dashboard muestra métricas en tiempo real
- [ ] Charts responsivos e interactivos
- [ ] Filtros de tiempo funcionales
- [ ] Exportación a PDF/Excel disponible
- [ ] Métricas de retención de clientes
- [ ] Análisis de eficiencia de rutas
- [ ] Reportes automatizados por email

---

## 📋 Resumen para Linear

### **Formato de Issues en Linear:**

Para cada tarea, usar este formato:

**Título:** `[PRIORITY] TASK-XXX: Título Descriptivo`

**Descripción:**
```markdown
## 🎯 Objetivo
Descripción clara del objetivo

## 📋 Archivos a Modificar
- Lista de archivos específicos
- Con ubicaciones exactas

## ✅ Criterios de Aceptación  
- [ ] Criterio específico 1
- [ ] Criterio específico 2

## 🛠️ Notas de Implementación
- Detalles técnicos específicos
- Referencias a líneas de código cuando aplique
```

**Labels sugeridos:** `critical`, `high`, `medium`, `backend`, `frontend`, `integrations`, `mobile`, `analytics`

**Estimados:** Usar Story Points (1-5) basados en días de trabajo

**Dependencies:** Establecer orden según las fases definidas

¿Necesitas que ajuste alguna tarea específica o que profundice en alguna implementación particular?