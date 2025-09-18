import { EmailProvider, SmsProvider } from '../notifications';
import { MockEmailProvider, MockSmsProvider } from '../notifications';
import { TwilioSmsProvider } from './twilio-provider';

// Importación condicional de SendGrid solo en el servidor
let SendGridEmailProvider: any = null;
if (typeof window === 'undefined') {
  // Solo importar en el servidor (Node.js)
  try {
    const { SendGridEmailProvider: SGProvider } = require('./sendgrid-provider');
    SendGridEmailProvider = SGProvider;
  } catch (error) {
    console.warn('SendGrid not available in server environment');
  }
}

export class ProviderFactory {
  static createEmailProvider(): EmailProvider {
    const apiKey = process.env.SENDGRID_API_KEY;
    const fromEmail = process.env.SENDGRID_FROM_EMAIL;
    
    // Verificar que las credenciales sean válidas (no placeholders)
    const hasValidCredentials = apiKey && 
                               fromEmail && 
                               apiKey.startsWith('SG.') && 
                               fromEmail.includes('@');
    
    // Solo usar SendGrid si está disponible y en producción
    if (SendGridEmailProvider && hasValidCredentials && process.env.NODE_ENV === 'production') {
      try {
        return new SendGridEmailProvider(apiKey);
      } catch (error) {
        console.warn('Failed to create SendGrid provider, falling back to mock:', error);
        return new MockEmailProvider();
      }
    }
    
    // En desarrollo, cliente, o si no hay API key, usar mock
    return new MockEmailProvider();
  }

  static createSmsProvider(): SmsProvider {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const fromPhone = process.env.TWILIO_FROM_PHONE;
    
    // Verificar que las credenciales sean válidas (no placeholders)
    const hasValidCredentials = accountSid && 
                               authToken && 
                               fromPhone && 
                               accountSid.startsWith('AC') && 
                               authToken.length > 20 && 
                               fromPhone.startsWith('+');
    
    if (hasValidCredentials && process.env.NODE_ENV === 'production') {
      try {
        return new TwilioSmsProvider(accountSid, authToken, fromPhone);
      } catch (error) {
        console.warn('Failed to create Twilio provider, falling back to mock:', error);
        return new MockSmsProvider();
      }
    }
    
    // En desarrollo o si no hay credenciales válidas, usar mock
    return new MockSmsProvider();
  }

  static isProduction(): boolean {
    return process.env.NODE_ENV === 'production';
  }

  static hasSendGridConfig(): boolean {
    return !!(SendGridEmailProvider && process.env.SENDGRID_API_KEY && process.env.SENDGRID_FROM_EMAIL);
  }

  static hasTwilioConfig(): boolean {
    return !!(process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_FROM_PHONE);
  }
}
