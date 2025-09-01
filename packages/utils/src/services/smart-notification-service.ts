import { ProviderFactory } from '../providers/provider-factory';
import { NotificationService } from '../notifications';
import type { EmailMessage, SmsMessage } from '../notifications';

export class SmartNotificationService {
  private notificationService: NotificationService;

  constructor() {
    const emailProvider = ProviderFactory.createEmailProvider();
    const smsProvider = ProviderFactory.createSmsProvider();
    
    this.notificationService = new NotificationService({
      emailProvider,
      smsProvider,
    });
  }

  async sendEmail(message: EmailMessage) {
    return this.notificationService.sendEmail(message);
  }

  async sendSms(message: SmsMessage) {
    return this.notificationService.sendSms(message);
  }

  // Método para enviar notificación de bienvenida
  async sendWelcomeNotification(email: string, phone?: string, name?: string) {
    const emailPromise = this.sendEmail({
      to: email,
      subject: '¡Bienvenido a EWA Box Water!',
      html: `
        <h1>¡Bienvenido a EWA Box Water!</h1>
        <p>Hola ${name || 'Usuario'},</p>
        <p>Gracias por registrarte en nuestra plataforma de entrega de agua.</p>
        <p>Tu cuenta ha sido creada exitosamente.</p>
        <br>
        <p>Saludos,<br>El equipo de EWA</p>
      `,
      text: `¡Bienvenido a EWA Box Water! Hola ${name || 'Usuario'}, gracias por registrarte. Tu cuenta ha sido creada exitosamente.`,
    });

    const promises: Promise<any>[] = [emailPromise];

    if (phone) {
      const smsPromise = this.sendSms({
        to: phone,
        body: `¡Bienvenido a EWA Box Water! Tu cuenta ha sido creada exitosamente.`,
      });
      promises.push(smsPromise);
    }

    return Promise.all(promises);
  }

  // Método para enviar confirmación de suscripción
  async sendSubscriptionConfirmation(email: string, subscriptionDetails: any) {
    return this.sendEmail({
      to: email,
      subject: 'Confirmación de Suscripción - EWA Box Water',
      html: `
        <h1>Confirmación de Suscripción</h1>
        <p>Tu suscripción ha sido activada exitosamente.</p>
        <h2>Detalles de la Suscripción:</h2>
        <ul>
          <li><strong>Plan:</strong> ${subscriptionDetails.planName}</li>
          <li><strong>Frecuencia:</strong> ${subscriptionDetails.frequency}</li>
          <li><strong>Precio:</strong> $${subscriptionDetails.price}</li>
          <li><strong>Próxima entrega:</strong> ${subscriptionDetails.nextDelivery}</li>
        </ul>
        <br>
        <p>Gracias por confiar en EWA Box Water.</p>
        <p>Saludos,<br>El equipo de EWA</p>
      `,
      text: `Confirmación de Suscripción - Tu suscripción ha sido activada. Plan: ${subscriptionDetails.planName}, Frecuencia: ${subscriptionDetails.frequency}, Precio: $${subscriptionDetails.price}. Próxima entrega: ${subscriptionDetails.nextDelivery}`,
    });
  }

  // Método para enviar recordatorio de entrega
  async sendDeliveryReminder(email: string, phone: string, deliveryDetails: any) {
    const emailPromise = this.sendEmail({
      to: email,
      subject: 'Recordatorio de Entrega - EWA Box Water',
      html: `
        <h1>Recordatorio de Entrega</h1>
        <p>Tu entrega está programada para mañana.</p>
        <h2>Detalles de la Entrega:</h2>
        <ul>
          <li><strong>Fecha:</strong> ${deliveryDetails.date}</li>
          <li><strong>Hora estimada:</strong> ${deliveryDetails.estimatedTime}</li>
          <li><strong>Dirección:</strong> ${deliveryDetails.address}</li>
        </ul>
        <br>
        <p>Saludos,<br>El equipo de EWA</p>
      `,
      text: `Recordatorio de Entrega - Tu entrega está programada para mañana. Fecha: ${deliveryDetails.date}, Hora estimada: ${deliveryDetails.estimatedTime}, Dirección: ${deliveryDetails.address}`,
    });

    const smsPromise = this.sendSms({
      to: phone,
      body: `EWA: Tu entrega está programada para mañana a las ${deliveryDetails.estimatedTime}. Dirección: ${deliveryDetails.address}`,
    });

    return Promise.all([emailPromise, smsPromise]);
  }

  // Método para verificar el estado de los proveedores
  getProviderStatus() {
    return {
      ...this.notificationService.getProviderStatus(),
      isProduction: ProviderFactory.isProduction(),
      hasSendGrid: ProviderFactory.hasSendGridConfig(),
      hasTwilio: ProviderFactory.hasTwilioConfig(),
    };
  }
}

// Instancia singleton
export const smartNotificationService = new SmartNotificationService();
