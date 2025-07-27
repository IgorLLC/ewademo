# Guía de Desarrollo - EWA Box Water

## Configuración Inicial

### Prerrequisitos
- Node.js >= 16.0.0
- npm >= 8.0.0
- Git

### Setup del Proyecto
```bash
# Clonar el repositorio
git clone <repository-url>
cd ewa-box-water

# Instalar dependencias
npm install

# Instalar dependencias de todos los workspaces
npm run install:all

# Configurar variables de entorno
cp .env.example .env.local
```

### Variables de Entorno Requeridas

#### Para todas las apps:
```bash
# Back4App
NEXT_PUBLIC_BACK4APP_APPLICATION_ID=your_app_id
NEXT_PUBLIC_BACK4APP_CLIENT_KEY=your_client_key
BACK4APP_MASTER_KEY=your_master_key
BACK4APP_SERVER_URL=https://parseapi.back4app.com

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# SendGrid
SENDGRID_API_KEY=SG...
SENDGRID_FROM_EMAIL=noreply@ewa.com

# MapBox
NEXT_PUBLIC_MAPBOX_TOKEN=pk...
```

## Flujo de Desarrollo

### 1. Desarrollo Local
```bash
# Iniciar todas las aplicaciones
npm run dev

# O iniciar una aplicación específica
npm run dev:customer
npm run dev:marketing
npm run dev:admin

# API mock para desarrollo
npm run mock-api
```

### 2. Estructura de Branches
```
main                    # Producción
├── develop            # Desarrollo principal
├── feature/           # Nuevas funcionalidades
│   ├── feature/customer-subscription
│   ├── feature/admin-dashboard
│   └── feature/marketing-site
├── bugfix/            # Correcciones de bugs
└── hotfix/            # Correcciones urgentes
```

### 3. Convenciones de Commits
```
feat: nueva funcionalidad
fix: corrección de bug
docs: documentación
style: cambios de estilo
refactor: refactorización
test: tests
chore: tareas de mantenimiento
```

## Arquitectura de Código

### Estructura de Componentes
```typescript
// Componente típico
import React from 'react';
import { ComponentProps } from '@ewa/types';
import { Button } from '@ewa/ui';
import { formatCurrency } from '@ewa/utils';

interface Props extends ComponentProps {
  title: string;
  price: number;
  onAction?: () => void;
}

export const ProductCard: React.FC<Props> = ({ 
  title, 
  price, 
  onAction,
  className = '' 
}) => {
  return (
    <div className={`bg-white rounded-lg shadow-md p-4 ${className}`}>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-2xl font-bold text-green-600">
        {formatCurrency(price)}
      </p>
      {onAction && (
        <Button onClick={onAction} variant="primary">
          Comprar
        </Button>
      )}
    </div>
  );
};
```

### Hooks Personalizados
```typescript
// hooks/useSubscription.ts
import { useState, useEffect } from 'react';
import { Subscription } from '@ewa/types';
import { api } from '@/services/api';

export const useSubscription = (userId: string) => {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        setLoading(true);
        const data = await api.subscriptions.getByUser(userId);
        setSubscription(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchSubscription();
    }
  }, [userId]);

  return { subscription, loading, error };
};
```

### Servicios de API
```typescript
// services/api.ts
import { apiClient } from '@ewa/api-client';
import { User, Subscription, Order } from '@ewa/types';

export const api = {
  // Usuarios
  users: {
    get: (id: string) => apiClient.get<User>(`/users/${id}`),
    update: (id: string, data: Partial<User>) => 
      apiClient.put<User>(`/users/${id}`, data),
    create: (data: Omit<User, 'id'>) => 
      apiClient.post<User>('/users', data),
  },

  // Suscripciones
  subscriptions: {
    get: (id: string) => apiClient.get<Subscription>(`/subscriptions/${id}`),
    getByUser: (userId: string) => 
      apiClient.get<Subscription[]>(`/subscriptions?user=${userId}`),
    create: (data: Omit<Subscription, 'id'>) => 
      apiClient.post<Subscription>('/subscriptions', data),
    update: (id: string, data: Partial<Subscription>) => 
      apiClient.put<Subscription>(`/subscriptions/${id}`, data),
    cancel: (id: string) => 
      apiClient.put<Subscription>(`/subscriptions/${id}/cancel`),
  },

  // Órdenes
  orders: {
    get: (id: string) => apiClient.get<Order>(`/orders/${id}`),
    getByUser: (userId: string) => 
      apiClient.get<Order[]>(`/orders?user=${userId}`),
    create: (data: Omit<Order, 'id'>) => 
      apiClient.post<Order>('/orders', data),
  },
};
```

## Testing

### Configuración de Tests
```typescript
// __tests__/components/ProductCard.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { ProductCard } from '@/components/ProductCard';

describe('ProductCard', () => {
  it('renders product information correctly', () => {
    const mockOnAction = jest.fn();
    
    render(
      <ProductCard
        title="Agua Purificada"
        price={29.99}
        onAction={mockOnAction}
      />
    );

    expect(screen.getByText('Agua Purificada')).toBeInTheDocument();
    expect(screen.getByText('$29.99')).toBeInTheDocument();
  });

  it('calls onAction when button is clicked', () => {
    const mockOnAction = jest.fn();
    
    render(
      <ProductCard
        title="Agua Purificada"
        price={29.99}
        onAction={mockOnAction}
      />
    );

    fireEvent.click(screen.getByText('Comprar'));
    expect(mockOnAction).toHaveBeenCalledTimes(1);
  });
});
```

### Comandos de Testing
```bash
# Ejecutar tests
npm test

# Tests en modo watch
npm test -- --watch

# Coverage
npm test -- --coverage

# Tests específicos
npm test -- ProductCard
```

## Linting y Formateo

### ESLint
```bash
# Linting de todo el proyecto
npm run lint

# Linting de una app específica
npm run lint --workspace=@ewa/customer

# Auto-fix
npm run lint -- --fix
```

### Prettier
```bash
# Formateo de todo el código
npm run format

# Verificar formato
npm run format -- --check
```

## Deployment

### Staging
```bash
# Build de staging
npm run build:staging

# Deploy a staging
vercel --prod
```

### Producción
```bash
# Build de producción
npm run build

# Deploy a producción
vercel --prod
```

## Debugging

### Herramientas de Desarrollo
- **React DevTools:** Para debugging de componentes
- **Redux DevTools:** Para debugging de estado
- **Network Tab:** Para debugging de API calls
- **Console:** Para logs y errores

### Logs
```typescript
// Logging estructurado
import { logger } from '@ewa/utils';

logger.info('Usuario inició sesión', { userId: '123', timestamp: new Date() });
logger.error('Error en checkout', { error: err, orderId: '456' });
logger.warn('Suscripción próxima a vencer', { subscriptionId: '789' });
```

## Performance

### Optimizaciones
- **Code Splitting:** Lazy loading de componentes
- **Image Optimization:** Next.js Image component
- **Bundle Analysis:** `npm run analyze`
- **Caching:** React Query para cache de datos

### Métricas
- **Core Web Vitals:** LCP, FID, CLS
- **Bundle Size:** Tamaño de JavaScript
- **API Response Time:** Tiempo de respuesta
- **Error Rate:** Tasa de errores

## Seguridad

### Best Practices
- **Input Validation:** Zod schemas
- **XSS Prevention:** React escape automático
- **CSRF Protection:** Tokens en formularios
- **HTTPS:** Siempre en producción

### Autenticación
```typescript
// Middleware de autenticación
export function withAuth(Component: React.ComponentType) {
  return function AuthenticatedComponent(props: any) {
    const { user, loading } = useAuth();
    
    if (loading) return <LoadingSpinner />;
    if (!user) return <LoginRedirect />;
    
    return <Component {...props} />;
  };
}
```

## Troubleshooting

### Problemas Comunes

#### Error de dependencias
```bash
# Limpiar cache
rm -rf node_modules package-lock.json
npm install
```

#### Puerto ocupado
```bash
# Verificar puertos en uso
lsof -i :3000
lsof -i :3001
lsof -i :3002

# Matar proceso
kill -9 <PID>
```

#### Build errors
```bash
# Limpiar builds
rm -rf .next dist

# Rebuild
npm run build
```

### Recursos Útiles
- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://reactjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Back4App Documentation](https://docs.back4app.com)

## Contacto

Para preguntas técnicas o soporte:
- **Email:** tech@ewa.com
- **Slack:** #ewa-dev
- **GitHub Issues:** Para bugs y feature requests 