import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { User } from '@ewa/types';
import { getCurrentUser, logout } from '@ewa/api-client';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
  requireAuth?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  title = 'EWA Box Water - Customer Portal',
  requireAuth = true
}) => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);

    if (requireAuth && !currentUser) {
      router.push('/login');
    }
  }, [requireAuth, router]);

  const handleLogout = () => {
    try {
      // Limpiamos todos los datos de sesión del localStorage
      localStorage.removeItem('ewa_token');
      localStorage.removeItem('ewa_user');
      localStorage.removeItem('ewa_subscription_details');
      
      // Limpiamos cualquier otro dato relacionado con la sesión
      sessionStorage.clear();
      
      // Mostramos un mensaje de confirmación antes de redirigir
      alert('Sesión cerrada correctamente. Redirigiendo a la página de inicio de sesión.');
      
      // Redirigimos a la página principal para que el usuario pueda iniciar sesión nuevamente
      window.location.href = 'http://localhost:3000/auth';
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      alert('Hubo un problema al cerrar la sesión. Por favor, inténtalo de nuevo.');
    }
  };

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content="EWA Box Water - Customer Portal" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <div className="flex-shrink-0 flex items-center">
                  <a href={user ? '/subscriptions' : 'http://localhost:3000'} className="text-xl font-bold text-ewa-blue">
                    EWA Box Water
                  </a>
                </div>
                {user && (
                  <nav className="hidden sm:ml-6 sm:flex sm:space-x-8">
                    <a href="/subscriptions" 
                      className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                        router.pathname === '/subscriptions' 
                          ? 'border-ewa-blue text-gray-900' 
                          : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                      }`}>
                      Suscripciones
                    </a>
                    <a href="/oneoffs" 
                      className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                        router.pathname === '/oneoffs' 
                          ? 'border-ewa-blue text-gray-900' 
                          : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                      }`}>
                      Pedidos Únicos
                    </a>
                    <a href="/profile" 
                      className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                        router.pathname === '/profile' 
                          ? 'border-ewa-blue text-gray-900' 
                          : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                      }`}>
                      Perfil
                    </a>
                  </nav>
                )}
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:items-center">
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
                  <div>
                    <Link href="/login" className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium">
                      Login
                    </Link>
                  </div>
                )}
              </div>
              <div className="-mr-2 flex items-center sm:hidden">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-ewa-blue"
                >
                  <span className="sr-only">Open main menu</span>
                  {isMenuOpen ? (
                    <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  ) : (
                    <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile menu */}
          {isMenuOpen && (
            <div className="sm:hidden">
              {user ? (
                <div className="pt-2 pb-3 space-y-1">
                  <a href="/subscriptions" 
                    className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                      router.pathname === '/subscriptions' 
                        ? 'bg-ewa-light-blue border-ewa-blue text-ewa-blue' 
                        : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
                    }`}>
                    Suscripciones
                  </a>
                  <a href="/oneoffs" 
                    className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                      router.pathname === '/oneoffs' 
                        ? 'bg-ewa-light-blue border-ewa-blue text-ewa-blue' 
                        : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
                    }`}>
                    Pedidos Únicos
                  </a>
                  <a href="/profile" 
                    className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                      router.pathname === '/profile' 
                        ? 'bg-ewa-light-blue border-ewa-blue text-ewa-blue' 
                        : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
                    }`}>
                    Perfil
                  </a>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="pt-2 pb-3 space-y-1">
                  <a href="http://localhost:3000/auth" 
                    className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700">
                    Iniciar sesión
                  </a>
                </div>
              )}
            </div>
          )}
        </header>

        {/* Main content */}
        <main className="flex-grow">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <p className="text-center text-sm text-gray-500">
              &copy; {new Date().getFullYear()} EWA Box Water. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Layout;
