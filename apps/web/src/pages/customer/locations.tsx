import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';

type Location = {
  id: string;
  label: string;
  address: string;
  city: string;
  zip: string;
  isDefault: boolean;
};

const LocationsPage: React.FC = () => {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [locations, setLocations] = useState<Location[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ label: '', address: '', city: '', zip: '' });

  useEffect(() => {
    const userJson = localStorage.getItem('ewa_user');
    if (!userJson) { router.push('/auth'); return; }
    try {
      const u = JSON.parse(userJson);
      if (u.role !== 'customer') { router.push('/auth'); return; }
      setUser(u);
      const saved = localStorage.getItem('ewa_locations');
      if (saved) {
        try { setLocations(JSON.parse(saved)); } catch {}
      } else {
        const seed: Location[] = [
          { id: 'loc_1', label: 'Casa', address: '123 Calle Principal', city: 'San Juan', zip: '00901', isDefault: true },
        ];
        setLocations(seed);
        localStorage.setItem('ewa_locations', JSON.stringify(seed));
      }
    } catch { router.push('/auth'); }
  }, [router]);

  const save = (list: Location[]) => {
    setLocations(list);
    localStorage.setItem('ewa_locations', JSON.stringify(list));
  };

  const addLocation = () => {
    const loc: Location = { id: `loc_${Date.now()}`, label: form.label || 'Ubicación', address: form.address, city: form.city, zip: form.zip, isDefault: locations.length === 0 };
    save([...locations, loc]);
    setShowModal(false);
    setForm({ label: '', address: '', city: '', zip: '' });
  };

  const removeLocation = (id: string) => {
    const list = locations.filter(l => l.id !== id);
    if (!list.some(l => l.isDefault) && list.length > 0) list[0].isDefault = true;
    save(list);
  };

  const setDefault = (id: string) => {
    save(locations.map(l => ({ ...l, isDefault: l.id === id })));
  };

  return (
    <>
      <Head>
        <title>Puntos de entrega • EWA</title>
      </Head>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
        <header className="bg-white/95 backdrop-blur-sm border-b border-gray-200/60 sticky top-0 z-50 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
            <div className="flex items-center">
              <div className="mr-8">
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">EWA Box Water</h1>
              </div>
              <nav className="hidden md:flex space-x-8">
                <a href="/customer/subscriptions" className="relative border-b-2 border-transparent hover:border-blue-300 text-gray-600 hover:text-blue-600 font-medium py-2 transition-all duration-200 group">Suscripciones<div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></div></a>
                <a href="/customer/oneoffs" className="relative border-b-2 border-transparent hover:border-blue-300 text-gray-600 hover:text-blue-600 font-medium py-2 transition-all duration-200 group">Pedidos Únicos<div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></div></a>
                <a href="/customer/profile" className="relative border-b-2 border-transparent hover:border-blue-300 text-gray-600 hover:text-blue-600 font-medium py-2 transition-all duration-200 group">Perfil<div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></div></a>
                <a href="/customer/billing" className="relative border-b-2 border-transparent hover:border-blue-300 text-gray-600 hover:text-blue-600 font-medium py-2 transition-all duration-200 group">Billing<div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></div></a>
                <a href="/customer/locations" className="relative border-b-2 border-blue-600 text-blue-600 font-semibold py-2 transition-all duration-200 group">Puntos de entrega<div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 transform scale-x-100 transition-transform duration-200"></div></a>
              </nav>
            </div>
          </div>
        </header>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="bg-white/90 rounded-2xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Puntos de entrega</h2>
                <p className="text-sm text-gray-600">Administra múltiples direcciones para tus entregas</p>
              </div>
              <button onClick={() => setShowModal(true)} className="inline-flex items-center gap-1 px-3 py-1.5 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700">
                <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"/></svg>
                Añadir dirección
              </button>
            </div>

            <ul className="divide-y border rounded">
              {locations.length === 0 ? (
                <li className="p-4 text-sm text-gray-500">Sin direcciones. Añade tu primer punto de entrega.</li>
              ) : (
                locations.map(loc => (
                  <li key={loc.id} className="p-4 flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900">{loc.label} {loc.isDefault && <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 border border-green-200">Predeterminado</span>}</div>
                      <div className="text-sm text-gray-600">{loc.address}, {loc.city} {loc.zip}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      {!loc.isDefault && (
                        <button onClick={() => setDefault(loc.id)} className="text-xs px-2 py-1 rounded border hover:bg-gray-50">Hacer predeterminado</button>
                      )}
                      <button onClick={() => removeLocation(loc.id)} className="text-xs px-2 py-1 rounded border border-red-300 text-red-600 hover:bg-red-50">Eliminar</button>
                    </div>
                  </li>
                ))
              )}
            </ul>
            <p className="text-xs text-gray-500 mt-2">Se guardan localmente para la demo.</p>
          </div>
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white w-full max-w-md rounded-xl shadow-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold">Nueva dirección</h4>
                <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700">✕</button>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm mb-1">Etiqueta</label>
                  <input value={form.label} onChange={e=>setForm({...form, label:e.target.value})} className="w-full border rounded px-3 py-2" placeholder="Casa, Oficina, etc." />
                </div>
                <div>
                  <label className="block text-sm mb-1">Dirección</label>
                  <input value={form.address} onChange={e=>setForm({...form, address:e.target.value})} className="w-full border rounded px-3 py-2" placeholder="Calle y número" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm mb-1">Ciudad</label>
                    <input value={form.city} onChange={e=>setForm({...form, city:e.target.value})} className="w-full border rounded px-3 py-2" placeholder="Ciudad" />
                  </div>
                  <div>
                    <label className="block text-sm mb-1">Código postal</label>
                    <input value={form.zip} onChange={e=>setForm({...form, zip:e.target.value})} className="w-full border rounded px-3 py-2" placeholder="00901" />
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-end gap-2 mt-6">
                <button onClick={()=>setShowModal(false)} className="px-3 py-2 rounded border">Cancelar</button>
                <button onClick={addLocation} className="px-3 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">Guardar</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default LocationsPage;


