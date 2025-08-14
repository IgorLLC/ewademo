import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import AdminLayout from '../../components/AdminLayout';
import { getSubscriptions, getPlans } from '@ewa/api-client';
import { Subscription, Plan } from '@ewa/types';

const AdminSubscriptions = () => {
  const router = useRouter();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    // Cargar datos
    fetchData();

    // Mensajes de éxito por query param
    if (router.query.success === 'created') {
      setSuccessMessage('Suscripción creada exitosamente');
      router.replace('/admin/subscriptions', undefined, { shallow: true });
      setTimeout(() => setSuccessMessage(null), 5000);
    } else if (router.query.success === 'plan_created') {
      setSuccessMessage('Plan creado exitosamente');
      router.replace('/admin/subscriptions', undefined, { shallow: true });
      setTimeout(() => setSuccessMessage(null), 5000);
    } else if (router.query.success === 'product_created') {
      setSuccessMessage('Producto creado exitosamente');
      router.replace('/admin/subscriptions', undefined, { shallow: true });
      setTimeout(() => setSuccessMessage(null), 5000);
    }
  }, [router.query.success]);

  const fetchData = async () => {
    try {
      // Cargar datos de la API
      const [subscriptionsData, plansData] = await Promise.all([
        getSubscriptions(),
        getPlans()
      ]);
      
      setSubscriptions(subscriptionsData);
      setPlans(plansData);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load subscriptions. Please try again later.');
      
      // Usar datos mock si la API falla
      setPlans([
        {
          id: "plan1",
          name: "EWA Box Water - Small (Weekly)",
          productId: "p1",
          frequency: "weekly",
          minQty: 6
        },
        {
          id: "plan2",
          name: "EWA Box Water - Medium (Biweekly)",
          productId: "p2",
          frequency: "biweekly",
          minQty: 12
        },
        {
          id: "plan3",
          name: "EWA Box Water - Large (Monthly)",
          productId: "p3",
          frequency: "monthly",
          minQty: 24
        }
      ]);
      
      setSubscriptions([
        {
          id: "sub1",
          planId: "plan1",
          userId: "u1",
          status: "active",
          nextDeliveryDate: "2025-05-28",
          frequency: "weekly",
          quantity: 6,
          address: "Calle Loíza 123, San Juan, PR 00911",
          createdAt: "2025-01-20"
        },
        {
          id: "sub2",
          planId: "plan2",
          userId: "u3",
          status: "paused",
          nextDeliveryDate: "2025-06-01",
          frequency: "biweekly",
          quantity: 12,
          address: "Ave. Universidad 45, Río Piedras, PR 00925",
          createdAt: "2025-02-25"
        },
        {
          id: "sub3",
          planId: "plan3",
          userId: "u1",
          status: "active",
          nextDeliveryDate: "2025-06-15",
          frequency: "monthly",
          quantity: 24,
          address: "Calle Loíza 123, San Juan, PR 00911",
          createdAt: "2025-03-15"
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Filtrar suscripciones según búsqueda (por plan o ID) y estado
  const filteredSubscriptions = subscriptions.filter(subscription => {
    const plan = plans.find(p => p.id === subscription.planId);
    
    const matchesSearch = 
      (plan?.name?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
      subscription.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || subscription.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Format date to readable string
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const getPlanName = (planId: string) => {
    const plan = plans.find(p => p.id === planId);
    return plan?.name || 'Plan desconocido';
  };

  // No mostramos datos de clientes en esta vista

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'paused':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return 'Activa';
      case 'paused':
        return 'Pausada';
      case 'cancelled':
        return 'Cancelada';
      default:
        return status;
    }
  };

  // Sin acciones de sesión en esta página; el layout maneja autenticación

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-ewa-blue"></div>
      </div>
    );
  }

  return (
    <AdminLayout title="Crear Suscripciones" description="Crea nuevas suscripciones. La tabla solo muestra una descripción por suscripción (sin datos de clientes)." currentPage="subscriptions">
      <div className="py-2">
              {/* Success Message */}
              {successMessage && (
                <div className="mb-4 bg-green-50 border-l-4 border-green-400 p-4">
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

              {/* Error Message */}
              {error && (
                <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-700">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Enfoque: Crear suscripciones */}
              <div className="bg-white shadow rounded-lg p-6 mb-6">
                <div className="md:flex md:items-center md:justify-between">
                  <div className="md:flex-1">
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </div>
                      <input
                        type="text"
                        placeholder="Busca plan o ID de suscripción..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="focus:ring-ewa-blue focus:border-ewa-blue block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>
                  <div className="mt-4 md:mt-0 md:ml-4 flex items-center space-x-4">
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-ewa-blue focus:border-ewa-blue sm:text-sm rounded-md"
                    >
                      <option value="all">Todas</option>
                      <option value="active">Activas</option>
                      <option value="paused">Pausadas</option>
                      <option value="cancelled">Canceladas</option>
                    </select>
                    <button
                      onClick={() => router.push('/admin/subscriptions/new')}
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-ewa-blue hover:bg-ewa-dark-blue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ewa-blue"
                    >
                      <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Crear nueva suscripción
                    </button>
                  </div>
                </div>
              </div>

              {/* Subscriptions Table: vista para validar lo creado (sin datos de clientes) */}
              <div className="bg-white shadow overflow-hidden rounded-lg">
                {loading ? (
                  <div className="p-6 flex justify-center">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-ewa-blue"></div>
                  </div>
                ) : filteredSubscriptions.length === 0 ? (
                  <div className="p-6 text-center text-gray-500">
                    Aún no hay suscripciones creadas. Usa el botón “Crear nueva suscripción” para comenzar.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Descripción
                          </th>
                          <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Acciones
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredSubscriptions.map((subscription) => (
                          <tr key={subscription.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                              <div className="flex flex-col">
                                <span className="font-medium text-gray-900">{getPlanName(subscription.planId)}</span>
                                <span className="text-gray-500">ID: {subscription.id}</span>
                                <span className="text-gray-500">Frecuencia: {subscription.frequency === 'weekly' ? 'Semanal' : subscription.frequency === 'biweekly' ? 'Bisemanal' : 'Mensual'}</span>
                                <span className="text-gray-500">Cantidad: {subscription.quantity}</span>
                                <span className="text-gray-500">Próxima entrega: {formatDate(subscription.nextDeliveryDate || null)}</span>
                                <span className="mt-1">
                                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(subscription.status)}`}>
                                    {getStatusLabel(subscription.status)}
                                  </span>
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <div className="flex justify-end space-x-2">
                                <button className="text-ewa-blue hover:text-ewa-dark-blue">
                                  Ver
                                </button>
                                <button className="text-ewa-blue hover:text-ewa-dark-blue">
                                  Editar
                                </button>
                                <button className="text-red-600 hover:text-red-900">
                                  Cancelar
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Pagination */}
              <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 mt-4 rounded-lg shadow">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Anterior
                  </button>
                  <button
                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Siguiente
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Mostrando <span className="font-medium">1</span> a <span className="font-medium">{filteredSubscriptions.length}</span> de{' '}
                      <span className="font-medium">{filteredSubscriptions.length}</span> resultados
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                      <button
                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                      >
                        <span className="sr-only">Anterior</span>
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <button
                        aria-current="page"
                        className="z-10 bg-ewa-light-blue border-ewa-blue text-ewa-blue relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                      >
                        1
                      </button>
                      <button
                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                      >
                        <span className="sr-only">Siguiente</span>
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
      </div>
    </AdminLayout>
  );
};

export default AdminSubscriptions;
