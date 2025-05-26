import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { getMRR, getChurn, getFulfillmentRate, getMetrics } from '@ewa/api-client';
import { Metrics } from '@ewa/types';

const AdminDashboard = () => {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  // Extender el tipo Metrics para incluir las propiedades adicionales
  type ExtendedMetrics = {
    mrr: number;
    churn: number;
    fulfillmentRate: number;
    activeSubscriptions: number;
    totalCustomers: number;
    totalOrders: number;
  };
  
  const [metrics, setMetrics] = useState<ExtendedMetrics>({
    mrr: 0,
    churn: 0,
    fulfillmentRate: 0,
    activeSubscriptions: 0,
    totalCustomers: 0,
    totalOrders: 0
  });

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
      
      // Cargar métricas
      fetchMetrics();
    } catch (error) {
      console.error('Error parsing user data:', error);
      router.push('/auth');
    }
  }, [router]);

  const fetchMetrics = async () => {
    try {
      // Intentar obtener métricas de la API
      const [mrrData, churnData, fulfillmentRateData, metricsData] = await Promise.all([
        getMRR(),
        getChurn(),
        getFulfillmentRate(),
        getMetrics()
      ]);
      
      // Convertir los datos de la API al formato extendido
      const extendedMetricsData = metricsData as unknown as {
        activeSubscriptions: number;
        totalCustomers: number;
        totalOrders: number;
      };
      
      setMetrics({
        mrr: mrrData,
        churn: churnData,
        fulfillmentRate: fulfillmentRateData,
        activeSubscriptions: extendedMetricsData.activeSubscriptions || 0,
        totalCustomers: extendedMetricsData.totalCustomers || 0,
        totalOrders: extendedMetricsData.totalOrders || 0
      });
    } catch (error) {
      console.error('Error fetching metrics:', error);
      
      // Usar datos mock si la API falla
      setMetrics({
        mrr: 4850,
        churn: 2.3,
        fulfillmentRate: 98.7,
        activeSubscriptions: 127,
        totalCustomers: 156,
        totalOrders: 342
      });
    } finally {
      setLoading(false);
    }
  };

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
        <title>Panel de Administración - EWA Box Water</title>
        <meta name="description" content="Panel de administración para EWA Box Water" />
      </Head>

      <div className="min-h-screen bg-gray-100">
        {/* Header */}
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <div className="flex-shrink-0 flex items-center">
                  <a href="/" className="text-xl font-bold text-ewa-blue">
                    EWA Box Water
                  </a>
                </div>
                {user && (
                  <nav className="hidden sm:ml-6 sm:flex sm:space-x-8">
                    <a href="/admin/dashboard" 
                      className="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium border-ewa-blue text-gray-900">
                      Dashboard
                    </a>
                    <a href="/admin/clients" 
                      className="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700">
                      Clientes
                    </a>
                    <a href="/admin/subscriptions" 
                      className="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700">
                      Suscripciones
                    </a>
                    <a href="/admin/routes" 
                      className="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700">
                      Rutas
                    </a>
                    <a href="/admin/metrics" 
                      className="inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700">
                      Métricas
                    </a>
                  </nav>
                )}
              </div>
              <div className="flex items-center">
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
                  <a
                    href="/auth"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-ewa-blue hover:bg-ewa-dark-blue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ewa-blue"
                  >
                    Iniciar sesión
                  </a>
                )}
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Panel de Administración</h1>
            
            {/* KPI Cards */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {/* MRR Card */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Ingresos Mensuales Recurrentes
                    </dt>
                    <dd className="mt-1 text-3xl font-semibold text-gray-900">
                      ${metrics.mrr.toLocaleString()}
                    </dd>
                  </dl>
                </div>
                <div className="bg-gray-50 px-4 py-4 sm:px-6">
                  <div className="text-sm">
                    <a href="/admin/metrics" className="font-medium text-ewa-blue hover:text-ewa-dark-blue">
                      Ver detalles
                    </a>
                  </div>
                </div>
              </div>

              {/* Churn Rate Card */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Tasa de Cancelación
                    </dt>
                    <dd className="mt-1 text-3xl font-semibold text-gray-900">
                      {metrics.churn}%
                    </dd>
                  </dl>
                </div>
                <div className="bg-gray-50 px-4 py-4 sm:px-6">
                  <div className="text-sm">
                    <a href="/admin/metrics" className="font-medium text-ewa-blue hover:text-ewa-dark-blue">
                      Ver detalles
                    </a>
                  </div>
                </div>
              </div>

              {/* Fulfillment Rate Card */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Tasa de Cumplimiento
                    </dt>
                    <dd className="mt-1 text-3xl font-semibold text-gray-900">
                      {metrics.fulfillmentRate}%
                    </dd>
                  </dl>
                </div>
                <div className="bg-gray-50 px-4 py-4 sm:px-6">
                  <div className="text-sm">
                    <a href="/admin/metrics" className="font-medium text-ewa-blue hover:text-ewa-dark-blue">
                      Ver detalles
                    </a>
                  </div>
                </div>
              </div>

              {/* Active Subscriptions Card */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Suscripciones Activas
                    </dt>
                    <dd className="mt-1 text-3xl font-semibold text-gray-900">
                      {metrics.activeSubscriptions}
                    </dd>
                  </dl>
                </div>
                <div className="bg-gray-50 px-4 py-4 sm:px-6">
                  <div className="text-sm">
                    <a href="/admin/subscriptions" className="font-medium text-ewa-blue hover:text-ewa-dark-blue">
                      Ver suscripciones
                    </a>
                  </div>
                </div>
              </div>

              {/* Total Customers Card */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Total de Clientes
                    </dt>
                    <dd className="mt-1 text-3xl font-semibold text-gray-900">
                      {metrics.totalCustomers}
                    </dd>
                  </dl>
                </div>
                <div className="bg-gray-50 px-4 py-4 sm:px-6">
                  <div className="text-sm">
                    <a href="/admin/clients" className="font-medium text-ewa-blue hover:text-ewa-dark-blue">
                      Ver clientes
                    </a>
                  </div>
                </div>
              </div>

              {/* Total Orders Card */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Total de Pedidos
                    </dt>
                    <dd className="mt-1 text-3xl font-semibold text-gray-900">
                      {metrics.totalOrders}
                    </dd>
                  </dl>
                </div>
                <div className="bg-gray-50 px-4 py-4 sm:px-6">
                  <div className="text-sm">
                    <a href="/admin/orders" className="font-medium text-ewa-blue hover:text-ewa-dark-blue">
                      Ver pedidos
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-8">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Acciones Rápidas</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <a
                  href="/admin/clients/new"
                  className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-ewa-blue hover:bg-ewa-dark-blue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ewa-blue"
                >
                  Añadir Cliente
                </a>
                <a
                  href="/admin/subscriptions/new"
                  className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-ewa-blue hover:bg-ewa-dark-blue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ewa-blue"
                >
                  Crear Suscripción
                </a>
                <a
                  href="/admin/routes/new"
                  className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-ewa-blue hover:bg-ewa-dark-blue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ewa-blue"
                >
                  Planificar Ruta
                </a>
                <a
                  href="/admin/metrics/export"
                  className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-ewa-blue hover:bg-ewa-dark-blue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ewa-blue"
                >
                  Exportar Informes
                </a>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="mt-8">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Actividad Reciente</h2>
              <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                  <li>
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-ewa-blue truncate">
                          Nueva suscripción creada
                        </p>
                        <div className="ml-2 flex-shrink-0 flex">
                          <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Completado
                          </p>
                        </div>
                      </div>
                      <div className="mt-2 sm:flex sm:justify-between">
                        <div className="sm:flex">
                          <p className="flex items-center text-sm text-gray-500">
                            Cliente: Juan Rivera
                          </p>
                        </div>
                        <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                          <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                          </svg>
                          <span>Hace 2 horas</span>
                        </div>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-ewa-blue truncate">
                          Entrega completada
                        </p>
                        <div className="ml-2 flex-shrink-0 flex">
                          <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Completado
                          </p>
                        </div>
                      </div>
                      <div className="mt-2 sm:flex sm:justify-between">
                        <div className="sm:flex">
                          <p className="flex items-center text-sm text-gray-500">
                            Ruta #R123 - 5 entregas
                          </p>
                        </div>
                        <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                          <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                          </svg>
                          <span>Hace 5 horas</span>
                        </div>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-ewa-blue truncate">
                          Nuevo cliente registrado
                        </p>
                        <div className="ml-2 flex-shrink-0 flex">
                          <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Nuevo
                          </p>
                        </div>
                      </div>
                      <div className="mt-2 sm:flex sm:justify-between">
                        <div className="sm:flex">
                          <p className="flex items-center text-sm text-gray-500">
                            Restaurante Sobao
                          </p>
                        </div>
                        <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                          <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                          </svg>
                          <span>Ayer</span>
                        </div>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
