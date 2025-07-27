import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

const Customer = () => {
  const router = useRouter();

  useEffect(() => {
    // Redirigir a la página de customer
    router.replace('/customer/subscriptions');
  }, [router]);

  return (
    <>
      <Head>
        <title>Cliente - EWA Box Water</title>
      </Head>
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Redirigiendo a cliente...</p>
        </div>
      </div>
    </>
  );
};

export default Customer; 