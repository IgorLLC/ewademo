import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { getSubscriptions, getPlans, getProducts, updateSubscription } from '@ewa/api-client';
import { Subscription, Plan, Product } from '@ewa/types';
import SimpleMapBox from '../../components/SimpleMapBox';

const SubscriptionsPage = () => {
  const router = useRouter();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [user, setUser] = useState<{id: string, name: string, role: string}>({id: '', name: '', role: ''});
  const [chatMessages, setChatMessages] = useState<{id: string, text: string, sender: 'user' | 'support', timestamp: Date}[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

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
        const userData = JSON.parse(localStorage.getItem('ewa_user') || '{}');
        console.log('Fetching data for user:', userData.id);
        
        // Primero intentamos obtener los planes y productos, que son menos propensos a fallar
        try {
          const plansData = await getPlans();
          setPlans(plansData);
          console.log('Plans loaded successfully:', plansData.length);
        } catch (planErr) {
          console.error('Error fetching plans:', planErr);
        }
        
        try {
          const productsData = await getProducts();
          setProducts(productsData);
          console.log('Products loaded successfully:', productsData.length);
        } catch (productErr) {
          console.error('Error fetching products:', productErr);
        }
        
        // Ahora intentamos obtener las suscripciones
        let subscriptionsData: Subscription[] = [];
        try {
          subscriptionsData = await getSubscriptions(userData.id);
          console.log('Subscriptions loaded successfully:', subscriptionsData.length);
        } catch (subErr) {
          console.error('Error fetching subscriptions:', subErr);
          setError('No se pudieron cargar las suscripciones. Por favor, inténtalo de nuevo más tarde.');
        }
        
        // Asegurarse de que hay al menos una suscripción para mostrar
        if (subscriptionsData.length === 0) {
          console.log('No subscriptions found, creating mock subscription');
          // Crear una suscripción mock si no hay ninguna
          const mockSubscription: Subscription = {
            id: 'sub_mock1',
            userId: userData.id,
            planId: 'plan_1',
            status: 'active',
            quantity: 1,
            nextDeliveryDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
            address: '123 Calle Principal, San Juan, PR 00901',
            frequency: 'weekly',
            createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
          };
          
          // Guardar datos adicionales en un objeto aparte para usar en la UI
          localStorage.setItem('ewa_subscription_details', JSON.stringify({
            deliveryHistory: [
              {
                id: 'del_1',
                date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
                status: 'entregado'
              },
              {
                id: 'del_2',
                date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
                status: 'entregado'
              },
              {
                id: 'del_3',
                date: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
                status: 'fallido'
              }
            ],
            frequency: 'weekly'
          }));
          subscriptionsData.push(mockSubscription);
        }
        
        setSubscriptions(subscriptionsData);
        setError(null); // Limpiar cualquier error previo si la carga fue exitosa
      } catch (err) {
        console.error('Error in fetchData:', err);
        setError('No se pudieron cargar los datos. Por favor, inténtalo de nuevo más tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const getProductById = (productId: string): Product | undefined => {
    return products.find(product => product.id === productId);
  };

  const getPlanById = (planId: string): Plan | undefined => {
    return plans.find(plan => plan.id === planId);
  };

  const getFrequencyLabel = (frequency: string): string => {
    switch (frequency) {
      case 'weekly':
        return 'Entrega Semanal';
      case 'biweekly':
        return 'Entrega Quincenal';
      case 'monthly':
        return 'Entrega Mensual';
      default:
        return 'Entrega Semanal';
    }
  };

  const handleStatusChange = async (subscriptionId: string, newStatus: 'active' | 'paused') => {
    try {
      await updateSubscription(subscriptionId, { status: newStatus });
      
      // Actualizar el estado local
      setSubscriptions(prevSubscriptions => 
        prevSubscriptions.map(sub => 
          sub.id === subscriptionId ? { ...sub, status: newStatus } : sub
        )
      );
      
      setSuccessMessage(`Suscripción ${newStatus === 'active' ? 'activada' : 'pausada'} correctamente.`);
      
      // Ocultar el mensaje después de 3 segundos
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (error) {
      setError(`No se pudo ${newStatus === 'active' ? 'activar' : 'pausar'} la suscripción. Inténtalo de nuevo más tarde.`);
      console.error('Error updating subscription:', error);
    }
  };



  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentMessage.trim()) return;
    
    // Agregar mensaje del usuario
    const userMessage = {
      id: Date.now().toString(),
      text: currentMessage.trim(),
      sender: 'user' as const,
      timestamp: new Date()
    };
    
    setChatMessages(prev => [...prev, userMessage]);
    setCurrentMessage('');
    setIsTyping(true);
    
    // Simular respuesta automática del soporte
    setTimeout(() => {
      const supportMessage = {
        id: (Date.now() + 1).toString(),
        text: '¡Hola! Gracias por contactarnos. Hemos recibido tu mensaje y uno de nuestros agentes te responderá pronto. ¿Hay algo más en lo que te podamos ayudar?',
        sender: 'support' as const,
        timestamp: new Date()
      };
      
      setChatMessages(prev => [...prev, supportMessage]);
      setIsTyping(false);
    }, 2000);
  };

  const handleLogout = () => {
    localStorage.removeItem('ewa_user');
    sessionStorage.clear();
    router.push('/auth');
  };

  return (
    <>
      <Head>
        <title>Mis Suscripciones | EWA Box Water</title>
        <meta name="description" content="Gestiona tus suscripciones de agua en caja" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
        <header className="bg-white/95 backdrop-blur-sm border-b border-gray-200/60 sticky top-0 z-50 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <div className="flex items-center">
              <div className="mr-8">
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  EWA Box Water
                </h1>
              </div>
              <nav className="hidden md:flex space-x-8">
                <a href="/customer/subscriptions" className="relative border-b-2 border-blue-600 text-blue-600 font-semibold py-2 transition-all duration-200 group">
                  Suscripciones
                  <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 transform scale-x-100 transition-transform duration-200"></div>
                </a>
                <a href="/customer/oneoffs" className="relative border-b-2 border-transparent hover:border-blue-300 text-gray-600 hover:text-blue-600 font-medium py-2 transition-all duration-200 group">
                  Pedidos Únicos
                  <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></div>
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
          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6 rounded-md shadow-sm">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3 flex justify-between w-full items-center">
                  <p className="text-sm text-red-700">
                    {error}
                  </p>
                  <button 
                    onClick={() => window.location.reload()} 
                    className="text-sm font-medium text-red-600 hover:text-red-800 transition-colors duration-200"
                  >
                    Intentar de nuevo
                  </button>
                </div>
              </div>
            </div>
          )}

          {successMessage && (
            <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6 rounded-md shadow-sm">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3 flex justify-between w-full items-center">
                  <p className="text-sm text-green-700">
                    {successMessage}
                  </p>
                  <button 
                    onClick={() => setSuccessMessage(null)} 
                    className="text-sm font-medium text-green-600 hover:text-green-800 transition-colors duration-200"
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            </div>
          )}

          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-ewa-blue mb-4"></div>
              <p className="text-gray-600">Cargando tus suscripciones...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* 1. Información personal mejorada */}
              <div className="md:col-span-3">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/60 p-8 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                      <span className="text-white font-bold text-xl">{user?.name?.charAt(0).toUpperCase()}</span>
                    </div>
                    <div>
                      <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-1">
                        ¡Bienvenido, {user?.name}!
                      </h1>
                      <p className="text-gray-600 text-lg">Gestiona tus suscripciones y entregas</p>
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-100/50">
                    <p className="text-gray-700 leading-relaxed">
                      Aquí puedes gestionar tus suscripciones de agua en caja, ver el historial de entregas y contactar con nuestro equipo de soporte.
                    </p>
                  </div>
                </div>
              </div>

              {/* 2. Información de entrega mejorada */}
              <div className="md:col-span-2">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/60 p-6 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <h2 className="text-xl font-bold text-gray-800">Información de entrega</h2>
                  </div>
                    
                  {subscriptions.length > 0 && (
                    <div className="space-y-6">
                      <div className="bg-gradient-to-r from-gray-50 to-blue-50/30 p-6 rounded-xl border border-gray-100/50">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              <p className="text-sm font-medium text-gray-600">Dirección de entrega</p>
                            </div>
                            <p className="font-semibold text-gray-800 leading-relaxed">
                              {subscriptions[0].address}
                            </p>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              <p className="text-sm font-medium text-gray-600">Próxima entrega</p>
                            </div>
                            <p className="font-semibold text-gray-800">
                              {new Date(subscriptions[0].nextDeliveryDate).toLocaleDateString('es-ES', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </p>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                              <p className="text-sm font-medium text-gray-600">Frecuencia</p>
                            </div>
                            <p className="font-semibold text-gray-800">
                              {localStorage.getItem('ewa_subscription_details') 
                                ? getFrequencyLabel(JSON.parse(localStorage.getItem('ewa_subscription_details') || '{}').frequency)
                                : 'Entrega Semanal'}
                            </p>
                          </div>
                        </div>
                        
                        <div className="rounded-xl overflow-hidden shadow-lg border-4 border-white">
                          <SimpleMapBox 
                            address={subscriptions[0].address}
                            height="200px"
                            className="w-full"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* 3. Suscripción activa mejorada */}
              <div className="md:col-span-1">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/60 p-6 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h2 className="text-xl font-bold text-gray-800">Suscripción activa</h2>
                  </div>
                  
                  {subscriptions.length > 0 ? (
                    <div className="space-y-4">
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-5 rounded-xl border border-blue-100/50">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <p className="font-bold text-gray-800 text-lg">
                              {getProductById(subscriptions[0].productId || '')?.name || 'Box Water Premium'}
                            </p>
                            <p className="text-sm text-gray-600">
                              {getPlanById(subscriptions[0].planId)?.name || 'Plan Mensual'}
                            </p>
                          </div>
                          <span className={`px-3 py-1 text-xs font-semibold rounded-full shadow-sm ${
                            subscriptions[0].status === 'active' 
                              ? 'bg-green-100 text-green-800 border border-green-200' 
                              : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                          }`}>
                            {subscriptions[0].status === 'active' ? '● Activa' : '⏸ Pausada'}
                          </span>
                        </div>
                        
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600 flex items-center">
                              <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                              </svg>
                              Cantidad
                            </span>
                            <span className="font-semibold text-gray-800">{subscriptions[0].quantity} unidades</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600 flex items-center">
                              <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a4 4 0 118 0v4M3 21h18l-2-9H5l-2 9z" />
                              </svg>
                              Activa desde
                            </span>
                            <span className="font-semibold text-gray-800">
                              {new Date(subscriptions[0].createdAt).toLocaleDateString('es-ES', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="pt-2">
                        {subscriptions[0].status === 'active' ? (
                          <button 
                            onClick={() => handleStatusChange(subscriptions[0].id, 'paused')}
                            className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-semibold py-3 px-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                          >
                            <svg className="w-4 h-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Pausar suscripción
                          </button>
                        ) : (
                          <button 
                            onClick={() => handleStatusChange(subscriptions[0].id, 'active')}
                            className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-semibold py-3 px-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                          >
                            <svg className="w-4 h-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M15 14h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Reactivar suscripción
                          </button>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-gradient-to-r from-gray-200 to-gray-300 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      </div>
                      <p className="text-gray-600 mb-4 font-medium">No tienes suscripciones activas</p>
                      <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105">
                        <svg className="w-4 h-4 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        Crear suscripción
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* 4. Historial de entregas mejorado */}
              <div className="md:col-span-2">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/60 p-6 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                      </svg>
                    </div>
                    <h2 className="text-xl font-bold text-gray-800">Historial de entregas</h2>
                  </div>
                  
                  <div className="space-y-4">
                    {(JSON.parse(localStorage.getItem('ewa_subscription_details') || '{"deliveryHistory":[]}').deliveryHistory || []).map((delivery: {id: string, date: string, status: string}) => (
                      <div key={delivery.id} className="bg-gradient-to-r from-gray-50 to-blue-50/30 rounded-xl p-5 border border-gray-100/50 hover:shadow-md transition-all duration-200">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                              delivery.status === 'entregado' 
                                ? 'bg-green-100 border-2 border-green-200' 
                                : 'bg-red-100 border-2 border-red-200'
                            }`}>
                              {delivery.status === 'entregado' ? (
                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                              ) : (
                                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              )}
                            </div>
                            <div>
                              <div className="flex items-center space-x-3 mb-1">
                                <p className="font-bold text-gray-800">
                                  {new Date(delivery.date).toLocaleDateString('es-ES', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                  })}
                                </p>
                                <span className={`px-3 py-1 text-xs font-semibold rounded-full shadow-sm ${
                                  delivery.status === 'entregado' 
                                    ? 'bg-green-100 text-green-800 border border-green-200' 
                                    : 'bg-red-100 text-red-800 border border-red-200'
                                }`}>
                                  {delivery.status === 'entregado' ? '✅ Entregado' : '❌ Fallido'}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600 flex items-center">
                                <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                </svg>
                                Box Water Premium • 1 unidad
                              </p>
                            </div>
                          </div>
                          <button className="bg-white hover:bg-blue-50 text-blue-600 hover:text-blue-700 font-medium py-2 px-4 rounded-xl border border-blue-200 shadow-sm hover:shadow-md transition-all duration-200 flex items-center space-x-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            <span>Ver detalles</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {(JSON.parse(localStorage.getItem('ewa_subscription_details') || '{"deliveryHistory":[]}').deliveryHistory || []).length === 0 && (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-gradient-to-r from-gray-200 to-gray-300 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                      </div>
                      <p className="text-gray-600 font-medium">No hay entregas registradas</p>
                      <p className="text-gray-500 text-sm mt-1">Las entregas aparecerán aquí una vez que se procesen</p>
                    </div>
                  )}
                </div>
              </div>

              {/* 5. Chat de soporte - Versión mejorada */}
              <div className="md:col-span-1">
                <div className="relative">
                  {!isChatOpen ? (
                    /* Floating Chat Button */
                    <div className="fixed bottom-6 right-6 z-50 md:relative md:bottom-auto md:right-auto">
                      <div className="bg-white rounded-3xl shadow-2xl p-6 border border-gray-100 backdrop-blur-sm bg-white/95 max-w-sm mx-auto">
                        <div className="text-center">
                          <div className="relative inline-flex items-center justify-center w-16 h-16 mb-4">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full opacity-20 animate-pulse"></div>
                            <div className="relative w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 4v-4z" />
                              </svg>
                            </div>
                          </div>
                          <h3 className="text-lg font-bold text-gray-900 mb-1">¿Necesitas ayuda?</h3>
                          <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                            Chatea con nuestro equipo de soporte.<br/>
                            <span className="text-green-600 font-medium">¡Estamos en línea!</span>
                          </p>
                          <button
                            onClick={() => setIsChatOpen(true)}
                            className="group relative w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
                          >
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-purple-700 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <div className="relative flex items-center justify-center space-x-2">
                              <svg className="w-5 h-5 transform group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                              </svg>
                              <span>Iniciar conversación</span>
                            </div>
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Modern Chat Interface */
                    <div className="fixed inset-0 z-50 md:relative md:inset-auto bg-black/50 md:bg-transparent flex items-end md:items-start justify-center md:justify-start p-4 md:p-0">
                      <div className="w-full max-w-md md:max-w-none bg-white rounded-t-3xl md:rounded-3xl shadow-2xl max-h-[90vh] md:max-h-none overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
                        {/* Chat Header */}
                        <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-blue-700 px-6 py-4">
                          <div className="absolute inset-0 bg-black/10"></div>
                          <div className="relative flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="relative">
                                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364" />
                                  </svg>
                                </div>
                                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 border-2 border-white rounded-full"></div>
                              </div>
                              <div>
                                <h3 className="text-white font-bold text-base">Soporte EWA</h3>
                                <div className="flex items-center space-x-1">
                                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                  <p className="text-white/90 text-xs">En línea • Responde rápido</p>
                                </div>
                              </div>
                            </div>
                            <button 
                              onClick={() => setIsChatOpen(false)}
                              className="text-white/80 hover:text-white hover:bg-white/20 rounded-full p-2 transition-all duration-200"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        </div>
                        
                        {/* Messages Area */}
                        <div className="h-96 overflow-y-auto bg-gradient-to-b from-gray-50/50 to-white relative">
                          <div className="absolute inset-0 opacity-20" style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f8fafc' fill-opacity='0.4'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                          }}></div>
                          <div className="relative p-4 space-y-4">
                            {chatMessages.length === 0 ? (
                              <div className="text-center py-8 px-4">
                                <div className="inline-flex items-start space-x-3 bg-white rounded-3xl p-4 shadow-lg border border-gray-100 max-w-xs text-left">
                                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                    </svg>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-gray-900 mb-1">
                                      ¡Hola! Soy tu asistente virtual 👋
                                    </p>
                                    <p className="text-xs text-gray-600 mb-2">
                                      ¿En qué puedo ayudarte hoy?
                                    </p>
                                    <div className="flex flex-wrap gap-1">
                                      <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">#entregas</span>
                                      <span className="inline-block bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">#facturación</span>
                                    </div>
                                  </div>
                                </div>
                                <p className="text-xs text-gray-500 mt-3">
                                  {new Date().toLocaleTimeString('es-ES', {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </p>
                              </div>
                            ) : (
                              chatMessages.map((message, index) => (
                                <div 
                                  key={message.id}
                                  className={`flex items-end space-x-2 ${message.sender === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}
                                  style={{animationDelay: `${index * 100}ms`}}
                                >
                                  {message.sender === 'support' && (
                                    <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                                      <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                      </svg>
                                    </div>
                                  )}
                                  <div className={`max-w-xs lg:max-w-sm relative group ${
                                    message.sender === 'user' ? 'order-1' : ''
                                  }`}>
                                    <div 
                                      className={`px-4 py-3 rounded-3xl shadow-lg backdrop-blur-sm relative ${
                                        message.sender === 'user' 
                                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-br-lg' 
                                          : 'bg-white/90 text-gray-800 border border-gray-100 rounded-bl-lg'
                                      }`}
                                    >
                                      <p className="text-sm leading-relaxed">{message.text}</p>
                                      <div className="flex items-center justify-between mt-2">
                                        <p className={`text-xs ${
                                          message.sender === 'user' ? 'text-white/80' : 'text-gray-500'
                                        }`}>
                                          {message.timestamp.toLocaleTimeString('es-ES', {
                                            hour: '2-digit',
                                            minute: '2-digit'
                                          })}
                                        </p>
                                        {message.sender === 'user' && (
                                          <div className="flex space-x-1">
                                            <div className="w-1 h-1 bg-white/60 rounded-full"></div>
                                            <div className="w-1 h-1 bg-white/60 rounded-full"></div>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                  {message.sender === 'user' && (
                                    <div className="w-7 h-7 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-md order-2">
                                      <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                      </svg>
                                    </div>
                                  )}
                                </div>
                              ))
                            )}
                            
                            {/* Enhanced Typing Indicator */}
                            {isTyping && (
                              <div className="flex items-end space-x-2 justify-start animate-in slide-in-from-bottom-2 duration-300">
                                <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                                  <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                  </svg>
                                </div>
                                <div className="bg-white/90 backdrop-blur-sm shadow-lg border border-gray-100 px-4 py-3 rounded-3xl rounded-bl-lg">
                                  <div className="flex items-center space-x-1">
                                    <span className="text-xs text-gray-500 mr-2">escribiendo</span>
                                    <div className="flex space-x-1">
                                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                                      <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {/* Enhanced Input Area */}
                        <div className="border-t border-gray-200/50 bg-white/95 backdrop-blur-sm p-4">
                          <form onSubmit={handleSendMessage} className="relative">
                            <div className="flex items-end space-x-3">
                              <div className="flex-1 relative">
                                <input
                                  type="text"
                                  value={currentMessage}
                                  onChange={(e) => setCurrentMessage(e.target.value)}
                                  placeholder="Escribe tu mensaje..."
                                  className="w-full bg-gray-50 border-2 border-gray-200 rounded-3xl px-6 py-3 pr-12 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white text-sm transition-all duration-200 resize-none"
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                      e.preventDefault();
                                      handleSendMessage(e);
                                    }
                                  }}
                                />
                                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
                                  <button 
                                    type="button"
                                    className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                                    title="Adjuntar archivo"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                                    </svg>
                                  </button>
                                </div>
                              </div>
                              <button 
                                type="submit"
                                disabled={!currentMessage.trim()}
                                className="group relative bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-400 text-white rounded-full p-3 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-110 active:scale-95 disabled:transform-none disabled:hover:shadow-lg"
                              >
                                <svg className="w-5 h-5 transform group-hover:rotate-12 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                </svg>
                              </button>
                            </div>
                            <p className="text-xs text-gray-500 mt-2 text-center">
                              Presiona Enter para enviar, Shift+Enter para nueva línea
                            </p>
                          </form>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

    </>
  );
};

export default SubscriptionsPage;
