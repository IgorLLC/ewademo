import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

const Dashboard = () => {
  const router = useRouter();

  useEffect(() => {
    // Verificar el rol del usuario y redirigir apropiadamente
    const userJson = localStorage.getItem('ewa_user');
    if (userJson) {
      try {
        const user = JSON.parse(userJson);
        if (user.role === 'admin') {
          router.replace('/admin/dashboard');
        } else if (user.role === 'customer') {
          router.replace('/customer/subscriptions');
        } else {
          router.replace('/auth');
        }
      } catch (error) {
        console.error('Error parsing user data:', error);
        router.replace('/auth');
      }
    } else {
      router.replace('/auth');
    }
  }, [router]);

  return (
    <>
      <Head>
        <title>Dashboard - EWA Box Water</title>
      </Head>
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando dashboard...</p>
        </div>
      </div>
    </>
  );
};

export default Dashboard; 