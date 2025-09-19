import React, { ReactNode } from 'react';
import { useRouter } from 'next/router';
import CustomerNav from './CustomerNav';
import type { User } from '@ewa/types';
import { logout as logoutApi } from '@ewa/api-client';
import BrandLogo from './BrandLogo';

interface CustomerLayoutProps {
  user: User;
  title: string;
  description?: string;
  actions?: ReactNode;
  children: ReactNode;
}

const CustomerLayout: React.FC<CustomerLayoutProps> = ({
  user,
  title,
  description,
  actions,
  children,
}) => {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logoutApi();
    } finally {
      sessionStorage.clear();
      if (typeof window !== 'undefined') {
        localStorage.removeItem('ewa_user');
        localStorage.removeItem('ewa_token');
      }
      router.replace('/auth');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100/40">
      <header className="bg-white/90 backdrop-blur border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <a href="/customer/subscriptions" className="flex items-center" aria-label="Inicio">
              <BrandLogo size="lg" className="h-24 w-24" />
            </a>
            <CustomerNav />
          </div>
          <div className="hidden md:flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-ewa-blue text-white flex items-center justify-center">
              {user.name?.slice(0, 1).toUpperCase() || 'C'}
            </div>
            <div className="flex items-center gap-3">
              <span className="text-gray-700 text-sm font-medium">
                {user.name || user.email}
              </span>
              <button
                onClick={handleLogout}
                className="text-sm text-gray-500 hover:text-ewa-blue transition"
              >
                Cerrar sesión
              </button>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="md:hidden text-sm text-gray-500 hover:text-ewa-blue transition"
            aria-label="Cerrar sesión"
          >
            Salir
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
            {description && <p className="text-gray-600 mt-1">{description}</p>}
          </div>
          {actions}
        </section>

        {children}
      </main>
    </div>
  );
};

export default CustomerLayout;
