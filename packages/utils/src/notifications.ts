export type EmailMessage = {
  to: string;
  subject?: string; // Opcional cuando se usa templateId
  html?: string;
  text?: string;
  templateId?: string;
  dynamicTemplateData?: Record<string, any>;
};

export type SmsMessage = {
  to: string;
  body: string;
};

export interface EmailProvider {
  sendEmail(message: EmailMessage): Promise<{ id: string }>; 
}

export interface SmsProvider {
  sendSms(message: SmsMessage): Promise<{ sid: string }>;
}

// Mock providers for local/dev usage
export class MockEmailProvider implements EmailProvider {
  async sendEmail(message: EmailMessage): Promise<{ id: string }> {
    const id = `email_${Date.now()}`;
    // eslint-disable-next-line no-console
    console.log('[MockEmailProvider] sendEmail', { id, message });
    return { id };
  }
}

export class MockSmsProvider implements SmsProvider {
  async sendSms(message: SmsMessage): Promise<{ sid: string }> {
    const sid = `sms_${Date.now()}`;
    // eslint-disable-next-line no-console
    console.log('[MockSmsProvider] sendSms', { sid, message });
    return { sid };
  }
}

// Simple NotificationService wrapper
export class NotificationService {
  private emailProvider: EmailProvider;
  private smsProvider: SmsProvider;

  constructor(params?: { emailProvider?: EmailProvider; smsProvider?: SmsProvider }) {
    this.emailProvider = params?.emailProvider ?? new MockEmailProvider();
    this.smsProvider = params?.smsProvider ?? new MockSmsProvider();
  }

  async sendEmail(message: EmailMessage) {
    return this.emailProvider.sendEmail(message);
  }

  async sendSms(message: SmsMessage) {
    return this.smsProvider.sendSms(message);
  }

  // Método para verificar el estado de los proveedores
  getProviderStatus() {
    return {
      emailProvider: this.emailProvider.constructor.name,
      smsProvider: this.smsProvider.constructor.name,
    };
  }
}

// Exportar el servicio con providers automáticos
export const notificationService = new NotificationService();



