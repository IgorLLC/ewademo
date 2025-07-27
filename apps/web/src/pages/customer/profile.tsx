import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

const ProfilePage = () => {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    // Verificar si el usuario está autenticado
    const userJson = localStorage.getItem('ewa_user');
    if (!userJson) {
      router.push('/auth');
      return;
    }

    try {
      const userData = JSON.parse(userJson);
      if (userData.role !== 'customer') {
        router.push('/auth');
        return;
      }
      setUser(userData);
      
      // Establecer los valores iniciales del formulario
      setName(userData.name || '');
      setEmail(userData.email || '');
      setPhone(userData.phone || '');
      
      // Obtener datos adicionales del perfil si existen
      const profileData = localStorage.getItem('ewa_profile_data');
      if (profileData) {
        const parsedProfileData = JSON.parse(profileData);
        setAddress(parsedProfileData.address || '');
        setCity(parsedProfileData.city || '');
        setZipCode(parsedProfileData.zipCode || '');
      } else {
        // Datos mock para demostración
        setAddress('123 Calle Principal');
        setCity('San Juan');
        setZipCode('00901');
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error parsing user data:', error);
      router.push('/auth');
    }
  }, [router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Actualizar los datos del usuario
      const updatedUser = {
        ...user,
        name,
        email,
        phone
      };
      
      // Guardar los datos del perfil
      const profileData = {
        address,
        city,
        zipCode
      };
      
      localStorage.setItem('ewa_user', JSON.stringify(updatedUser));
      localStorage.setItem('ewa_profile_data', JSON.stringify(profileData));
      
      setSuccessMessage('Perfil actualizado correctamente');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error updating profile:', error);
      setErrorMessage('Error al actualizar el perfil');
      setTimeout(() => setErrorMessage(''), 3000);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('ewa_token');
    localStorage.removeItem('ewa_user');
    sessionStorage.clear();
    router.push('/auth');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-ewa-blue"></div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Mi Perfil - EWA Box Water</title>
        <meta name="description" content="Gestiona tu perfil de usuario" />
      </Head>

      <div className="min-h-screen bg-gray-100">
        {/* Header */}
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <div className="flex-shrink-0 flex items-center">
                  <a href="/" className="text-xl font-bold text-ewa-blue">
                    EWA Box Water
                  </a>
                </div>
                {user && (
                  <nav className="hidden sm:ml-6 sm:flex sm:space-x-8">
                    <a href="/customer/subscriptions" 
                      className="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700">
                      Suscripciones
                    </a>
                    <a href="/customer/oneoffs" 
                      className="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700">
                      Pedidos Únicos
                    </a>
                    <a href="/customer/profile" 
                      className="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium border-ewa-blue text-gray-900">
                      Perfil
                    </a>
                  </nav>
                )}
              </div>
              <div className="flex items-center">
                {user ? (
                  <div className="ml-3 relative">
                    <div className="flex items-center">
                      <span className="text-sm text-gray-700 mr-2">Hola, {user.name}</span>
                      <button
                        onClick={handleLogout}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        <svg className="mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Cerrar sesión
                      </button>
                    </div>
                  </div>
                ) : (
                  <a
                    href="/auth"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-ewa-blue hover:bg-ewa-dark-blue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ewa-blue"
                  >
                    Iniciar sesión
                  </a>
                )}
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Mi Perfil</h1>
            
            {successMessage && (
              <div className="mb-4 bg-green-50 border-l-4 border-green-400 p-4">
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
              <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-4">
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
              <form onSubmit={handleSubmit}>
                <div className="px-4 py-5 sm:p-6">
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Nombre completo
                      </label>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="mt-1 focus:ring-ewa-blue focus:border-ewa-blue block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Correo electrónico
                      </label>
                      <input
                        type="email"
                        name="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="mt-1 focus:ring-ewa-blue focus:border-ewa-blue block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                        Teléfono
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        id="phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="mt-1 focus:ring-ewa-blue focus:border-ewa-blue block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                        Dirección
                      </label>
                      <input
                        type="text"
                        name="address"
                        id="address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="mt-1 focus:ring-ewa-blue focus:border-ewa-blue block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                        Ciudad
                      </label>
                      <input
                        type="text"
                        name="city"
                        id="city"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="mt-1 focus:ring-ewa-blue focus:border-ewa-blue block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700">
                        Código postal
                      </label>
                      <input
                        type="text"
                        name="zipCode"
                        id="zipCode"
                        value={zipCode}
                        onChange={(e) => setZipCode(e.target.value)}
                        className="mt-1 focus:ring-ewa-blue focus:border-ewa-blue block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                  <button
                    type="submit"
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-ewa-blue hover:bg-ewa-dark-blue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ewa-blue"
                  >
                    Guardar cambios
                  </button>
                </div>
              </form>
            </div>
            
            <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Cambiar contraseña</h3>
                <div className="mt-2 max-w-xl text-sm text-gray-500">
                  <p>Actualiza tu contraseña para mantener tu cuenta segura.</p>
                </div>
                <div className="mt-5">
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ewa-blue"
                    onClick={() => alert('Funcionalidad de cambio de contraseña (simulación)')}
                  >
                    Cambiar contraseña
                  </button>
                </div>
              </div>
            </div>
            
            <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Preferencias de comunicación</h3>
                <div className="mt-2 max-w-xl text-sm text-gray-500">
                  <p>Elige cómo quieres recibir notificaciones sobre tus pedidos y entregas.</p>
                </div>
                <div className="mt-5">
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="email_notifications"
                          name="email_notifications"
                          type="checkbox"
                          defaultChecked
                          className="focus:ring-ewa-blue h-4 w-4 text-ewa-blue border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="email_notifications" className="font-medium text-gray-700">Notificaciones por correo electrónico</label>
                        <p className="text-gray-500">Recibe actualizaciones sobre tus pedidos y entregas por correo electrónico.</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="sms_notifications"
                          name="sms_notifications"
                          type="checkbox"
                          defaultChecked
                          className="focus:ring-ewa-blue h-4 w-4 text-ewa-blue border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="sms_notifications" className="font-medium text-gray-700">Notificaciones por SMS</label>
                        <p className="text-gray-500">Recibe actualizaciones sobre tus pedidos y entregas por SMS.</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="marketing_notifications"
                          name="marketing_notifications"
                          type="checkbox"
                          className="focus:ring-ewa-blue h-4 w-4 text-ewa-blue border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="marketing_notifications" className="font-medium text-gray-700">Comunicaciones de marketing</label>
                        <p className="text-gray-500">Recibe ofertas especiales y novedades sobre nuestros productos.</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-5">
                    <button
                      type="button"
                      className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ewa-blue"
                      onClick={() => {
                        setSuccessMessage('Preferencias de comunicación actualizadas');
                        setTimeout(() => setSuccessMessage(''), 3000);
                      }}
                    >
                      Guardar preferencias
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
