import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { getOneOffOrders, getProducts } from '@ewa/api-client';
import { OneOffOrder, Product } from '@ewa/types';

const OneOffOrdersPage = () => {
  const router = useRouter();
  const [orders, setOrders] = useState<OneOffOrder[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
      if (userData.role !== 'customer') {
        router.push('/auth');
        return;
      }
      setUser(userData);
    } catch (error) {
      console.error('Error parsing user data:', error);
      router.push('/auth');
      return;
    }

    const fetchData = async () => {
      try {
        try {
          // Intentar obtener datos de la API
          const [ordersData, productsData] = await Promise.all([
            getOneOffOrders(user.id),
            getProducts()
          ]);
          
          setOrders(ordersData);
          setProducts(productsData);
        } catch (apiError) {
          console.error('Error fetching data from API:', apiError);
          
          // Si la API falla, usar datos mock
          const mockProducts = [
            {
              id: 'p1',
              name: 'EWA Box Water - Small',
              sizeOz: 16,
              sku: 'EWA-S-16',
              price: 1.99
            },
            {
              id: 'p2',
              name: 'EWA Box Water - Medium',
              sizeOz: 24,
              sku: 'EWA-M-24',
              price: 2.49
            },
            {
              id: 'p3',
              name: 'EWA Box Water - Large',
              sizeOz: 32,
              sku: 'EWA-L-32',
              price: 2.99
            }
          ];
          
          const mockOrders: OneOffOrder[] = [
            {
              id: 'o1',
              productId: 'p3',
              userId: user.id,
              status: 'delivered' as 'delivered'
            },
            {
              id: 'o2',
              productId: 'p2',
              userId: user.id,
              status: 'pending' as 'pending'
            }
          ];
          
          setProducts(mockProducts as Product[]);
          setOrders(mockOrders);
        }
      } catch (err) {
        setError('Failed to load orders. Please try again later.');
        console.error('Error in fetchData:', err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchData();
    }
  }, [router, user]);

  const getProductById = (productId: string): Product | undefined => {
    return products.find(product => product.id === productId);
  };

  const getStatusBadgeClass = (status: string): string => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatOrderDate = (orderId: string): string => {
    // Mock function to generate a date based on the order ID
    // In a real app, this would come from the order data
    const orderNumber = parseInt(orderId.replace(/\D/g, ''), 10) || 0;
    const date = new Date();
    date.setDate(date.getDate() - orderNumber * 3); // Just for demo purposes
    return date.toLocaleDateString();
  };

  const formatDeliveryDate = (orderId: string, status: string): string => {
    // Mock function to generate a delivery date based on the order ID
    // In a real app, this would come from the order data
    if (status === 'delivered') {
      const orderNumber = parseInt(orderId.replace(/\D/g, ''), 10) || 0;
      const date = new Date();
      date.setDate(date.getDate() - orderNumber * 2); // Just for demo purposes
      return date.toLocaleDateString();
    } else {
      const date = new Date();
      date.setDate(date.getDate() + 2); // Estimated delivery in 2 days
      return date.toLocaleDateString();
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('ewa_token');
    localStorage.removeItem('ewa_user');
    sessionStorage.clear();
    router.push('/auth');
  };

  return (
    <>
      <Head>
        <title>Pedidos Únicos - EWA Box Water</title>
        <meta name="description" content="Gestiona tus pedidos únicos de agua en caja" />
      </Head>

      <div className="min-h-screen bg-gray-100">
        {/* Header */}
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <div className="flex-shrink-0 flex items-center">
                  <a href="/" className="text-xl font-bold text-ewa-blue">
                    EWA Box Water
                  </a>
                </div>
                {user && (
                  <nav className="hidden sm:ml-6 sm:flex sm:space-x-8">
                    <a href="/customer/subscriptions" 
                      className="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700">
                      Suscripciones
                    </a>
                    <a href="/customer/oneoffs" 
                      className="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium border-ewa-blue text-gray-900">
                      Pedidos Únicos
                    </a>
                    <a href="/customer/profile" 
                      className="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700">
                      Perfil
                    </a>
                  </nav>
                )}
              </div>
              <div className="flex items-center">
                {user ? (
                  <div className="ml-3 relative">
                    <div className="flex items-center">
                      <span className="text-sm text-gray-700 mr-2">Hola, {user.name}</span>
                      <button
                        onClick={handleLogout}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        <svg className="mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Cerrar sesión
                      </button>
                    </div>
                  </div>
                ) : (
                  <a
                    href="/auth"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-ewa-blue hover:bg-ewa-dark-blue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ewa-blue"
                  >
                    Iniciar sesión
                  </a>
                )}
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Pedidos Únicos</h1>
              <a
                href="/customer/shop"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-ewa-blue hover:bg-ewa-dark-blue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ewa-blue"
              >
                Nuevo Pedido
              </a>
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-ewa-blue"></div>
              </div>
            ) : error ? (
              <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
                <div className="bg-red-50 border-l-4 border-red-400 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-700">{error}</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : orders.length === 0 ? (
              <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
                <div className="text-center py-8">
                  <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                  <h3 className="mt-2 text-lg font-medium text-gray-900">No tienes pedidos únicos</h3>
                  <p className="mt-1 text-sm text-gray-500">Realiza tu primer pedido único para recibirlo sin necesidad de suscripción.</p>
                  <div className="mt-6">
                    <a
                      href="/customer/shop"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-ewa-blue hover:bg-ewa-dark-blue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ewa-blue"
                    >
                      Comprar ahora
                    </a>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          ID del Pedido
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Producto
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Fecha de Pedido
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Fecha de Entrega
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Estado
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Acciones
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {orders.map(order => {
                        const product = getProductById(order.productId);
                        if (!product) return null;

                        return (
                          <tr key={order.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              #{order.id}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {product.name} ({product.sizeOz} oz)
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {formatOrderDate(order.id)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {formatDeliveryDate(order.id, order.status)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(order.status)}`}>
                                {order.status === 'delivered' ? 'Entregado' : 'Pendiente'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {order.status === 'pending' ? (
                                <button
                                  type="button"
                                  className="text-ewa-blue hover:text-ewa-dark-blue font-medium"
                                >
                                  Seguir Pedido
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  className="text-ewa-blue hover:text-ewa-dark-blue font-medium"
                                >
                                  Repetir Pedido
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default OneOffOrdersPage;
