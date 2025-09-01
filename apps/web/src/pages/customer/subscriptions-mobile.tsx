import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { getSubscriptions, getPlans, getProducts, updateSubscription } from '@ewa/api-client';
import { Subscription, Plan, Product } from '@ewa/types';
import { 
  MobileCustomerLayout, 
  MobileSubscriptionCard,
  useMobile 
} from '../../components/mobile';
import { 
  Package, 
  Plus, 
  Calendar, 
  MapPin,
  RefreshCw,
  AlertCircle
} from 'lucide-react';

const SubscriptionsMobilePage = () => {
  const router = useRouter();
  const { isMobile } = useMobile();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [user, setUser] = useState<{id: string, name: string, role: string}>({id: '', name: '', role: ''});
  const [refreshing, setRefreshing] = useState(false);

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

    fetchData();
  }, [router]);

  const fetchData = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem('ewa_user') || '{}');
      console.log('Fetching data for user:', userData.id);
      
      // Obtener planes y productos
      try {
        const plansData = await getPlans();
        setPlans(plansData);
      } catch (planErr) {
        console.error('Error fetching plans:', planErr);
      }
      
      try {
        const productsData = await getProducts();
        setProducts(productsData);
      } catch (productErr) {
        console.error('Error fetching products:', productErr);
      }
      
      // Obtener suscripciones
      let subscriptionsData: Subscription[] = [];
      try {
        subscriptionsData = await getSubscriptions(userData.id);
      } catch (subErr) {
        console.error('Error fetching subscriptions:', subErr);
        setError('No se pudieron cargar las suscripciones. Por favor, inténtalo de nuevo más tarde.');
      }
      
      // Crear suscripción mock si no hay ninguna
      if (subscriptionsData.length === 0) {
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
        subscriptionsData = [mockSubscription];
      }
      
      setSubscriptions(subscriptionsData);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Error al cargar los datos. Por favor, inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  const handleStatusChange = async (id: string, status: 'active' | 'paused') => {
    try {
      await updateSubscription(id, { status });
      setSubscriptions(prev => 
        prev.map(sub => 
          sub.id === id ? { ...sub, status } : sub
        )
      );
      setSuccessMessage(`Suscripción ${status === 'active' ? 'reactivada' : 'pausada'} exitosamente`);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      console.error('Error updating subscription:', error);
      setError('Error al actualizar la suscripción. Por favor, inténtalo de nuevo.');
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleEdit = (id: string) => {
    router.push(`/customer/subscriptions/edit/${id}`);
  };

  const handleDelete = async (id: string) => {
    if (confirm('¿Estás seguro de que quieres cancelar esta suscripción?')) {
      try {
        await updateSubscription(id, { status: 'cancelled' });
        setSubscriptions(prev => 
          prev.map(sub => 
            sub.id === id ? { ...sub, status: 'cancelled' } : sub
          )
        );
        setSuccessMessage('Suscripción cancelada exitosamente');
        setTimeout(() => setSuccessMessage(null), 3000);
      } catch (error) {
        console.error('Error cancelling subscription:', error);
        setError('Error al cancelar la suscripción. Por favor, inténtalo de nuevo.');
        setTimeout(() => setError(null), 3000);
      }
    }
  };

  const getPlanById = (planId: string) => {
    return plans.find(plan => plan.id === planId);
  };

  const getProductById = (productId: string) => {
    return products.find(product => product.id === productId);
  };

  const handleNewSubscription = () => {
    router.push('/plans');
  };

  if (loading) {
    return (
      <MobileCustomerLayout title="Suscripciones" showFAB={false}>
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
          <div className="w-16 h-16 border-4 border-ewa-blue border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">Cargando suscripciones...</p>
        </div>
      </MobileCustomerLayout>
    );
  }

  return (
    <MobileCustomerLayout 
      title="Suscripciones" 
      showSearch={true}
      onSearch={(query) => console.log('Search:', query)}
      onNewSubscription={handleNewSubscription}
      user={user}
    >
      <div className="p-4 space-y-4">
        {/* Mensajes de estado */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center space-x-3">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {successMessage && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center space-x-3">
            <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
            <p className="text-green-700 text-sm">{successMessage}</p>
          </div>
        )}

        {/* Header de la página */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Mis Suscripciones</h2>
              <p className="text-gray-600 text-sm">
                {subscriptions.length} suscripción{subscriptions.length !== 1 ? 'es' : ''} activa{subscriptions.length !== 1 ? 's' : ''}
              </p>
            </div>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <RefreshCw className={`w-5 h-5 text-gray-600 ${refreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {/* Estadísticas rápidas */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-blue-600">Próxima entrega</span>
              </div>
              <p className="text-lg font-semibold text-blue-900 mt-1">
                {subscriptions.length > 0 
                  ? new Date(subscriptions[0].nextDeliveryDate).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })
                  : 'N/A'
                }
              </p>
            </div>
            
            <div className="bg-green-50 rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <Package className="w-4 h-4 text-green-600" />
                <span className="text-sm text-green-600">Total unidades</span>
              </div>
              <p className="text-lg font-semibold text-green-900 mt-1">
                {subscriptions.reduce((total, sub) => total + sub.quantity, 0)}
              </p>
            </div>
          </div>
        </div>

        {/* Lista de suscripciones */}
        {subscriptions.length > 0 ? (
          <div className="space-y-4">
            {subscriptions.map((subscription) => (
              <MobileSubscriptionCard
                key={subscription.id}
                subscription={subscription}
                planName={getPlanById(subscription.planId)?.name || 'Plan Básico'}
                productName={getProductById(subscription.productId || '')?.name || 'Box Water Premium'}
                onStatusChange={handleStatusChange}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl p-8 text-center shadow-sm">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No tienes suscripciones
            </h3>
            <p className="text-gray-600 mb-6">
              Comienza tu primera suscripción para recibir agua purificada en tu hogar
            </p>
            <button
              onClick={handleNewSubscription}
              className="w-full bg-ewa-blue hover:bg-ewa-dark-blue text-white font-semibold py-3 px-6 rounded-xl transition-colors"
            >
              <Plus className="w-5 h-5 inline mr-2" />
              Crear Suscripción
            </button>
          </div>
        )}

        {/* Información adicional */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-3">¿Necesitas ayuda?</h3>
          <div className="space-y-3 text-sm text-gray-600">
            <div className="flex items-start space-x-3">
              <MapPin className="w-4 h-4 text-ewa-blue mt-0.5 flex-shrink-0" />
              <p>Verifica que tu dirección de entrega esté actualizada</p>
            </div>
            <div className="flex items-start space-x-3">
              <Calendar className="w-4 h-4 text-ewa-blue mt-0.5 flex-shrink-0" />
              <p>Puedes pausar o reactivar tu suscripción en cualquier momento</p>
            </div>
            <div className="flex items-start space-x-3">
              <Package className="w-4 h-4 text-ewa-blue mt-0.5 flex-shrink-0" />
              <p>Contacta a soporte si tienes alguna pregunta</p>
            </div>
          </div>
        </div>
      </div>
    </MobileCustomerLayout>
  );
};

export default SubscriptionsMobilePage;
