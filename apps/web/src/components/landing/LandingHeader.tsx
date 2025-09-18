import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

interface LandingHeaderProps {
  user?: any;
  onAccessRedirect: () => void;
}

const LandingHeader: React.FC<LandingHeaderProps> = ({ user, onAccessRedirect }) => {
  const router = useRouter();
  const [showAuthDropdown, setShowAuthDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

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
    setShowAuthDropdown(false);
    setShowMobileMenu(false);
    router.push('/');
  };

  const handleAuthRedirect = (path: string) => {
    setShowAuthDropdown(false);
    setShowMobileMenu(false);
    router.push(path);
  };

  const handleAuthButtonClick = () => {
    if (user) {
      setShowAuthDropdown(!showAuthDropdown);
    } else {
      router.push('/auth');
    }
  };

  return (
    <>
      {/* Top Bar - Free Shipping */}
      <div className="bg-blue-800 text-white py-2 text-center text-sm">
        <div className="container mx-auto px-4">
          <span>¡Envío gratis en todas las órdenes de Puerto Rico! </span>
          <a href="/plans" className="underline hover:no-underline ml-1">
            Comprar Ahora
          </a>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            {/* Left Navigation Links */}
            <div className="hidden lg:flex items-center space-x-8">
              <a href="/plans" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                planes
              </a>
              <a href="/subscriptions" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                suscribirse
              </a>
              <a href="/about" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                aprender
              </a>
              <a href="/blog" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                blog
              </a>
            </div>

            {/* Center Logo */}
            <div className="flex-shrink-0">
              <a href="/" className="flex items-center">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center mr-3">
                  <span className="text-white font-bold text-lg">E</span>
                </div>
                <span className="text-2xl font-bold text-gray-800">ewa</span>
                <span className="text-xs text-gray-500 ml-1">®</span>
              </a>
            </div>

            {/* Right Navigation Links */}
            <div className="hidden lg:flex items-center space-x-8">
              <a href="/guarantee" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                garantía
              </a>
              <a href="/stores" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                encontrar tienda
              </a>
              
              {/* Authentication Section */}
              {user ? (
                /* User is logged in - Show account dropdown */
                <div className="relative auth-dropdown-container">
                  <button 
                    onClick={handleAuthButtonClick}
                    className="flex items-center text-gray-700 hover:text-blue-600 font-medium transition-colors"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Mi Cuenta
                    <svg 
                      className={`w-4 h-4 ml-1 transition-transform duration-200 ${showAuthDropdown ? 'rotate-180' : ''}`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {/* Dropdown menu */}
                  {showAuthDropdown && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-blue-600">
                              {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                            </span>
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
                      
                      <a 
                        href="/customer" 
                        className="block px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                        onClick={() => handleAuthRedirect('/customer')}
                      >
                        Mi Portal
                      </a>
                      
                      {user.role === 'admin' || user.role === 'operator' || user.role === 'editor' ? (
                        <a 
                          href="/admin/dashboard" 
                          className="block px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                          onClick={() => handleAuthRedirect('/admin/dashboard')}
                        >
                          Panel Admin
                        </a>
                      ) : null}
                      
                      <div className="border-t border-gray-100 my-1"></div>
                      
                      <button 
                        onClick={handleLogout}
                        className="w-full text-left block px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        Cerrar Sesión
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                /* User is not logged in - Show clear Login/Signup buttons */
                <div className="flex items-center space-x-4">
                  <a 
                    href="/auth" 
                    className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                  >
                    Iniciar Sesión
                  </a>
                  <a 
                    href="/register" 
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium transition-colors"
                  >
                    Registrarse
                  </a>
                </div>
              )}

            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden">
              <button 
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="p-2 rounded-md text-gray-700 hover:text-blue-600 focus:outline-none"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="lg:hidden bg-white border-t border-gray-200">
            <div className="px-4 py-2 space-y-1">
              <a href="/plans" className="block px-3 py-2 text-gray-700 hover:text-blue-600 font-medium">
                planes
              </a>
              <a href="/subscriptions" className="block px-3 py-2 text-gray-700 hover:text-blue-600 font-medium">
                suscribirse
              </a>
              <a href="/about" className="block px-3 py-2 text-gray-700 hover:text-blue-600 font-medium">
                aprender
              </a>
              <a href="/blog" className="block px-3 py-2 text-gray-700 hover:text-blue-600 font-medium">
                blog
              </a>
              <a href="/guarantee" className="block px-3 py-2 text-gray-700 hover:text-blue-600 font-medium">
                garantía
              </a>
              <a href="/stores" className="block px-3 py-2 text-gray-700 hover:text-blue-600 font-medium">
                encontrar tienda
              </a>
              
              {user ? (
                <>
                  <div className="border-t border-gray-200 my-2"></div>
                  <div className="px-3 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">
                      Hola, {user.name || 'Usuario'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {user.email || user.role || 'Cliente'}
                    </p>
                  </div>
                  <a href="/customer" className="block px-3 py-2 text-gray-700 hover:text-blue-600 font-medium">
                    Mi Portal
                  </a>
                  {user.role === 'admin' || user.role === 'operator' || user.role === 'editor' ? (
                    <a href="/admin/dashboard" className="block px-3 py-2 text-gray-700 hover:text-blue-600 font-medium">
                      Panel Admin
                    </a>
                  ) : null}
                  <button 
                    onClick={handleLogout}
                    className="block w-full text-left px-3 py-2 text-red-600 hover:bg-red-50 font-medium"
                  >
                    Cerrar Sesión
                  </button>
                </>
              ) : (
                <>
                  <div className="border-t border-gray-200 my-2"></div>
                  <a href="/auth" className="block px-3 py-2 text-blue-600 hover:bg-blue-50 font-medium">
                    Iniciar Sesión
                  </a>
                  <a href="/register" className="block px-3 py-2 text-white bg-blue-600 hover:bg-blue-700 font-medium rounded">
                    Registrarse
                  </a>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default LandingHeader;
