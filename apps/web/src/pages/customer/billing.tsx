import React, { useEffect, useMemo, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import CustomerLayout from '../../components/CustomerLayout';
import { getCurrentUser } from '@ewa/api-client';
import type { User } from '@ewa/types';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

type PaymentMethodSummary = {
  id: string;
  brand: string;
  last4: string;
  expMonth: number | null;
  expYear: number | null;
  isDefault: boolean;
};

type InvoiceSummary = {
  id: string;
  invoiceNumber: string;
  status: string;
  amount: number;
  taxAmount: number;
  totalAmount: number;
  currency: string;
  dueDate: string;
};

const AddPaymentMethodForm: React.FC<{
  user: User;
  onClose: () => void;
  onAdded: () => void;
}> = ({ user, onClose, onAdded }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [name, setName] = useState(user.name || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setError(null);

    try {
      const setupIntentResponse = await fetch('/api/stripe/setup-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, email: user.email, name: user.name }),
      });

      if (!setupIntentResponse.ok) {
        throw new Error('No se pudo iniciar la configuración de la tarjeta');
      }

      const { clientSecret } = (await setupIntentResponse.json()) as { clientSecret: string };

      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        throw new Error('No se pudo inicializar el formulario de tarjeta');
      }

      const { error: stripeError, setupIntent } = await stripe.confirmCardSetup(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: name || user.name || undefined,
            email: user.email,
          },
        },
      });

      if (stripeError || !setupIntent?.payment_method) {
        throw new Error(stripeError?.message || 'No se pudo guardar el método de pago');
      }

      const addResponse = await fetch('/api/stripe/payment-methods/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          email: user.email,
          name: user.name,
          paymentMethodId: setupIntent.payment_method,
          makeDefault: true,
        }),
      });

      if (!addResponse.ok) {
        throw new Error('No se pudo registrar el método de pago');
      }

      onAdded();
      onClose();
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Ocurrió un error inesperado');
    } finally {
      setLoading(false);
    }
  };

  if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="rounded-lg border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm text-yellow-800">
          Falta configurar NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY para habilitar Stripe.
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm text-gray-600">Nombre en la tarjeta</label>
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-ewa-blue"
          placeholder="Nombre completo"
          required
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm text-gray-600">Detalles de la tarjeta</label>
        <div className="rounded-lg border border-gray-200 px-3 py-2 bg-white focus-within:border-ewa-blue">
          <CardElement options={{ hidePostalCode: true }} />
        </div>
      </div>
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
          {error}
        </div>
      )}
      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onClose}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-600 hover:bg-gray-100"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-ewa-blue px-4 py-2 text-sm font-medium text-white hover:bg-ewa-dark-blue disabled:opacity-60"
        >
          {loading ? 'Guardando…' : 'Guardar método'}
        </button>
      </div>
    </form>
  );
};

const BillingPage: React.FC = () => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethodSummary[]>([]);
  const [invoices, setInvoices] = useState<InvoiceSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddMethod, setShowAddMethod] = useState(false);
  const [settingDefault, setSettingDefault] = useState(false);

  useEffect(() => {
    const current = getCurrentUser();
    if (!current || current.role !== 'customer') {
      router.replace('/auth');
      return;
    }
    setUser(current);
  }, [router]);

  useEffect(() => {
    const loadData = async () => {
      if (!user) return;
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams({
          userId: user.id,
          email: user.email,
          name: user.name || '',
        });

        const [pmRes, invoiceRes] = await Promise.all([
          fetch(`/api/stripe/payment-methods?${params.toString()}`),
          fetch(`/api/stripe/invoices?${params.toString()}`),
        ]);

        if (!pmRes.ok) {
          throw new Error('No se pudieron cargar los métodos de pago');
        }
        if (!invoiceRes.ok) {
          throw new Error('No se pudieron cargar las facturas');
        }

        const pmJson = (await pmRes.json()) as { paymentMethods: PaymentMethodSummary[] };
        const invoiceJson = (await invoiceRes.json()) as { invoices: InvoiceSummary[] };

        setPaymentMethods(pmJson.paymentMethods);
        setInvoices(invoiceJson.invoices);
      } catch (err) {
        console.error(err);
        setError(err instanceof Error ? err.message : 'Ocurrió un error inesperado');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user]);

  const summary = useMemo(() => {
    if (invoices.length === 0) {
      return { subtotal: 0, tax: 0, total: 0 };
    }
    const subtotal = invoices.reduce((acc, invoice) => acc + invoice.amount, 0);
    const tax = invoices.reduce((acc, invoice) => acc + invoice.taxAmount, 0);
    const total = invoices.reduce((acc, invoice) => acc + invoice.totalAmount, 0);
    return { subtotal, tax, total };
  }, [invoices]);

  const handleSetDefault = async (paymentMethodId: string) => {
    if (!user) return;
    setSettingDefault(true);
    setError(null);
    try {
      const response = await fetch('/api/stripe/payment-methods/default', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          email: user.email,
          name: user.name,
          paymentMethodId,
        }),
      });

      if (!response.ok) {
        throw new Error('No se pudo actualizar el método predeterminado');
      }

      const params = new URLSearchParams({ userId: user.id, email: user.email, name: user.name || '' });
      const updated = await fetch(`/api/stripe/payment-methods?${params.toString()}`);
      if (updated.ok) {
        const data = (await updated.json()) as { paymentMethods: PaymentMethodSummary[] };
        setPaymentMethods(data.paymentMethods);
      }
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Ocurrió un error inesperado');
    } finally {
      setSettingDefault(false);
    }
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
        <title>Facturación • EWA</title>
      </Head>

      <CustomerLayout
        user={user}
        title="Facturación"
        description="Administra tus métodos de pago y consulta tus facturas recientes."
        actions={
          <button
            onClick={() => setShowAddMethod(true)}
            className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-3 py-2 text-sm text-white hover:bg-blue-700"
          >
            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" />
            </svg>
            Agregar método
          </button>
        }
      >
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <section className="bg-white/90 rounded-2xl shadow-lg border border-gray-100 p-6 space-y-6">
          <header className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Métodos de pago</h2>
          </header>

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-ewa-blue" />
            </div>
          ) : paymentMethods.length === 0 ? (
            <p className="text-sm text-gray-600">Aún no tienes métodos de pago registrados.</p>
          ) : (
            <ul className="divide-y rounded-lg border border-gray-200">
              {paymentMethods.map((method) => (
                <li key={method.id} className="flex items-center justify-between p-4">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {method.brand} •••• {method.last4}
                    </p>
                    <p className="text-xs text-gray-500">
                      Expira {method.expMonth ? String(method.expMonth).padStart(2, '0') : '--'}/
                      {method.expYear || '--'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {method.isDefault ? (
                      <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">
                        Predeterminado
                      </span>
                    ) : (
                      <button
                        onClick={() => handleSetDefault(method.id)}
                        disabled={settingDefault}
                        className="rounded border border-gray-200 px-3 py-1 text-xs hover:bg-gray-50 disabled:opacity-60"
                      >
                        Usar como predeterminado
                      </button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="bg-white/90 rounded-2xl shadow-lg border border-gray-100 p-6 space-y-6">
          <header className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Historial de facturas</h2>
          </header>

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-ewa-blue" />
            </div>
          ) : invoices.length === 0 ? (
            <p className="text-sm text-gray-600">Aún no hay facturas registradas.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500">
                    <th className="py-2">Fecha</th>
                    <th className="py-2">Factura</th>
                    <th className="py-2">Subtotal</th>
                    <th className="py-2">Impuestos</th>
                    <th className="py-2">Total</th>
                    <th className="py-2">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {invoices.map((invoice) => (
                    <tr key={invoice.id}>
                      <td className="py-2">
                        {new Date(invoice.dueDate).toLocaleDateString('es-PR', {
                          year: 'numeric',
                          month: 'short',
                          day: '2-digit',
                        })}
                      </td>
                      <td className="py-2">{invoice.invoiceNumber}</td>
                      <td className="py-2">${invoice.amount.toFixed(2)}</td>
                      <td className="py-2">${invoice.taxAmount.toFixed(2)}</td>
                      <td className="py-2">${invoice.totalAmount.toFixed(2)}</td>
                      <td className="py-2">
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs ${
                            invoice.status === 'paid'
                              ? 'bg-emerald-100 text-emerald-700'
                              : invoice.status === 'open'
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-gray-200 text-gray-700'
                          }`}
                        >
                          {invoice.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <footer className="grid grid-cols-1 gap-4 border-t border-gray-200 pt-4 text-sm text-gray-600 sm:grid-cols-3">
            <div>
              Subtotal acumulado
              <p className="text-lg font-semibold text-gray-900">${summary.subtotal.toFixed(2)}</p>
            </div>
            <div>
              Impuestos acumulados
              <p className="text-lg font-semibold text-gray-900">${summary.tax.toFixed(2)}</p>
            </div>
            <div>
              Total facturado
              <p className="text-lg font-semibold text-gray-900">${summary.total.toFixed(2)}</p>
            </div>
          </footer>
        </section>

        {showAddMethod && stripePromise && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Agregar método de pago</h3>
                <button onClick={() => setShowAddMethod(false)} className="text-gray-500 hover:text-gray-700">
                  ✕
                </button>
              </div>
              <Elements stripe={stripePromise}>
                <AddPaymentMethodForm
                  user={user}
                  onClose={() => setShowAddMethod(false)}
                  onAdded={() => {
                    const params = new URLSearchParams({ userId: user.id, email: user.email, name: user.name || '' });
                    fetch(`/api/stripe/payment-methods?${params.toString()}`)
                      .then((res) => (res.ok ? res.json() : Promise.reject()))
                      .then((data: { paymentMethods: PaymentMethodSummary[] }) => setPaymentMethods(data.paymentMethods))
                      .catch(() => {});
                  }}
                />
              </Elements>
            </div>
          </div>
        )}
      </CustomerLayout>
    </>
  );
};

export default BillingPage;
