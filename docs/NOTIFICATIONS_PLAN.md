## Plan de Integración de Notificaciones (SendGrid y Twilio)

### Objetivo
Integrar notificaciones por email (SendGrid) y SMS (Twilio) con proveedores mock en desarrollo. Identificar puntos de disparo y dejar interfaces listas para reemplazo por proveedores reales.

### Alcance (MVP)
- Proveedores mock implementados: `MockEmailProvider`, `MockSmsProvider`.
- Servicio `NotificationService` inyectable/exportado (`@ewa/utils`).
- Hooks de notificación (mock) en:
  - Registro de usuario (bienvenida por email y SMS si hay teléfono).
  - Creación de suscripción (confirmación por email).
- Variables de entorno documentadas.

### Puntos de disparo (primeros)
- Registro: `apps/web/src/pages/register.tsx` después de persistir el usuario local.
- Nueva suscripción: `apps/web/src/pages/admin/subscriptions/new.tsx` tras `createSubscription`.

### Variables de entorno
Agregar a `.env.local` (placeholder en dev, reales en prod):

```
# SendGrid
SENDGRID_API_KEY=your_sendgrid_api_key
SENDGRID_FROM_EMAIL=noreply@ewa.com

# Twilio
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_FROM_PHONE=+10000000000
```

### Reemplazo por proveedores reales (futuro)
- Crear `SendGridEmailProvider` usando `@sendgrid/mail`.
- Crear `TwilioSmsProvider` usando `twilio` SDK.
- Inyectar en `NotificationService` según `NODE_ENV` o feature flag.

### Checklist
- [x] Interfaces y mocks de notificaciones
- [x] Hook de email en creación de suscripción
- [x] Hook de email/SMS en registro
- [ ] Variables de entorno agregadas/documentadas
- [ ] Proveedores reales (fase siguiente)



