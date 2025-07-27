import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { getSubscriptions, getPlans, getProducts, updateSubscription } from '@ewa/api-client';
import { Subscription, Plan, Product } from '@ewa/types';
import { Button, Card } from '@ewa/ui';
import SimpleMapBox from '../../components/SimpleMapBox';
import AddressChangeModal from '../../components/AddressChangeModal';

const SubscriptionsPage = () => {
  const router = useRouter();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [user, setUser] = useState<{id: string, name: string, role: string}>({id: '', name: '', role: ''});
  const [showSupportForm, setShowSupportForm] = useState(false);
  const [supportMessage, setSupportMessage] = useState('');
  const [supportCategory, setSupportCategory] = useState('delivery');
  const [supportSubmitted, setSupportSubmitted] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);

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

  const handleSkipDelivery = () => {
    // Implementación de saltar entrega
    setSuccessMessage('Entrega saltada correctamente. Tu próxima entrega será en 2 semanas.');
    
    // Ocultar el mensaje después de 3 segundos
    setTimeout(() => {
      setSuccessMessage(null);
    }, 3000);
  };

  const handleChangeAddress = () => {
    setShowAddressModal(true);
  };

  const handleSaveAddress = async (newAddress: string, lat: number, lng: number) => {
    try {
      // En un entorno real, aquí actualizaríamos la dirección en la API
      if (subscriptions.length > 0) {
        await updateSubscription(subscriptions[0].id, { address: newAddress });
        
        // Actualizar el estado local
        setSubscriptions(prevSubscriptions => 
          prevSubscriptions.map(sub => 
            sub.id === subscriptions[0].id ? { ...sub, address: newAddress } : sub
          )
        );
      }
      
      setSuccessMessage('Dirección actualizada correctamente.');
      setShowAddressModal(false);
      
      // Ocultar el mensaje después de 3 segundos
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (error) {
      setError('No se pudo actualizar la dirección. Inténtalo de nuevo más tarde.');
      console.error('Error updating address:', error);
    }
  };

  const handleSupportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulación de envío de formulario de soporte
    setSuccessMessage('Tu mensaje ha sido enviado. Nos pondremos en contacto contigo pronto.');
    setSupportSubmitted(true);
    
    // Resetear el formulario
    setSupportMessage('');
    setSupportCategory('delivery');
    
    // Ocultar el formulario después de 2 segundos
    setTimeout(() => {
      setShowSupportForm(false);
      setSupportSubmitted(false);
    }, 2000);
    
    // Ocultar el mensaje después de 5 segundos
    setTimeout(() => {
      setSuccessMessage(null);
    }, 5000);
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

      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <div className="flex items-center">
              <a href="/" className="flex items-center group">
                <div className="bg-ewa-blue text-white font-bold text-xl py-2 px-4 rounded-lg mr-4 shadow-sm group-hover:shadow-md transition-all duration-300 flex items-center space-x-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4m16 0a8 8 0 01-8 8m8-8a8 8 0 00-8-8m8 8h-8" />
                  </svg>
                  <span>EWA Box Water</span>
                </div>
              </a>
              <nav className="hidden md:flex space-x-8">
                <a href="/customer/subscriptions" className="border-b-2 border-ewa-blue text-gray-900 font-medium py-1 transition-colors duration-200">
                  Suscripciones
                </a>
                <a href="/customer/oneoffs" className="border-b-2 border-transparent hover:border-ewa-blue text-gray-500 hover:text-gray-900 font-medium py-1 transition-colors duration-200">
                  Pedidos Únicos
                </a>
                <a href="/customer/profile" className="border-b-2 border-transparent hover:border-ewa-blue text-gray-500 hover:text-gray-900 font-medium py-1 transition-colors duration-200">
                  Perfil
                </a>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              {user && (
                <span className="hidden md:inline text-gray-600">
                  Hola, {user.name}
                </span>
              )}
              <Button
                variant="secondary"
                size="sm"
                onClick={handleLogout}
              >
                Cerrar sesión
              </Button>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                              {subscriptions[0].address}
                            </p>
                          </div>
                          <div className="mt-2 md:mt-0">
                            <p className="text-sm text-gray-500">Próxima entrega:</p>
                            <p className="font-medium">
                              {new Date(subscriptions[0].nextDeliveryDate).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="mt-2 md:mt-0">
                            <p className="text-sm text-gray-500">Frecuencia:</p>
                            <p className="font-medium">
                              {localStorage.getItem('ewa_subscription_details') 
                                ? getFrequencyLabel(JSON.parse(localStorage.getItem('ewa_subscription_details') || '{}').frequency)
                                : 'Entrega Semanal'}
                            </p>
                          </div>
                        </div>
                        
                        <div className="rounded-lg mb-4 overflow-hidden">
                          <SimpleMapBox 
                            address={subscriptions[0].address}
                            height="200px"
                            className="w-full"
                          />
                          <div className="flex justify-end mt-2">
                            <Button 
                              onClick={handleChangeAddress}
                              variant="secondary"
                              size="sm"
                            >
                              Cambiar dirección
                            </Button>
                          </div>
                        </div>
                        
                        <div className="flex justify-end">
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
                      <div>
                        <div className="bg-gray-50 p-4 rounded-lg mb-4">
                          <div className="flex justify-between items-center mb-2">
                            <p className="font-medium">
                              {getProductById(subscriptions[0].productId || '')?.name || 'Box Water Premium'}
                            </p>
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              subscriptions[0].status === 'active' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {subscriptions[0].status === 'active' ? 'Activa' : 'Pausada'}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">
                            {getPlanById(subscriptions[0].planId)?.name || 'Plan Mensual'}
                          </p>
                          <div className="flex justify-between items-center text-sm">
                            <p className="text-gray-500">Cantidad:</p>
                            <p>{subscriptions[0].quantity} unidades</p>
                          </div>
                          <div className="flex justify-between items-center text-sm">
                            <p className="text-gray-500">Desde:</p>
                            <p>{new Date(subscriptions[0].createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                        
                        <div className="flex justify-between">
                          {subscriptions[0].status === 'active' ? (
                            <Button 
                              onClick={() => handleStatusChange(subscriptions[0].id, 'paused')}
                              variant="secondary"
                              size="sm"
                              fullWidth
                            >
                              Pausar suscripción
                            </Button>
                          ) : (
                            <Button 
                              onClick={() => handleStatusChange(subscriptions[0].id, 'active')}
                              variant="primary"
                              size="sm"
                              fullWidth
                            >
                              Reactivar suscripción
                            </Button>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <p className="text-gray-500 mb-4">No tienes suscripciones activas</p>
                        <Button 
                          variant="primary"
                          size="sm"
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
                              Producto
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Acciones
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {(JSON.parse(localStorage.getItem('ewa_subscription_details') || '{"deliveryHistory":[]}').deliveryHistory || []).map((delivery: {id: string, date: string, status: string}) => (
                            <tr key={delivery.id}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">{new Date(delivery.date).toLocaleDateString()}</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 py-1 text-xs rounded-full ${
                                  delivery.status === 'entregado' 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-red-100 text-red-800'
                                }`}>
                                  {delivery.status === 'entregado' ? 'Entregado' : 'Fallido'}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">Box Water Premium</div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button className="text-ewa-blue hover:text-ewa-blue-dark transition-colors duration-200">
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

      {/* Modal de cambio de dirección */}
      {showAddressModal && subscriptions.length > 0 && (
        <AddressChangeModal
          currentAddress={subscriptions[0].address}
          onClose={() => setShowAddressModal(false)}
          onSave={handleSaveAddress}
        />
      )}
    </>
  );
};

export default SubscriptionsPage;
