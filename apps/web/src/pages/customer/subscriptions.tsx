import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import {
  getSubscriptions,
  getPlans,
  getProducts,
  updateSubscription,
  getCurrentUser,
} from '@ewa/api-client';
import { Subscription, Plan, Product, User } from '@ewa/types';
import SimpleMapBox from '../../components/SimpleMapBox';
import CustomerLayout from '../../components/CustomerLayout';

const SubscriptionsPage = () => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<
    { id: string; text: string; sender: 'user' | 'support'; timestamp: Date }[]
  >([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser || currentUser.role !== 'customer') {
      router.replace('/auth');
      return;
    }

    setUser(currentUser);

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [plansData, productsData, subscriptionsData] = await Promise.all([
          getPlans().catch((planErr) => {
            console.error('Error fetching plans:', planErr);
            return [] as Plan[];
          }),
          getProducts().catch((productsErr) => {
            console.error('Error fetching products:', productsErr);
            return [] as Product[];
          }),
          getSubscriptions(currentUser.id),
        ]);

        setPlans(plansData);
        setProducts(productsData);
        setSubscriptions(subscriptionsData);
      } catch (fetchErr) {
        console.error('Error loading subscriptions:', fetchErr);
        setError('No se pudieron cargar tus datos. Inténtalo nuevamente.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const getProductById = (productId: string): Product | undefined =>
    products.find((product) => product.id === productId);

  const getPlanById = (planId: string): Plan | undefined =>
    plans.find((plan) => plan.id === planId);

  const getFrequencyLabel = (frequency: string): string => {
    switch (frequency) {
      case 'weekly':
        return 'Entrega Semanal';
      case 'biweekly':
        return 'Entrega Quincenal';
      case 'monthly':
        return 'Entrega Mensual';
      default:
        return 'Entrega personalizada';
    }
  };

  const handleStatusChange = async (
    subscriptionId: string,
    newStatus: 'active' | 'paused',
  ) => {
    try {
      await updateSubscription(subscriptionId, { status: newStatus });
      setSubscriptions((prev) =>
        prev.map((subscription) =>
          subscription.id === subscriptionId
            ? { ...subscription, status: newStatus }
            : subscription,
        ),
      );
      setSuccessMessage(
        `Suscripción ${
          newStatus === 'active' ? 'activada' : 'pausada'
        } correctamente.`,
      );
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (updateError) {
      console.error('Error updating subscription:', updateError);
      setError(
        `No se pudo ${
          newStatus === 'active' ? 'activar' : 'pausar'
        } la suscripción. Intenta más tarde.`,
      );
    }
  };

  const handleSendMessage = (event: React.FormEvent) => {
    event.preventDefault();
    if (!currentMessage.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      text: currentMessage.trim(),
      sender: 'user' as const,
      timestamp: new Date(),
    };

    setChatMessages((prev) => [...prev, userMessage]);
    setCurrentMessage('');
    setIsTyping(true);

    setTimeout(() => {
      const supportMessage = {
        id: `${Date.now() + 1}`,
        text: 'Gracias por escribirnos. Nuestro equipo te responderá pronto.',
        sender: 'support' as const,
        timestamp: new Date(),
      };
      setChatMessages((prev) => [...prev, supportMessage]);
      setIsTyping(false);
    }, 1500);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-ewa-blue" />
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Suscripciones - EWA Box Water</title>
        <meta name="description" content="Gestiona tus suscripciones de EWA Box Water" />
      </Head>

      <CustomerLayout
        user={user}
        title="Tus suscripciones"
        description="Consulta y administra tu plan de entregas de agua."
        actions={
          successMessage ? (
            <div className="bg-green-50 text-green-700 border border-green-200 rounded-lg px-4 py-2 text-sm">
              {successMessage}
            </div>
          ) : undefined
        }
      >
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3">
            {error}
          </div>
        )}

        {loading ? (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-ewa-blue mx-auto" />
            <p className="mt-4 text-gray-600">Cargando tus suscripciones…</p>
          </div>
        ) : subscriptions.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Aún no tienes suscripciones activas</h3>
            <p className="text-gray-600">
              Cuando actives un plan, podrás visualizar el estado y la información de tus entregas aquí.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {subscriptions.map((subscription) => {
              const plan = getPlanById(subscription.planId);
              const product = getProductById(subscription.productId ?? '');
              return (
                <div
                  key={subscription.id}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">
                        {plan?.name || 'Suscripción'}
                      </h3>
                      <p className="text-gray-600 mt-1">
                        {getFrequencyLabel(subscription.frequency)}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleStatusChange(subscription.id, 'active')}
                        disabled={subscription.status === 'active'}
                        className={`rounded-lg px-3 py-2 text-sm font-medium border transition ${
                          subscription.status === 'active'
                            ? 'bg-ewa-blue text-white border-ewa-blue cursor-default'
                            : 'bg-white text-ewa-blue border-ewa-blue hover:bg-ewa-blue hover:text-white'
                        }`}
                      >
                        Activar
                      </button>
                      <button
                        onClick={() => handleStatusChange(subscription.id, 'paused')}
                        disabled={subscription.status === 'paused'}
                        className={`rounded-lg px-3 py-2 text-sm font-medium border transition ${
                          subscription.status === 'paused'
                            ? 'bg-amber-500 text-white border-amber-500 cursor-default'
                            : 'bg-white text-amber-600 border-amber-500 hover:bg-amber-500 hover:text-white'
                        }`}
                      >
                        Pausar
                      </button>
                    </div>
                  </div>

                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-500">Próxima entrega</p>
                        <p className="text-lg font-medium text-gray-900">
                          {subscription.nextDeliveryDate
                            ? new Date(subscription.nextDeliveryDate).toLocaleDateString()
                            : 'Pendiente'}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Dirección</p>
                        <p className="text-gray-900">{subscription.address || 'Sin dirección registrada'}</p>
                      </div>
                      <div className="flex flex-wrap gap-3">
                        <div className="rounded-lg bg-blue-50 text-blue-700 px-3 py-1 text-sm font-medium">
                          {subscription.status === 'active' ? 'Activa' : 'Pausada'}
                        </div>
                        {product && (
                          <div className="rounded-lg bg-slate-100 text-slate-700 px-3 py-1 text-sm">
                            {product.name}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="rounded-xl overflow-hidden border border-gray-100">
                      <SimpleMapBox
                        markers={[
                          {
                            id: subscription.id,
                            latitude: subscription?.deliveryAddress?.lat ?? 18.4655,
                            longitude: subscription?.deliveryAddress?.lng ?? -66.1057,
                            title: plan?.name || 'Entrega',
                            description: subscription.address,
                          },
                        ]}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="fixed bottom-6 right-6">
          <button
            onClick={() => setIsChatOpen((prev) => !prev)}
            className="bg-ewa-blue text-white rounded-full shadow-lg w-12 h-12 flex items-center justify-center hover:bg-ewa-dark-blue transition"
            aria-label="Abrir chat de soporte"
          >
            {isChatOpen ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.86 9.86 0 01-4.255-.938L3 20l1.154-2.885A8.58 8.58 0 013 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            )}
          </button>

          {isChatOpen && (
            <div className="mt-3 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
              <div className="bg-ewa-blue text-white px-4 py-3">
                <h3 className="font-medium">Soporte EWA</h3>
                <p className="text-xs text-ewa-light-blue">Siempre listos para ayudarte</p>
              </div>
              <div className="max-h-72 overflow-y-auto p-4 space-y-3">
                {chatMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`px-3 py-2 rounded-xl text-sm shadow-sm ${
                        message.sender === 'user'
                          ? 'bg-ewa-blue text-white rounded-br-none'
                          : 'bg-gray-100 text-gray-800 rounded-bl-none'
                      }`}
                    >
                      <p>{message.text}</p>
                      <p className="text-[10px] opacity-70 mt-1">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span className="w-2 h-2 bg-ewa-blue rounded-full animate-pulse" />
                    <span>Soporte está escribiendo…</span>
                  </div>
                )}
              </div>
              <form onSubmit={handleSendMessage} className="border-t border-gray-200 p-3 bg-gray-50">
                <div className="flex gap-2">
                  <input
                    value={currentMessage}
                    onChange={(event) => setCurrentMessage(event.target.value)}
                    placeholder="Escribe tu mensaje…"
                    className="flex-1 rounded-xl border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ewa-blue"
                  />
                  <button
                    type="submit"
                    className="bg-ewa-blue text-white rounded-xl px-3 py-2 text-sm hover:bg-ewa-dark-blue"
                  >
                    Enviar
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </CustomerLayout>
    </>
  );
};

export default SubscriptionsPage;
