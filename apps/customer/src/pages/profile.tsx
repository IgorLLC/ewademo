import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { Button } from '@ewa/ui';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
}

interface Address {
  id: string;
  label: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  isDefault: boolean;
}

interface PaymentMethod {
  id: string;
  type: 'credit' | 'debit' | 'paypal';
  last4: string;
  brand: string;
  isDefault: boolean;
}

interface DeliveryPreferences {
  timeSlot: string;
  instructions: string;
  frequency: 'weekly' | 'biweekly' | 'monthly';
  contactMethod: 'email' | 'sms' | 'both';
}

interface NotificationSettings {
  orderUpdates: boolean;
  deliveryReminders: boolean;
  promotions: boolean;
  productUpdates: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
}

interface PrivacySettings {
  profileVisibility: 'public' | 'private';
  dataSharing: boolean;
  analytics: boolean;
  thirdPartyMarketing: boolean;
}

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState('personal');
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Estados para cada sección
  const [profile, setProfile] = useState<UserProfile>({
    id: 'u1',
    name: '',
    email: '',
    phone: ''
  });

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [deliveryPrefs, setDeliveryPrefs] = useState<DeliveryPreferences>({
    timeSlot: 'morning',
    instructions: '',
    frequency: 'weekly',
    contactMethod: 'email'
  });

  const [notifications, setNotifications] = useState<NotificationSettings>({
    orderUpdates: true,
    deliveryReminders: true,
    promotions: false,
    productUpdates: true,
    emailNotifications: true,
    smsNotifications: false
  });

  const [privacy, setPrivacy] = useState<PrivacySettings>({
    profileVisibility: 'private',
    dataSharing: false,
    analytics: true,
    thirdPartyMarketing: false
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [editingPersonal, setEditingPersonal] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Obtener datos del usuario desde localStorage
        const userData = JSON.parse(localStorage.getItem('ewa_user') || '{}');
        
        setProfile({
          id: userData.id || 'u1',
          name: userData.name || '',
          email: userData.email || '',
          phone: userData.phone || ''
        });

        // Datos mock para demo
        setAddresses([
          {
            id: 'addr1',
            label: 'Casa',
            address: '123 Calle Principal',
            city: 'San Juan',
            state: 'PR',
            zipCode: '00901',
            isDefault: true
          },
          {
            id: 'addr2',
            label: 'Trabajo',
            address: '456 Ave Comercial',
            city: 'Bayamón',
            state: 'PR',
            zipCode: '00961',
            isDefault: false
          }
        ]);

        setPaymentMethods([
          {
            id: 'pm1',
            type: 'credit',
            last4: '4242',
            brand: 'Visa',
            isDefault: true
          },
          {
            id: 'pm2',
            type: 'paypal',
            last4: '',
            brand: 'PayPal',
            isDefault: false
          }
        ]);

      } catch (error) {
        console.error('Error loading user data:', error);
        setErrorMessage('Error cargando los datos del perfil');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const showSuccess = (message: string) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const showError = (message: string) => {
    setErrorMessage(message);
    setTimeout(() => setErrorMessage(null), 3000);
  };

  const handlePersonalSave = () => {
    // Actualizar localStorage
    const updatedUser = { ...JSON.parse(localStorage.getItem('ewa_user') || '{}'), ...profile };
    localStorage.setItem('ewa_user', JSON.stringify(updatedUser));
    
    setEditingPersonal(false);
    showSuccess('Información personal actualizada correctamente');
  };

  const handlePasswordChange = () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showError('Las contraseñas no coinciden');
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      showError('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    
    // Simular cambio de contraseña
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    showSuccess('Contraseña actualizada correctamente');
  };

  const handleAddressToggleDefault = (id: string) => {
    setAddresses(addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === id
    })));
    showSuccess('Dirección predeterminada actualizada');
  };

  const handlePaymentToggleDefault = (id: string) => {
    setPaymentMethods(paymentMethods.map(pm => ({
      ...pm,
      isDefault: pm.id === id
    })));
    showSuccess('Método de pago predeterminado actualizado');
  };

  const handleNotificationChange = (key: keyof NotificationSettings) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handlePrivacyChange = (key: keyof PrivacySettings, value: boolean | string) => {
    setPrivacy(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const tabs = [
    { id: 'personal', name: 'Información Personal', icon: '👤' },
    { id: 'addresses', name: 'Direcciones', icon: '📍' },
    { id: 'payment', name: 'Métodos de Pago', icon: '💳' },
    { id: 'delivery', name: 'Preferencias de Entrega', icon: '🚚' },
    { id: 'notifications', name: 'Notificaciones', icon: '🔔' },
    { id: 'security', name: 'Seguridad', icon: '🔒' },
    { id: 'privacy', name: 'Privacidad', icon: '🛡️' }
  ];

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Mi Perfil</h1>
            <p className="mt-2 text-gray-600">Gestiona tu información personal y preferencias</p>
          </div>

          {/* Mensajes de éxito y error */}
          {successMessage && (
            <div className="mb-6 bg-green-50 border-l-4 border-green-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-green-700">{successMessage}</p>
                </div>
              </div>
            </div>
          )}

          {errorMessage && (
            <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{errorMessage}</p>
                </div>
              </div>
            </div>
          )}

          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            {/* Tabs de navegación */}
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex flex-wrap">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <span>{tab.icon}</span>
                    <span className="hidden sm:block">{tab.name}</span>
                  </button>
                ))}
              </nav>
            </div>

            {/* Contenido de las tabs */}
            <div className="p-6">
              {/* Información Personal */}
              {activeTab === 'personal' && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">Información Personal</h3>
                      <p className="text-sm text-gray-500">Actualiza tu información básica</p>
                    </div>
                    <Button
                      onClick={() => editingPersonal ? handlePersonalSave() : setEditingPersonal(true)}
                      variant={editingPersonal ? "primary" : "secondary"}
                    >
                      {editingPersonal ? 'Guardar' : 'Editar'}
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nombre completo
                      </label>
                      {editingPersonal ? (
                        <input
                          type="text"
                          value={profile.name}
                          onChange={(e) => setProfile({...profile, name: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        <p className="text-gray-900">{profile.name}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Correo electrónico
                      </label>
                      {editingPersonal ? (
                        <input
                          type="email"
                          value={profile.email}
                          onChange={(e) => setProfile({...profile, email: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        <p className="text-gray-900">{profile.email}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Teléfono
                      </label>
                      {editingPersonal ? (
                        <input
                          type="tel"
                          value={profile.phone}
                          onChange={(e) => setProfile({...profile, phone: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="(555) 123-4567"
                        />
                      ) : (
                        <p className="text-gray-900">{profile.phone || 'No agregado'}</p>
                      )}
                    </div>
                  </div>

                  {editingPersonal && (
                    <div className="mt-6 flex space-x-4">
                      <Button onClick={handlePersonalSave}>
                        Guardar cambios
                      </Button>
                      <Button variant="secondary" onClick={() => setEditingPersonal(false)}>
                        Cancelar
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {/* Direcciones */}
              {activeTab === 'addresses' && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">Direcciones de Entrega</h3>
                      <p className="text-sm text-gray-500">Gestiona tus direcciones de entrega</p>
                    </div>
                    <Button onClick={() => alert('Función no implementada')}>
                      Agregar Dirección
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {addresses.map((address) => (
                      <div key={address.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <h4 className="font-medium text-gray-900">{address.label}</h4>
                              {address.isDefault && (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                  Predeterminada
                                </span>
                              )}
                            </div>
                            <p className="text-gray-600 mt-1">
                              {address.address}, {address.city}, {address.state} {address.zipCode}
                            </p>
                          </div>
                          <div className="flex space-x-2">
                            {!address.isDefault && (
                              <button
                                onClick={() => handleAddressToggleDefault(address.id)}
                                className="text-blue-600 hover:text-blue-800 text-sm"
                              >
                                Hacer predeterminada
                              </button>
                            )}
                            <button className="text-gray-400 hover:text-gray-600">
                              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Métodos de Pago */}
              {activeTab === 'payment' && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">Métodos de Pago</h3>
                      <p className="text-sm text-gray-500">Gestiona tus métodos de pago</p>
                    </div>
                    <Button onClick={() => alert('Función no implementada')}>
                      Agregar Método
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {paymentMethods.map((method) => (
                      <div key={method.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center space-x-4">
                            <div className="flex-shrink-0">
                              {method.type === 'credit' || method.type === 'debit' ? (
                                <svg className="h-8 w-8 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                                  <path d="M20 4H4c-1.103 0-2 .897-2 2v12c0 1.103.897 2 2 2h16c1.103 0 2-.897 2-2V6c0-1.103-.897-2-2-2zm0 14H4V6h16v12z"/>
                                  <path d="M7 9h10v2H7z"/>
                                </svg>
                              ) : (
                                <svg className="h-8 w-8 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                                  <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 9 5.16.74 9-3.45 9-9V7l-10-5z"/>
                                </svg>
                              )}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">
                                {method.brand} {method.last4 && `****${method.last4}`}
                              </p>
                              <p className="text-sm text-gray-500 capitalize">{method.type}</p>
                            </div>
                            {method.isDefault && (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                Predeterminado
                              </span>
                            )}
                          </div>
                          <div className="flex space-x-2">
                            {!method.isDefault && (
                              <button
                                onClick={() => handlePaymentToggleDefault(method.id)}
                                className="text-blue-600 hover:text-blue-800 text-sm"
                              >
                                Hacer predeterminado
                              </button>
                            )}
                            <button className="text-red-600 hover:text-red-800 text-sm">
                              Eliminar
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Preferencias de Entrega */}
              {activeTab === 'delivery' && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-6">Preferencias de Entrega</h3>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Horario preferido
                      </label>
                      <select
                        value={deliveryPrefs.timeSlot}
                        onChange={(e) => setDeliveryPrefs({...deliveryPrefs, timeSlot: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="morning">Mañana (8:00 AM - 12:00 PM)</option>
                        <option value="afternoon">Tarde (12:00 PM - 5:00 PM)</option>
                        <option value="evening">Noche (5:00 PM - 8:00 PM)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Frecuencia de entrega
                      </label>
                      <select
                        value={deliveryPrefs.frequency}
                        onChange={(e) => setDeliveryPrefs({...deliveryPrefs, frequency: e.target.value as DeliveryPreferences['frequency']})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="weekly">Semanal</option>
                        <option value="biweekly">Cada 2 semanas</option>
                        <option value="monthly">Mensual</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Instrucciones especiales
                      </label>
                      <textarea
                        value={deliveryPrefs.instructions}
                        onChange={(e) => setDeliveryPrefs({...deliveryPrefs, instructions: e.target.value})}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Instrucciones para el repartidor..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Método de contacto preferido
                      </label>
                      <div className="space-y-2">
                        {['email', 'sms', 'both'].map((method) => (
                          <label key={method} className="flex items-center">
                            <input
                              type="radio"
                              name="contactMethod"
                              value={method}
                              checked={deliveryPrefs.contactMethod === method}
                              onChange={(e) => setDeliveryPrefs({...deliveryPrefs, contactMethod: e.target.value as DeliveryPreferences['contactMethod']})}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                            />
                            <span className="ml-2 text-sm text-gray-700 capitalize">
                              {method === 'both' ? 'Ambos' : method === 'email' ? 'Correo' : 'SMS'}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <Button onClick={() => showSuccess('Preferencias de entrega actualizadas')}>
                      Guardar Preferencias
                    </Button>
                  </div>
                </div>
              )}

              {/* Notificaciones */}
              {activeTab === 'notifications' && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-6">Configuración de Notificaciones</h3>
                  
                  <div className="space-y-6">
                    <div className="border-b border-gray-200 pb-6">
                      <h4 className="text-base font-medium text-gray-900 mb-4">Tipos de notificaciones</h4>
                      <div className="space-y-4">
                        {[
                          { key: 'orderUpdates', label: 'Actualizaciones de pedidos', desc: 'Recibe notificaciones sobre el estado de tus pedidos' },
                          { key: 'deliveryReminders', label: 'Recordatorios de entrega', desc: 'Te recordamos cuando se acerca tu próxima entrega' },
                          { key: 'promotions', label: 'Promociones y ofertas', desc: 'Recibe ofertas especiales y descuentos' },
                          { key: 'productUpdates', label: 'Nuevos productos', desc: 'Entérate de nuevos productos y características' }
                        ].map((item) => (
                          <div key={item.key} className="flex items-start">
                            <div className="flex items-center h-5">
                              <input
                                type="checkbox"
                                checked={notifications[item.key as keyof NotificationSettings] as boolean}
                                onChange={() => handleNotificationChange(item.key as keyof NotificationSettings)}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                              />
                            </div>
                            <div className="ml-3">
                              <label className="text-sm font-medium text-gray-700">{item.label}</label>
                              <p className="text-sm text-gray-500">{item.desc}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-base font-medium text-gray-900 mb-4">Métodos de notificación</h4>
                      <div className="space-y-4">
                        <div className="flex items-start">
                          <div className="flex items-center h-5">
                            <input
                              type="checkbox"
                              checked={notifications.emailNotifications}
                              onChange={() => handleNotificationChange('emailNotifications')}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                          </div>
                          <div className="ml-3">
                            <label className="text-sm font-medium text-gray-700">Notificaciones por correo</label>
                            <p className="text-sm text-gray-500">Recibe notificaciones en tu correo electrónico</p>
                          </div>
                        </div>

                        <div className="flex items-start">
                          <div className="flex items-center h-5">
                            <input
                              type="checkbox"
                              checked={notifications.smsNotifications}
                              onChange={() => handleNotificationChange('smsNotifications')}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                          </div>
                          <div className="ml-3">
                            <label className="text-sm font-medium text-gray-700">Notificaciones por SMS</label>
                            <p className="text-sm text-gray-500">Recibe mensajes de texto en tu teléfono</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <Button onClick={() => showSuccess('Configuración de notificaciones actualizada')}>
                      Guardar Configuración
                    </Button>
                  </div>
                </div>
              )}

              {/* Seguridad */}
              {activeTab === 'security' && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-6">Configuración de Seguridad</h3>
                  
                  <div className="space-y-8">
                    <div>
                      <h4 className="text-base font-medium text-gray-900 mb-4">Cambiar Contraseña</h4>
                      <div className="space-y-4 max-w-md">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Contraseña actual
                          </label>
                          <input
                            type="password"
                            value={passwordForm.currentPassword}
                            onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Nueva contraseña
                          </label>
                          <input
                            type="password"
                            value={passwordForm.newPassword}
                            onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Confirmar nueva contraseña
                          </label>
                          <input
                            type="password"
                            value={passwordForm.confirmPassword}
                            onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>

                        <Button onClick={handlePasswordChange}>
                          Actualizar Contraseña
                        </Button>
                      </div>
                    </div>

                    <div className="border-t border-gray-200 pt-8">
                      <h4 className="text-base font-medium text-gray-900 mb-4">Sesiones Activas</h4>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium text-gray-900">Navegador actual</p>
                            <p className="text-sm text-gray-500">Iniciada ahora • Tu ubicación</p>
                          </div>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Activa
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Privacidad */}
              {activeTab === 'privacy' && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-6">Configuración de Privacidad</h3>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Visibilidad del perfil
                      </label>
                      <div className="space-y-2">
                        {[
                          { value: 'private', label: 'Privado', desc: 'Solo tú puedes ver tu información' },
                          { value: 'public', label: 'Público', desc: 'Otros usuarios pueden ver tu información básica' }
                        ].map((option) => (
                          <label key={option.value} className="flex items-start">
                            <input
                              type="radio"
                              name="profileVisibility"
                              value={option.value}
                              checked={privacy.profileVisibility === option.value}
                              onChange={(e) => handlePrivacyChange('profileVisibility', e.target.value)}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 mt-1"
                            />
                            <div className="ml-3">
                              <span className="text-sm font-medium text-gray-700">{option.label}</span>
                              <p className="text-sm text-gray-500">{option.desc}</p>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            type="checkbox"
                            checked={privacy.dataSharing}
                            onChange={(e) => handlePrivacyChange('dataSharing', e.target.checked)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                        </div>
                        <div className="ml-3">
                          <label className="text-sm font-medium text-gray-700">Compartir datos para mejoras</label>
                          <p className="text-sm text-gray-500">Permite que usemos tus datos para mejorar nuestros servicios</p>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            type="checkbox"
                            checked={privacy.analytics}
                            onChange={(e) => handlePrivacyChange('analytics', e.target.checked)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                        </div>
                        <div className="ml-3">
                          <label className="text-sm font-medium text-gray-700">Analytics y cookies</label>
                          <p className="text-sm text-gray-500">Permite el uso de cookies para analíticas</p>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            type="checkbox"
                            checked={privacy.thirdPartyMarketing}
                            onChange={(e) => handlePrivacyChange('thirdPartyMarketing', e.target.checked)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                        </div>
                        <div className="ml-3">
                          <label className="text-sm font-medium text-gray-700">Marketing de terceros</label>
                          <p className="text-sm text-gray-500">Permite que compartamos tu información con socios para ofertas personalizadas</p>
                        </div>
                      </div>
                    </div>

                    <Button onClick={() => showSuccess('Configuración de privacidad actualizada')}>
                      Guardar Configuración
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProfilePage;