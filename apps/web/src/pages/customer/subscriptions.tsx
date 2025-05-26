import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { getSubscriptions, getPlans, getProducts, updateSubscription } from '@ewa/api-client';
import { Subscription, Plan, Product } from '@ewa/types';
import { Button, Card } from '@ewa/ui';

const SubscriptionsPage = () => {
  const router = useRouter();
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
      
      setSuccessMessage(`Subscription ${newStatus === 'active' ? 'activated' : 'paused'} successfully!`);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (err) {
      setError(`Failed to ${newStatus === 'active' ? 'activate' : 'pause'} subscription. Please try again.`);
      console.error('Error updating subscription:', err);
      
      // Clear error message after 3 seconds
      setTimeout(() => {
        setError(null);
      }, 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleSkipDelivery = () => {
    setSuccessMessage('Your next delivery has been skipped successfully!');
    
    // Clear success message after 3 seconds
    setTimeout(() => {
      setSuccessMessage(null);
    }, 3000);
  };

  const handleChangeAddress = () => {
    setSuccessMessage('Your delivery address has been updated successfully!');
    
    // Clear success message after 3 seconds
    setTimeout(() => {
      setSuccessMessage(null);
    }, 3000);
  };

  const handleSupportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // En un entorno real, aquí enviaríamos el mensaje de soporte a un API
    console.log('Support message submitted:', {
      category: supportCategory,
      message: supportMessage,
      userId: user?.id
    });
    
    setSupportSubmitted(true);
    setShowSupportForm(false);
    setSupportMessage('');
    
    setSuccessMessage('Your support request has been submitted. We will contact you soon!');
    
    // Clear success message after 3 seconds
    setTimeout(() => {
      setSuccessMessage(null);
    }, 3000);
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
        <title>Mis Suscripciones - EWA Box Water</title>
        <meta name="description" content="Gestiona tus suscripciones de agua en caja" />
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
                      className="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium border-ewa-blue text-gray-900">
                      Suscripciones
                    </a>
                    <a href="/customer/oneoffs" 
                      className="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700">
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
          {/* Notification */}
          {error && (
            <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-4">
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

          {successMessage && (
            <div className="mb-4 bg-green-50 border-l-4 border-green-400 p-4">
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

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-ewa-blue"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* 1. Información personal */}
              <div className="md:col-span-3">
                <Card>
                  <div className="p-4">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">¡Bienvenido, {user?.name}!</h1>
                    <p className="text-gray-600">Aquí puedes gestionar tus suscripciones de agua en caja y ver el historial de entregas.</p>
                  </div>
                </Card>
              </div>

              {/* 2. Información de entrega */}
              <div className="md:col-span-2">
                <Card>
                  <div className="p-4">
                    <h2 className="text-lg font-semibold mb-4">Información de entrega</h2>
                    
                    {subscriptions.length > 0 && (
                      <div className="bg-gray-50 p-4 rounded-lg mb-4">
                        <div className="flex flex-col md:flex-row justify-between mb-4">
                          <div>
                            <p className="text-sm text-gray-500">Dirección de entrega:</p>
                            <p className="font-medium">
                              {localStorage.getItem('ewa_subscription_details') 
                                ? JSON.parse(localStorage.getItem('ewa_subscription_details') || '{}').address 
                                : '123 Calle Principal, San Juan, PR 00901'}
                            </p>
                          </div>
                          <div className="mt-2 md:mt-0">
                            <p className="text-sm text-gray-500">Próxima entrega:</p>
                            <p className="font-medium">
                              {localStorage.getItem('ewa_subscription_details')
                                ? new Date(JSON.parse(localStorage.getItem('ewa_subscription_details') || '{}').nextDeliveryDate).toLocaleDateString()
                                : new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="mt-2 md:mt-0">
                            <p className="text-sm text-gray-500">Frecuencia:</p>
                            <p className="font-medium">
                              {localStorage.getItem('ewa_subscription_details')
                                ? getFrequencyLabel(JSON.parse(localStorage.getItem('ewa_subscription_details') || '{}').frequency)
                                : 'Weekly Delivery'}
                            </p>
                          </div>
                        </div>
                        
                        <div className="bg-gray-200 h-40 rounded-lg flex items-center justify-center mb-4">
                          <p className="text-gray-500 text-center">Mapa de entrega<br/>(Simulación)</p>
                        </div>
                        
                        <div className="flex flex-wrap gap-2">
                          <Button 
                            onClick={handleChangeAddress}
                            variant="secondary"
                            size="sm"
                          >
                            Cambiar dirección
                          </Button>
                          <Button 
                            onClick={handleSkipDelivery}
                            variant="secondary"
                            size="sm"
                          >
                            Saltar próxima entrega
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              </div>

              {/* 3. Suscripción activa */}
              <div className="md:col-span-1">
                <Card>
                  <div className="p-4">
                    <h2 className="text-lg font-semibold mb-4">Suscripción activa</h2>
                    
                    {subscriptions.length > 0 ? (
                      subscriptions.map(subscription => {
                        const plan = getPlanById(subscription.planId);
                        const product = plan ? getProductById(plan.productId) : undefined;
                        
                        return (
                          <div key={subscription.id} className="bg-gray-50 p-4 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="font-medium">{product?.name || 'Box Water'}</h3>
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                subscription.status === 'active' 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {subscription.status === 'active' ? 'Activa' : 'Pausada'}
                              </span>
                            </div>
                            <p className="text-sm text-gray-500 mb-4">
                              {plan?.name || 'Standard Plan'} - ${plan?.price.toFixed(2) || '9.99'}/mes
                            </p>
                            
                            <div className="flex flex-col space-y-2">
                              {subscription.status === 'active' ? (
                                <Button 
                                  onClick={() => handleStatusChange(subscription.id, 'paused')}
                                  variant="secondary"
                                  fullWidth
                                >
                                  Pausar suscripción
                                </Button>
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
                                variant="outline"
                                fullWidth
                              >
                                Cambiar plan
                              </Button>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-center py-4">
                        <p className="text-gray-500 mb-4">No tienes suscripciones activas.</p>
                        <Button 
                          variant="primary"
                          fullWidth
                        >
                          Crear suscripción
                        </Button>
                      </div>
                    )}
                  </div>
                </Card>
              </div>

              {/* 4. Historial de entregas */}
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
                              Acción
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {(localStorage.getItem('ewa_subscription_details') 
                            ? JSON.parse(localStorage.getItem('ewa_subscription_details') || '{}').deliveryHistory 
                            : [
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
                          ).map((delivery: any) => (
                            <tr key={delivery.id}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {new Date(delivery.date).toLocaleDateString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 py-1 text-xs rounded-full ${
                                  delivery.status === 'entregado' 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-red-100 text-red-800'
                                }`}>
                                  {delivery.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                <button 
                                  className="text-ewa-blue hover:text-ewa-dark-blue"
                                  onClick={() => alert(`Detalles de entrega ${delivery.id}`)}
                                >
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
    </>
  );
};

export default SubscriptionsPage;
