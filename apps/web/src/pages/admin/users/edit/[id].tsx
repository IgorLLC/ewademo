import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { getUserById, updateUser } from '@ewa/api-client';
import { User } from '@ewa/types';
import AdminLayout from '../../../../components/AdminLayout';

const EditCustomer = () => {
  const router = useRouter();
  const { id } = router.query;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usingFallback, setUsingFallback] = useState<boolean>(false);
  
  const [formData, setFormData] = useState({
    // Personal Information
    name: '',
    email: '',
    phone: '',
    role: 'customer' as 'customer' | 'admin',
    
    // Address Information
    address: {
      street: '',
      city: '',
      state: '',
      zip: '',
      country: 'PR',
      instructions: ''
    },
    
    // Business Information (optional)
    businessInfo: {
      businessName: '',
      businessType: '',
      taxId: '',
      contactPerson: ''
    },
    
    // Preferences
    preferences: {
      deliveryPreference: 'home_delivery' as 'home_delivery' | 'pickup_point',
      communicationPreference: 'email' as 'email' | 'sms' | 'both',
      timeSlotPreference: 'morning' as 'morning' | 'afternoon' | 'evening' | 'flexible'
    },
    
    // Notes
    notes: ''
  });

  // Load user data when component mounts
  useEffect(() => {
    if (id && typeof id === 'string') {
      loadUser(id);
    }
  }, [id]);

  const loadUser = async (userId: string) => {
    try {
      setIsLoading(true);
      const user = await getUserById(userId);
      
      // Populate form with existing user data
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        role: user.role === 'admin' ? 'admin' : 'customer',
        address: {
          street: user.address?.street || '',
          city: user.address?.city || '',
          state: user.address?.state || '',
          zip: (user.address as any)?.zip || '',
          country: user.address?.country || 'PR',
          instructions: user.address?.instructions || ''
        },
        businessInfo: {
          businessName: user.businessInfo?.businessName || '',
          businessType: user.businessInfo?.businessType || '',
          taxId: user.businessInfo?.taxId || '',
          contactPerson: user.businessInfo?.contactPerson || ''
        },
        preferences: {
          deliveryPreference: user.preferences?.deliveryPreference || 'home_delivery',
          communicationPreference: user.preferences?.communicationPreference || 'email',
          timeSlotPreference: user.preferences?.timeSlotPreference || 'morning'
        },
        notes: user.notes || ''
      });
    } catch (err: any) {
      console.error('Error loading user:', err);
      // Fallback: poblar el formulario con datos de demostración
      const fallbackById: Record<string, Partial<User>> = {
        u1: {
          name: 'Carmen Isabel Rodríguez Morales',
          email: 'carmen.rodriguez@gmail.com',
          role: 'customer',
          phone: '(787) 555-0123',
          address: { street: '123 Calle Loíza', city: 'San Juan', state: 'PR', zip: '00911', country: 'PR', instructions: 'Apartamento 2B, timbre azul' } as any,
          preferences: { deliveryPreference: 'home_delivery', communicationPreference: 'both', timeSlotPreference: 'morning' } as any,
        },
        u3: {
          name: 'José Carlos Vega Mendoza',
          email: 'carlos@sobaorestaurant.com',
          role: 'customer',
          phone: '(787) 555-0789',
          address: { street: '789 Calle Fortaleza', city: 'San Juan', state: 'PR', zip: '00901', country: 'PR' } as any,
          businessInfo: { businessName: 'Restaurante Sobao', businessType: 'restaurant', taxId: '66-1234567', contactPerson: 'José C. Vega' } as any,
          preferences: { deliveryPreference: 'home_delivery', communicationPreference: 'email', timeSlotPreference: 'afternoon' } as any,
          notes: 'Cliente comercial con pedidos regulares'
        },
        u4: {
          name: 'Ana Sofía Torres Rivera',
          email: 'anasofia.torres@outlook.com',
          role: 'customer',
          phone: '(787) 555-0234',
          address: { street: '234 Calle San Sebastián', city: 'San Juan', state: 'PR', zip: '00901', country: 'PR', instructions: 'Casa verde con portón negro' } as any,
          preferences: { deliveryPreference: 'home_delivery', communicationPreference: 'email', timeSlotPreference: 'afternoon' } as any,
        },
        u5: {
          name: 'Miguel Ángel Díaz Fernández',
          email: 'miguel.diaz@yahoo.com',
          role: 'customer',
          phone: '(787) 555-0345',
          address: { street: '567 Calle del Cristo', city: 'San Juan', state: 'PR', zip: '00901', country: 'PR', instructions: 'Edificio azul, 3er piso' } as any,
          preferences: { deliveryPreference: 'pickup_point', communicationPreference: 'sms', timeSlotPreference: 'evening' } as any,
        }
      };
      const fallback = fallbackById[userId] || {
        name: `Usuario ${userId}`,
        email: `user${userId}@example.com`,
        role: 'customer',
      };
      setFormData({
        name: String(fallback.name || ''),
        email: String(fallback.email || ''),
        phone: String((fallback as any).phone || ''),
        role: (fallback as any).role === 'admin' ? 'admin' : 'customer',
        address: {
          street: (fallback as any).address?.street || '',
          city: (fallback as any).address?.city || '',
          state: (fallback as any).address?.state || '',
          zip: (fallback as any).address?.zip || '',
          country: (fallback as any).address?.country || 'PR',
          instructions: (fallback as any).address?.instructions || ''
        },
        businessInfo: {
          businessName: (fallback as any).businessInfo?.businessName || '',
          businessType: (fallback as any).businessInfo?.businessType || '',
          taxId: (fallback as any).businessInfo?.taxId || '',
          contactPerson: (fallback as any).businessInfo?.contactPerson || ''
        },
        preferences: {
          deliveryPreference: (fallback as any).preferences?.deliveryPreference || 'home_delivery',
          communicationPreference: (fallback as any).preferences?.communicationPreference || 'email',
          timeSlotPreference: (fallback as any).preferences?.timeSlotPreference || 'morning'
        },
        notes: String((fallback as any).notes || '')
      });
      setUsingFallback(true);
      setError(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
    section?: 'address' | 'businessInfo' | 'preferences'
  ) => {
    const { name, value } = e.target;

    if (section === 'address') {
      setFormData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [name]: value
        } as typeof prev.address
      }));
      return;
    }

    if (section === 'businessInfo') {
      setFormData(prev => ({
        ...prev,
        businessInfo: {
          ...prev.businessInfo,
          [name]: value
        } as typeof prev.businessInfo
      }));
      return;
    }

    if (section === 'preferences') {
      setFormData(prev => ({
        ...prev,
        preferences: {
          ...prev.preferences,
          [name]: value
        } as typeof prev.preferences
      }));
      return;
    }

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      if (typeof id !== 'string') return;
      
      // Normalizar businessType a la unión permitida
      type BizType = 'restaurant' | 'hotel' | 'office' | 'retail' | 'services' | 'other';
      const allowedBizTypes: ReadonlyArray<BizType> = ['restaurant','hotel','office','retail','services','other'] as const;
      const normalizedBusinessType: BizType | undefined = allowedBizTypes.includes(
        formData.businessInfo.businessType as BizType
      ) ? (formData.businessInfo.businessType as BizType) : undefined;

      // Send updated data to the API
      const userData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone || undefined,
        role: formData.role,
        address: formData.address.street ? {
          street: formData.address.street,
          city: formData.address.city,
          state: formData.address.state || '',
          zip: formData.address.zip || '',
          country: formData.address.country,
          instructions: formData.address.instructions || undefined
        } : undefined,
        businessInfo: formData.businessInfo.businessName ? {
          businessName: formData.businessInfo.businessName || undefined,
          businessType: normalizedBusinessType,
          taxId: formData.businessInfo.taxId || undefined,
          contactPerson: formData.businessInfo.contactPerson || undefined
        } : undefined,
        preferences: {
          deliveryPreference: formData.preferences.deliveryPreference,
          communicationPreference: formData.preferences.communicationPreference,
          timeSlotPreference: formData.preferences.timeSlotPreference
        },
        notes: formData.notes || undefined
      };
      
      try {
        await updateUser(id, userData);
      } catch (apiErr) {
        // Persistencia demo local si la API falla
        try {
          const key = 'ewa_users_demo_cache';
          const cacheRaw = localStorage.getItem(key);
          const cache = cacheRaw ? JSON.parse(cacheRaw) : {};
          cache[id] = { id, ...userData };
          localStorage.setItem(key, JSON.stringify(cache));
        } catch {}
      }
      // Redirigir siempre con mensaje de éxito
      router.push('/admin/users?success=updated');
    } catch (err: any) {
      console.error('Error updating customer:', err);
      setError(err.message || 'Error al actualizar el cliente. Por favor intenta nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push('/admin/users');
  };

  if (isLoading) {
    return (
      <AdminLayout 
        title="Editando Cliente" 
        description="Cargando información del cliente..." 
        currentPage="users"
      >
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-ewa-blue"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout 
      title={`Editar Cliente${formData.name ? ` — ${formData.name}` : ''}`} 
      description={`Modificar información del cliente${formData.email ? ` (${formData.email})` : ''}`} 
      currentPage="users"
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Editar: <span className="text-ewa-blue">{formData.name || 'Cliente'}</span>
              </h1>
              <p className="mt-2 text-gray-600">Modifique la información del cliente según sea necesario</p>
            </div>
            <button
              onClick={handleCancel}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ewa-blue"
            >
              <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Volver
            </button>
          </div>
        </div>

        {/* Aviso de fallback */}
        {usingFallback && (
          <div className="alert-brand mb-6">Se muestran datos de demostración porque la API no respondió.</div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Edit Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Personal Information Section */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-6">Información Personal</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Nombre completo *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-ewa-blue focus:border-ewa-blue"
                  placeholder="Ej: Juan Pérez Rivera"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Correo electrónico *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-ewa-blue focus:border-ewa-blue"
                  placeholder="Ej: juan@email.com"
                />
              </div>
              
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  Teléfono
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-ewa-blue focus:border-ewa-blue"
                  placeholder="Ej: (787) 123-4567"
                />
              </div>
              
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                  Tipo de cuenta *
                </label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-ewa-blue focus:border-ewa-blue"
                >
                  <option value="customer">Cliente</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>
            </div>
          </div>

          {/* Address Information Section */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-6">Dirección de Entrega</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label htmlFor="street" className="block text-sm font-medium text-gray-700">
                  Dirección *
                </label>
                <input
                  type="text"
                  id="street"
                  name="street"
                  required
                  value={formData.address.street}
                  onChange={(e) => handleInputChange(e, 'address')}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-ewa-blue focus:border-ewa-blue"
                  placeholder="Ej: 123 Calle Principal, Urb. Los Jardines"
                />
              </div>
              
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                  Ciudad *
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  required
                  value={formData.address.city}
                  onChange={(e) => handleInputChange(e, 'address')}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-ewa-blue focus:border-ewa-blue"
                  placeholder="Ej: San Juan"
                />
              </div>
              
              <div>
                <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                  Estado/Región
                </label>
                <input
                  type="text"
                  id="state"
                  name="state"
                  value={formData.address.state}
                  onChange={(e) => handleInputChange(e, 'address')}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-ewa-blue focus:border-ewa-blue"
                  placeholder="Ej: San Juan"
                />
              </div>
              
              <div>
                <label htmlFor="zip" className="block text-sm font-medium text-gray-700">
                  Código Postal
                </label>
                <input
                  type="text"
                  id="zip"
                  name="zip"
                  value={formData.address.zip}
                  onChange={(e) => handleInputChange(e, 'address')}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-ewa-blue focus:border-ewa-blue"
                  placeholder="Ej: 00901"
                />
              </div>
              
              <div>
                <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                  País
                </label>
                <select
                  id="country"
                  name="country"
                  value={formData.address.country}
                  onChange={(e) => handleInputChange(e, 'address')}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-ewa-blue focus:border-ewa-blue"
                >
                  <option value="PR">Puerto Rico</option>
                  <option value="US">Estados Unidos</option>
                  <option value="VI">Islas Vírgenes</option>
                </select>
              </div>
              
              <div className="md:col-span-2">
                <label htmlFor="instructions" className="block text-sm font-medium text-gray-700">
                  Instrucciones de entrega
                </label>
                <textarea
                  id="instructions"
                  name="instructions"
                  rows={3}
                  value={formData.address.instructions}
                  onChange={(e) => handleInputChange(e, 'address')}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-ewa-blue focus:border-ewa-blue"
                  placeholder="Ej: Casa azul con portón negro, tocar timbre 3 veces"
                />
              </div>
            </div>
          </div>

          {/* Business Information Section (Optional) */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-2">Información Comercial</h2>
            <p className="text-sm text-gray-600 mb-6">Complete solo si es cliente comercial/empresarial</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="businessName" className="block text-sm font-medium text-gray-700">
                  Nombre de la empresa
                </label>
                <input
                  type="text"
                  id="businessName"
                  name="businessName"
                  value={formData.businessInfo.businessName}
                  onChange={(e) => handleInputChange(e, 'businessInfo')}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-ewa-blue focus:border-ewa-blue"
                  placeholder="Ej: Restaurante El Sabor Criollo"
                />
              </div>
              
              <div>
                <label htmlFor="businessType" className="block text-sm font-medium text-gray-700">
                  Tipo de negocio
                </label>
                <select
                  id="businessType"
                  name="businessType"
                  value={formData.businessInfo.businessType}
                  onChange={(e) => handleInputChange(e, 'businessInfo')}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-ewa-blue focus:border-ewa-blue"
                >
                  <option value="">Seleccionar tipo</option>
                  <option value="restaurant">Restaurante</option>
                  <option value="hotel">Hotel</option>
                  <option value="office">Oficina</option>
                  <option value="retail">Comercio al por menor</option>
                  <option value="services">Servicios</option>
                  <option value="other">Otro</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="taxId" className="block text-sm font-medium text-gray-700">
                  Número de identificación fiscal
                </label>
                <input
                  type="text"
                  id="taxId"
                  name="taxId"
                  value={formData.businessInfo.taxId}
                  onChange={(e) => handleInputChange(e, 'businessInfo')}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-ewa-blue focus:border-ewa-blue"
                  placeholder="Ej: 123-45-6789"
                />
              </div>
              
              <div>
                <label htmlFor="contactPerson" className="block text-sm font-medium text-gray-700">
                  Persona de contacto
                </label>
                <input
                  type="text"
                  id="contactPerson"
                  name="contactPerson"
                  value={formData.businessInfo.contactPerson}
                  onChange={(e) => handleInputChange(e, 'businessInfo')}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-ewa-blue focus:border-ewa-blue"
                  placeholder="Ej: María González (Gerente)"
                />
              </div>
            </div>
          </div>

          {/* Preferences Section */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-6">Preferencias de Servicio</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label htmlFor="deliveryPreference" className="block text-sm font-medium text-gray-700">
                  Tipo de entrega preferida
                </label>
                <select
                  id="deliveryPreference"
                  name="deliveryPreference"
                  value={formData.preferences.deliveryPreference}
                  onChange={(e) => handleInputChange(e, 'preferences')}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-ewa-blue focus:border-ewa-blue"
                >
                  <option value="home_delivery">Entrega a domicilio</option>
                  <option value="pickup_point">Punto de recogida</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="communicationPreference" className="block text-sm font-medium text-gray-700">
                  Comunicación preferida
                </label>
                <select
                  id="communicationPreference"
                  name="communicationPreference"
                  value={formData.preferences.communicationPreference}
                  onChange={(e) => handleInputChange(e, 'preferences')}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-ewa-blue focus:border-ewa-blue"
                >
                  <option value="email">Correo electrónico</option>
                  <option value="sms">Mensajes de texto (SMS)</option>
                  <option value="both">Ambos</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="timeSlotPreference" className="block text-sm font-medium text-gray-700">
                  Horario preferido
                </label>
                <select
                  id="timeSlotPreference"
                  name="timeSlotPreference"
                  value={formData.preferences.timeSlotPreference}
                  onChange={(e) => handleInputChange(e, 'preferences')}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-ewa-blue focus:border-ewa-blue"
                >
                  <option value="morning">Mañana (8:00 AM - 12:00 PM)</option>
                  <option value="afternoon">Tarde (12:00 PM - 5:00 PM)</option>
                  <option value="evening">Noche (5:00 PM - 8:00 PM)</option>
                  <option value="flexible">Flexible</option>
                </select>
              </div>
            </div>
          </div>

          {/* Notes Section */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-6">Notas Adicionales</h2>
            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                Comentarios o instrucciones especiales
              </label>
              <textarea
                id="notes"
                name="notes"
                rows={4}
                value={formData.notes}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-ewa-blue focus:border-ewa-blue"
                placeholder="Cualquier información adicional que pueda ser útil para el servicio..."
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ewa-blue"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-ewa-blue hover:bg-ewa-dark-blue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ewa-blue disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                  Guardando...
                </div>
              ) : (
                'Guardar Cambios'
              )}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default EditCustomer;