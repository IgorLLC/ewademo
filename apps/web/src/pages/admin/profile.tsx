import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { readSessionFromCookie } from '../../lib/session';

const AdminProfilePage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const u = readSessionFromCookie();
    if (u) {
      setName(u.name || '');
      setEmail(u.email);
    } else {
      try {
        const json = localStorage.getItem('ewa_user');
        if (json) {
          const lu = JSON.parse(json);
          setName(lu.name || '');
          setEmail(lu.email || '');
        }
      } catch {}
    }
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    try {
      // Demo: solo persiste en localStorage, en real enviaría a API
      const json = localStorage.getItem('ewa_user');
      if (json) {
        const lu = JSON.parse(json);
        lu.name = name;
        lu.email = email;
        localStorage.setItem('ewa_user', JSON.stringify(lu));
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout title="Perfil del Administrador" description="Editar información del administrador" currentPage="dashboard">
      <div className="max-w-xl">
        <form onSubmit={handleSave} className="bg-white p-5 rounded-lg border shadow-sm space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nombre</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 w-full rounded-md border-gray-300 focus:ring-ewa-blue focus:border-ewa-blue"
              placeholder="Tu nombre"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-md border-gray-300 focus:ring-ewa-blue focus:border-ewa-blue"
              placeholder="tu@email.com"
              required
            />
          </div>
          <div className="flex items-center gap-3">
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-md bg-ewa-blue text-white px-4 py-2 text-sm hover:bg-ewa-dark-blue disabled:opacity-60"
              disabled={saving}
            >
              {saving ? 'Guardando…' : 'Guardar cambios'}
            </button>
            {saved && <span className="text-sm text-green-700">Cambios guardados</span>}
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default AdminProfilePage;


