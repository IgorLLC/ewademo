import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Navbar, Footer, Button } from '@ewa/ui';
import { useRouter } from 'next/router';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, title = 'Agua Sustentable Demo' }) => {
  const router = useRouter();
  const [showAuthDropdown, setShowAuthDropdown] = useState(false);
  const [user, setUser] = useState<any>(null);

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

  // Cerrar dropdown cuando se hace click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.auth-dropdown-container')) {
        setShowAuthDropdown(false);
      }
    };

    if (showAuthDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showAuthDropdown]);

  const handleLogout = () => {
    localStorage.removeItem('ewa_user');
    setUser(null);
    setShowAuthDropdown(false);
    router.push('/');
  };

  const handleAuthRedirect = (path: string) => {
    setShowAuthDropdown(false);
    router.push(path);
  };

  const handleAuthButtonClick = () => {
    if (user) {
      // Si hay sesión, toggle del dropdown
      setShowAuthDropdown(!showAuthDropdown);
    } else {
      // Si no hay sesión, redirigir directamente a auth
      router.push('/auth');
    }
  };

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content="Servicio de entrega de agua sustentable - Demo" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <div className="sticky top-0 z-50">
        <Navbar>
          {/* Botón de autenticación mejorado - Versión con estado */}
          <div className="hidden md:block relative auth-dropdown-container">
            <div className="flex items-center">
              {/* Botón principal con dropdown */}
              <div className="relative">
                <button 
                  className={`inline-flex items-center px-6 py-2.5 text-sm font-medium rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                    user 
                      ? 'text-white bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 border-transparent hover:from-blue-700 hover:via-blue-800 hover:to-blue-900 hover:shadow-xl transform hover:-translate-y-0.5 focus:ring-blue-500' 
                      : 'text-blue-600 bg-white border-blue-600 hover:bg-blue-50 hover:border-blue-700 focus:ring-blue-500'
                  }`}
                  onClick={handleAuthButtonClick}
                  aria-expanded={showAuthDropdown}
                  aria-haspopup={user ? "true" : "false"}
                >
                  {user ? (
                    <>
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Mi Cuenta
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                      </svg>
                      Login / Sign Up
                    </>
                  )}
                  {user && (
                    <svg 
                      className={`w-4 h-4 ml-2 transition-transform duration-200 ${showAuthDropdown ? 'rotate-180' : ''}`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  )}
                </button>
                
                {/* Dropdown menu - solo mostrar si hay usuario */}
                {showAuthDropdown && user && (
                  <div 
                    className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50 animate-in slide-in-from-top-2 duration-200"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="auth-button"
                  >
                    {/* Información del usuario */}
                    <div className="px-4 py-3 border-b border-gray-100">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-blue-600">
                              {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                            </span>
                          </div>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">
                            {user.name || 'Usuario'}
                          </p>
                          <p className="text-xs text-gray-500">
                            {user.email || user.role || 'Cliente'}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Opciones para usuario autenticado */}
                    <a 
                      href="/customer" 
                      className="block px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
                      onClick={() => handleAuthRedirect('/customer')}
                    >
                      <div className="flex items-center">
                        <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6H8V5z" />
                        </svg>
                        Mi Portal
                      </div>
                    </a>
                    
                    {user.role === 'admin' || user.role === 'operator' || user.role === 'editor' ? (
                      <a 
                        href="/admin/dashboard" 
                        className="block px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-200"
                        onClick={() => handleAuthRedirect('/admin/dashboard')}
                      >
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                          </svg>
                          Panel Admin
                        </div>
                      </a>
                    ) : null}
                    
                    <div className="border-t border-gray-100 my-1"></div>
                    
                    <button 
                      onClick={handleLogout}
                      className="w-full text-left block px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
                    >
                      <div className="flex items-center">
                        <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Cerrar Sesión
                      </div>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Menú móvil - Botón hamburguesa */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => {
                const mobileMenu = document.getElementById('mobile-menu');
                if (mobileMenu) {
                  mobileMenu.classList.toggle('hidden');
                }
              }}
              className="p-2 rounded-md text-gray-700 hover:text-ewa-blue focus:outline-none"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </Navbar>
        
        {/* Menú móvil desplegable */}
        <div id="mobile-menu" className="hidden md:hidden bg-white shadow-lg absolute w-full z-50">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {/* Botones de autenticación móviles mejorados */}
            <div className="pt-2 space-y-2">
              {user ? (
                <>
                  <div className="px-3 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">
                      Hola, {user.name || 'Usuario'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {user.email || user.role || 'Cliente'}
                    </p>
                  </div>
                  <a href="/customer" className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-ewa-blue hover:bg-gray-50 transition-colors duration-200">
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6H8V5z" />
                    </svg>
                    Mi Portal
                  </a>
                  {user.role === 'admin' || user.role === 'operator' || user.role === 'editor' ? (
                    <a href="/admin/dashboard" className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-ewa-blue hover:bg-gray-50 transition-colors duration-200">
                      <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                      Panel Admin
                    </a>
                  ) : null}
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50 transition-colors duration-200"
                  >
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Cerrar Sesión
                  </button>
                </>
              ) : (
                <>
                  <a href="/auth" className="flex items-center px-3 py-2 rounded-md text-base font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors duration-200">
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                    Iniciar Sesión
                  </a>
                  <a href="/register" className="flex items-center px-3 py-2 rounded-md text-base font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-all duration-200">
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                    Registrarse
                  </a>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <main>{children}</main>
      
      <Footer />
    </>
  );
};

export default Layout;
