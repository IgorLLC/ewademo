import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import CustomerLayout from '../../components/CustomerLayout';
import {
  changePassword,
  getCurrentUser,
  getUserById,
  updateUser,
} from '@ewa/api-client';
import type { User } from '@ewa/types';

const ProfilePage = () => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zip: '',
    deliveryInstructions: '',
    marketingOptIn: false,
  });
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [saving, setSaving] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ current: '', next: '', confirm: '' });
  const [passwordError, setPasswordError] = useState<string | null>(null);

  useEffect(() => {
    const current = getCurrentUser();
    if (!current || current.role !== 'customer') {
      router.replace('/auth');
      return;
    }

    const loadProfile = async () => {
      try {
        const freshUser = await getUserById(current.id);
        setUser(freshUser);
        setFormState({
          name: freshUser.name || '',
          email: freshUser.email || '',
          phone: freshUser.phone || '',
          street: freshUser.address?.street || '',
          city: freshUser.address?.city || '',
          state: freshUser.address?.state || '',
          zip: freshUser.address?.zip || '',
          deliveryInstructions: freshUser.address?.instructions || '',
          marketingOptIn: Boolean(
            freshUser.preferences?.communicationPreference === 'email' ||
              freshUser.preferences?.communicationPreference === 'both',
          ),
        });
      } catch (err) {
        console.error('Error loading profile:', err);
        setStatus({ type: 'error', message: 'No pudimos cargar tu perfil. Intenta más tarde.' });
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [router]);

  const handleFieldChange = (field: keyof typeof formState, value: string | boolean) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveProfile = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!user) return;

    setSaving(true);
    setStatus(null);
    try {
      const updated = await updateUser(user.id, {
        name: formState.name.trim(),
        phone: formState.phone.trim() || undefined,
        address: formState.street
          ? {
              street: formState.street,
              city: formState.city,
              state: formState.state,
              zip: formState.zip,
              country: user.address?.country || 'PR',
              instructions: formState.deliveryInstructions || undefined,
            }
          : undefined,
        preferences: {
          communicationPreference: formState.marketingOptIn ? 'email' : 'sms',
          deliveryPreference: user.preferences?.deliveryPreference || 'home_delivery',
          timeSlotPreference: user.preferences?.timeSlotPreference || 'morning',
        },
      });
      setUser(updated);
      setStatus({ type: 'success', message: 'Perfil actualizado correctamente.' });
    } catch (err) {
      console.error('Error updating profile:', err);
      setStatus({ type: 'error', message: 'No se pudo guardar el perfil. Intenta más tarde.' });
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!formState.email) return;

    if (passwordForm.next !== passwordForm.confirm) {
      setPasswordError('Las contraseñas nuevas no coinciden.');
      return;
    }

    setPasswordError(null);
    setPasswordSaving(true);
    setStatus(null);
    try {
      await changePassword(formState.email, passwordForm.current, passwordForm.next);
      setPasswordForm({ current: '', next: '', confirm: '' });
      setStatus({ type: 'success', message: 'Contraseña actualizada correctamente.' });
    } catch (err) {
      console.error('Error changing password:', err);
      setPasswordError('No pudimos actualizar tu contraseña. Verifica tus datos e inténtalo nuevamente.');
    } finally {
      setPasswordSaving(false);
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-ewa-blue" />
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Perfil - EWA Box Water</title>
        <meta name="description" content="Actualiza tu información personal y preferencias." />
      </Head>

      <CustomerLayout
        user={user}
        title="Tu perfil"
        description="Mantén tus datos y preferencias al día para brindarte un mejor servicio."
        actions={
          status && (
            <div
              className={`rounded-lg border px-4 py-2 text-sm ${
                status.type === 'success'
                  ? 'bg-green-50 border-green-200 text-green-700'
                  : 'bg-red-50 border-red-200 text-red-700'
              }`}
            >
              {status.message}
            </div>
          )
        }
      >
        <form onSubmit={handleSaveProfile} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <label className="flex flex-col gap-1 text-sm text-gray-600">
              Nombre completo
              <input
                value={formState.name}
                onChange={(event) => handleFieldChange('name', event.target.value)}
                className="rounded-lg border border-gray-200 px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-ewa-blue"
                required
              />
            </label>
            <label className="flex flex-col gap-1 text-sm text-gray-600">
              Correo electrónico
              <input
                value={formState.email}
                disabled
                className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-base text-gray-500"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm text-gray-600">
              Teléfono
              <input
                value={formState.phone}
                onChange={(event) => handleFieldChange('phone', event.target.value)}
                className="rounded-lg border border-gray-200 px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-ewa-blue"
              />
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <label className="flex flex-col gap-1 text-sm text-gray-600">
              Dirección
              <input
                value={formState.street}
                onChange={(event) => handleFieldChange('street', event.target.value)}
                className="rounded-lg border border-gray-200 px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-ewa-blue"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm text-gray-600">
              Ciudad
              <input
                value={formState.city}
                onChange={(event) => handleFieldChange('city', event.target.value)}
                className="rounded-lg border border-gray-200 px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-ewa-blue"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm text-gray-600">
              Estado / Región
              <input
                value={formState.state}
                onChange={(event) => handleFieldChange('state', event.target.value)}
                className="rounded-lg border border-gray-200 px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-ewa-blue"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm text-gray-600">
              Código Postal
              <input
                value={formState.zip}
                onChange={(event) => handleFieldChange('zip', event.target.value)}
                className="rounded-lg border border-gray-200 px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-ewa-blue"
              />
            </label>
          </div>

          <label className="flex flex-col gap-1 text-sm text-gray-600">
            Instrucciones de entrega
            <textarea
              value={formState.deliveryInstructions}
              onChange={(event) => handleFieldChange('deliveryInstructions', event.target.value)}
              rows={3}
              className="rounded-lg border border-gray-200 px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-ewa-blue"
              placeholder="Ej.: Dejar en la entrada principal, timbre dañado"
            />
          </label>

          <label className="inline-flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={formState.marketingOptIn}
              onChange={(event) => handleFieldChange('marketingOptIn', event.target.checked)}
              className="rounded border-gray-300 text-ewa-blue focus:ring-ewa-blue"
            />
            Deseo recibir actualizaciones y promociones por correo electrónico.
          </label>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-ewa-blue px-4 py-2 text-white font-medium hover:bg-ewa-dark-blue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ewa-blue disabled:opacity-60"
            >
              {saving ? 'Guardando…' : 'Guardar cambios'}
            </button>
          </div>
        </form>

        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Seguridad</h2>
            <p className="text-sm text-gray-600">Actualiza tu contraseña cuando lo necesites.</p>
          </div>

          <form onSubmit={handleChangePassword} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <label className="flex flex-col gap-1 text-sm text-gray-600">
              Contraseña actual
              <input
                type="password"
                value={passwordForm.current}
                onChange={(event) => setPasswordForm((prev) => ({ ...prev, current: event.target.value }))}
                className="rounded-lg border border-gray-200 px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-ewa-blue"
                required
              />
            </label>
            <label className="flex flex-col gap-1 text-sm text-gray-600">
              Nueva contraseña
              <input
                type="password"
                value={passwordForm.next}
                onChange={(event) => setPasswordForm((prev) => ({ ...prev, next: event.target.value }))}
                className="rounded-lg border border-gray-200 px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-ewa-blue"
                required
              />
            </label>
            <label className="flex flex-col gap-1 text-sm text-gray-600">
              Confirmar nueva contraseña
              <input
                type="password"
                value={passwordForm.confirm}
                onChange={(event) => setPasswordForm((prev) => ({ ...prev, confirm: event.target.value }))}
                className="rounded-lg border border-gray-200 px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-ewa-blue"
                required
              />
            </label>

            <div className="md:col-span-2 space-y-3">
              {passwordError && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
                  {passwordError}
                </div>
              )}
              <button
                type="submit"
                disabled={passwordSaving}
                className="rounded-lg bg-ewa-blue px-4 py-2 text-white font-medium hover:bg-ewa-dark-blue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ewa-blue disabled:opacity-60"
              >
                {passwordSaving ? 'Actualizando…' : 'Actualizar contraseña'}
              </button>
            </div>
          </form>
        </section>
      </CustomerLayout>
    </>
  );
};

export default ProfilePage;
