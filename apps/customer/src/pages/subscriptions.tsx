import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { Subscription, Plan, Product, User } from '@ewa/types';
import { Plus, CheckCircle, AlertCircle } from 'lucide-react';

const SubscriptionsPage = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [subscriptionDetails, setSubscriptionDetails] = useState<{
    nextDeliveryDate?: string;
    address?: string;
    frequency?: string;
    createdAt?: string;
    deliveryHistory?: Array<{ id: string; date: string; status: string }>;
  }>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem('ewa_user') || '{}');
        setUser(userData);
        
        const storedSubscriptionDetails = JSON.parse(localStorage.getItem('ewa_subscription_details') || '{}');
        setSubscriptionDetails(storedSubscriptionDetails);
        
        const mockPlans: Plan[] = [
          {
            id: 'plan_1',
            name: 'Plan Semanal',
            productId: 'prod_1',
            frequency: 'weekly',
            minQty: 1
          }
        ];

        const mockProducts: Product[] = [
          {
            id: 'prod_1',
            name: 'Agua Purificada EWA',
            sizeOz: 5,
            sku: 'EWA-5GAL',
            price: 12.99
          }
        ];

        const subscriptionsData: Subscription[] = [];
        const plansData = mockPlans;
        const productsData = mockProducts;
        
        if (subscriptionsData.length === 0) {
          const mockSubscription: Subscription = {
            id: 'sub_mock1',
            userId: userData.id,
            planId: 'plan_1',
            status: 'active',
            quantity: 1,
            address: '123 Calle Principal, San Juan, PR 00901',
            nextDeliveryDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
            frequency: 'weekly',
            createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
          };
          
          localStorage.setItem('ewa_subscription_details', JSON.stringify({
            nextDeliveryDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
            address: '123 Calle Principal, San Juan, PR 00901',
            frequency: 'weekly',
            createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
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
            ]
          }));
          subscriptionsData.push(mockSubscription);
        }
        
        setSubscriptions(subscriptionsData);
        setPlans(plansData);
        setProducts(productsData);
      } catch (err) {
        setError('Failed to load subscriptions. Please try again later.');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getProductById = (productId: string): Product | undefined => {
    return products.find(product => product.id === productId);
  };

  const getPlanById = (planId: string): Plan | undefined => {
    return plans.find(plan => plan.id === planId);
  };

  const getFrequencyLabel = (frequency: string): string => {
    switch (frequency) {
      case 'weekly':
        return 'Weekly Delivery';
      case 'biweekly':
        return 'Every Two Weeks';
      case 'monthly':
        return 'Monthly Delivery';
      default:
        return frequency;
    }
  };

  const handleStatusChange = async (subscriptionId: string, newStatus: 'active' | 'paused') => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSubscriptions(prevSubscriptions => 
        prevSubscriptions.map(sub => 
          sub.id === subscriptionId ? { ...sub, status: newStatus } : sub
        )
      );
      
      setSuccessMessage(`Suscripción ${newStatus === 'active' ? 'activada' : 'pausada'} exitosamente.`);
      
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (err) {
      setError(`Error al actualizar la suscripción. Inténtalo de nuevo.`);
      console.error('Error updating subscription:', err);
    }
  };

  const handleSkipDelivery = () => {
    setSuccessMessage('Tu próxima entrega ha sido omitida.');
    setTimeout(() => {
      setSuccessMessage(null);
    }, 3000);
  };

  const handleChangeAddress = () => {
    setSuccessMessage('Tu dirección de entrega ha sido actualizada.');
    setTimeout(() => {
      setSuccessMessage(null);
    }, 3000);
  };


  const nextDeliveryDate = subscriptionDetails.nextDeliveryDate ? 
    new Date(subscriptionDetails.nextDeliveryDate).toLocaleDateString('es-PR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    }) : 
    new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toLocaleDateString('es-PR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    });


  return (
    <Layout title="Mis Suscripciones - EWA Box Water">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Hola, {user?.name || 'Cliente'} 👋</h1>
              <p className="mt-2 text-lg text-gray-600">
                {subscriptions.length > 0 
                  ? `Tu próxima entrega está programada para el ${nextDeliveryDate}`
                  : 'Bienvenido a tu portal de suscripciones'
                }
              </p>
            </div>
            {subscriptions.length > 0 && (
              <a href="/plans" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                <Plus className="w-4 h-4 mr-2" />
                Nueva Suscripción
              </a>
            )}
          </div>

          {successMessage && (
            <div className="mb-6 bg-green-50 border-l-4 border-green-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-green-700">{successMessage}</p>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-red-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-500">Cargando tus suscripciones...</p>
              </div>
            </div>
          ) : subscriptions.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-xl font-medium text-gray-900 mb-2">No tienes suscripciones activas</h3>
              <p className="text-gray-500 mb-6">Comienza creando una nueva suscripción.</p>
              <a href="/plans" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                <Plus className="w-4 h-4 mr-2" />
                Nueva Suscripción
              </a>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <div className="bg-white shadow rounded-lg h-full">
                  <div className="p-4">
                    <h2 className="text-lg font-semibold mb-2">Ubicación de entrega</h2>
                    <div className="relative h-64 bg-gray-200 rounded-lg overflow-hidden">
                      <img 
                        src="https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/pin-s+1A73E8(-66.1057,18.4655)/-66.1057,18.4655,13,0/600x400?access_token=pk.mock" 
                        alt="Mapa de ubicación"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.onerror = null;
                          target.src = 'https://via.placeholder.com/600x400?text=Mapa+de+ubicaci%C3%B3n';
                        }}
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-white bg-opacity-90 p-3">
                        <p className="font-medium text-gray-900">Entrega estimada: hoy entre 2–4 pm</p>
                        <p className="text-sm text-gray-600">{subscriptionDetails.address || '123 Calle Principal, San Juan, PR 00901'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="md:col-span-1">
                {subscriptions.map(subscription => {
                  const plan = getPlanById(subscription.planId);
                  if (!plan) return null;
                  
                  const product = getProductById(plan.productId);
                  if (!product) return null;

                  return (
                    <div key={subscription.id} className="bg-white shadow rounded-lg h-full">
                      <div className="p-4">
                        <h2 className="text-lg font-semibold mb-2">Tu suscripción</h2>
                        <div className="mb-4">
                          <h3 className="text-xl font-bold text-blue-600">
                            {product.sizeOz} oz × {plan.minQty} unidades
                          </h3>
                          <p className="text-gray-600">
                            {getFrequencyLabel(plan.frequency)}
                          </p>
                          <div className="mt-2">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${subscription.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                              {subscription.status === 'active' ? 'Activa' : 'Pausada'}
                            </span>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          {subscription.status === 'active' ? (
                            <>
                              <button
                                onClick={() => handleStatusChange(subscription.id, 'paused')}
                                className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                              >
                                Pausar suscripción
                              </button>
                              <button
                                onClick={handleSkipDelivery}
                                className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                              >
                                Saltar próxima entrega
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => handleStatusChange(subscription.id, 'active')}
                              className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                              Reactivar suscripción
                            </button>
                          )}
                          <button 
                            onClick={handleChangeAddress}
                            className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            Cambiar dirección
                          </button>
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
    </Layout>
  );
};

export default SubscriptionsPage;