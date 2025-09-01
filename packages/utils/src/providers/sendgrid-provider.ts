import sgMail from '@sendgrid/mail';
import { EmailProvider, EmailMessage } from '../notifications';

export class SendGridEmailProvider implements EmailProvider {
  constructor(apiKey: string) {
    sgMail.setApiKey(apiKey);
  }

  async sendEmail(message: EmailMessage): Promise<{ id: string }> {
    try {
      const msg: any = {
        to: message.to,
        from: process.env.SENDGRID_FROM_EMAIL || 'noreply@ewa.com',
        subject: message.subject,
      };

      // Agregar contenido según lo que esté disponible
      if (message.text) {
        msg.text = message.text;
      }
      if (message.html) {
        msg.html = message.html;
      }
      if (message.templateId) {
        msg.templateId = message.templateId;
      }
      if (message.dynamicTemplateData) {
        msg.dynamicTemplateData = message.dynamicTemplateData;
      }

      const response = await sgMail.send(msg);
      
      // SendGrid devuelve un array, tomamos el primer mensaje
      const sentMessage = Array.isArray(response) ? response[0] : response;
      
      return { 
        id: sentMessage.headers['x-message-id'] || `sg_${Date.now()}` 
      };
    } catch (error) {
      console.error('[SendGridEmailProvider] Error sending email:', error);
      throw new Error(`Failed to send email: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}
