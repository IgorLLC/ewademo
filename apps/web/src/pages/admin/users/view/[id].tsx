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
      
      // Usar datos mock si la API falla
      const mockUser: User = {
        id: userId,
        name: userId === 'u1' ? 'Juan Rivera' : userId === 'u2' ? 'María López' : 'Restaurante Sobao',
        email: userId === 'u1' ? 'juan@cliente.com' : userId === 'u2' ? 'admin@ewa.com' : 'sobao@business.com',
        role: userId === 'u2' ? 'admin' : 'customer',
        phone: userId === 'u1' ? '+1 787 555-0123' : '+1 787 555-0456',
        address: {
          street: userId === 'u1' ? '123 Calle Loíza' : '456 Ave. Ponce de León',
          city: 'San Juan',
          state: 'PR',
          zip: '00911',
          country: 'Puerto Rico'
        },
        businessInfo: userId === 'u3' ? {
          businessName: 'Restaurante Sobao',
          businessType: 'restaurant',
          taxId: '123-45-6789'
        } : undefined,
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-03-15T14:30:00Z'
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
          <div className="flex items-center justify-between">
            <div>
              <button
                onClick={() => router.push('/admin/users')}
                className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-2"
              >
                <svg className="mr-1 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Volver a usuarios
              </button>
              <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
              <div className="flex items-center mt-2">
                <span className={`px-2 py-1 text-xs leading-5 font-semibold rounded-full ${getRoleBadgeClass(user.role)}`}>
                  {getRoleLabel(user.role)}
                </span>
                <span className="ml-3 text-sm text-gray-500">ID: {user.id}</span>
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
                  <label className="block text-sm font-medium text-gray-500">Calle</label>
                  <p className="mt-1 text-sm text-gray-900">{user.address.street}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Ciudad</label>
                    <p className="mt-1 text-sm text-gray-900">{user.address.city}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Estado</label>
                    <p className="mt-1 text-sm text-gray-900">{user.address.state}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Código Postal</label>
                    <p className="mt-1 text-sm text-gray-900">{user.address.zip}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">País</label>
                    <p className="mt-1 text-sm text-gray-900">{user.address.country}</p>
                  </div>
                </div>
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
              <p className="mt-1 text-sm text-gray-900">{formatDate(user.createdAt)}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">Última Actualización</label>
              <p className="mt-1 text-sm text-gray-900">{formatDate(user.updatedAt)}</p>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ViewUser;