import React, { useEffect, useMemo, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import CustomerNav from '../../components/CustomerNav';
import { smartNotificationService } from '@ewa/utils';

const BillingPage: React.FC = () => {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [paymentMethods, setPaymentMethods] = useState<Array<{ id: string; brand: string; last4: string; expMonth: number; expYear: number; isDefault: boolean }>>([]);
  const [showAddMethod, setShowAddMethod] = useState(false);
  const [form, setForm] = useState({ name: '', number: '', exp: '', cvc: '', address: '' });

  useEffect(() => {
    const userJson = localStorage.getItem('ewa_user');
    if (!userJson) {
      router.push('/auth');
      return;
    }
    try {
      const u = JSON.parse(userJson);
      if (u.role !== 'customer') {
        router.push('/auth');
        return;
      }
      setUser(u);
      const saved = localStorage.getItem('ewa_payment_methods');
      if (saved) {
        try { setPaymentMethods(JSON.parse(saved)); } catch {}
      } else {
        const seed = [{ id: 'pm_1', brand: 'Visa', last4: '4242', expMonth: 12, expYear: 2034, isDefault: true }];
        setPaymentMethods(seed);
        localStorage.setItem('ewa_payment_methods', JSON.stringify(seed));
      }
    } catch {
      router.push('/auth');
    }
  }, [router]);

  const invoices = useMemo(() => {
    const now = new Date();
    const fmt = (d: Date) => d.toLocaleDateString('es-PR', { year: 'numeric', month: 'short', day: '2-digit' });
    const make = (idx: number) => {
      const d = new Date(now);
      d.setMonth(d.getMonth() - idx);
      return { id: `INV-${d.getFullYear()}${String(d.getMonth()+1).padStart(2,'0')}${String(d.getDate()).padStart(2,'0')}`, date: fmt(d), amount: 49.99, tax: 49.99 * 0.115, status: idx === 0 ? 'pendiente' : 'pagada' };
    };
    return [make(0), make(1), make(2)];
  }, []);

  const summary = useMemo(() => {
    const ordersCount = 12;
    const subtotal = 12 * 49.99;
    const tax = subtotal * 0.115;
    const total = subtotal + tax;
    const nextInvoiceDate = new Date();
    nextInvoiceDate.setDate(nextInvoiceDate.getDate() + 7);
    return { ordersCount, subtotal, tax, total, nextInvoiceDate: nextInvoiceDate.toLocaleDateString('es-PR', { year:'numeric', month:'short', day:'2-digit' }) };
  }, []);

  const setDefaultMethod = (id: string) => {
    const updated = paymentMethods.map(m => ({ ...m, isDefault: m.id === id }));
    setPaymentMethods(updated);
    localStorage.setItem('ewa_payment_methods', JSON.stringify(updated));
  };

  const handleAddMethod = async () => {
    const last4 = form.number.replace(/\s|-/g, '').slice(-4) || '0000';
    const parts = form.exp.split('/');
    const mm = parseInt((parts[0] || '').trim(), 10);
    const yy = parseInt((parts[1] || '').trim(), 10);
    const newMethod = { id: `pm_${Date.now()}`, brand: 'Visa', last4, expMonth: isFinite(mm as any) ? (mm || 12) : 12, expYear: isFinite(yy as any) ? (2000 + (yy || 34)) : 2034, isDefault: paymentMethods.length === 0 };
    const updated = [...paymentMethods, newMethod];
    setPaymentMethods(updated);
    localStorage.setItem('ewa_payment_methods', JSON.stringify(updated));
    
    // Obtener usuario actual para enviar email
    const userJson = localStorage.getItem('ewa_user');
    let userEmail = 'test@ewa.com'; // fallback
    
    if (userJson) {
      try {
        const userData = JSON.parse(userJson);
        userEmail = userData.email;
        
        // Enviar email de confirmación de método de pago agregado
        try {
          await smartNotificationService.sendPaymentReceipt(userEmail, {
            receiptId: `PM-${Date.now()}`,
            date: new Date().toLocaleDateString('es-PR'),
            amount: '0.00', // No hay cargo por agregar método
            paymentMethod: `Visa •••• ${last4}`,
            description: 'Método de pago agregado exitosamente'
          });
          console.log('Email de confirmación de método de pago enviado exitosamente');
        } catch (emailError) {
          console.error('Error enviando email de confirmación:', emailError);
          // No bloquear la operación si falla el email
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
    
    setShowAddMethod(false);
    setForm({ name: '', number: '', exp: '', cvc: '', address: '' });
  };

  return (
    <>
      <Head>
        <title>Facturación • EWA</title>
      </Head>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
        <header className="bg-white/95 backdrop-blur-sm border-b border-gray-200/60 sticky top-0 z-50 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <div className="flex items-center">
              <div className="mr-8">
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">EWA Box Water</h1>
              </div>
              <CustomerNav />
            </div>
          </div>
        </header>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
          {/* Se ocultan las tarjetas de resumen por no ser necesarias */}

          <div className="bg-white/90 rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 1.343-3 3v1H8a1 1 0 100 2h1v1a3 3 0 006 0v-1h1a1 1 0 100-2h-1v-1c0-1.657-1.343-3-3-3z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Facturación (Stripe)</h2>
                <p className="text-sm text-gray-600">Guarda tu tarjeta de crédito/débito de forma segura</p>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold">Métodos de pago</h3>
                <button onClick={() => setShowAddMethod(true)} className="inline-flex items-center gap-1 px-3 py-1.5 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700">
                  <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"/></svg>
                  Agregar método
                </button>
              </div>
              <ul className="divide-y border rounded">
                {paymentMethods.length === 0 ? (
                  <li className="p-3 text-sm text-gray-500">No hay métodos de pago guardados.</li>
                ) : paymentMethods.map((m) => (
                  <li key={m.id} className="p-3 flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium">{m.brand} •••• {m.last4}</div>
                      <div className="text-xs text-gray-500">Expira {String(m.expMonth).padStart(2,'0')}/{m.expYear}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      {m.isDefault ? (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 border border-green-200">Predeterminado</span>
                      ) : (
                        <button onClick={() => setDefaultMethod(m.id)} className="text-xs px-2 py-0.5 rounded border hover:bg-gray-50">Hacer predeterminado</button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
              <p className="text-xs text-gray-500 mt-2">Datos simulados de Stripe. Solo demostración.</p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold">Facturas</h3>
                <div className="text-xs text-gray-500">Próxima factura: {summary.nextInvoiceDate}</div>
              </div>
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
                      <th className="py-2"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {invoices.map(inv => (
                      <tr key={inv.id}>
                        <td className="py-2">{inv.date}</td>
                        <td className="py-2">{inv.id}</td>
                        <td className="py-2">${inv.amount.toFixed(2)}</td>
                        <td className="py-2">${inv.tax.toFixed(2)}</td>
                        <td className="py-2">${(inv.amount + inv.tax).toFixed(2)}</td>
                        <td className="py-2">
                          <span className={`px-2 py-0.5 rounded-full text-xs ${inv.status === 'pagada' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-800'}`}>{inv.status}</span>
                        </td>
                        <td className="py-2 text-right">
                          <button disabled className="text-xs px-2 py-1 rounded border text-gray-400 cursor-not-allowed">Descargar</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {showAddMethod && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
              <div className="bg-white w-full max-w-md rounded-xl shadow-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold">Agregar método de pago</h4>
                  <button onClick={() => setShowAddMethod(false)} className="text-gray-500 hover:text-gray-700">✕</button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm mb-1">Nombre en la tarjeta</label>
                    <input value={form.name} onChange={e=>setForm({...form, name:e.target.value})} className="w-full border rounded px-3 py-2" placeholder="Nombre y Apellido" />
                  </div>
                  <div>
                    <label className="block text-sm mb-1">Número de tarjeta</label>
                    <input value={form.number} onChange={e=>setForm({...form, number:e.target.value})} className="w-full border rounded px-3 py-2" placeholder="4242 4242 4242 4242" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm mb-1">Expira</label>
                      <input value={form.exp} onChange={e=>setForm({...form, exp:e.target.value})} className="w-full border rounded px-3 py-2" placeholder="MM/YY" />
                    </div>
                    <div>
                      <label className="block text-sm mb-1">CVC</label>
                      <input value={form.cvc} onChange={e=>setForm({...form, cvc:e.target.value})} className="w-full border rounded px-3 py-2" placeholder="CVC" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm mb-1">Dirección de facturación</label>
                    <input value={form.address} onChange={e=>setForm({...form, address:e.target.value})} className="w-full border rounded px-3 py-2" placeholder="Calle y número" />
                  </div>
                </div>
                <div className="flex items-center justify-end gap-2 mt-6">
                  <button onClick={()=>setShowAddMethod(false)} className="px-3 py-2 rounded border">Cancelar</button>
                  <button onClick={handleAddMethod} className="px-3 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">Guardar método</button>
                </div>
                <p className="text-[11px] text-gray-500 mt-3">Demo UI: no se conecta con Stripe.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default BillingPage;


