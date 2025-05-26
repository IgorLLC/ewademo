# EWA Box Water - Estructura de Rutas y Secciones

Este documento describe la estructura de rutas y secciones de la aplicación EWA Box Water, un servicio de suscripción de agua en caja sustentable.

## Estructura General

La aplicación está organizada en tres áreas principales:

1. **Landing Page y Autenticación** - Área pública para visitantes
2. **Área de Cliente** - Portal para clientes con suscripciones
3. **Área de Administración** - Panel de control para administradores

Todas las rutas están consolidadas en una sola aplicación web que corre en el puerto 3000.

## 1. Landing Page y Autenticación

### Rutas Principales

| Ruta | Descripción |
|------|-------------|
| `/` | Landing page principal con información del producto |
| `/auth` | Página de autenticación (login/registro) |
| `/plans` | Información sobre planes de suscripción |
| `/blog` | Blog con artículos sobre sostenibilidad |

### Características de la Landing Page

- **Hero Banner** con llamado a la acción ("Comenzar ahora")
- **Sección de Valores** destacando beneficios (Eco-friendly, Entrega conveniente, Calidad premium)
- **Catálogo de Productos** mostrando los diferentes tamaños disponibles
- **Sección de Llamado a la Acción** para incentivar la suscripción

### Características de la Autenticación

- **Inicio de Sesión** para usuarios existentes
- **Registro** para nuevos usuarios
- **Redirección Inteligente** según el rol del usuario:
  - Clientes → `/customer`
  - Administradores → `/admin`
- **Usuarios de Prueba**:
  - Cliente: juan@cliente.com / test123
  - Cliente B2B: info@sobao.com / sobao123
  - Administrador: admin@ewa.com / admin123
  - Operador: carmen@ewa.com / carmen123
  - Editor: pedro@ewa.com / pedro123

## 2. Área de Cliente

### Rutas Principales

| Ruta | Descripción |
|------|-------------|
| `/customer` | Redirección que verifica autenticación |
| `/customer/subscriptions` | Gestión de suscripciones activas |
| `/customer/oneoffs` | Pedidos únicos (sin suscripción) |
| `/customer/profile` | Perfil del cliente y preferencias |

### Características del Área de Cliente

#### Suscripciones (`/customer/subscriptions`)
- **Información Personal** con bienvenida personalizada
- **Información de Entrega** con dirección, fecha de próxima entrega y mapa
- **Panel de Suscripción Activa** con opciones para pausar/reactivar
- **Historial de Entregas** en formato tabla
- **Sección de Soporte** para contactar con problemas

#### Pedidos Únicos (`/customer/oneoffs`)
- **Listado de Pedidos** con estado (entregado/pendiente)
- **Detalles del Producto** para cada pedido
- **Fechas de Pedido y Entrega**
- **Acciones** como seguimiento de pedido o repetir pedido

#### Perfil (`/customer/profile`)
- **Información Personal** (nombre, email, teléfono)
- **Dirección de Entrega**
- **Cambio de Contraseña**
- **Preferencias de Comunicación**

## 3. Área de Administración

### Rutas Principales

| Ruta | Descripción |
|------|-------------|
| `/admin` | Redirección que verifica autenticación |
| `/admin/dashboard` | Panel principal con métricas |
| `/admin/clients` | Gestión de clientes |
| `/admin/subscriptions` | Gestión de suscripciones |
| `/admin/routes` | Planificación de rutas de entrega |
| `/admin/metrics` | Métricas detalladas del negocio |
| `/admin/plans` | Gestión de planes y precios |
| `/admin/pickup-points` | Gestión de puntos de recogida |
| `/admin/inventory` | Control de inventario |
| `/admin/content` | Gestión de contenido (landing y blog) |
| `/admin/notifications` | Gestión de notificaciones |
| `/admin/internal-users` | Gestión de usuarios internos |

### Características del Área de Administración

#### Dashboard (`/admin/dashboard`)
- **KPIs Principales**:
  - Ingresos Mensuales Recurrentes (MRR)
  - Tasa de Cancelación (Churn)
  - Tasa de Cumplimiento
  - Suscripciones Activas
  - Total de Clientes
  - Total de Pedidos
- **Acciones Rápidas** para tareas comunes
- **Actividad Reciente** con últimas acciones

#### Clientes (`/admin/clients`)
- **Listado de Clientes** con información de contacto
- **Detalles de Cliente** con historial de pedidos
- **Creación y Edición** de clientes

#### Suscripciones (`/admin/subscriptions`)
- **Listado de Suscripciones** con estado
- **Filtros** por cliente, plan y estado
- **Gestión** de suscripciones (pausar, cancelar, modificar)

#### Rutas (`/admin/routes`)
- **Planificación de Rutas** de entrega
- **Mapa** con visualización de rutas
- **Asignación de Conductores**

#### Métricas (`/admin/metrics`)
- **Gráficos de Rendimiento** del negocio
- **Análisis de Tendencias**
- **Exportación de Informes**

## Autenticación y Seguridad

- **Verificación de Roles** en todas las rutas protegidas
- **Redirección Automática** a la página de autenticación si no hay sesión
- **Botón de Logout** visible en todas las páginas autenticadas
- **Limpieza de Sesión** al cerrar sesión

## Flujo de Navegación

1. El usuario comienza en la landing page (`/`)
2. Hace clic en "Iniciar sesión" para ir a la página de autenticación (`/auth`)
3. Ingresa sus credenciales (cliente o admin)
4. Es redirigido automáticamente al área correspondiente según su rol:
   - Clientes → `/customer`
   - Administradores → `/admin`
5. Navega por las diferentes secciones de su área
6. Puede cerrar sesión en cualquier momento con el botón de logout

## Datos de Ejemplo

La aplicación utiliza datos mock para simular un entorno real:

- **Productos**: Cajas de agua en diferentes tamaños (pequeño, mediano, grande)
- **Planes**: Opciones de suscripción (semanal, quincenal, mensual)
- **Ubicaciones**: San Juan, Río Piedras, Caguas, Mayagüez y Ponce
- **Clientes Demo**: Juan Rivera (B2C), Restaurante Sobao (B2B)
- **Métricas**: MRR, churn, tasa de cumplimiento, etc.

---

*Documentación creada para EWA Box Water - Mayo 2025*
