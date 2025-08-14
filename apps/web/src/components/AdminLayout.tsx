import React, { useState, useEffect, ReactNode, useRef } from 'react';
import { readSessionFromCookie, hasAdminAccess } from '../lib/session';
import { useRouter } from 'next/router';
import Head from 'next/head';

interface AdminLayoutProps {
  children: ReactNode;
  title: string;
  description: string;
  currentPage: 'dashboard' | 'users' | 'subscriptions' | 'routes' | 'deliveries';
}

type UserRole = 'admin' | 'operator' | 'editor' | 'customer';
interface StoredUser {
  name?: string;
  email?: string;
  role?: UserRole | string;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ 
  children, 
  title, 
  description, 
  currentPage 
}) => {
  const router = useRouter();
  const [user, setUser] = useState<StoredUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuOpenUp, setMenuOpenUp] = useState(false);
  const menuAnchorRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Preferir cookie httpOnly si existe; fallback a localStorage para compatibilidad
    const cookieUser = readSessionFromCookie();
    if (cookieUser && hasAdminAccess(cookieUser)) {
      setUser(cookieUser);
      setLoading(false);
      return;
    }
    const userJson = localStorage.getItem('ewa_user');
    if (!userJson) {
      setLoading(false);
      router.push('/auth');
      return;
    }
    try {
      const userData = JSON.parse(userJson) as StoredUser;
      if (!hasAdminAccess(userData as any)) {
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

  const handleLogout = async () => {
    try { await fetch('/api/auth/logout', { method: 'POST' }); } catch {}
    localStorage.removeItem('ewa_token');
    localStorage.removeItem('ewa_user');
    sessionStorage.clear();
    router.push('/auth');
  };

  const getInitials = (fullName?: string) => {
    if (!fullName) return 'U';
    const parts = fullName.trim().split(/\s+/);
    const letters = (parts[0]?.[0] || '') + (parts[1]?.[0] || '');
    return letters.toUpperCase() || 'U';
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
        <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex md:flex-col md:sticky md:top-0 md:h-screen relative z-30 overflow-visible">
          {/* Logo superior */}
              <div className="p-4 flex items-center justify-center border-b border-gray-200">
            <a href="/" aria-label="Inicio">
              <div className="w-16 h-16 rounded-full bg-ewa-light-blue flex items-center justify-center overflow-hidden border border-gray-200 shadow-sm">
                <img src="/images/ewa-logo.jpg" alt="EWA" className="w-full h-full object-cover" onError={(e)=>{(e.currentTarget as HTMLImageElement).src='/logo.png';}} />
              </div>
            </a>
          </div>
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
            <div className="relative" ref={menuAnchorRef}>
              <button
                type="button"
                className="w-full inline-flex items-center justify-between gap-3 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm hover:bg-gray-50"
                onClick={() => {
                  const next = !menuOpen;
                  setMenuOpen(next);
                  if (next) {
                    setTimeout(() => {
                      const anchor = menuAnchorRef.current;
                      if (!anchor) return;
                      const rect = anchor.getBoundingClientRect();
                      const estimatedMenuHeight = 160;
                      const hasSpaceDown = rect.bottom + estimatedMenuHeight + 8 <= window.innerHeight;
                      setMenuOpenUp(!hasSpaceDown);
                    }, 0);
                  }
                }}
                aria-expanded={menuOpen}
                aria-haspopup="true"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-full bg-ewa-light-blue text-ewa-dark-blue flex items-center justify-center border border-gray-200 font-semibold text-sm">
                    {getInitials(user?.name)}
                  </div>
                  <div className="min-w-0 text-left">
                    <div className="text-sm font-medium text-gray-900 truncate max-w-[9rem]">
                      {user?.name || 'Usuario'}
                    </div>
                    <div className="text-xs text-gray-500 truncate max-w-[9rem]">
                      {user?.email || ''}
                    </div>
                  </div>
                </div>
                <svg className={`h-4 w-4 text-gray-500 transition-transform ${menuOpen ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clipRule="evenodd" />
                </svg>
              </button>
              {menuOpen && (
                <div className={`absolute left-0 right-0 z-50 ${menuOpenUp ? 'bottom-full mb-2' : 'top-full mt-2'} rounded-md border bg-white shadow-md overflow-hidden max-h-[60vh] overflow-auto`}>
                  <button
                    onClick={() => { setMenuOpen(false); router.push('/admin/profile'); }}
                    className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    Editar perfil
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    Cerrar sesión
                  </button>
                </div>
              )}
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {/* Logo en encabezado principal */}
              <div className="flex items-center justify-center mb-4">
                <div className="w-14 h-14 rounded-full bg-ewa-light-blue flex items-center justify-center overflow-hidden border border-gray-200 shadow-sm">
                  <img src="/images/ewa-logo.jpg" alt="EWA" className="w-full h-full object-cover" onError={(e)=>{(e.currentTarget as HTMLImageElement).src='/logo.png';}} />
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
