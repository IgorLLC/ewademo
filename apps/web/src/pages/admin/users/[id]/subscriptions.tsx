import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { getUserById, getSubscriptions } from '@ewa/api-client';
import { User, Subscription } from '@ewa/types';
import AdminLayout from '../../../../components/AdminLayout';

// Mock transaction type
type Transaction = {
  id: string;
  subscriptionId: string;
  amount: number;
  status: 'completed' | 'pending' | 'failed';
  date: string;
  description: string;
  paymentMethod: string;
  transactionId: string;
  invoice?: string;
  refundAmount?: number;
  notes?: string;
};

// Mock payment method type
type PaymentMethod = {
  id: string;
  type: 'credit_card' | 'debit_card' | 'bank_account';
  last4: string;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
  isDefault: boolean;
  bankName?: string;
};

// Mock transaction data
const mockTransactions: Transaction[] = [
  {
    id: 't1',
    subscriptionId: 's1',
    amount: 45.99,
    status: 'completed',
    date: '2024-01-15T10:30:00Z',
    description: 'Suscripción mensual - Agua Premium 5 galones',
    paymentMethod: 'Visa ****4532',
    transactionId: 'txn_1234567890abcdef',
    invoice: 'INV-2024-001',
    notes: 'Pago automático procesado exitosamente'
  },
  {
    id: 't2',
    subscriptionId: 's1',
    amount: 45.99,
    status: 'completed',
    date: '2024-02-15T10:30:00Z',
    description: 'Suscripción mensual - Agua Premium 5 galones',
    paymentMethod: 'Visa ****4532',
    transactionId: 'txn_abcdef1234567890',
    invoice: 'INV-2024-002',
    notes: 'Pago automático procesado exitosamente'
  },
  {
    id: 't3',
    subscriptionId: 's2',
    amount: 89.99,
    status: 'pending',
    date: '2024-03-15T10:30:00Z',
    description: 'Suscripción semanal - Agua Premium 3 galones',
    paymentMethod: 'Mastercard ****8765',
    transactionId: 'txn_pending123456',
    invoice: 'INV-2024-003',
    notes: 'Pago pendiente de autorización bancaria'
  },
  {
    id: 't4',
    subscriptionId: 's1',
    amount: 45.99,
    status: 'failed',
    date: '2024-03-10T14:22:00Z',
    description: 'Suscripción mensual - Agua Premium 5 galones',
    paymentMethod: 'Visa ****4532',
    transactionId: 'txn_failed789012',
    invoice: 'INV-2024-004',
    notes: 'Pago rechazado - fondos insuficientes'
  },
  {
    id: 't5',
    subscriptionId: 's1',
    amount: 22.50,
    status: 'completed',
    date: '2024-02-28T16:45:00Z',
    description: 'Reembolso parcial - Entrega cancelada',
    paymentMethod: 'Visa ****4532',
    transactionId: 'txn_refund345678',
    invoice: 'REF-2024-001',
    refundAmount: 22.50,
    notes: 'Reembolso por entrega cancelada por cliente'
  },
  {
    id: 't6',
    subscriptionId: 's2',
    amount: 29.99,
    status: 'completed',
    date: '2024-01-05T09:15:00Z',
    description: 'Cargo único - Entrega express',
    paymentMethod: 'Mastercard ****8765',
    transactionId: 'txn_express901234',
    invoice: 'INV-2024-005',
    notes: 'Cargo adicional por entrega express solicitada'
  }
];

// Mock subscription data
const mockSubscriptions: Subscription[] = [
  {
    id: 's1',
    planId: 'plan1',
    userId: 'u1',
    status: 'active',
    productId: 'prod1',
    quantity: 2,
    address: '123 Calle Principal, Urb. Los Jardines, San Juan, PR',
    nextDeliveryDate: '2024-03-20',
    frequency: 'monthly',
    createdAt: '2024-01-15T10:00:00Z'
  },
  {
    id: 's2',
    planId: 'plan2',
    userId: 'u1',
    status: 'paused',
    productId: 'prod2',
    quantity: 1,
    address: '123 Calle Principal, Urb. Los Jardines, San Juan, PR',
    nextDeliveryDate: '2024-04-01',
    frequency: 'weekly',
    createdAt: '2024-02-01T14:30:00Z'
  }
];

// Mock payment methods data
const mockPaymentMethods: PaymentMethod[] = [
  {
    id: 'pm1',
    type: 'credit_card',
    last4: '4532',
    brand: 'Visa',
    expiryMonth: 12,
    expiryYear: 2026,
    isDefault: true
  },
  {
    id: 'pm2',
    type: 'credit_card',
    last4: '8765',
    brand: 'Mastercard',
    expiryMonth: 8,
    expiryYear: 2025,
    isDefault: false
  },
  {
    id: 'pm3',
    type: 'bank_account',
    last4: '1234',
    bankName: 'Banco Popular',
    isDefault: false
  }
];

const UserSubscriptions = () => {
  const router = useRouter();
  const { id } = router.query;
  const [user, setUser] = useState<User | null>(null);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'subscriptions' | 'transactions' | 'payment_methods'>('subscriptions');

  useEffect(() => {
    if (id && typeof id === 'string') {
      loadUserData(id);
    }
    
    // Check for success message from URL params
    if (router.query.success === 'created') {
      setSuccessMessage('Suscripción creada exitosamente');
      // Remove the success param from URL
      router.replace(`/admin/users/${id}/subscriptions`, undefined, { shallow: true });
    }
  }, [id, router]);

  const loadUserData = async (userId: string) => {
    try {
      setIsLoading(true);
      const [userData, subscriptionData] = await Promise.all([
        getUserById(userId),
        getSubscriptions(userId)
      ]);
      
      setUser(userData);
      setSubscriptions(subscriptionData);
      setTransactions(mockTransactions.filter(t => 
        subscriptionData.some(s => s.id === t.subscriptionId)
      ));
      setPaymentMethods(mockPaymentMethods);
    } catch (err: any) {
      console.error('Error loading user data:', err);
      setError('Error al cargar la información del cliente.');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = "px-2 inline-flex text-xs leading-5 font-semibold rounded-full";
    switch (status) {
      case 'active':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'paused':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'completed':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'pending':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'failed':
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleToggleSubscriptionStatus = async (subscriptionId: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'active' ? 'paused' : 'active';
      
      // Aquí normalmente harías una llamada a la API
      // await updateSubscriptionStatus(subscriptionId, newStatus);
      
      // Por ahora, actualizamos el estado local (mock)
      setSubscriptions(prev => prev.map(sub => 
        sub.id === subscriptionId 
          ? { ...sub, status: newStatus }
          : sub
      ));

      setSuccessMessage(
        newStatus === 'paused' 
          ? 'Suscripción pausada exitosamente' 
          : 'Suscripción reanudada exitosamente'
      );
      
      // Limpiar el mensaje después de 3 segundos
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      console.error('Error updating subscription status:', error);
      setError('Error al actualizar el estado de la suscripción');
    }
  };

  const handleSetDefaultPaymentMethod = async (paymentMethodId: string) => {
    try {
      // Aquí normalmente harías una llamada a la API
      // await setDefaultPaymentMethod(paymentMethodId);
      
      // Por ahora, actualizamos el estado local (mock)
      setPaymentMethods(prev => prev.map(pm => 
        pm.id === paymentMethodId 
          ? { ...pm, isDefault: true }
          : { ...pm, isDefault: false }
      ));

      setSuccessMessage('Método de pago predeterminado actualizado exitosamente');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      console.error('Error setting default payment method:', error);
      setError('Error al establecer el método de pago predeterminado');
    }
  };

  const handleDeletePaymentMethod = async (paymentMethodId: string) => {
    try {
      // Verificar si es el método predeterminado
      const paymentMethod = paymentMethods.find(pm => pm.id === paymentMethodId);
      if (paymentMethod?.isDefault) {
        setError('No puedes eliminar el método de pago predeterminado');
        setTimeout(() => setError(null), 3000);
        return;
      }

      // Aquí normalmente harías una llamada a la API
      // await deletePaymentMethod(paymentMethodId);
      
      // Por ahora, actualizamos el estado local (mock)
      setPaymentMethods(prev => prev.filter(pm => pm.id !== paymentMethodId));

      setSuccessMessage('Método de pago eliminado exitosamente');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      console.error('Error deleting payment method:', error);
      setError('Error al eliminar el método de pago');
    }
  };

  const formatPaymentMethod = (paymentMethod: PaymentMethod) => {
    if (paymentMethod.type === 'bank_account') {
      return `${paymentMethod.bankName} ****${paymentMethod.last4}`;
    } else {
      return `${paymentMethod.brand} ****${paymentMethod.last4}`;
    }
  };

  const getPaymentMethodIcon = (type: string) => {
    switch (type) {
      case 'credit_card':
        return (
          <svg className="w-6 h-6 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
        );
      case 'debit_card':
        return (
          <svg className="w-6 h-6 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
        );
      case 'bank_account':
        return (
          <svg className="w-6 h-6 text-purple-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        );
      default:
        return null;
    }
  };

  // Export functions
  const exportToCSV = () => {
    const headers = [
      'ID Transacción',
      'Fecha',
      'Descripción',
      'Monto',
      'Estado',
      'Método de Pago',
      'ID Interno',
      'Factura',
      'Notas'
    ];

    const csvContent = [
      headers.join(','),
      ...transactions.map(transaction => [
        transaction.transactionId,
        formatDate(transaction.date),
        `"${transaction.description}"`,
        transaction.amount,
        transaction.status,
        `"${transaction.paymentMethod}"`,
        transaction.id,
        transaction.invoice || '',
        `"${transaction.notes || ''}"`
      ].join(','))
    ].join('\n');

    downloadFile(csvContent, `transacciones-${user?.name || 'usuario'}-${new Date().toISOString().split('T')[0]}.csv`, 'text/csv');
  };


  const downloadFile = (content: string, fileName: string, contentType: string) => {
    const blob = new Blob([content], { type: contentType });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);

    setSuccessMessage(`Archivo ${fileName} descargado exitosamente`);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  if (isLoading) {
    return (
      <AdminLayout 
        title="Suscripciones del Cliente" 
        description="Cargando información del cliente..." 
        currentPage="users"
      >
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-ewa-blue"></div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout 
        title="Error" 
        description="Error al cargar la información" 
        currentPage="users"
      >
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <p className="text-red-700">{error}</p>
          <button
            onClick={() => router.push('/admin/users')}
            className="mt-2 text-red-600 hover:text-red-800"
          >
            Volver a la lista de usuarios
          </button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout 
      title={`Suscripciones - ${user?.name}`} 
      description="Gestión de suscripciones y transacciones del cliente" 
      currentPage="users"
    >
      <div className="max-w-6xl mx-auto">
        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 bg-green-50 border-l-4 border-green-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm text-green-700">{successMessage}</p>
              </div>
              <div className="ml-auto pl-3">
                <button
                  onClick={() => setSuccessMessage(null)}
                  className="inline-flex text-green-400 hover:text-green-600"
                >
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <button
                onClick={() => router.push('/admin/users')}
                className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-2"
              >
                <svg className="mr-1 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Volver a usuarios
              </button>
              <h1 className="text-2xl font-bold text-gray-900">{user?.name}</h1>
              <p className="mt-2 text-gray-600">
                {user?.email} • {user?.phone} • Cliente desde {user?.createdAt ? formatDate(user.createdAt) : 'N/A'}
              </p>
            </div>
            <button
              onClick={() => router.push(`/admin/users/${id}/subscription/new`)}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-ewa-blue hover:bg-ewa-dark-blue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ewa-blue"
            >
              <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Nueva Suscripción
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-md flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Suscripciones Activas</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {subscriptions.filter(s => s.status === 'active').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-yellow-100 rounded-md flex items-center justify-center">
                  <svg className="w-5 h-5 text-yellow-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Suscripciones Pausadas</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {subscriptions.filter(s => s.status === 'paused').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-md flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Transacciones</p>
                <p className="text-2xl font-semibold text-gray-900">{transactions.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-md flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Ingresos Totales</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {formatCurrency(transactions.filter(t => t.status === 'completed').reduce((sum, t) => sum + t.amount, 0))}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white shadow rounded-lg">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('subscriptions')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'subscriptions'
                    ? 'border-ewa-blue text-ewa-blue'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Suscripciones ({subscriptions.length})
              </button>
              <button
                onClick={() => setActiveTab('transactions')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'transactions'
                    ? 'border-ewa-blue text-ewa-blue'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Historial de Transacciones ({transactions.length})
              </button>
              <button
                onClick={() => setActiveTab('payment_methods')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'payment_methods'
                    ? 'border-ewa-blue text-ewa-blue'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Métodos de Pago ({paymentMethods.length})
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'subscriptions' && (
              <div className="space-y-6">
                {subscriptions.length === 0 ? (
                  <div className="text-center py-12">
                    <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No hay suscripciones</h3>
                    <p className="mt-1 text-sm text-gray-500">Este cliente no tiene suscripciones activas.</p>
                  </div>
                ) : (
                  subscriptions.map((subscription) => (
                    <div key={subscription.id} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <h3 className="text-lg font-medium text-gray-900">
                              Suscripción #{subscription.id}
                            </h3>
                            <span className={getStatusBadge(subscription.status)}>
                              {subscription.status === 'active' ? 'Activa' : 'Pausada'}
                            </span>
                          </div>
                          <div className="mt-2 space-y-1">
                            <p className="text-sm text-gray-600">
                              <strong>Cantidad:</strong> {subscription.quantity} unidad(es)
                            </p>
                            <p className="text-sm text-gray-600">
                              <strong>Frecuencia:</strong> {subscription.frequency === 'monthly' ? 'Mensual' : subscription.frequency === 'weekly' ? 'Semanal' : 'Quincenal'}
                            </p>
                            <p className="text-sm text-gray-600">
                              <strong>Próxima entrega:</strong> {formatDate(subscription.nextDeliveryDate)}
                            </p>
                            <p className="text-sm text-gray-600">
                              <strong>Dirección:</strong> {subscription.address}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col space-y-2 ml-4">
                          <button 
                            onClick={() => router.push(`/admin/subscriptions/edit/${subscription.id}`)}
                            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ewa-blue"
                          >
                            <svg className="-ml-1 mr-1.5 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Editar
                          </button>
                          <button 
                            onClick={() => handleToggleSubscriptionStatus(subscription.id, subscription.status)}
                            className={`inline-flex items-center px-3 py-2 border shadow-sm text-sm leading-4 font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                              subscription.status === 'active' 
                                ? 'border-yellow-300 text-yellow-700 bg-yellow-50 hover:bg-yellow-100 focus:ring-yellow-500' 
                                : 'border-green-300 text-green-700 bg-green-50 hover:bg-green-100 focus:ring-green-500'
                            }`}
                          >
                            <svg className="-ml-1 mr-1.5 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              {subscription.status === 'active' ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M15 14h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              )}
                            </svg>
                            {subscription.status === 'active' ? 'Pausar' : 'Reanudar'}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === 'transactions' && (
              <div className="space-y-6">
                {/* Transaction Summary & Export Options */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">Resumen de Transacciones</h3>
                      <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Total Transacciones</p>
                          <p className="text-2xl font-semibold text-gray-900">{transactions.length}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Completadas</p>
                          <p className="text-2xl font-semibold text-green-600">{transactions.filter(t => t.status === 'completed').length}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Monto Total</p>
                          <p className="text-2xl font-semibold text-gray-900">
                            {formatCurrency(transactions.filter(t => t.status === 'completed').reduce((sum, t) => sum + t.amount, 0))}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div>
                      <button
                        onClick={exportToCSV}
                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-ewa-blue hover:bg-ewa-dark-blue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ewa-blue"
                      >
                        <svg className="-ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Exportar CSV
                      </button>
                    </div>
                  </div>
                </div>

                {/* Transactions Table */}
                {transactions.length === 0 ? (
                  <div className="text-center py-12">
                    <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No hay transacciones</h3>
                    <p className="mt-1 text-sm text-gray-500">Este cliente no tiene historial de transacciones.</p>
                  </div>
                ) : (
                  <div className="bg-white shadow rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Fecha / ID
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Descripción
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Método de Pago
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Estado
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Monto
                            </th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Acciones
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {transactions.map((transaction) => (
                            <tr key={transaction.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div>
                                  <div className="text-sm font-medium text-gray-900">
                                    {formatDate(transaction.date)}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    ID: {transaction.transactionId}
                                  </div>
                                  {transaction.invoice && (
                                    <div className="text-xs text-blue-600">
                                      {transaction.invoice}
                                    </div>
                                  )}
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <div>
                                  <div className="text-sm text-gray-900">{transaction.description}</div>
                                  {transaction.notes && (
                                    <div className="text-xs text-gray-500 mt-1 max-w-xs truncate">
                                      {transaction.notes}
                                    </div>
                                  )}
                                  {transaction.refundAmount && (
                                    <div className="text-xs text-orange-600 mt-1">
                                      Reembolso: {formatCurrency(transaction.refundAmount)}
                                    </div>
                                  )}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {transaction.paymentMethod}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(transaction.status).replace('px-2 inline-flex text-xs leading-5 font-semibold rounded-full ', '')}`}>
                                  {transaction.status === 'completed' ? 'Completada' : 
                                   transaction.status === 'pending' ? 'Pendiente' : 'Fallida'}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right">
                                <div className={`text-sm font-medium ${
                                  transaction.status === 'completed' ? 'text-gray-900' :
                                  transaction.status === 'pending' ? 'text-yellow-600' : 'text-red-600'
                                }`}>
                                  {formatCurrency(transaction.amount)}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                <button
                                  className="text-ewa-blue hover:text-ewa-dark-blue mr-3"
                                  title="Ver detalles"
                                >
                                  <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                  </svg>
                                </button>
                                {transaction.invoice && (
                                  <button
                                    className="text-green-600 hover:text-green-900"
                                    title="Descargar factura"
                                  >
                                    <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                  </button>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'payment_methods' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-900">Métodos de Pago</h3>
                  <button 
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-ewa-blue hover:bg-ewa-dark-blue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ewa-blue"
                  >
                    <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Agregar Método de Pago
                  </button>
                </div>
                
                {paymentMethods.length === 0 ? (
                  <div className="text-center py-12">
                    <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No hay métodos de pago</h3>
                    <p className="mt-1 text-sm text-gray-500">Este cliente no tiene métodos de pago registrados.</p>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {paymentMethods.map((paymentMethod) => (
                      <div key={paymentMethod.id} className="border border-gray-200 rounded-lg p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="flex-shrink-0">
                              {getPaymentMethodIcon(paymentMethod.type)}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center space-x-3">
                                <h4 className="text-lg font-medium text-gray-900">
                                  {formatPaymentMethod(paymentMethod)}
                                </h4>
                                {paymentMethod.isDefault && (
                                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                    Predeterminado
                                  </span>
                                )}
                              </div>
                              <div className="mt-1 space-y-1">
                                <p className="text-sm text-gray-600">
                                  <strong>Tipo:</strong> {
                                    paymentMethod.type === 'credit_card' ? 'Tarjeta de Crédito' :
                                    paymentMethod.type === 'debit_card' ? 'Tarjeta de Débito' :
                                    'Cuenta Bancaria'
                                  }
                                </p>
                                {paymentMethod.expiryMonth && paymentMethod.expiryYear && (
                                  <p className="text-sm text-gray-600">
                                    <strong>Expira:</strong> {paymentMethod.expiryMonth.toString().padStart(2, '0')}/{paymentMethod.expiryYear}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex flex-col space-y-2 ml-4">
                            {!paymentMethod.isDefault && (
                              <button
                                onClick={() => handleSetDefaultPaymentMethod(paymentMethod.id)}
                                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ewa-blue"
                              >
                                <svg className="-ml-1 mr-1.5 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                Hacer Predeterminado
                              </button>
                            )}
                            
                            <button
                              onClick={() => handleDeletePaymentMethod(paymentMethod.id)}
                              disabled={paymentMethod.isDefault}
                              className={`inline-flex items-center px-3 py-2 border shadow-sm text-sm leading-4 font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                                paymentMethod.isDefault 
                                  ? 'border-gray-200 text-gray-400 bg-gray-100 cursor-not-allowed' 
                                  : 'border-red-300 text-red-700 bg-red-50 hover:bg-red-100 focus:ring-red-500'
                              }`}
                            >
                              <svg className="-ml-1 mr-1.5 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                              Eliminar
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default UserSubscriptions;