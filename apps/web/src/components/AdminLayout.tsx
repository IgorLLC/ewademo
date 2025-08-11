import React, { useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

interface AdminLayoutProps {
  children: ReactNode;
  title: string;
  description: string;
  currentPage: 'dashboard' | 'users' | 'subscriptions' | 'routes' | 'deliveries';
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
      setLoading(false);
      router.push('/auth');
      return;
    }

    try {
      const userData = JSON.parse(userJson);
      if (userData.role !== 'admin' && userData.role !== 'operator' && userData.role !== 'editor') {
        setLoading(false);
        router.push('/auth');
        return;
      }
      setUser(userData);
      setLoading(false);
    } catch (error) {
      console.error('Error parsing user data:', error);
      setLoading(false);
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

      <div className="min-h-screen bg-gray-100 flex">
        {/* Sidebar (left) */}
        <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex md:flex-col md:sticky md:top-0 md:h-screen">
          <div className="h-16 flex items-center px-4 border-b border-gray-200">
            <a href="/" className="text-ewa-blue font-semibold text-lg hover:text-ewa-dark-blue transition-colors">
              Panel Administrativo
            </a>
          </div>
          {user && (
            <nav className="flex-1 overflow-y-auto py-4">
              <ul className="space-y-1 px-3">
                <li>
                  <a href="/admin/dashboard" className={`block px-3 py-2 rounded-md text-sm font-medium ${currentPage === 'dashboard' ? 'bg-ewa-light-blue text-ewa-blue' : 'text-gray-700 hover:bg-gray-50'}`}>
                    Dashboard
                  </a>
                </li>
                <li>
                  <a href="/admin/users" className={`block px-3 py-2 rounded-md text-sm font-medium ${currentPage === 'users' ? 'bg-ewa-light-blue text-ewa-blue' : 'text-gray-700 hover:bg-gray-50'}`}>
                    Clientes
                  </a>
                </li>
                <li>
                  <a href="/admin/subscriptions" className={`block px-3 py-2 rounded-md text-sm font-medium ${currentPage === 'subscriptions' ? 'bg-ewa-light-blue text-ewa-blue' : 'text-gray-700 hover:bg-gray-50'}`}>
                    Suscripciones
                  </a>
                </li>
                <li>
                  <a href="/admin/deliveries" className={`block px-3 py-2 rounded-md text-sm font-medium ${currentPage === 'deliveries' ? 'bg-ewa-light-blue text-ewa-blue' : 'text-gray-700 hover:bg-gray-50'}`}>
                    Entregas
                  </a>
                </li>
                <li>
                  <a href="/admin/routes" className={`block px-3 py-2 rounded-md text-sm font-medium ${currentPage === 'routes' ? 'bg-ewa-light-blue text-ewa-blue' : 'text-gray-700 hover:bg-gray-50'}`}>
                    Rutas
                  </a>
                </li>
              </ul>
            </nav>
          )}
          <div className="border-t border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700 truncate max-w-[10rem]">{user?.name}</span>
              <button onClick={handleLogout} className="text-sm font-medium text-ewa-blue hover:text-ewa-dark-blue">
                Cerrar sesión
              </button>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 w-0 md:ml-64">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {/* Logo circular arriba del encabezado */}
              <div className="mb-4">
                <div className="w-14 h-14 rounded-full bg-white border border-gray-200 shadow-sm overflow-hidden flex items-center justify-center">
                  <img src="/logo.png" alt="Logo EWA" className="w-12 h-12 object-cover" />
                </div>
              </div>
              <h1 className="text-2xl font-semibold text-gray-900 mb-4">{title}</h1>
              <div className="mt-2">
                {children}
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default AdminLayout;
