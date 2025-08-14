import React from 'react';
import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { Button } from '@ewa/ui';
import Head from 'next/head';
import { useRouter } from 'next/router';

const Home = () => {
  type UserRole = 'admin' | 'operator' | 'editor' | 'customer';
  interface StoredUser {
    name?: string;
    email?: string;
    role?: UserRole | string;
  }

  const [user, setUser] = useState<StoredUser | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Verificar si hay usuario autenticado
    const userJson = localStorage.getItem('ewa_user');
    if (userJson) {
      try {
        const userData = JSON.parse(userJson) as StoredUser;
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
        router.push('/admin');
      } else if (user.role === 'customer') {
        router.push('/customer');
      }
    } else {
      // Usuario no autenticado - ir a login
      router.push('/auth');
    }
  };

  return (
    <Layout title="EWA Box Water - Agua Sustentable">
      <Head>
        <style dangerouslySetInnerHTML={{ __html: `
          .shadow-text {
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
          }
          .hero-gradient {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          }
        `}} />
      </Head>
      
      {/* Hero Section - One Pager */}
      <section className="min-h-screen hero-gradient flex items-center justify-center relative overflow-hidden">
        {/* Fondo con efecto de ondas de agua */}
        <div className="absolute inset-0 opacity-10 z-0">
          <img 
            src="https://images.unsplash.com/photo-1559825481-12a05cc00344?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2001&q=80" 
            alt="Water background" 
            className="w-full h-full object-cover object-center"
          />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-center min-h-screen py-20">
            {/* Contenido principal */}
            <div className="lg:w-1/2 text-center lg:text-left mb-12 lg:mb-0">
              <h1 className="text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                Agua Sustentable
                <span className="block text-4xl lg:text-5xl text-blue-200 mt-2">Directo a tu Puerta</span>
              </h1>
              <p className="text-xl lg:text-2xl text-blue-100 mb-8 max-w-2xl mx-auto lg:mx-0">
                Agua premium en caja con planes de suscripción que ayudan a reducir los residuos plásticos y te mantienen hidratado.
              </p>
              
              {/* Botones de acción */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                {user ? (
                  <Button 
                    size="lg" 
                    onClick={handleAccessRedirect}
                    className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
                  >
                    {user.role === 'admin' || user.role === 'operator' || user.role === 'editor' ? 'Ir al Panel Admin' : 'Ir a Mi Cuenta'}
                  </Button>
                ) : (
                  <>
                    <Button 
                      size="lg" 
                      onClick={() => router.push('/auth')}
                      className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
                    >
                      Iniciar Sesión
                    </Button>
                    <Button 
                      size="lg" 
                      onClick={() => router.push('/register')}
                      className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
                    >
                      Registrarse
                    </Button>
                  </>
                )}
              </div>
            </div>
            
            {/* Imagen del producto */}
            <div className="lg:w-1/2 flex justify-center">
              <div className="relative bg-white/10 backdrop-blur-sm p-6 rounded-2xl shadow-2xl border border-white/20">
                <img 
                  src="https://images.unsplash.com/photo-1536939459926-301728717817?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80" 
                  alt="Boxed water product" 
                  className="w-full max-w-md h-auto rounded-xl shadow-2xl"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-2xl">
                  <div className="text-center p-8">
                    <p className="text-white text-2xl font-bold shadow-text">
                      Agua en caja, mejor para ti y para el planeta
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <svg className="w-6 h-6 text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>
    </Layout>
  );
};

export default Home;
