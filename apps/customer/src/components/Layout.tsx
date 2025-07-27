import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Menu, X, LogOut } from 'lucide-react';

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
  const [user, setUser] = useState<{ id: string; name: string; email: string } | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    // Obtener usuario del localStorage
    const userJson = localStorage.getItem('ewa_user');
    let currentUser = null;
    
    if (userJson) {
      try {
        currentUser = JSON.parse(userJson);
        setUser(currentUser);
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('ewa_user');
        localStorage.removeItem('ewa_token');
      }
    }

    if (requireAuth && !currentUser) {
      router.push('/auth');
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
      
      // Mostrar mensaje de éxito con modal
      const logoutMessage = document.createElement('div');
      logoutMessage.className = 'fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50';
      logoutMessage.innerHTML = `
        <div class="bg-white p-8 rounded-lg shadow-xl max-w-md w-full text-center">
          <svg class="mx-auto h-12 w-12 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
          <h3 class="mt-4 text-lg font-medium text-gray-900">Sesión cerrada correctamente</h3>
          <p class="mt-2 text-sm text-gray-500">Redirigiendo a la página de inicio de sesión...</p>
        </div>
      `;
      document.body.appendChild(logoutMessage);
      
      // Redirigir después de mostrar el mensaje
      setTimeout(() => {
        document.body.removeChild(logoutMessage);
        router.push('/auth');
      }, 1500);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      alert('Hubo un problema al cerrar la sesión. Por favor, inténtalo de nuevo.');
    }
  };

  const navigationItems = [
    { href: '/subscriptions', label: 'Suscripciones' },
    { href: '/plans', label: 'Planes' },
    { href: '/oneoffs', label: 'Pedidos Únicos' },
    { href: '/pickup-points', label: 'Puntos Pickup' },
    { href: '/deliveries', label: 'Entregas' },
    { href: '/profile', label: 'Perfil' }
  ];

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content="EWA Box Water - Customer Portal" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <Link href={user ? '/subscriptions' : '/'} className="text-2xl font-bold text-blue-600 hover:text-blue-700">
                  EWA Box Water
                </Link>
                
                {user && (
                  <nav className="hidden md:flex ml-8 space-x-6">
                    {navigationItems.map((item) => (
                      <Link 
                        key={item.href} 
                        href={item.href}
                        className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                          router.pathname === item.href 
                            ? 'text-blue-600 font-semibold' 
                            : 'text-gray-600'
                        }`}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </nav>
                )}
              </div>

              <div className="hidden md:flex items-center space-x-4">
                {user ? (
                  <div className="flex items-center space-x-3">
                    <span className="text-sm text-gray-600">
                      Hola, {user.name}
                    </span>
                    <button
                      onClick={handleLogout}
                      className="inline-flex items-center px-3 py-2 border border-red-200 text-sm font-medium rounded-md text-red-600 bg-white hover:bg-red-50 hover:border-red-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Cerrar sesión
                    </button>
                  </div>
                ) : (
                  <div className="flex space-x-2">
                    <Link href="/auth" className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md">
                      Iniciar Sesión
                    </Link>
                    <Link href="/auth" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                      Registrarse
                    </Link>
                  </div>
                )}
              </div>

              {/* Mobile menu button */}
              <div className="md:hidden">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                >
                  {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Mobile menu */}
            {isMenuOpen && (
              <div className="md:hidden border-t border-gray-200 py-4">
                {user ? (
                  <div className="space-y-2">
                    {navigationItems.map((item) => (
                      <Link 
                        key={item.href} 
                        href={item.href}
                        className={`block px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                          router.pathname === item.href
                            ? 'bg-blue-50 text-blue-600 font-semibold'
                            : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                        }`}
                      >
                        {item.label}
                      </Link>
                    ))}
                    <div className="pt-2">
                      <button
                        onClick={handleLogout}
                        className="w-full inline-flex items-center justify-center px-3 py-2 border border-red-200 text-sm font-medium rounded-md text-red-600 bg-white hover:bg-red-50 hover:border-red-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Cerrar sesión
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Link href="/auth" className="w-full inline-flex items-center justify-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-md">
                      Iniciar Sesión
                    </Link>
                    <Link href="/auth" className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                      Registrarse
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-white border-t">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
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
