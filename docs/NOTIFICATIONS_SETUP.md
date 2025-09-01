# 🚀 Configuración Completa de Notificaciones EWA

## 📋 **Resumen**

Este documento explica cómo configurar y usar el sistema de notificaciones de EWA Box Water, que incluye:
- **SendGrid** para emails
- **Twilio** para SMS
- **Proveedores mock** para desarrollo
- **Sistema inteligente** que cambia automáticamente según el entorno

## 🛠️ **Instalación y Configuración**

### **1. Instalar Dependencias**

```bash
# En el root del proyecto
npm install

# O instalar específicamente en el paquete utils
cd packages/utils
npm install @sendgrid/mail twilio
```

### **2. Configurar Variables de Entorno**

Crear o actualizar tu archivo `.env.local`:

```bash
# SendGrid Configuration
SENDGRID_API_KEY=SG.your_sendgrid_api_key
SENDGRID_FROM_EMAIL=noreply@ewa.com

# Twilio Configuration
TWILIO_ACCOUNT_SID=AC.your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_FROM_PHONE=+10000000000

# Entorno
NODE_ENV=development
```

### **3. Obtener Credenciales**

#### **SendGrid:**
1. Crear cuenta en [SendGrid](https://sendgrid.com)
2. Verificar tu dominio de email
3. Generar API Key
4. Configurar remitente verificado

#### **Twilio:**
1. Crear cuenta en [Twilio](https://twilio.com)
2. Obtener Account SID y Auth Token
3. Comprar número de teléfono
4. Verificar números de destino (para trial)

## 🔧 **Uso del Sistema**

### **Importación Básica**

```typescript
import { smartNotificationService } from '@ewa/utils';

// El servicio detecta automáticamente qué proveedor usar
```

### **Envío de Emails**

```typescript
// Email simple
await smartNotificationService.sendEmail({
  to: 'usuario@email.com',
  subject: 'Asunto del Email',
  html: '<h1>Contenido HTML</h1>',
  text: 'Contenido de texto plano',
});

// Usando template de SendGrid
await smartNotificationService.sendEmail({
  to: 'usuario@email.com',
  subject: 'Email con Template',
  templateId: 'd-xxxxxxxxxxxxxxxxxxxxxxxx',
  dynamicTemplateData: {
    name: 'Juan',
    plan: 'Básico',
  },
});
```

### **Envío de SMS**

```typescript
await smartNotificationService.sendSms({
  to: '+1234567890',
  body: 'Mensaje de texto',
});
```

### **Notificaciones Predefinidas**

```typescript
// Notificación de bienvenida
await smartNotificationService.sendWelcomeNotification(
  'usuario@email.com',
  '+1234567890',
  'Nombre del Usuario'
);

// Confirmación de suscripción
await smartNotificationService.sendSubscriptionConfirmation(
  'usuario@email.com',
  {
    planName: 'Plan Premium',
    frequency: 'Semanal',
    price: '49.99',
    nextDelivery: '2024-01-15',
  }
);

// Recordatorio de entrega
await smartNotificationService.sendDeliveryReminder(
  'usuario@email.com',
  '+1234567890',
  {
    date: '2024-01-15',
    estimatedTime: '10:00 AM',
    address: '123 Main St, City, State',
  }
);
```

## 🧪 **Pruebas**

### **Ejecutar Script de Prueba**

```bash
cd packages/utils
npm run test:notifications
```

### **Pruebas Manuales en Código**

```typescript
import { smartNotificationService } from '@ewa/utils';

// Verificar estado de proveedores
const status = smartNotificationService.getProviderStatus();
console.log(status);

// Probar envío
try {
  const result = await smartNotificationService.sendEmail({
    to: 'test@ewa.com',
    subject: 'Prueba',
    text: 'Este es un email de prueba',
  });
  console.log('Email enviado:', result);
} catch (error) {
  console.error('Error:', error);
}
```

## 🔄 **Comportamiento Automático**

### **En Desarrollo (NODE_ENV=development):**
- Usa proveedores **mock** por defecto
- Logs en consola para debugging
- No requiere credenciales reales

### **En Producción (NODE_ENV=production):**
- Usa **SendGrid** y **Twilio** reales
- Requiere todas las credenciales configuradas
- Manejo de errores robusto

### **Detección Automática:**
```typescript
// El sistema detecta automáticamente:
if (hasSendGridConfig && isProduction) {
  // Usa SendGrid real
} else {
  // Usa mock
}
```

## 📱 **Integración en Componentes React**

### **Hook de Notificaciones**

```typescript
import { useState } from 'react';
import { smartNotificationService } from '@ewa/utils';

export function useNotifications() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendWelcomeEmail = async (email: string, name: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      await smartNotificationService.sendWelcomeNotification(email, undefined, name);
      return { success: true };
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      return { success: false, error: err };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    sendWelcomeEmail,
    isLoading,
    error,
  };
}
```

### **Uso en Componente**

```typescript
import { useNotifications } from './useNotifications';

export function RegistrationForm() {
  const { sendWelcomeEmail, isLoading, error } = useNotifications();

  const handleSubmit = async (formData: any) => {
    // ... lógica de registro
    
    // Enviar email de bienvenida
    const result = await sendWelcomeEmail(formData.email, formData.name);
    
    if (result.success) {
      // Mostrar mensaje de éxito
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* ... campos del formulario */}
      {error && <div className="error">{error}</div>}
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Enviando...' : 'Registrarse'}
      </button>
    </form>
  );
}
```

## 🚨 **Manejo de Errores**

### **Tipos de Errores Comunes**

```typescript
// SendGrid
- API Key inválida
- Email no verificado
- Rate limiting
- Template no encontrado

// Twilio
- Credenciales inválidas
- Número no verificado (trial)
- Saldo insuficiente
- Número de destino inválido
```

### **Estrategia de Fallback**

```typescript
try {
  await smartNotificationService.sendEmail(message);
} catch (error) {
  if (error.message.includes('SendGrid')) {
    // Fallback a email alternativo o log
    console.error('SendGrid falló:', error);
    // Opcional: enviar a servicio alternativo
  } else {
    // Error inesperado
    throw error;
  }
}
```

## 📊 **Monitoreo y Logs**

### **Logs Automáticos**

El sistema genera logs automáticos para:
- Envíos exitosos
- Errores de proveedores
- Cambios de proveedor
- Rate limiting

### **Métricas Recomendadas**

```typescript
// Contar envíos exitosos/fallidos
// Monitorear latencia de envío
// Verificar rate limits
// Alertas de errores críticos
```

## 🔒 **Seguridad**

### **Buenas Prácticas**

1. **Nunca** exponer credenciales en el frontend
2. **Siempre** usar variables de entorno
3. **Validar** emails y números antes de enviar
4. **Implementar** rate limiting por usuario
5. **Logging** de intentos de envío

### **Validación de Entrada**

```typescript
import { z } from 'zod';

const emailSchema = z.string().email();
const phoneSchema = z.string().regex(/^\+[1-9]\d{1,14}$/);

// Validar antes de enviar
const validEmail = emailSchema.parse(email);
const validPhone = phoneSchema.parse(phone);
```

## 🚀 **Próximos Pasos**

### **Fase 1 (Completado):**
- ✅ Sistema base implementado
- ✅ Proveedores mock funcionando
- ✅ Integración con SendGrid y Twilio

### **Fase 2 (Próxima):**
- [ ] Templates de email personalizados
- [ ] Sistema de colas para envíos masivos
- [ ] Webhooks de entrega
- [ ] Dashboard de monitoreo

### **Fase 3 (Futura):**
- [ ] A/B testing de templates
- [ ] Personalización dinámica
- [ ] Integración con analytics
- [ ] Machine learning para optimización

## 📞 **Soporte**

Si tienes problemas:

1. **Verificar** variables de entorno
2. **Ejecutar** script de prueba
3. **Revisar** logs de consola
4. **Consultar** documentación de SendGrid/Twilio
5. **Contactar** al equipo de desarrollo

---

**¡El sistema está listo para usar! 🎉**
