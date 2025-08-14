import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { getUserById } from '@ewa/api-client';
import { User } from '@ewa/types';
import AdminLayout from '../../../../components/AdminLayout';

const ViewUser = () => {
  const router = useRouter();
  const { id } = router.query;
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id && typeof id === 'string') {
      fetchUser(id);
    }
  }, [id]);

  const fetchUser = async (userId: string) => {
    try {
      setLoading(true);
      const userData = await getUserById(userId);
      setUser(userData);
    } catch (err: any) {
      console.error('Error fetching user:', err);
      setError('Error al cargar la información del usuario.');
      
      // Usar datos mock mejorados si la API falla
      const mockUsers: Record<string, User> = {
        u1: {
          id: 'u1',
          name: 'Carmen Isabel Rodríguez Morales',
          email: 'carmen.rodriguez@gmail.com',
          role: 'customer',
          phone: '+1 787 555-0123',
          address: {
            street: '123 Calle Loíza',
            city: 'San Juan',
            state: 'PR',
            zip: '00911',
            country: 'Puerto Rico',
            instructions: 'Apartamento 2B, timbre azul'
          },
          preferences: {
            deliveryPreference: 'home_delivery',
            communicationPreference: 'both',
            timeSlotPreference: 'morning'
          },
          isActive: true,
          createdAt: '2024-01-15T10:00:00Z',
          updatedAt: '2024-08-14T14:30:00Z'
        },
        u2: {
          id: 'u2',
          name: 'María Elena López Santos',
          email: 'maria.admin@ewa.com',
          role: 'admin',
          phone: '+1 787 555-0456',
          address: {
            street: '456 Ave. Ponce de León',
            city: 'San Juan',
            state: 'PR',
            zip: '00907',
            country: 'Puerto Rico'
          },
          isActive: true,
          createdAt: '2024-01-10T08:00:00Z',
          updatedAt: '2024-08-14T12:15:00Z'
        },
        u3: {
          id: 'u3',
          name: 'José Carlos Vega Mendoza',
          email: 'carlos@sobaorestaurant.com',
          role: 'customer',
          phone: '+1 787 555-0789',
          address: {
            street: '789 Calle Fortaleza',
            city: 'Old San Juan',
            state: 'PR',
            zip: '00901',
            country: 'Puerto Rico',
            instructions: 'Entrada por el lado de la plaza'
          },
          businessInfo: {
            businessName: 'Restaurante Sobao',
            businessType: 'restaurant',
            taxId: '123-45-6789',
            contactPerson: 'José Carlos Vega Mendoza'
          },
          preferences: {
            deliveryPreference: 'home_delivery',
            communicationPreference: 'email',
            timeSlotPreference: 'afternoon'
          },
          notes: 'Cliente comercial con pedidos regulares grandes',
          isActive: true,
          createdAt: '2024-02-01T09:00:00Z',
          updatedAt: '2024-08-14T11:45:00Z'
        },
        u4: {
          id: 'u4',
          name: 'Ana Sofía Torres Rivera',
          email: 'anasofia.torres@outlook.com',
          role: 'customer',
          phone: '+1 787 555-0234',
          address: {
            street: '234 Calle San Sebastián',
            city: 'San Juan',
            state: 'PR',
            zip: '00901',
            country: 'Puerto Rico',
            instructions: 'Casa verde con portón negro'
          },
          preferences: {
            deliveryPreference: 'home_delivery',
            communicationPreference: 'email',
            timeSlotPreference: 'afternoon'
          },
          isActive: true,
          createdAt: '2024-03-20T09:30:00Z',
          updatedAt: '2024-08-14T16:00:00Z'
        },
        u5: {
          id: 'u5',
          name: 'Miguel Ángel Díaz Fernández',
          email: 'miguel.diaz@yahoo.com',
          role: 'customer',
          phone: '+1 787 555-0345',
          address: {
            street: '567 Calle del Cristo',
            city: 'Old San Juan',
            state: 'PR',
            zip: '00901',
            country: 'Puerto Rico',
            instructions: 'Edificio azul, 3er piso'
          },
          preferences: {
            deliveryPreference: 'pickup_point',
            communicationPreference: 'sms',
            timeSlotPreference: 'evening'
          },
          isActive: true,
          createdAt: '2024-04-05T11:15:00Z',
          updatedAt: '2024-08-14T10:45:00Z'
        },
        u6: {
          id: 'u6',
          name: 'Isabella Marie Ortega Ruiz',
          email: 'isabella.ortega@gmail.com',
          role: 'customer',
          phone: '+1 787 555-0456',
          address: {
            street: '890 Ave. Ashford',
            city: 'Condado',
            state: 'PR',
            zip: '00907',
            country: 'Puerto Rico',
            instructions: 'Condominio Ocean View, Torre A'
          },
          preferences: {
            deliveryPreference: 'home_delivery',
            communicationPreference: 'both',
            timeSlotPreference: 'morning'
          },
          isActive: true,
          createdAt: '2024-05-12T14:20:00Z',
          updatedAt: '2024-08-14T13:30:00Z'
        }
      };
      
      const mockUser = mockUsers[userId] || {
        id: userId,
        name: `Usuario ${userId}`,
        email: `user${userId}@example.com`,
        role: 'customer' as const,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setUser(mockUser);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout 
        title="Ver Usuario" 
        description="Información detallada del usuario" 
        currentPage="users"
      >
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-ewa-blue"></div>
        </div>
      </AdminLayout>
    );
  }

  if (error || !user) {
    return (
      <AdminLayout 
        title="Error" 
        description="Error al cargar la información" 
        currentPage="users"
      >
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <p className="text-red-700">{error || 'Usuario no encontrado'}</p>
          <button
            onClick={() => router.push('/admin/users')}
            className="mt-2 text-red-600 hover:text-red-800"
          >
            Volver a la lista de usuarios
          </button>
        </div>
      </AdminLayout>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Administrador';
      case 'customer':
        return 'Cliente';
      case 'operator':
        return 'Operador';
      case 'editor':
        return 'Editor';
      default:
        return role;
    }
  };

  const getRoleBadgeClass = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-100 text-purple-800';
      case 'customer':
        return 'bg-green-100 text-green-800';
      case 'operator':
        return 'bg-blue-100 text-blue-800';
      case 'editor':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <AdminLayout 
      title={`Ver Usuario - ${user.name}`} 
      description="Información detallada del usuario" 
      currentPage="users"
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <button
                onClick={() => router.push('/admin/users')}
                className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4"
              >
                <svg className="mr-1 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Volver a usuarios
              </button>
              
              <div className="flex items-start space-x-4">
                {/* User Avatar */}
                <div className="relative">
                  <img
                    className="h-16 w-16 rounded-full object-cover border-4 border-white shadow-lg"
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&size=128&background=0066FF&color=ffffff&bold=true`}
                    alt={`Avatar de ${user.name}`}
                  />
                  {user.isActive !== false && (
                    <div className="absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full bg-green-400 border-2 border-white"></div>
                  )}
                </div>
                
                {/* User Info */}
                <div className="flex-1 min-w-0">
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">{user.name}</h1>
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <span className={`px-3 py-1 text-sm leading-5 font-semibold rounded-full ${getRoleBadgeClass(user.role)}`}>
                      {getRoleLabel(user.role)}
                    </span>
                    {user.isActive !== false ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <svg className="-ml-0.5 mr-1.5 h-2 w-2" fill="currentColor" viewBox="0 0 8 8">
                          <circle cx={4} cy={4} r={3} />
                        </svg>
                        Activo
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        <svg className="-ml-0.5 mr-1.5 h-2 w-2" fill="currentColor" viewBox="0 0 8 8">
                          <circle cx={4} cy={4} r={3} />
                        </svg>
                        Inactivo
                      </span>
                    )}
                    <span className="text-sm text-gray-500">ID: {user.id}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <svg className="flex-shrink-0 mr-1.5 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                    {user.email}
                  </div>
                  {user.phone && (
                    <div className="flex items-center text-sm text-gray-600 mt-1">
                      <svg className="flex-shrink-0 mr-1.5 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      {user.phone}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => router.push(`/admin/users/edit/${user.id}`)}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-ewa-blue hover:bg-ewa-dark-blue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ewa-blue"
              >
                <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Editar
              </button>
              {user.role === 'customer' && (
                <button
                  onClick={() => router.push(`/admin/users/${user.id}/subscriptions`)}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ewa-blue"
                >
                  <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  Ver Suscripciones
                </button>
              )}
            </div>
          </div>
        </div>

        {/* User Information Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Personal Information */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Información Personal</h3>
            </div>
            <div className="px-6 py-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-500">Nombre</label>
                <p className="mt-1 text-sm text-gray-900">{user.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">Email</label>
                <p className="mt-1 text-sm text-gray-900">{user.email}</p>
              </div>
              {user.phone && (
                <div>
                  <label className="block text-sm font-medium text-gray-500">Teléfono</label>
                  <p className="mt-1 text-sm text-gray-900">{user.phone}</p>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-500">Rol</label>
                <span className={`mt-1 inline-flex px-2 py-1 text-xs leading-5 font-semibold rounded-full ${getRoleBadgeClass(user.role)}`}>
                  {getRoleLabel(user.role)}
                </span>
              </div>
            </div>
          </div>

          {/* Address Information */}
          {user.address && (
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Dirección</h3>
              </div>
              <div className="px-6 py-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500">Dirección Completa</label>
                  <p className="mt-1 text-sm text-gray-900">{user.address.street}</p>
                  <p className="text-sm text-gray-700">{user.address.city}, {user.address.state} {user.address.zip}</p>
                  <p className="text-sm text-gray-600">{user.address.country}</p>
                </div>
                {user.address.instructions && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Instrucciones de Entrega</label>
                    <p className="mt-1 text-sm text-gray-900 bg-yellow-50 border border-yellow-200 rounded-md p-2">
                      {user.address.instructions}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Business Information */}
        {user.businessInfo && (
          <div className="bg-white shadow rounded-lg mb-8">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Información de Negocio</h3>
            </div>
            <div className="px-6 py-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-500">Nombre del Negocio</label>
                <p className="mt-1 text-sm text-gray-900">{user.businessInfo.businessName}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500">Tipo de Negocio</label>
                  <p className="mt-1 text-sm text-gray-900 capitalize">{user.businessInfo.businessType}</p>
                </div>
                {user.businessInfo.taxId && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500">ID Fiscal</label>
                    <p className="mt-1 text-sm text-gray-900">{user.businessInfo.taxId}</p>
                  </div>
                )}
              </div>
              {user.businessInfo.contactPerson && (
                <div>
                  <label className="block text-sm font-medium text-gray-500">Persona de Contacto</label>
                  <p className="mt-1 text-sm text-gray-900">{user.businessInfo.contactPerson}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Service Preferences */}
        {user.preferences && (
          <div className="bg-white shadow rounded-lg mb-8">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Preferencias de Servicio</h3>
            </div>
            <div className="px-6 py-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500">Método de Entrega</label>
                  <p className="mt-1 text-sm text-gray-900 capitalize">
                    {user.preferences.deliveryPreference === 'home_delivery' ? 'Entrega a domicilio' : 'Punto de recogida'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Comunicación Preferida</label>
                  <p className="mt-1 text-sm text-gray-900 capitalize">
                    {user.preferences.communicationPreference === 'email' ? 'Correo electrónico' : 
                     user.preferences.communicationPreference === 'sms' ? 'SMS' : 'Ambos'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Horario Preferido</label>
                  <p className="mt-1 text-sm text-gray-900 capitalize">
                    {user.preferences.timeSlotPreference === 'morning' ? 'Mañana' : 
                     user.preferences.timeSlotPreference === 'afternoon' ? 'Tarde' : 
                     user.preferences.timeSlotPreference === 'evening' ? 'Noche' : 'Flexible'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Additional Notes */}
        {user.notes && (
          <div className="bg-white shadow rounded-lg mb-8">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Notas Adicionales</h3>
            </div>
            <div className="px-6 py-4">
              <p className="text-sm text-gray-900 bg-blue-50 border border-blue-200 rounded-md p-3">
                {user.notes}
              </p>
            </div>
          </div>
        )}

        {/* Account Information */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Información de Cuenta</h3>
          </div>
          <div className="px-6 py-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-500">Fecha de Registro</label>
              <p className="mt-1 text-sm text-gray-900">{formatDate(user.createdAt || new Date().toISOString())}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">Última Actualización</label>
              <p className="mt-1 text-sm text-gray-900">{formatDate(user.updatedAt || new Date().toISOString())}</p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ViewUser;