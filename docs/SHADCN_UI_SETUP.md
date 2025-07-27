# Guía de Implementación de shadcn/ui - EWA Box Water

## Visión General

[shadcn/ui](https://ui.shadcn.com/) será la base de nuestro sistema de diseño para toda la plataforma EWA Box Water. Proporciona componentes hermosos, accesibles y personalizables que se integran perfectamente con Next.js 14 y Tailwind CSS.

## Beneficios de shadcn/ui para EWA

### ✅ **Ventajas**
- **Componentes hermosos y modernos** - Diseño profesional out-of-the-box
- **Accesibilidad nativa** - WCAG 2.1 AA compliance
- **Personalización completa** - Tema adaptado a marca EWA
- **Performance optimizada** - Solo incluye el código que usas
- **TypeScript nativo** - Tipado completo
- **Integración perfecta** - Next.js 14 + Tailwind CSS
- **Comunidad activa** - Soporte y actualizaciones constantes

### 🎨 **Componentes Específicos para EWA**

#### **Portal de Clientes**
- **Button** - Botones de suscripción, checkout, acciones
- **Card** - Tarjetas de productos y planes
- **Form** - Formularios de registro, login, perfil
- **Input** - Campos de texto, email, contraseña
- **Dialog** - Modales de confirmación
- **Badge** - Estados de suscripción, órdenes
- **Avatar** - Fotos de perfil de usuario

#### **Dashboard Admin**
- **Table** - Listas de clientes, suscripciones, inventario
- **Chart** - Gráficos de MRR, retención, métricas
- **Calendar** - Programación de entregas
- **Progress** - Barras de progreso de tareas
- **Alert** - Notificaciones y alertas
- **Dropdown** - Menús de navegación
- **Tabs** - Organización de contenido

#### **Sitio de Marketing**
- **Navigation** - Menú principal y footer
- **Hero** - Sección principal de landing
- **Testimonial** - Testimonios de clientes
- **Pricing** - Tabla de precios
- **Contact** - Formulario de contacto

## Plan de Implementación

### **Fase 1: Setup Inicial**
```bash
# En cada aplicación (customer, marketing, admin)
npx shadcn@latest init
```

### **Fase 2: Configuración del Tema**
```typescript
// globals.css
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    
    /* Colores EWA */
    --ewa-primary: 210 100% 50%;     /* Azul EWA */
    --ewa-secondary: 120 100% 40%;   /* Verde agua */
    --ewa-accent: 30 100% 50%;       /* Naranja */
    
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: 222.2 47.4% 11.2%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96%;
    --secondary-foreground: 222.2 84% 4.9%;
    --muted: 210 40% 96%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96%;
    --accent-foreground: 222.2 84% 4.9%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 222.2 84% 4.9%;
    --radius: 0.5rem;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;
    --primary: 210 40% 98%;
    --primary-foreground: 222.2 47.4% 11.2%;
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 212.7 26.8% 83.9%;
  }
}
```

### **Fase 3: Instalación de Componentes**

#### **Componentes Base (Prioridad Alta)**
```bash
# Componentes esenciales
npx shadcn@latest add button
npx shadcn@latest add input
npx shadcn@latest add card
npx shadcn@latest add form
npx shadcn@latest add dialog
npx shadcn@latest add badge
npx shadcn@latest add avatar
```

#### **Componentes de Datos (Prioridad Media)**
```bash
# Para dashboard admin
npx shadcn@latest add table
npx shadcn@latest add dropdown-menu
npx shadcn@latest add tabs
npx shadcn@latest add progress
npx shadcn@latest add alert
```

#### **Componentes Avanzados (Prioridad Baja)**
```bash
# Componentes especializados
npx shadcn@latest add calendar
npx shadcn@latest add select
npx shadcn@latest add textarea
npx shadcn@latest add checkbox
npx shadcn@latest add radio-group
npx shadcn@latest add switch
npx shadcn@latest add slider
```

### **Fase 4: Componentes Personalizados EWA**

#### **EWAButton**
```typescript
// components/ui/ewa-button.tsx
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface EWAButtonProps {
  variant?: "primary" | "secondary" | "outline" | "ghost"
  size?: "sm" | "md" | "lg"
  children: React.ReactNode
  className?: string
  onClick?: () => void
}

export function EWAButton({ 
  variant = "primary", 
  size = "md", 
  children, 
  className,
  ...props 
}: EWAButtonProps) {
  return (
    <Button
      variant={variant}
      size={size}
      className={cn(
        "font-semibold transition-all duration-200",
        variant === "primary" && "bg-ewa-primary hover:bg-ewa-primary/90",
        className
      )}
      {...props}
    >
      {children}
    </Button>
  )
}
```

#### **EWACard**
```typescript
// components/ui/ewa-card.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface EWACardProps {
  title?: string
  description?: string
  children: React.ReactNode
  className?: string
}

export function EWACard({ title, description, children, className }: EWACardProps) {
  return (
    <Card className={cn("border-ewa-primary/20 shadow-lg", className)}>
      {(title || description) && (
        <CardHeader>
          {title && <CardTitle className="text-ewa-primary">{title}</CardTitle>}
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
      )}
      <CardContent>{children}</CardContent>
    </Card>
  )
}
```

## Configuración por Aplicación

### **Portal de Clientes (`apps/customer`)**
```bash
cd apps/customer
npx shadcn@latest init
# Seleccionar: TypeScript, Tailwind CSS, CSS Variables, React Server Components
```

**Componentes específicos:**
- Button, Input, Form, Card, Dialog, Badge, Avatar
- Tema: Enfoque en conversión y usabilidad

### **Sitio de Marketing (`apps/marketing`)**
```bash
cd apps/marketing
npx shadcn@latest init
# Seleccionar: TypeScript, Tailwind CSS, CSS Variables, React Server Components
```

**Componentes específicos:**
- Navigation, Hero, Card, Button, Form, Alert
- Tema: Enfoque en branding y conversión

### **Dashboard Admin (`apps/admin`)**
```bash
cd apps/admin
npx shadcn@latest init
# Seleccionar: TypeScript, Tailwind CSS, CSS Variables, React Server Components
```

**Componentes específicos:**
- Table, Chart, Calendar, Progress, Alert, Dropdown, Tabs
- Tema: Enfoque en funcionalidad y eficiencia

## Integración con Paquetes Compartidos

### **Paquete UI (`packages/ui`)**
```typescript
// packages/ui/src/components/index.ts
export { Button } from './button'
export { Card } from './card'
export { Input } from './input'
export { Form } from './form'
export { Dialog } from './dialog'
export { Badge } from './badge'
export { Avatar } from './avatar'
export { EWAButton } from './ewa-button'
export { EWACard } from './ewa-card'
```

## Accesibilidad

### **WCAG 2.1 AA Compliance**
- Todos los componentes shadcn/ui incluyen accesibilidad nativa
- Navegación por teclado
- Screen reader support
- Contraste de colores adecuado
- Focus indicators visibles

### **Testing de Accesibilidad**
```bash
# Instalar herramientas de testing
npm install -D @axe-core/react

# Testing en componentes
import { axe, toHaveNoViolations } from 'jest-axe'
expect.extend(toHaveNoViolations)
```

## Performance

### **Optimizaciones**
- Tree-shaking automático
- CSS-in-JS optimizado
- Lazy loading de componentes
- Bundle splitting por aplicación

### **Métricas Objetivo**
- First Contentful Paint: < 1.5s
- Largest Contentful Paint: < 2.5s
- Cumulative Layout Shift: < 0.1
- First Input Delay: < 100ms

## Monitoreo y Mantenimiento

### **Versionado**
- Mantener shadcn/ui actualizado
- Documentar cambios breaking
- Testing de regresiones

### **Analytics**
- Tracking de uso de componentes
- Performance monitoring
- Error tracking

## Recursos y Referencias

- [shadcn/ui Documentation](https://ui.shadcn.com/)
- [Componentes disponibles](https://ui.shadcn.com/docs/components)
- [Guía de instalación](https://ui.shadcn.com/docs/installation)
- [Guía de temas](https://ui.shadcn.com/docs/themes)
- [Guía de accesibilidad](https://ui.shadcn.com/docs/accessibility)
- [GitHub Repository](https://github.com/shadcn/ui)

## Próximos Pasos

1. **Setup inicial** en cada aplicación
2. **Configuración del tema** EWA
3. **Instalación de componentes** base
4. **Creación de componentes** personalizados
5. **Testing y QA** de accesibilidad
6. **Documentación** completa
7. **Deployment** y monitoreo 