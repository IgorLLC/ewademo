import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { changePassword, getCurrentUser, updateUser } from '@ewa/api-client';

const AdminProfilePage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [userId, setUserId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [pwOld, setPwOld] = useState('');
  const [pwNew, setPwNew] = useState('');
  const [pwConfirm, setPwConfirm] = useState('');
  const [pwSaving, setPwSaving] = useState(false);
  const [pwSaved, setPwSaved] = useState(false);
  const [pwError, setPwError] = useState<string | null>(null);
  const [pwEditing, setPwEditing] = useState(false);

  useEffect(() => {
    const current = getCurrentUser();
    if (current) {
      setUserId(current.id);
      setName(current.name || '');
      setEmail(current.email || '');
    }
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    try {
      if (!userId) return;
      const updated = await updateUser(userId, { name, email });
      const stored = getCurrentUser();
      if (stored && typeof window !== 'undefined') {
        const merged = { ...stored, ...updated };
        localStorage.setItem('ewa_user', JSON.stringify(merged));
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout title="Perfil del Administrador" description="Editar información del administrador y seguridad" currentPage="dashboard">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Información básica */}
        <div className="max-w-xl">
          <form onSubmit={handleSave} className="bg-white p-5 rounded-lg border shadow-sm space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-ewa-light-blue text-ewa-dark-blue flex items-center justify-center border border-gray-200 font-semibold text-sm">
                {name ? name.split(' ').slice(0,2).map(s=>s[0]).join('').toUpperCase() : 'U'}
              </div>
              <div>
                <h2 className="text-base font-semibold text-gray-900">Información de perfil</h2>
                <p className="text-xs text-gray-500">Actualiza tu nombre y correo</p>
              </div>
            </div>
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

        {/* Seguridad: Cambiar contraseña */}
        <div className="max-w-xl">
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              setPwError(null);
              setPwSaved(false);
              if (!pwOld || !pwNew || !pwConfirm) {
                setPwError('Completa todos los campos');
                return;
              }
              if (pwNew !== pwConfirm) {
                setPwError('La nueva contraseña y su confirmación no coinciden');
                return;
              }
              if (pwNew.length < 8) {
                setPwError('La nueva contraseña debe tener al menos 8 caracteres');
                return;
              }
              if (pwNew === pwOld) {
                setPwError('La nueva contraseña no debe ser igual a la anterior');
                return;
              }
              setPwSaving(true);
              try {
                await changePassword(email, pwOld, pwNew);
                setPwSaved(true);
                setPwOld('');
                setPwNew('');
                setPwConfirm('');
                setPwEditing(false);
                setTimeout(() => setPwSaved(false), 2500);
              } catch (err) {
                const message = err instanceof Error ? err.message : 'No se pudo cambiar la contraseña';
                setPwError(message);
              } finally {
                setPwSaving(false);
              }
            }}
            className="bg-white p-5 rounded-lg border shadow-sm space-y-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gray-100 text-gray-700 flex items-center justify-center border border-gray-200">
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5 8a5 5 0 1110 0v1h.5A1.5 1.5 0 0117 10.5v6A1.5 1.5 0 0115.5 18h-11A1.5 1.5 0 013 16.5v-6A1.5 1.5 0 014.5 9H5V8zm2 1V8a3 3 0 116 0v1H7z" clipRule="evenodd"/></svg>
              </div>
              <div>
                <h2 className="text-base font-semibold text-gray-900">Seguridad</h2>
                <p className="text-xs text-gray-500">Cambia tu contraseña con buenas prácticas</p>
              </div>
            </div>
            {!pwEditing ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between border rounded-md p-3 bg-gray-50">
                  <div>
                    <div className="text-sm text-gray-600">Contraseña</div>
                    <div className="text-lg tracking-widest select-none">••••••••••</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => { setPwEditing(true); setPwError(null); }}
                    className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm hover:bg-gray-50"
                  >
                    Editar
                  </button>
                </div>
                <p className="text-xs text-gray-500">Consejo: Usa una combinación de letras, números y símbolos.</p>
              </div>
            ) : (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Contraseña actual</label>
                  <input
                    type="password"
                    value={pwOld}
                    onChange={(e) => setPwOld(e.target.value)}
                    className="mt-1 w-full rounded-md border-gray-300 focus:ring-ewa-blue focus:border-ewa-blue"
                    placeholder="••••••••"
                    required
                    autoComplete="current-password"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nueva contraseña</label>
                  <input
                    type="password"
                    value={pwNew}
                    onChange={(e) => setPwNew(e.target.value)}
                    className="mt-1 w-full rounded-md border-gray-300 focus:ring-ewa-blue focus:border-ewa-blue"
                    placeholder="Mínimo 8 caracteres"
                    required
                    autoComplete="new-password"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Confirmar nueva contraseña</label>
                  <input
                    type="password"
                    value={pwConfirm}
                    onChange={(e) => setPwConfirm(e.target.value)}
                    className="mt-1 w-full rounded-md border-gray-300 focus:ring-ewa-blue focus:border-ewa-blue"
                    placeholder="Repite la nueva contraseña"
                    required
                    autoComplete="new-password"
                  />
                </div>
                {pwError && <div className="text-sm text-red-600">{pwError}</div>}
                <div className="flex items-center gap-3">
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 rounded-md bg-gray-800 text-white px-4 py-2 text-sm hover:bg-black disabled:opacity-60"
                    disabled={pwSaving}
                  >
                    {pwSaving ? 'Guardando…' : 'Guardar contraseña'}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setPwEditing(false); setPwOld(''); setPwNew(''); setPwConfirm(''); setPwError(null); }}
                    className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm hover:bg-gray-50"
                    disabled={pwSaving}
                  >
                    Cancelar
                  </button>
                  {pwSaved && <span className="text-sm text-green-700">Contraseña actualizada</span>}
                </div>
              </>
            )}
          </form>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminProfilePage;
