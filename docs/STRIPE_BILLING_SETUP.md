# Integración con Stripe Billing

Esta guía interna documenta cómo activar cobros recurrentes mediante Stripe y mantener sincronizado el catálogo con Parse/Back4App.

## Pasos para la integración

1. Crea la cuenta en Stripe y habilita **Billing** con suscripciones activadas.
2. Configura productos y precios reutilizando los mismos identificadores que usamos en el proyecto (por ejemplo, `plan_weekly`, `plan_growth`).
3. Declara las variables de entorno `STRIPE_SECRET_KEY`, `STRIPE_PUBLISHABLE_KEY` y `STRIPE_WEBHOOK_SECRET` en el proyecto correspondiente.
4. Ejecuta `npm run upload:products` para sincronizar catálogo y verifica que el script `apps/web/src/lib/stripe-server.ts` utilice la llave secreta correcta.
5. Configura los Webhooks en Stripe apuntando a `/api/stripe/*` para los eventos `payment-intent.succeeded`, `customer.subscription.updated` y `customer.subscription.deleted`.
6. En producción utiliza Stripe Checkout o el Billing Portal para altas/bajas y guarda el `subscriptionId` en Parse.

## Tip operativo

Usa el script `npm run upload:products` de manera recurrente para mantener catálogo y assets sincronizados en Parse. Conecta los endpoints bajo `/api/stripe` a los Webhooks configurados y habilita el Customer Portal de Stripe para que los usuarios autogestionen métodos de pago.
