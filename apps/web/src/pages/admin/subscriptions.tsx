import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { getSubscriptions, getPlans, getProducts } from '@ewa/api-client';
import { Subscription, Plan, Product, User } from '@ewa/types';

const AdminSubscriptions = () => {
  const router = useRouter();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Verificar si el usuario está autenticado
    const userJson = localStorage.getItem('ewa_user');
    if (!userJson) {
      router.push('/auth');
      return;
    }

    try {
      const userData = JSON.parse(userJson);
      if (userData.role !== 'admin' && userData.role !== 'operator' && userData.role !== 'editor') {
        router.push('/auth');
        return;
      }
      setUser(userData);
      
      // Cargar datos
      fetchData();
    } catch (error) {
      console.error('Error parsing user data:', error);
      router.push('/auth');
    }
  }, [router]);

  const fetchData = async () => {
    try {
      // Cargar datos de la API
      const [subscriptionsData, plansData, productsData] = await Promise.all([
        getSubscriptions(),
        getPlans(),
        getProducts()
      ]);
      
      setSubscriptions(subscriptionsData);
      setPlans(plansData);
      setProducts(productsData);
      
      // Cargar usuarios mock para mostrar nombres
      setUsers([
        {
          id: 'u1',
          name: 'Juan Rivera',
          email: 'juan@cliente.com',
          role: 'customer'
        },
        {
          id: 'u2',
          name: 'María López',
          email: 'admin@ewa.com',
          role: 'admin'
        },
        {
          id: 'u3',
          name: 'Restaurante Sobao',
          email: 'sobao@business.com',
          role: 'customer'
        }
      ]);
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
          minQty: 6,
          price: 11.94
        },
        {
          id: "plan2",
          name: "EWA Box Water - Medium (Biweekly)",
          productId: "p2",
          frequency: "biweekly",
          minQty: 12,
          price: 29.88
        },
        {
          id: "plan3",
          name: "EWA Box Water - Large (Monthly)",
          productId: "p3",
          frequency: "monthly",
          minQty: 24,
          price: 71.76
        }
      ]);
      
      setProducts([
        {
          id: "p1",
          name: "Small Box Water",
          description: "330ml box water",
          price: 1.99
        },
        {
          id: "p2",
          name: "Medium Box Water",
          description: "500ml box water",
          price: 2.49
        },
        {
          id: "p3",
          name: "Large Box Water",
          description: "1L box water",
          price: 2.99
        }
      ]);
      
      setSubscriptions([
        {
          id: "sub1",
          planId: "plan1",
          userId: "u1",
          status: "active",
          startDate: "2025-01-20",
          nextDeliveryDate: "2025-05-28",
          frequency: "weekly",
          quantity: 6,
          address: "Calle Loíza 123, San Juan, PR 00911"
        },
        {
          id: "sub2",
          planId: "plan2",
          userId: "u3",
          status: "paused",
          startDate: "2025-02-25",
          nextDeliveryDate: null,
          pauseDate: "2025-05-10",
          frequency: "biweekly",
          quantity: 12,
          address: "Ave. Universidad 45, Río Piedras, PR 00925"
        },
        {
          id: "sub3",
          planId: "plan3",
          userId: "u1",
          status: "active",
          startDate: "2025-03-15",
          nextDeliveryDate: "2025-06-15",
          frequency: "monthly",
          quantity: 24,
          address: "Calle Loíza 123, San Juan, PR 00911"
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Filter subscriptions based on search term and status filter
  const filteredSubscriptions = subscriptions.filter(subscription => {
    const user = users.find(u => u.id === subscription.userId);
    const plan = plans.find(p => p.id === subscription.planId);
    
    const matchesSearch = 
      (user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
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

  const getUserName = (userId: string) => {
    const user = users.find(u => u.id === userId);
    return user?.name || 'Usuario desconocido';
  };

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

  const handleLogout = () => {
    localStorage.removeItem('ewa_token');
    localStorage.removeItem('ewa_user');
    sessionStorage.clear();
    router.push('/auth');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-ewa-blue"></div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Gestión de Suscripciones - Panel Administrativo</title>
        <meta name="description" content="Gestión de suscripciones para el servicio de agua sustentable - Demo" />
      </Head>

      <div className="min-h-screen bg-gray-100">
        {/* Header */}
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <div className="flex-shrink-0 flex items-center">
                  <a href="/" className="flex items-center">
                    <span className="text-ewa-blue font-medium text-xl hover:text-ewa-dark-blue transition-all duration-300">Panel Administrativo <span className="text-gray-500 text-sm">Demo</span></span>
                  </a>
                </div>
                {user && (
                  <nav className="hidden sm:ml-6 sm:flex sm:space-x-8">
                    <a href="/admin/dashboard" 
                      className="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium text-gray-500 border-transparent hover:border-gray-300 hover:text-gray-700">
                      Dashboard
                    </a>
                    <a href="/admin/users" 
                      className="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium text-gray-500 border-transparent hover:border-gray-300 hover:text-gray-700">
                      Clientes
                    </a>
                    <a href="/admin/subscriptions" 
                      className="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium border-ewa-blue text-gray-900">
                      Suscripciones
                    </a>
                    <a href="/admin/routes" 
                      className="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium text-gray-500 border-transparent hover:border-gray-300 hover:text-gray-700">
                      Rutas
                    </a>
                  </nav>
                )}
              </div>
              <div className="flex items-center">
                <div className="hidden md:ml-4 md:flex-shrink-0 md:flex md:items-center">
                  <div className="ml-3 relative">
                    <div className="flex items-center space-x-3">
                      <span className="text-sm font-medium text-gray-700">{user?.name}</span>
                      <button
                        onClick={handleLogout}
                        className="text-sm font-medium text-ewa-blue hover:text-ewa-dark-blue"
                      >
                        Cerrar sesión
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-2xl font-semibold text-gray-900">Gestión de Suscripciones</h1>
          </div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
            <div className="py-4">
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

              {/* Search and Filter */}
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
                        placeholder="Buscar suscripciones..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="focus:ring-ewa-blue focus:border-ewa-blue block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>
                  <div className="mt-4 md:mt-0 md:ml-4">
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-ewa-blue focus:border-ewa-blue sm:text-sm rounded-md"
                    >
                      <option value="all">Todos los estados</option>
                      <option value="active">Activas</option>
                      <option value="paused">Pausadas</option>
                      <option value="cancelled">Canceladas</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Subscriptions Table */}
              <div className="bg-white shadow overflow-hidden rounded-lg">
                {loading ? (
                  <div className="p-6 flex justify-center">
                    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-ewa-blue"></div>
                  </div>
                ) : filteredSubscriptions.length === 0 ? (
                  <div className="p-6 text-center text-gray-500">
                    No se encontraron suscripciones que coincidan con los criterios de búsqueda.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            ID
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Cliente
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Plan
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Estado
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Próxima entrega
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Cantidad
                          </th>
                          <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Acciones
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredSubscriptions.map((subscription) => (
                          <tr key={subscription.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {subscription.id}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {getUserName(subscription.userId)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {getPlanName(subscription.planId)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(subscription.status)}`}>
                                {getStatusLabel(subscription.status)}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {formatDate(subscription.nextDeliveryDate || null)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {subscription.quantity}
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
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminSubscriptions;
