import React, { useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

interface AdminLayoutProps {
  children: ReactNode;
  title: string;
  description: string;
  currentPage: 'dashboard' | 'users' | 'subscriptions' | 'routes';
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ 
  children, 
  title, 
  description, 
  currentPage 
}) => {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar si el usuario está autenticado
    const userJson = localStorage.getItem('ewa_user');
    if (!userJson) {
      router.push('/auth');
      return;
    }

    try {
      const userData = JSON.parse(userJson);
      if (userData.role !== 'admin' && userData.role !== 'operator' && userData.role !== 'editor') {
        router.push('/auth');
        return;
      }
      setUser(userData);
      setLoading(false);
    } catch (error) {
      console.error('Error parsing user data:', error);
      router.push('/auth');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('ewa_token');
    localStorage.removeItem('ewa_user');
    sessionStorage.clear();
    router.push('/auth');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-ewa-blue"></div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{title} - Panel Administrativo</title>
        <meta name="description" content={description} />
      </Head>

      <div className="min-h-screen bg-gray-100">
        {/* Header */}
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <div className="flex-shrink-0 flex items-center">
                  <a href="/" className="flex items-center">
                    <span className="text-ewa-blue font-medium text-xl hover:text-ewa-dark-blue transition-all duration-300">Panel Administrativo</span>
                  </a>
                </div>
                {user && (
                  <nav className="hidden sm:ml-6 sm:flex sm:space-x-8">
                    <a href="/admin/dashboard" 
                      className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                        currentPage === 'dashboard' 
                          ? 'border-ewa-blue text-gray-900' 
                          : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                      }`}>
                      Dashboard
                    </a>
                    <a href="/admin/users" 
                      className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                        currentPage === 'users' 
                          ? 'border-ewa-blue text-gray-900' 
                          : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                      }`}>
                      Clientes
                    </a>
                    <a href="/admin/subscriptions" 
                      className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                        currentPage === 'subscriptions' 
                          ? 'border-ewa-blue text-gray-900' 
                          : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                      }`}>
                      Suscripciones
                    </a>
                    <a href="/admin/routes" 
                      className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                        currentPage === 'routes' 
                          ? 'border-ewa-blue text-gray-900' 
                          : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                      }`}>
                      Rutas
                    </a>
                  </nav>
                )}
              </div>
              <div className="flex items-center">
                <div className="hidden md:ml-4 md:flex-shrink-0 md:flex md:items-center">
                  <div className="ml-3 relative">
                    <div className="flex items-center space-x-3">
                      <span className="text-sm font-medium text-gray-700">{user?.name}</span>
                      <button
                        onClick={handleLogout}
                        className="text-sm font-medium text-ewa-blue hover:text-ewa-dark-blue"
                      >
                        Cerrar sesión
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
          </div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
            <div className="py-4">
              {children}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminLayout;
