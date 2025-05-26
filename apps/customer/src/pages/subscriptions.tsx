import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { getSubscriptions, getPlans, getProducts, updateSubscription } from '@ewa/api-client';
import { Subscription, Plan, Product } from '@ewa/types';
import { Button, Card } from '@ewa/ui';

const SubscriptionsPage = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [showSupportForm, setShowSupportForm] = useState(false);
  const [supportMessage, setSupportMessage] = useState('');
  const [supportCategory, setSupportCategory] = useState('delivery');
  const [supportSubmitted, setSupportSubmitted] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem('ewa_user') || '{}');
        setUser(userData);
        
        const [subscriptionsData, plansData, productsData] = await Promise.all([
          getSubscriptions(userData.id),
          getPlans(),
          getProducts()
        ]);
        
        // Asegurarse de que hay al menos una suscripción para mostrar
        if (subscriptionsData.length === 0) {
          // Crear una suscripción mock si no hay ninguna
          const mockSubscription: Subscription = {
            id: 'sub_mock1',
            userId: userData.id,
            planId: 'plan_1',
            status: 'active'
          };
          
          // Guardar datos adicionales en un objeto aparte para usar en la UI
          // ya que no forman parte del tipo Subscription
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
      setLoading(true);
      await updateSubscription(subscriptionId, { status: newStatus });
      
      // Update local state
      setSubscriptions(prevSubscriptions => 
        prevSubscriptions.map(sub => 
          sub.id === subscriptionId ? { ...sub, status: newStatus } : sub
        )
      );
      
      setSuccessMessage(`Subscription successfully ${newStatus === 'active' ? 'activated' : 'paused'}.`);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (err) {
      setError(`Failed to update subscription. Please try again.`);
      console.error('Error updating subscription:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSkipDelivery = () => {
    setSuccessMessage('Tu próxima entrega ha sido omitida.');
    
    // Clear success message after 3 seconds
    setTimeout(() => {
      setSuccessMessage(null);
    }, 3000);
  };

  const handleChangeAddress = () => {
    setSuccessMessage('Tu dirección de entrega ha sido actualizada.');
    
    // Clear success message after 3 seconds
    setTimeout(() => {
      setSuccessMessage(null);
    }, 3000);
  };

  const handleSupportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSupportSubmitted(true);
    setSuccessMessage('Tu mensaje ha sido enviado. Te contactaremos pronto.');
    
    // Reset form
    setSupportMessage('');
    setSupportCategory('delivery');
    setShowSupportForm(false);
    
    // Clear success message after 3 seconds
    setTimeout(() => {
      setSuccessMessage(null);
      setSupportSubmitted(false);
    }, 3000);
  };

  // Obtener los detalles adicionales de la suscripción del localStorage
  const subscriptionDetails = JSON.parse(localStorage.getItem('ewa_subscription_details') || '{}');
  
  // Calcular la fecha de próxima entrega en formato legible
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

  // Obtener el historial de entregas
  const deliveryHistory = subscriptionDetails.deliveryHistory || [];

  return (
    <Layout title="Mis Suscripciones - EWA Box Water">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* 1. Encabezado o bienvenida */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Hola, {user?.name || 'Cliente'} 👋</h1>
            <p className="mt-2 text-gray-600">Tu próxima entrega está programada para el {nextDeliveryDate}</p>
          </div>
          
          {successMessage && (
            <div className="mb-6 bg-green-50 border-l-4 border-green-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
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
                  <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {loading ? (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="mt-2 text-sm text-gray-500">Cargando tus suscripciones...</p>
            </div>
          ) : subscriptions.length === 0 ? (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No tienes suscripciones activas</h3>
              <p className="mt-1 text-sm text-gray-500">Comienza creando una nueva suscripción.</p>
              <div className="mt-6">
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-ewa-blue hover:bg-ewa-dark-blue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ewa-blue"
                >
                  <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  Nueva Suscripción
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* 2. Información visual principal - Mapa */}
              <div className="md:col-span-2">
                <Card className="h-full">
                  <div className="p-4">
                    <h2 className="text-lg font-semibold mb-2">Ubicación de entrega</h2>
                    <div className="relative h-64 bg-gray-200 rounded-lg overflow-hidden">
                      {/* Imagen estática de mapa (mock) */}
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
                </Card>
              </div>

              {/* 3. Panel de suscripción activa */}
              <div className="md:col-span-1">
                {subscriptions.map(subscription => {
                  const plan = getPlanById(subscription.planId);
                  if (!plan) return null;
                  
                  const product = getProductById(plan.productId);
                  if (!product) return null;

                  return (
                    <Card key={subscription.id} className="h-full">
                      <div className="p-4">
                        <h2 className="text-lg font-semibold mb-2">Tu suscripción</h2>
                        <div className="mb-4">
                          <h3 className="text-xl font-bold text-ewa-blue">
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
                              <Button 
                                onClick={() => handleStatusChange(subscription.id, 'paused')}
                                variant="secondary"
                                fullWidth
                              >
                                Pausar suscripción
                              </Button>
                              <Button 
                                onClick={handleSkipDelivery}
                                variant="secondary"
                                fullWidth
                              >
                                Saltar próxima entrega
                              </Button>
                            </>
                          ) : (
                            <Button 
                              onClick={() => handleStatusChange(subscription.id, 'active')}
                              variant="primary"
                              fullWidth
                            >
                              Reactivar suscripción
                            </Button>
                          )}
                          <Button 
                            onClick={handleChangeAddress}
                            variant="secondary"
                            fullWidth
                          >
                            Cambiar dirección
                          </Button>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>

              {/* 4. Historial básico */}
              <div className="md:col-span-2">
                <Card>
                  <div className="p-4">
                    <h2 className="text-lg font-semibold mb-4">Historial de entregas</h2>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Fecha
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Estado
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Detalles
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {deliveryHistory.map((delivery: any) => (
                            <tr key={delivery.id}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {new Date(delivery.date).toLocaleDateString('es-PR')}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  delivery.status === 'entregado' ? 'bg-green-100 text-green-800' : 
                                  delivery.status === 'en camino' ? 'bg-blue-100 text-blue-800' : 
                                  'bg-red-100 text-red-800'
                                }`}>
                                  {delivery.status.charAt(0).toUpperCase() + delivery.status.slice(1)}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                <button className="text-ewa-blue hover:text-ewa-dark-blue">
                                  Ver detalles
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </Card>
              </div>

              {/* 5. Sección de soporte */}
              <div className="md:col-span-1">
                <Card>
                  <div className="p-4">
                    <h2 className="text-lg font-semibold mb-4">¿Necesitas ayuda?</h2>
                    
                    {!showSupportForm ? (
                      <div className="text-center">
                        <p className="text-gray-600 mb-4">¿Tienes alguna pregunta o problema con tu entrega?</p>
                        <Button 
                          onClick={() => setShowSupportForm(true)}
                          variant="primary"
                          fullWidth
                        >
                          Contactar soporte
                        </Button>
                      </div>
                    ) : (
                      <form onSubmit={handleSupportSubmit}>
                        <div className="mb-4">
                          <label htmlFor="supportCategory" className="block text-sm font-medium text-gray-700 mb-1">
                            Categoría
                          </label>
                          <select
                            id="supportCategory"
                            name="supportCategory"
                            value={supportCategory}
                            onChange={(e) => setSupportCategory(e.target.value)}
                            className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-ewa-blue focus:border-ewa-blue sm:text-sm"
                          >
                            <option value="delivery">Problema con entrega</option>
                            <option value="product">Problema con producto</option>
                            <option value="billing">Problema con facturación</option>
                            <option value="other">Otro</option>
                          </select>
                        </div>
                        <div className="mb-4">
                          <label htmlFor="supportMessage" className="block text-sm font-medium text-gray-700 mb-1">
                            Mensaje
                          </label>
                          <textarea
                            id="supportMessage"
                            name="supportMessage"
                            rows={4}
                            value={supportMessage}
                            onChange={(e) => setSupportMessage(e.target.value)}
                            className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-ewa-blue focus:border-ewa-blue sm:text-sm"
                            placeholder="Describe tu problema o pregunta"
                            required
                          />
                        </div>
                        <div className="flex justify-end space-x-2">
                          <Button 
                            onClick={() => setShowSupportForm(false)}
                            variant="secondary"
                            type="button"
                          >
                            Cancelar
                          </Button>
                          <Button 
                            type="submit"
                            variant="primary"
                            disabled={!supportMessage.trim()}
                          >
                            Enviar
                          </Button>
                        </div>
                      </form>
                    )}
                  </div>
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default SubscriptionsPage;
