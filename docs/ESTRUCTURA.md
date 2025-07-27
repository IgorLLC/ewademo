# Estructura del Proyecto EWA Box Water

## Visión General

Este proyecto está organizado como un monorepo usando Turbo, con tres aplicaciones principales y paquetes compartidos. La estructura está diseñada para escalar y mantener separadas las responsabilidades de cada componente del sistema.

## Estructura de Directorios

```
ewa-box-water/
├── apps/                          # Aplicaciones principales
│   ├── customer/                  # Portal de clientes (B2C/B2B)
│   │   ├── src/
│   │   │   ├── components/        # Componentes específicos del cliente
│   │   │   ├── pages/            # Páginas de Next.js
│   │   │   ├── hooks/            # Custom hooks
│   │   │   ├── services/         # Servicios de API
│   │   │   └── utils/            # Utilidades específicas
│   │   └── public/               # Assets estáticos
│   │
│   ├── marketing/                # Sitio de marketing público
│   │   ├── src/
│   │   │   ├── components/       # Componentes de marketing
│   │   │   ├── pages/           # Páginas del sitio
│   │   │   ├── content/         # Contenido del blog
│   │   │   └── seo/             # Configuración SEO
│   │   └── public/              # Assets de marketing
│   │
│   └── admin/                    # Dashboard de operaciones
│       ├── src/
│       │   ├── components/       # Componentes del dashboard
│       │   ├── pages/           # Páginas administrativas
│       │   ├── hooks/           # Hooks para datos
│       │   ├── services/        # Servicios de API
│       │   └── charts/          # Componentes de gráficos
│       └── public/              # Assets del admin
│
├── packages/                     # Librerías compartidas
│   ├── ui/                      # Componentes UI reutilizables
│   │   ├── src/
│   │   │   ├── components/      # Componentes base
│   │   │   ├── styles/          # Estilos compartidos
│   │   │   └── index.ts         # Exportaciones
│   │   └── package.json
│   │
│   ├── api-client/              # Cliente API para Back4App
│   │   ├── src/
│   │   │   ├── client.ts        # Cliente principal
│   │   │   ├── auth.ts          # Autenticación
│   │   │   ├── subscriptions.ts # API de suscripciones
│   │   │   ├── orders.ts        # API de órdenes
│   │   │   └── index.ts         # Exportaciones
│   │   └── package.json
│   │
│   ├── types/                   # Tipos TypeScript compartidos
│   │   ├── src/
│   │   │   ├── user.ts          # Tipos de usuario
│   │   │   ├── subscription.ts  # Tipos de suscripción
│   │   │   ├── order.ts         # Tipos de orden
│   │   │   ├── product.ts       # Tipos de producto
│   │   │   └── index.ts         # Exportaciones
│   │   └── package.json
│   │
│   └── utils/                   # Utilidades comunes
│       ├── src/
│       │   ├── date.ts          # Utilidades de fecha
│       │   ├── validation.ts    # Validaciones
│       │   ├── format.ts        # Formateo de datos
│       │   └── index.ts         # Exportaciones
│       └── package.json
│
├── backend/                     # Configuración Back4App
│   ├── cloud-functions/         # Cloud Functions
│   │   ├── stripe-webhooks.ts   # Webhooks de Stripe
│   │   ├── email-notifications.ts # Notificaciones
│   │   └── route-optimization.ts # Optimización de rutas
│   │
│   ├── schemas/                 # Esquemas de base de datos
│   │   ├── user-schema.json     # Esquema de usuarios
│   │   ├── subscription-schema.json # Esquema de suscripciones
│   │   └── order-schema.json    # Esquema de órdenes
│   │
│   └── webhooks/                # Webhooks de integración
│       ├── stripe.ts            # Webhooks de Stripe
│       └── sendgrid.ts          # Webhooks de SendGrid
│
├── docs/                        # Documentación
│   ├── ESTRUCTURA.md            # Este archivo
│   ├── API.md                   # Documentación de API
│   ├── DEPLOYMENT.md            # Guía de deployment
│   └── DEVELOPMENT.md           # Guía de desarrollo
│
├── mock/                        # Datos mock para desarrollo
│   ├── db.json                  # Base de datos mock
│   ├── routes.json              # Rutas de API mock
│   └── middleware.js            # Middleware mock
│
└── package.json                 # Configuración del monorepo
```

## Aplicaciones Principales

### 1. Portal de Clientes (`apps/customer`)
**Puerto:** 3000
**Propósito:** Interfaz principal para clientes B2C y B2B

**Funcionalidades:**
- Registro e inicio de sesión
- Gestión de suscripciones
- Compras únicas
- Checkout con Stripe
- Historial de órdenes
- Gestión de perfil

**Tecnologías:**
- Next.js 14 con App Router
- React Hook Form + Zod
- Stripe Elements
- Tailwind CSS

### 2. Sitio de Marketing (`apps/marketing`)
**Puerto:** 3001
**Propósito:** Landing page pública y blog

**Funcionalidades:**
- Landing page bilingüe
- Catálogo de productos
- Blog con contenido SEO
- Formularios de captura
- Página de contacto

**Tecnologías:**
- Next.js 14
- MDX para contenido
- SEO optimizado
- Tailwind CSS

### 3. Dashboard de Operaciones (`apps/admin`)
**Puerto:** 3002
**Propósito:** Panel de control interno

**Funcionalidades:**
- Gestión de clientes
- Seguimiento de MRR
- Optimización de rutas
- Gestión de inventario
- Métricas y analytics

**Tecnologías:**
- Next.js 14
- MapBox para rutas
- Recharts para gráficos
- Tailwind CSS

## Paquetes Compartidos

### UI (`packages/ui`)
Componentes reutilizables de interfaz de usuario:
- Botones, inputs, modales
- Layouts y navegación
- Componentes de formulario
- Iconos y elementos visuales

### API Client (`packages/api-client`)
Cliente unificado para comunicación con Back4App:
- Autenticación
- CRUD operations
- Manejo de errores
- Cache y optimización

### Types (`packages/types`)
Definiciones de tipos TypeScript:
- Interfaces de usuario
- Tipos de suscripción
- Tipos de orden
- Tipos de producto

### Utils (`packages/utils`)
Utilidades comunes:
- Formateo de fechas y moneda
- Validaciones
- Funciones helper
- Constantes

## Configuración de Desarrollo

### Scripts Principales
```bash
# Desarrollo
npm run dev                    # Todas las apps
npm run dev:customer           # Solo portal de clientes
npm run dev:marketing          # Solo sitio de marketing
npm run dev:admin              # Solo dashboard admin

# Build
npm run build                  # Todas las apps
npm run build:customer         # Solo portal de clientes
npm run build:marketing        # Solo sitio de marketing
npm run build:admin            # Solo dashboard admin

# Utilidades
npm run lint                   # Linting
npm run format                 # Formateo
npm run mock-api               # API mock
```

### Variables de Entorno
Cada aplicación tiene su propio archivo `.env.local`:

```bash
# Customer App
NEXT_PUBLIC_API_URL=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=

# Marketing App
NEXT_PUBLIC_SITE_URL=
NEXT_PUBLIC_GA_ID=

# Admin App
NEXT_PUBLIC_MAPBOX_TOKEN=
NEXT_PUBLIC_API_URL=
```

## Flujo de Datos

### Cliente → Backend
1. Cliente hace request a través de `@ewa/api-client`
2. API Client se comunica con Back4App
3. Back4App procesa y almacena en MongoDB
4. Respuesta regresa al cliente

### Integraciones Externas
- **Stripe:** Pagos y suscripciones
- **SendGrid:** Notificaciones por email
- **MapBox:** Optimización de rutas
- **Expo Push:** Notificaciones push

## Convenciones de Código

### Nomenclatura
- **Archivos:** kebab-case (`user-profile.tsx`)
- **Componentes:** PascalCase (`UserProfile`)
- **Funciones:** camelCase (`getUserData`)
- **Constantes:** UPPER_SNAKE_CASE (`API_BASE_URL`)

### Estructura de Componentes
```typescript
// Componente típico
import React from 'react';
import { ComponentProps } from '@ewa/types';

interface Props extends ComponentProps {
  // props específicas
}

export const Component: React.FC<Props> = ({ ... }) => {
  // lógica del componente
  return (
    // JSX
  );
};
```

### Imports
```typescript
// Imports de paquetes compartidos
import { Button } from '@ewa/ui';
import { User } from '@ewa/types';
import { formatCurrency } from '@ewa/utils';

// Imports locales
import { useAuth } from '@/hooks/useAuth';
import { api } from '@/services/api';
```

## Deployment

### Vercel
Cada aplicación se despliega independientemente en Vercel:
- `customer.ewa.com` - Portal de clientes
- `marketing.ewa.com` - Sitio de marketing
- `admin.ewa.com` - Dashboard de operaciones

### Back4App
- Cloud Functions para lógica de negocio
- Webhooks para integraciones
- Base de datos MongoDB Atlas

## Monitoreo y Analytics

### Sentry
- Error tracking en todas las apps
- Performance monitoring
- User feedback

### Google Analytics
- Tracking de conversiones
- User behavior
- Marketing attribution

## Seguridad

### Autenticación
- JWT tokens con Back4App
- Role-based access control
- Session management

### Datos Sensibles
- Stripe keys en variables de entorno
- PCI-DSS compliance
- Data encryption at rest

## Próximos Pasos

1. **Setup inicial:** Configurar Back4App y credenciales
2. **UI/UX:** Implementar sistema de diseño
3. **Desarrollo:** Construir flujos principales
4. **Testing:** QA y optimización
5. **Launch:** Deployment y soporte 