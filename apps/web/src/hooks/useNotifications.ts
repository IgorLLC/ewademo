import { useState } from 'react';
import { smartNotificationService } from '@ewa/utils';

export interface NotificationState {
  isLoading: boolean;
  error: string | null;
  success: boolean;
}

export interface UseNotificationsReturn {
  // Estado general
  state: NotificationState;
  
  // Métodos de email
  sendWelcomeEmail: (email: string, phone?: string, name?: string) => Promise<{ success: boolean; error?: string }>;
  sendEmailVerification: (email: string, name: string, token: string) => Promise<{ success: boolean; error?: string }>;
  sendPasswordReset: (email: string, name: string, token: string) => Promise<{ success: boolean; error?: string }>;
  sendSubscriptionConfirmation: (email: string, details: any) => Promise<{ success: boolean; error?: string }>;
  sendDeliveryReminder: (email: string, phone: string, details: any) => Promise<{ success: boolean; error?: string }>;
  sendPaymentReceipt: (email: string, details: any) => Promise<{ success: boolean; error?: string }>;
  sendPaymentFailed: (email: string, details: any) => Promise<{ success: boolean; error?: string }>;
  
  // Métodos de SMS
  sendSms: (phone: string, body: string) => Promise<{ success: boolean; error?: string }>;
  
  // Utilidades
  resetState: () => void;
  clearError: () => void;
}

export function useNotifications(): UseNotificationsReturn {
  const [state, setState] = useState<NotificationState>({
    isLoading: false,
    error: null,
    success: false,
  });

  const setLoading = (loading: boolean) => {
    setState(prev => ({ ...prev, isLoading: loading }));
  };

  const setError = (error: string) => {
    setState(prev => ({ ...prev, error, isLoading: false, success: false }));
  };

  const setSuccess = () => {
    setState(prev => ({ ...prev, success: true, isLoading: false, error: null }));
  };

  const resetState = () => {
    setState({ isLoading: false, error: null, success: false });
  };

  const clearError = () => {
    setState(prev => ({ ...prev, error: null }));
  };

  // Métodos de email
  const sendWelcomeEmail = async (email: string, phone?: string, name?: string) => {
    setLoading(true);
    try {
      await smartNotificationService.sendWelcomeNotification(email, phone, name);
      setSuccess();
      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const sendEmailVerification = async (email: string, name: string, token: string) => {
    setLoading(true);
    try {
      await smartNotificationService.sendEmailVerification(email, name, token);
      setSuccess();
      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const sendPasswordReset = async (email: string, name: string, token: string) => {
    setLoading(true);
    try {
      await smartNotificationService.sendPasswordReset(email, name, token);
      setSuccess();
      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const sendSubscriptionConfirmation = async (email: string, details: any) => {
    setLoading(true);
    try {
      await smartNotificationService.sendSubscriptionConfirmation(email, details);
      setSuccess();
      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const sendDeliveryReminder = async (email: string, phone: string, details: any) => {
    setLoading(true);
    try {
      await smartNotificationService.sendDeliveryReminder(email, phone, details);
      setSuccess();
      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const sendPaymentReceipt = async (email: string, details: any) => {
    setLoading(true);
    try {
      await smartNotificationService.sendPaymentReceipt(email, details);
      setSuccess();
      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const sendPaymentFailed = async (email: string, details: any) => {
    setLoading(true);
    try {
      await smartNotificationService.sendPaymentFailed(email, details);
      setSuccess();
      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Métodos de SMS
  const sendSms = async (phone: string, body: string) => {
    setLoading(true);
    try {
      await smartNotificationService.sendSms({ to: phone, body });
      setSuccess();
      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  return {
    state,
    sendWelcomeEmail,
    sendEmailVerification,
    sendPasswordReset,
    sendSubscriptionConfirmation,
    sendDeliveryReminder,
    sendPaymentReceipt,
    sendPaymentFailed,
    sendSms,
    resetState,
    clearError,
  };
}
