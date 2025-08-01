import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const AdminRedirect = () => {
  const router = useRouter();
  const [error, setError] = useState('');

  useEffect(() => {
    // Verificar si el usuario está autenticado y es admin
    const userJson = localStorage.getItem('ewa_user');
    if (!userJson) {
      // Si no hay usuario, redirigir a la página de autenticación
      router.push('/auth');
      return;
    }

    try {
      const user = JSON.parse(userJson);
      if (user.role === 'admin' || user.role === 'operator' || user.role === 'editor') {
        // Si es admin, redirigir al dashboard del panel
        router.replace('/admin/dashboard');
      } else {
        // Si no es admin, mostrar error y redirigir a la página de autenticación
        setError('No tienes permisos para acceder al panel de administración');
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
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Redirigiendo al panel de administración...</p>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminRedirect;
