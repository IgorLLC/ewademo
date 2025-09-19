import React, { useEffect, useMemo, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import CustomerLayout from '../../components/CustomerLayout';
import { getCurrentUser, getSubscriptions } from '@ewa/api-client';
import { Subscription, User } from '@ewa/types';

const LocationsPage: React.FC = () => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const current = getCurrentUser();
    if (!current || current.role !== 'customer') {
      router.replace('/auth');
      return;
    }

    setUser(current);

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const subs = await getSubscriptions(current.id);
        setSubscriptions(subs);
      } catch (err) {
        console.error('Error fetching delivery locations:', err);
        setError('No pudimos cargar tus direcciones de entrega. Intenta nuevamente.');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [router]);

  const uniqueAddresses = useMemo(() => {
    const map = new Map<string, { address: string; frequency: string; nextDelivery?: string }>();
    subscriptions.forEach((subscription) => {
      if (!subscription.address) return;
      map.set(subscription.address, {
        address: subscription.address,
        frequency: subscription.frequency,
        nextDelivery: subscription.nextDeliveryDate,
      });
    });
    return Array.from(map.values());
  }, [subscriptions]);

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
        <title>Puntos de entrega • EWA</title>
      </Head>

      <CustomerLayout
        user={user}
        title="Puntos de entrega"
        description="Direcciones actualmente vinculadas a tus suscripciones activas."
      >
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-8 bg-white rounded-xl border border-gray-100 shadow-sm">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-ewa-blue" />
          </div>
        ) : uniqueAddresses.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Sin direcciones registradas</h3>
            <p className="text-gray-600">
              Cuando configures una suscripción, verás aquí la dirección de entrega.
            </p>
          </div>
        ) : (
          <ul className="space-y-4">
            {uniqueAddresses.map((entry) => (
              <li key={entry.address} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                <h3 className="font-semibold text-gray-900">{entry.address}</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Frecuencia: {entry.frequency === 'weekly'
                    ? 'Semanal'
                    : entry.frequency === 'biweekly'
                    ? 'Quincenal'
                    : entry.frequency === 'monthly'
                    ? 'Mensual'
                    : 'Personalizada'}
                </p>
                {entry.nextDelivery && (
                  <p className="text-xs text-gray-500 mt-1">
                    Próxima entrega:{' '}
                    {new Date(entry.nextDelivery).toLocaleDateString('es-PR', {
                      year: 'numeric',
                      month: 'short',
                      day: '2-digit',
                    })}
                  </p>
                )}
              </li>
            ))}
          </ul>
        )}

        <p className="mt-6 text-xs text-gray-500">
          ¿Necesitas agregar o cambiar una dirección? Escríbenos a soporte@ewaboxwater.com y te ayudaremos.
        </p>
      </CustomerLayout>
    </>
  );
};

export default LocationsPage;
