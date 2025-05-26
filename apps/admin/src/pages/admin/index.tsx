import { useEffect } from 'react';
import { useRouter } from 'next/router';

const AdminRedirect = () => {
  const router = useRouter();

  useEffect(() => {
    // Redirigir a la página principal del panel de administración
    router.replace('/');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-ewa-blue mx-auto"></div>
        <p className="mt-4 text-gray-600">Redirigiendo al panel de administración...</p>
      </div>
    </div>
  );
};

export default AdminRedirect;
