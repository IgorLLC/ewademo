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

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
        {/* Header moderno */}
        <header className="bg-white/95 backdrop-blur-sm border-b border-gray-200/60 sticky top-0 z-50 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <div className="flex items-center">
              <div className="mr-8">
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  EWA Box Water
                </h1>
              </div>
              <nav className="hidden md:flex space-x-8">
                <a href="/customer/subscriptions" className="relative border-b-2 border-transparent hover:border-blue-300 text-gray-600 hover:text-blue-600 font-medium py-2 transition-all duration-200 group">
                  Suscripciones
                  <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></div>
                </a>
                <a href="/customer/oneoffs" className="relative border-b-2 border-blue-600 text-blue-600 font-semibold py-2 transition-all duration-200 group">
                  Pedidos Únicos
                  <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 transform scale-x-100 transition-transform duration-200"></div>
                </a>
                <a href="/customer/profile" className="relative border-b-2 border-transparent hover:border-blue-300 text-gray-600 hover:text-blue-600 font-medium py-2 transition-all duration-200 group">
                  Perfil
                  <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></div>
                </a>
                <a href="/customer/billing" className="relative border-b-2 border-transparent hover:border-blue-300 text-gray-600 hover:text-blue-600 font-medium py-2 transition-all duration-200 group">
                  Billing
                  <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></div>
                </a>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              {user && (
                <div className="hidden md:flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium text-sm">{user.name?.charAt(0).toUpperCase()}</span>
                  </div>
                  <span className="text-gray-700 font-medium">
                    Hola, {user.name}
                  </span>
                </div>
              )}
              <button
                onClick={handleLogout}
                className="bg-white hover:bg-gray-50 text-gray-700 hover:text-gray-900 font-medium py-2 px-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 flex items-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>Cerrar sesión</span>
              </button>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          {/* Header de página mejorado */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/60 p-8 hover:shadow-xl transition-all duration-300">
            <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2-2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-1">
                    Pedidos Únicos
                  </h1>
                  <p className="text-gray-600 text-lg">Gestiona tus compras individuales</p>
                </div>
              </div>
              <a
                href="/customer/shop"
                className="inline-flex items-center bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Nuevo Pedido
              </a>
            </div>
          </div>

          {/* Contenido principal */}
          {loading ? (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/60 p-12 hover:shadow-xl transition-all duration-300">
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
                <p className="text-gray-600 font-medium">Cargando tus pedidos...</p>
              </div>
            </div>
          ) : error ? (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/60 p-8 hover:shadow-xl transition-all duration-300">
              <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                    <svg className="h-5 w-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-red-800">Error al cargar pedidos</h3>
                    <p className="text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            </div>
          ) : orders.length === 0 ? (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/60 p-12 hover:shadow-xl transition-all duration-300">
              <div className="text-center space-y-6">
                <div className="w-20 h-20 bg-gradient-to-r from-gray-200 to-gray-300 rounded-2xl flex items-center justify-center mx-auto">
                  <svg className="w-10 h-10 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2-2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">No tienes pedidos únicos</h3>
                  <p className="text-gray-600 text-lg max-w-md mx-auto">Realiza tu primer pedido único para recibirlo sin necesidad de suscripción.</p>
                </div>
                <a
                  href="/customer/shop"
                  className="inline-flex items-center bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  Comprar ahora
                </a>
              </div>
            </div>
          ) : (
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/60 p-6 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-gray-800">Tus pedidos</h2>
              </div>
              
              <div className="space-y-4">
                {orders.map(order => {
                  const product = getProductById(order.productId);
                  if (!product) return null;

                  return (
                    <div key={order.id} className="bg-gradient-to-r from-gray-50 to-blue-50/30 rounded-xl p-6 border border-gray-100/50 hover:shadow-md transition-all duration-200">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
                        <div className="flex items-center space-x-4">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                            order.status === 'delivered' 
                              ? 'bg-green-100 border-2 border-green-200' 
                              : 'bg-yellow-100 border-2 border-yellow-200'
                          }`}>
                            {order.status === 'delivered' ? (
                              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            ) : (
                              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            )}
                          </div>
                          <div>
                            <div className="flex items-center space-x-3 mb-1">
                              <h3 className="font-bold text-gray-800 text-lg">#{order.id}</h3>
                              <span className={`px-3 py-1 text-xs font-semibold rounded-full shadow-sm ${
                                order.status === 'delivered' 
                                  ? 'bg-green-100 text-green-800 border border-green-200' 
                                  : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                              }`}>
                                {order.status === 'delivered' ? '✅ Entregado' : '🕐 Pendiente'}
                              </span>
                            </div>
                            <p className="text-gray-600 flex items-center">
                              <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                              </svg>
                              {product.name} ({product.sizeOz} oz) • ${product.price}
                            </p>
                            <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                              <span>Pedido: {formatOrderDate(order.id)}</span>
                              <span>•</span>
                              <span>{order.status === 'delivered' ? 'Entregado' : 'Entrega estimada'}: {formatDeliveryDate(order.id, order.status)}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex space-x-3">
                          {order.status === 'pending' ? (
                            <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 flex items-center space-x-2">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                              <span>Seguir pedido</span>
                            </button>
                          ) : (
                            <button className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 flex items-center space-x-2">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                              </svg>
                              <span>Repetir pedido</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default OneOffOrdersPage;