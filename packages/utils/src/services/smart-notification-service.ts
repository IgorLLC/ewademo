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
      templateId: 'd-b3f67b9b9c324ab2a18a1b9b01881e05',
      dynamicTemplateData: {
        name: name || 'Usuario'
      }
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

  // Método para enviar verificación de email
  async sendEmailVerification(email: string, name: string, verificationToken: string) {
    const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://ewaboxwater.com'}/verify-email?token=${verificationToken}`;
    
    return this.sendEmail({
      to: email,
      subject: 'Verifica tu email - EWA Box Water',
      templateId: 'd-131acd21940649d88f9c6c00ae60186f',
      dynamicTemplateData: {
        name: name,
        verificationUrl: verificationUrl
      }
    });
  }

  // Método para enviar reset de contraseña
  async sendPasswordReset(email: string, name: string, resetToken: string) {
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://ewaboxwater.com'}/reset-password?token=${resetToken}`;
    
    return this.sendEmail({
      to: email,
      subject: 'Restablece tu contraseña - EWA Box Water',
      templateId: 'd-be181dd18e7d4f10a38246df5267321e',
      dynamicTemplateData: {
        name: name,
        resetUrl: resetUrl
      }
    });
  }

  // Método para enviar confirmación de suscripción
  async sendSubscriptionConfirmation(email: string, subscriptionDetails: any) {
    return this.sendEmail({
      to: email,
      subject: 'Confirmación de Suscripción - EWA Box Water',
      templateId: 'd-35744003e329438ba316c354ae59c798',
      dynamicTemplateData: {
        planName: subscriptionDetails.planName,
        frequency: subscriptionDetails.frequency,
        price: subscriptionDetails.price,
        nextDelivery: subscriptionDetails.nextDelivery
      }
    });
  }

  // Método para enviar recordatorio de entrega
  async sendDeliveryReminder(email: string, phone: string, deliveryDetails: any) {
    const emailPromise = this.sendEmail({
      to: email,
      subject: 'Recordatorio de Entrega - EWA Box Water',
      templateId: 'd-d0387f9b50934966baa0f92e67457800',
      dynamicTemplateData: {
        date: deliveryDetails.date,
        estimatedTime: deliveryDetails.estimatedTime,
        address: deliveryDetails.address
      }
    });

    const smsPromise = this.sendSms({
      to: phone,
      body: `EWA: Tu entrega está programada para mañana a las ${deliveryDetails.estimatedTime}. Dirección: ${deliveryDetails.address}`,
    });

    return Promise.all([emailPromise, smsPromise]);
  }

  // Método para enviar recibo de pago
  async sendPaymentReceipt(email: string, paymentDetails: any) {
    return this.sendEmail({
      to: email,
      subject: 'Recibo de Pago - EWA Box Water',
      templateId: 'd-cce56a9296184160a716c7772320f85f',
      dynamicTemplateData: {
        receiptId: paymentDetails.receiptId,
        date: paymentDetails.date,
        amount: paymentDetails.amount,
        paymentMethod: paymentDetails.paymentMethod,
        description: paymentDetails.description
      }
    });
  }

  // Método para enviar notificación de pago fallido
  async sendPaymentFailed(email: string, paymentDetails: any) {
    return this.sendEmail({
      to: email,
      subject: 'Pago Fallido - EWA Box Water',
      templateId: 'd-321b70181eda475a96d27d4805b5e213',
      dynamicTemplateData: {
        date: paymentDetails.date,
        amount: paymentDetails.amount,
        paymentMethod: paymentDetails.paymentMethod,
        reason: paymentDetails.reason
      }
    });
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
