import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { getMRR, getChurn, getFulfillmentRate, getMetrics } from '@ewa/api-client';
import { Metrics } from '@ewa/types';

const AdminDashboard = () => {
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
    // Cargar métricas (auth y layout gestionados por AdminLayout)
    fetchMetrics();
  }, []);

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

  return (
    <AdminLayout title="Panel de Administración" description="Panel de administración para el servicio de agua sustentable - Demo" currentPage="dashboard">
      {loading ? (
        <div className="p-6 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-ewa-blue"></div>
        </div>
      ) : (
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Resumen</h2>
            
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
      )}
    </AdminLayout>
  );
};

export default AdminDashboard;
