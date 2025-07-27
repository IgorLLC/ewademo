import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

const Subscriptions = () => {
  const router = useRouter();

  useEffect(() => {
    // Redirigir a la página correcta de suscripciones
    router.replace('/customer/subscriptions');
  }, [router]);

  return (
    <>
      <Head>
        <title>Redirigiendo... - EWA Box Water</title>
      </Head>
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Redirigiendo a suscripciones...</p>
        </div>
      </div>
    </>
  );
};

export default Subscriptions; 