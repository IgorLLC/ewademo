import React from 'react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import { Button } from '@ewa/ui';
import Head from 'next/head';

const Home = () => {
  const [user, setUser] = useState<{ id: string; name: string; email: string; role: string } | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Verificar si hay usuario autenticado
    const userJson = localStorage.getItem('ewa_user');
    if (userJson) {
      try {
        const userData = JSON.parse(userJson);
        setUser(userData);
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, []);

  const handleAccessRedirect = () => {
    if (user) {
      // Usuario autenticado - redirigir según rol
      if (user.role === 'admin' || user.role === 'operator' || user.role === 'editor') {
        // Para admin, necesitamos ir a una app admin separada o mostrar error
        alert('Panel admin no disponible en esta app. Use la app principal.');
      } else if (user.role === 'customer') {
        router.push('/subscriptions');
      }
    } else {
      // Usuario no autenticado - ir a auth
      router.push('/auth');
    }
  };

  return (
    <Layout requireAuth={false}>
      <Head>
        <title>Agua Sustentable Demo - Entrega de Agua Ecológica</title>
        <style dangerouslySetInnerHTML={{ __html: `
          .shadow-text {
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
          }
        `}} />
      </Head>
      
      {/* Hero Banner */}
      <section className="bg-blue-50 py-20 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Agua en caja sustentable, directo a tu puerta
              </h1>
              <p className="text-xl text-gray-700 mb-8">
                Agua premium en caja con planes de suscripción que ayudan a reducir los residuos plásticos y te mantienen hidratado.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" onClick={handleAccessRedirect}>
                  {user ? (user.role === 'customer' ? 'Ir a Mis Suscripciones' : 'Mi Cuenta') : 'Acceder'}
                </Button>
              </div>
            </div>
            <div className="md:w-1/2">
              <div className="relative bg-white p-4 rounded-lg shadow-xl overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1536939459926-301728717817?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80" 
                  alt="Boxed water product" 
                  className="w-full h-64 object-cover object-center rounded-lg"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 rounded-lg">
                  <div className="text-center p-8">
                    <p className="text-white text-xl font-semibold shadow-text">Agua en caja, mejor para ti y para el planeta</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Values */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">¿Por qué elegirnos?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
              <div className="relative w-full h-48 mb-6 overflow-hidden rounded-lg">
                <img 
                  src="https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80" 
                  alt="Eco-friendly packaging" 
                  className="w-full h-full object-cover object-center"
                />
              </div>
              <h3 className="text-xl font-semibold mb-2">Eco-Friendly</h3>
              <p className="text-gray-600">
                Nuestras cajas están hechas de materiales sostenibles y son 100% reciclables.
              </p>
            </div>
            <div className="text-center rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
              <div className="relative w-full h-48 mb-6 overflow-hidden rounded-lg">
                <img 
                  src="https://images.unsplash.com/photo-1621964275191-ccc01ef2134c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80" 
                  alt="Water delivery" 
                  className="w-full h-full object-cover object-center"
                />
              </div>
              <h3 className="text-xl font-semibold mb-2">Entrega Conveniente</h3>
              <p className="text-gray-600">
                Entregas regulares según tu horario, para que nunca te quedes sin agua fresca.
              </p>
            </div>
            <div className="text-center rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
              <div className="relative w-full h-48 mb-6 overflow-hidden rounded-lg">
                <img 
                  src="https://images.unsplash.com/photo-1548839140-29a749e1cf4d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80" 
                  alt="Premium water quality" 
                  className="w-full h-full object-cover object-center"
                />
              </div>
              <h3 className="text-xl font-semibold mb-2">Calidad Premium</h3>
              <p className="text-gray-600">
                Agua pura y filtrada que sabe muy bien y te mantiene hidratado.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-blue-600 text-white relative overflow-hidden">
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl font-bold mb-6">¿Listo para hacer el cambio?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Únete a miles de clientes que han cambiado a nuestro servicio de entrega de agua más sostenible.
          </p>
          <Button variant="secondary" size="lg" onClick={handleAccessRedirect}>
            {user ? 'Acceder a mi cuenta' : 'Acceder'}
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default Home;
