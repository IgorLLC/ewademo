# Configuración de Back4App para EWA Box Water

## Credenciales de la Aplicación

**App ID:** `dQhoPK7uBWUWp8FVQGwYZVnUqKiHrh9tMXXJdfE7`  
**App Name:** `ewaboxwater`

## Variables de Entorno

Actualiza tu archivo `apps/web/.env.local` con las siguientes credenciales:

```bash
# Back4App Configuration
NEXT_PUBLIC_BACK4APP_APPLICATION_ID=dQhoPK7uBWUWp8FVQGwYZVnUqKiHrh9tMXXJdfE7
NEXT_PUBLIC_BACK4APP_CLIENT_KEY=0xiYJfe3o7Y9gYejj9Cod0cVWobLupJWWRCoew0h
BACK4APP_MASTER_KEY=q8qOoaKmYf1e9tePPC7IXp5G2vFbsRRyIK5DVMMI
BACK4APP_SERVER_URL=https://parseapi.back4app.com
BACK4APP_REST_KEY=rSTOq9oc6VlhHcwjVnQWzxo1kXuWse5sbZBoYWWA
```

## Clases Existentes en Back4App

La aplicación ya tiene las siguientes clases configuradas:

### 1. `_User` (Usuarios)
- Campos básicos: `username`, `email`, `password`
- Campos adicionales: `firstName`, `lastName`, `phone`, `company`
- Configuraciones: `pushNotifications`, `emailNotifications`, `language`, `darkMode`

### 2. `Subscription` (Suscripciones)
- `user`: Pointer a `_User`
- `plan`: String del plan
- `planPointer`: Pointer a `PricingPlan`
- `status`: Estado de la suscripción
- `startDate`, `endDate`: Fechas
- `price`, `billingCycle`: Información de facturación

### 3. `PricingPlan` (Planes de Precios)
- `name`: Nombre del plan
- `monthlyPrice`, `annualPrice`: Precios
- `annualDiscount`: Descuento anual
- `features`: Array de características
- `isActive`: Si el plan está activo
- `planId`: ID único del plan

## Cliente Back4App

Se ha creado un cliente Back4App en `packages/api-client/src/back4app-client.ts` que incluye:

- ✅ Autenticación de usuarios
- ✅ CRUD para todas las clases
- ✅ Métodos específicos para suscripciones
- ✅ Manejo de sesiones
- ✅ Soporte para Master Key y REST Key

## Próximos Pasos

1. **Actualizar variables de entorno** con las credenciales reales
2. **Migrar datos mock** a Back4App
3. **Actualizar componentes** para usar el cliente Back4App
4. **Configurar webhooks** para notificaciones
5. **Implementar autenticación real** con Parse Server

## Uso del Cliente

```typescript
import { getBack4AppClient } from '@ewa/api-client';

const client = getBack4AppClient();

// Crear usuario
const user = await client.createUser({
  username: 'usuario@ejemplo.com',
  password: 'password123',
  email: 'usuario@ejemplo.com'
});

// Crear suscripción
const subscription = await client.createSubscription({
  user: { __type: 'Pointer', className: '_User', objectId: user.objectId },
  plan: 'weekly',
  status: 'active',
  startDate: new Date(),
  price: 29.99
});
```

## Seguridad

- ✅ Master Key solo para operaciones administrativas
- ✅ REST Key para operaciones de cliente
- ✅ ACL configurado para control de acceso
- ✅ Sesiones con tokens seguros
