import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getCurrentUser } from '@ewa/api-client';

const CustomerRedirect = () => {
  const router = useRouter();
  const [error, setError] = useState('');

  useEffect(() => {
    const user = getCurrentUser();
    if (!user) {
      router.replace('/auth');
      return;
    }

    if (user.role === 'customer') {
      router.replace('/customer/subscriptions');
      return;
    }

    setError('No tienes permisos para acceder al portal de clientes');
    setTimeout(() => router.replace('/auth'), 2000);
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
