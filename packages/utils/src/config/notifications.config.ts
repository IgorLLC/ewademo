export const NOTIFICATIONS_CONFIG = {
  // Configuración de SendGrid
  sendgrid: {
    apiKey: process.env.SENDGRID_API_KEY,
    fromEmail: process.env.SENDGRID_FROM_EMAIL || 'noreply@ewa.com',
    templates: {
      welcome: 'd-xxxxxxxxxxxxxxxxxxxxxxxx',
      subscription: 'd-xxxxxxxxxxxxxxxxxxxxxxxx',
      delivery: 'd-xxxxxxxxxxxxxxxxxxxxxxxx',
    },
  },

  // Configuración de Twilio
  twilio: {
    accountSid: process.env.TWILIO_ACCOUNT_SID,
    authToken: process.env.TWILIO_AUTH_TOKEN,
    fromPhone: process.env.TWILIO_FROM_PHONE,
  },

  // Configuración general
  general: {
    companyName: 'EWA Box Water',
    supportEmail: 'support@ewa.com',
    supportPhone: '+1-800-EWA-WATER',
    website: 'https://ewa.com',
  },

  // Configuración de templates de email
  emailTemplates: {
    welcome: {
      subject: '¡Bienvenido a EWA Box Water!',
      subjectPrefix: '[EWA] ',
    },
    subscription: {
      subject: 'Confirmación de Suscripción',
      subjectPrefix: '[EWA] ',
    },
    delivery: {
      subject: 'Recordatorio de Entrega',
      subjectPrefix: '[EWA] ',
    },
    passwordReset: {
      subject: 'Restablecimiento de Contraseña',
      subjectPrefix: '[EWA] ',
    },
  },

  // Configuración de templates de SMS
  smsTemplates: {
    welcome: '¡Bienvenido a EWA Box Water! Tu cuenta ha sido creada exitosamente.',
    subscription: 'Tu suscripción a EWA Box Water ha sido activada. Próxima entrega: {nextDelivery}',
    delivery: 'EWA: Tu entrega está programada para mañana a las {time}. Dirección: {address}',
    passwordReset: 'EWA: Tu código de restablecimiento es: {code}. Válido por 10 minutos.',
  },

  // Configuración de rate limiting
  rateLimiting: {
    maxEmailsPerHour: 100,
    maxSmsPerHour: 50,
    maxEmailsPerDay: 1000,
    maxSmsPerDay: 500,
  },
};

// Función para validar la configuración
export function validateNotificationsConfig(): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Validar SendGrid
  if (!NOTIFICATIONS_CONFIG.sendgrid.apiKey) {
    errors.push('SENDGRID_API_KEY no está configurado');
  }
  if (!NOTIFICATIONS_CONFIG.sendgrid.fromEmail) {
    errors.push('SENDGRID_FROM_EMAIL no está configurado');
  }

  // Validar Twilio
  if (!NOTIFICATIONS_CONFIG.twilio.accountSid) {
    errors.push('TWILIO_ACCOUNT_SID no está configurado');
  }
  if (!NOTIFICATIONS_CONFIG.twilio.authToken) {
    errors.push('TWILIO_AUTH_TOKEN no está configurado');
  }
  if (!NOTIFICATIONS_CONFIG.twilio.fromPhone) {
    errors.push('TWILIO_FROM_PHONE no está configurado');
  }

  // Warnings para desarrollo
  if (process.env.NODE_ENV === 'development') {
    if (!NOTIFICATIONS_CONFIG.sendgrid.apiKey) {
      warnings.push('SendGrid no configurado - usando proveedor mock');
    }
    if (!NOTIFICATIONS_CONFIG.twilio.accountSid) {
      warnings.push('Twilio no configurado - usando proveedor mock');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

// Función para obtener la configuración según el entorno
export function getNotificationsConfig(environment: 'development' | 'production' = 'development') {
  if (environment === 'production') {
    return {
      ...NOTIFICATIONS_CONFIG,
      useMocks: false,
    };
  }

  return {
    ...NOTIFICATIONS_CONFIG,
    useMocks: true,
  };
}
