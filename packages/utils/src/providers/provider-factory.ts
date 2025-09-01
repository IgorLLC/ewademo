import { EmailProvider, SmsProvider } from '../notifications';
import { MockEmailProvider, MockSmsProvider } from '../notifications';
import { SendGridEmailProvider } from './sendgrid-provider';
import { TwilioSmsProvider } from './twilio-provider';

export class ProviderFactory {
  static createEmailProvider(): EmailProvider {
    const apiKey = process.env.SENDGRID_API_KEY;
    const fromEmail = process.env.SENDGRID_FROM_EMAIL;
    
    if (apiKey && fromEmail && process.env.NODE_ENV === 'production') {
      return new SendGridEmailProvider(apiKey);
    }
    
    // En desarrollo o si no hay API key, usar mock
    return new MockEmailProvider();
  }

  static createSmsProvider(): SmsProvider {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const fromPhone = process.env.TWILIO_FROM_PHONE;
    
    if (accountSid && authToken && fromPhone && process.env.NODE_ENV === 'production') {
      return new TwilioSmsProvider(accountSid, authToken, fromPhone);
    }
    
    // En desarrollo o si no hay credenciales, usar mock
    return new MockSmsProvider();
  }

  static isProduction(): boolean {
    return process.env.NODE_ENV === 'production';
  }

  static hasSendGridConfig(): boolean {
    return !!(process.env.SENDGRID_API_KEY && process.env.SENDGRID_FROM_EMAIL);
  }

  static hasTwilioConfig(): boolean {
    return !!(process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_FROM_PHONE);
  }
}
