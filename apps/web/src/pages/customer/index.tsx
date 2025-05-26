import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const CustomerRedirect = () => {
  const router = useRouter();
  const [error, setError] = useState('');

  useEffect(() => {
    // Verificar si el usuario está autenticado y es cliente
    const userJson = localStorage.getItem('ewa_user');
    if (!userJson) {
      // Si no hay usuario, redirigir a la página de autenticación
      router.push('/auth');
      return;
    }

    try {
      const user = JSON.parse(userJson);
      if (user.role === 'customer') {
        // Si es cliente, redirigir a la página de suscripciones
        router.push('/customer/subscriptions');
      } else {
        // Si no es cliente, mostrar error y redirigir a la página de autenticación
        setError('No tienes permisos para acceder al portal de clientes');
        setTimeout(() => {
          router.push('/auth');
        }, 2000);
      }
    } catch (error) {
      console.error('Error al verificar usuario:', error);
      router.push('/auth');
    }
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        {error ? (
          <>
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
              <span className="block sm:inline">{error}</span>
            </div>
            <p className="text-gray-600">Redirigiendo a la página de autenticación...</p>
          </>
        ) : (
          <>
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-ewa-blue mx-auto"></div>
            <p className="mt-4 text-gray-600">Redirigiendo al portal de cliente...</p>
          </>
        )}
      </div>
    </div>
  );
};

export default CustomerRedirect;
