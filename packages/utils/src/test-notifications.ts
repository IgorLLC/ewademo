#!/usr/bin/env node

import { smartNotificationService } from './services/smart-notification-service';
import { validateNotificationsConfig } from './config/notifications.config';

async function testNotifications() {
  console.log('🧪 Probando Sistema de Notificaciones EWA\n');

  // 1. Validar configuración
  console.log('1️⃣ Validando configuración...');
  const configValidation = validateNotificationsConfig();
  
  if (configValidation.errors.length > 0) {
    console.log('❌ Errores de configuración:');
    configValidation.errors.forEach(error => console.log(`   - ${error}`));
  }
  
  if (configValidation.warnings.length > 0) {
    console.log('⚠️  Advertencias:');
    configValidation.warnings.forEach(warning => console.log(`   - ${warning}`));
  }

  if (configValidation.isValid) {
    console.log('✅ Configuración válida');
  }

  // 2. Verificar estado de proveedores
  console.log('\n2️⃣ Estado de proveedores:');
  const providerStatus = smartNotificationService.getProviderStatus();
  console.log(`   Email Provider: ${providerStatus.emailProvider}`);
  console.log(`   SMS Provider: ${providerStatus.smsProvider}`);
  console.log(`   Entorno: ${providerStatus.isProduction ? 'Producción' : 'Desarrollo'}`);
  console.log(`   SendGrid configurado: ${providerStatus.hasSendGrid ? 'Sí' : 'No'}`);
  console.log(`   Twilio configurado: ${providerStatus.hasTwilio ? 'Sí' : 'No'}`);

  // 3. Probar notificación de bienvenida
  console.log('\n3️⃣ Probando notificación de bienvenida...');
  try {
    const welcomeResult = await smartNotificationService.sendWelcomeNotification(
      'test@ewa.com',
      '+1234567890',
      'Usuario de Prueba'
    );
    console.log('✅ Notificación de bienvenida enviada:', welcomeResult);
  } catch (error) {
    console.log('❌ Error en notificación de bienvenida:', error);
  }

  // 4. Probar confirmación de suscripción
  console.log('\n4️⃣ Probando confirmación de suscripción...');
  try {
    const subscriptionResult = await smartNotificationService.sendSubscriptionConfirmation(
      'test@ewa.com',
      {
        planName: 'Plan Básico',
        frequency: 'Semanal',
        price: '29.99',
        nextDelivery: '2024-01-15',
      }
    );
    console.log('✅ Confirmación de suscripción enviada:', subscriptionResult);
  } catch (error) {
    console.log('❌ Error en confirmación de suscripción:', error);
  }

  // 5. Probar recordatorio de entrega
  console.log('\n5️⃣ Probando recordatorio de entrega...');
  try {
    const deliveryResult = await smartNotificationService.sendDeliveryReminder(
      'test@ewa.com',
      '+1234567890',
      {
        date: '2024-01-15',
        estimatedTime: '10:00 AM',
        address: '123 Main St, City, State 12345',
      }
    );
    console.log('✅ Recordatorio de entrega enviado:', deliveryResult);
  } catch (error) {
    console.log('❌ Error en recordatorio de entrega:', error);
  }

  // 6. Probar envío directo de email
  console.log('\n6️⃣ Probando envío directo de email...');
  try {
    const emailResult = await smartNotificationService.sendEmail({
      to: 'test@ewa.com',
      subject: 'Prueba de Sistema - EWA',
      html: '<h1>Prueba del Sistema</h1><p>Este es un email de prueba del sistema de notificaciones.</p>',
      text: 'Prueba del Sistema - Este es un email de prueba del sistema de notificaciones.',
    });
    console.log('✅ Email directo enviado:', emailResult);
  } catch (error) {
    console.log('❌ Error en email directo:', error);
  }

  // 7. Probar envío directo de SMS
  console.log('\n7️⃣ Probando envío directo de SMS...');
  try {
    const smsResult = await smartNotificationService.sendSms({
      to: '+1234567890',
      body: 'EWA: Prueba del sistema de notificaciones SMS.',
    });
    console.log('✅ SMS directo enviado:', smsResult);
  } catch (error) {
    console.log('❌ Error en SMS directo:', error);
  }

  console.log('\n🎉 Pruebas completadas!');
}

// Ejecutar si se llama directamente
if (require.main === module) {
  testNotifications().catch(console.error);
}

export { testNotifications };
