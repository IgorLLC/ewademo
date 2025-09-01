import twilio from 'twilio';
import { SmsProvider, SmsMessage } from '../notifications';

export class TwilioSmsProvider implements SmsProvider {
  private client: twilio.Twilio;
  private fromPhone: string;

  constructor(accountSid: string, authToken: string, fromPhone: string) {
    this.client = twilio(accountSid, authToken);
    this.fromPhone = fromPhone;
  }

  async sendSms(message: SmsMessage): Promise<{ sid: string }> {
    try {
      const response = await this.client.messages.create({
        body: message.body,
        from: this.fromPhone,
        to: message.to,
      });

      return { sid: response.sid };
    } catch (error) {
      console.error('[TwilioSmsProvider] Error sending SMS:', error);
      throw new Error(`Failed to send SMS: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Método adicional para verificar números de teléfono (opcional)
  async verifyPhoneNumber(phoneNumber: string): Promise<boolean> {
    try {
      // Nota: Esta funcionalidad requiere una cuenta de pago de Twilio
      // Para desarrollo, siempre retornamos true
      console.log(`[TwilioSmsProvider] Verificando número: ${phoneNumber}`);
      return true;
    } catch (error) {
      console.error('[TwilioSmsProvider] Error verifying phone number:', error);
      return false;
    }
  }
}
