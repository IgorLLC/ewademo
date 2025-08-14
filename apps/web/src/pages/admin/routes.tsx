import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
// import { getRoutes } from '@ewa/api-client';
import SimpleMapBox from '../../components/SimpleMapBox';
import AdminLayout from '../../components/AdminLayout';

// Definir el tipo de parada en una ruta
interface RouteStop {
  id: string;
  address: string;
  lat: number;
  lng: number;
  status: 'pending' | 'completed';
  eta?: string;
  orderId?: string;
  customer?: string;
}

// Definir una interfaz para nuestras rutas
interface ExtendedRoute {
  id: string;
  name: string;
  area: string;
  driverId: string | null;
  driverName: string | null;
  status: 'active' | 'pending' | 'completed' | 'in-progress' | 'scheduled';
  stops: RouteStop[];
  startTime: string;
  estimatedEndTime: string;
  actualEndTime?: string;
  details?: {
    stops: Array<{
      id: string;
      address: string;
      lat: number;
      lng: number;
      status: 'pending' | 'completed';
      eta: string;
    }>;
  };
}

const AdminRoutes = () => {
  const router = useRouter();
  const [routes, setRoutes] = useState<ExtendedRoute[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedRoute, setSelectedRoute] = useState<ExtendedRoute | null>(null);
  const [activatedFromCalendar, setActivatedFromCalendar] = useState<boolean>(false);
  const [expandedStopIds, setExpandedStopIds] = useState<string[]>([]);

  // Cargar cola desde localStorage si viene del Calendario; si no, mantener vacío
  useEffect(() => {
    // No precargamos datos por defecto; solo si viene activado o hay cola
    try {
      const queueRaw = (typeof window !== 'undefined') ? localStorage.getItem('ewa_routes_queue') : null;
      if (queueRaw) {
        const queue = JSON.parse(queueRaw);
        if (Array.isArray(queue) && queue.length > 0) {
          setRoutes(queue);
        }
      }
    } catch {}
  }, []);

  useEffect(() => {
    if (!router.isReady) return;
    setLoading(true);
    setError(null);
    const activatedParam = router.query.activated === '1';
    try {
      const queueRaw = (typeof window !== 'undefined') ? localStorage.getItem('ewa_routes_queue') : null;
      const queue = queueRaw ? JSON.parse(queueRaw) : [];
      if (Array.isArray(queue) && queue.length > 0) {
        setRoutes(queue);
        setActivatedFromCalendar(true);
      } else {
        setRoutes([]);
        setActivatedFromCalendar(!!activatedParam);
      }
    } catch {
      setRoutes([]);
      setActivatedFromCalendar(!!activatedParam);
    }
    // Auto seleccionar ruta si viene en la URL
    const qid = router.query.routeId as string | undefined;
    if (qid && routes.length > 0) {
      const found = routes.find(r => r.id === qid);
      if (found) setSelectedRoute(found as any);
    } else {
      setSelectedRoute(null);
    }
    setLoading(false);
  }, [router.isReady, router.query]);

  useEffect(() => {
    // Reintentar selección cuando las rutas carguen
    const qid = router.query.routeId as string | undefined;
    if (qid && routes.length > 0 && !selectedRoute) {
      const found = routes.find(r => r.id === qid);
      if (found) setSelectedRoute(found as any);
    }
  }, [routes]);

  const activeDriverName = useMemo(() => {
    return selectedRoute?.driverName || (routes.length > 0 ? routes[0].driverName : null);
  }, [selectedRoute, routes]);

  const fetchRoutes = async () => {
    try {
      // Datos mock de PR para evitar dependencia de API
      const puertoRicoRoutes: ExtendedRoute[] = [
        {
          id: "route1",
          name: "Ruta San Juan - Condado",
          driverId: "d1",
          driverName: "Francisco Javier Morales Cruz",
          status: "in-progress",
          area: "San Juan",
          stops: [
            {
              id: "stop1",
              address: "Calle Loíza 123, San Juan, PR 00911",
              lat: 18.4655,
              lng: -66.0572,
              status: "completed",
              customer: "Carmen Isabel Rodríguez Morales",
              orderId: "ORD-001"
            },
            {
              id: "stop2",
              address: "Calle Taft 45, Condado, San Juan, PR 00911",
              lat: 18.4612,
              lng: -66.0650,
              status: "pending",
              customer: "Ana Sofía Torres Rivera", 
              orderId: "ORD-002"
            },
            {
              id: "stop3",
              address: "Ashford Avenue 1058, Condado, San Juan, PR 00907",
              lat: 18.4571,
              lng: -66.0788,
              status: "pending",
              customer: "Isabella Marie Ortega Ruiz",
              orderId: "ORD-003"
            }
          ],
          startTime: "2025-05-26T08:00:00",
          estimatedEndTime: "2025-05-26T12:00:00"
        },
        {
          id: "route2",
          name: "Ruta Río Piedras - Universidad",
          driverId: "d2",
          driverName: "Elena Patricia Vázquez Rivera",
          status: "completed",
          area: "Río Piedras",
          stops: [
            {
              id: "stop4",
              address: "Ave. Universidad 45, Río Piedras, PR 00925",
              lat: 18.4037,
              lng: -66.0501,
              status: "completed",
              customer: "Rafael Antonio Jiménez López",
              orderId: "ORD-004"
            },
            {
              id: "stop5",
              address: "Calle Gandhi, Río Piedras, PR 00927",
              lat: 18.4008,
              lng: -66.0499,
              status: "completed",
              customer: "Daniela Cristina Soto Mendez",
              orderId: "ORD-005"
            }
          ],
          startTime: "2025-05-26T09:00:00",
          estimatedEndTime: "2025-05-26T11:00:00",
          actualEndTime: "2025-05-26T10:45:00"
        },
        {
          id: "route3",
          name: "Ruta Ponce - Centro",
          driverId: "d3",
          driverName: "Eduardo Luis Herrera Santos",
          status: "active",
          area: "Ponce",
          stops: [
            {
              id: "stop6",
              address: "Calle Marina 78, Ponce, PR 00716",
              lat: 18.0108,
              lng: -66.6140,
              status: "pending",
              customer: "Valentina Rosa Castillo Díaz",
              orderId: "ORD-006"
            },
            {
              id: "stop7",
              address: "Plaza Las Delicias, Ponce, PR 00730",
              lat: 18.0115,
              lng: -66.6141,
              status: "pending",
              customer: "José Carlos Vega Mendoza",
              orderId: "ORD-007"
            },
            {
              id: "stop8",
              address: "Calle Cristina 52, Ponce, PR 00731",
              lat: 18.0125,
              lng: -66.6133,
              status: "pending",
              customer: "Adriana Michelle Ruiz Torres",
              orderId: "ORD-008"
            }
          ],
          startTime: "2025-05-26T10:00:00",
          estimatedEndTime: "2025-05-26T14:00:00"
        },
        {
          id: "route4",
          name: "Ruta Mayagüez",
          driverId: "d4",
          driverName: "Roberto Carlos Sánchez Moreno",
          status: "scheduled",
          area: "Mayagüez",
          stops: [
            {
              id: "stop9",
              address: "Calle Méndez Vigo 55, Mayagüez, PR 00680",
              lat: 18.2010,
              lng: -67.1391,
              status: "pending",
              customer: "Miguel Ángel Díaz Fernández",
              orderId: "ORD-009"
            },
            {
              id: "stop10",
              address: "Plaza Colón, Mayagüez, PR 00680",
              lat: 18.2019,
              lng: -67.1397,
              status: "pending",
              customer: "Sofía Alejandra González Pérez",
              orderId: "ORD-010"
            }
          ],
          startTime: "2025-05-27T09:00:00",
          estimatedEndTime: "2025-05-27T12:00:00"
        },
        {
          id: "route5",
          name: "Ruta Caguas",
          driverId: "d5",
          driverName: "Carmen Lucía Torres Delgado",
          status: "scheduled",
          area: "Caguas",
          stops: [
            {
              id: "stop11",
              address: "Calle Gautier Benítez 42, Caguas, PR 00725",
              lat: 18.2341,
              lng: -66.0361,
              status: "pending",
              customer: "Gabriel Esteban Ramírez Silva",
              orderId: "ORD-011"
            },
            {
              id: "stop12",
              address: "Plaza Palmer, Caguas, PR 00725",
              lat: 18.2349,
              lng: -66.0356,
              status: "pending",
              customer: "Natalia Isabel Martín Rodríguez",
              orderId: "ORD-012"
            },
            {
              id: "stop13",
              address: "Calle Padial 15, Caguas, PR 00725",
              lat: 18.2353,
              lng: -66.0372,
              status: "pending",
              customer: "Alejandro David Fernández Castro",
              orderId: "ORD-013"
            }
          ],
          startTime: "2025-05-27T10:00:00",
          estimatedEndTime: "2025-05-27T14:00:00"
        }
      ];
      
      setRoutes(puertoRicoRoutes);
    } catch (err) {
      console.error('Error fetching routes:', err);
      setError('Failed to load routes. Please try again later.');
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  // Si no está activado, no mostramos rutas
  const baseRoutes = routes;
  // Filtrar rutas según el término de búsqueda y el filtro de estado
  const filteredRoutes = baseRoutes.filter(route => {
    const matchesSearch = 
      route.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      route.area.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (route.driverName && route.driverName.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || route.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Format date to readable string
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('es-PR', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-blue-100 text-blue-800';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'scheduled':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return 'Activa';
      case 'in-progress':
        return 'En progreso';
      case 'completed':
        return 'Completada';
      case 'scheduled':
        return 'Programada';
      default:
        return 'Pendiente';
    }
  };

  const handleViewRoute = (route: ExtendedRoute) => {
    setSelectedRoute(route);
  };

  const toggleStopExpansion = (stopId: string) => {
    setExpandedStopIds(prev => prev.includes(stopId) ? prev.filter(id => id !== stopId) : [...prev, stopId]);
  };

  return (
    <AdminLayout 
      title="Cola de Entregas" 
      description="Gestión de entregas pendientes y en progreso" 
      currentPage="routes"
    >
      <div className="py-2">
          {/* Banner de estado de la cola */}
          {!activatedFromCalendar ? (
            <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded mb-4 flex items-center gap-3">
              <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="font-medium">Cola de entregas vacía</p>
                <p className="text-sm text-blue-700">Las entregas programadas desde el calendario aparecerán aquí para ser asignadas a conductores</p>
              </div>
            </div>
          ) : (
            <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded mb-4 flex items-center gap-3">
              <svg className="h-5 w-5 text-green-600" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-7.25 7.25a1 1 0 01-1.414 0l-3-3a1 1 0 111.414-1.414l2.293 2.293 6.543-6.543a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
              <div>
                <p className="font-medium">Cola de entregas activa</p>
                <p className="text-sm text-green-700">Entregas enviadas desde el calendario están listas para gestión</p>
              </div>
            </div>
          )}

          {/* Search and filter */}
          <div className="bg-white shadow rounded-lg p-4 my-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="w-full md:w-1/2 mb-4 md:mb-0">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    name="search"
                    id="search"
                    className="focus:ring-ewa-blue focus:border-ewa-blue block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                    placeholder="Buscar entregas por cliente, área o conductor..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="w-full md:w-1/4">
                <select
                  id="status"
                  name="status"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-ewa-blue focus:border-ewa-blue sm:text-sm rounded-md"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">Todos los estados</option>
                  <option value="active">Activas</option>
                  <option value="in-progress">En progreso</option>
                  <option value="completed">Completadas</option>
                  <option value="scheduled">Programadas</option>
                  <option value="pending">Pendientes</option>
                </select>
              </div>
            </div>
          </div>

           {/* Main content */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Delivery Queue */}
            <div className="lg:col-span-4">
              <div className="bg-white shadow rounded-lg">
                 <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                        </svg>
                        Cola de Entregas
                        {(activatedFromCalendar || routes.length > 0) && (
                          <span className="inline-flex items-center gap-1 text-xs text-green-700 bg-green-50 border border-green-200 rounded px-2 py-0.5">
                            <svg className="h-3 w-3 text-green-600" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-7.25 7.25a1 1 0 01-1.414 0l-3-3a1 1 0 111.414-1.414l2.293 2.293 6.543-6.543a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
                            Activa
                          </span>
                        )}
                      </h2>
                      <p className="mt-1 text-sm text-gray-600">Entregas pendientes por procesar</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-600">{filteredRoutes.length}</div>
                      <div className="text-xs text-gray-500">en cola</div>
                    </div>
                  </div>
                   {!activatedFromCalendar && (
                     <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                       <p className="text-sm text-gray-600">💡 <strong>Tip:</strong> Las entregas programadas desde el calendario aparecerán aquí</p>
                     </div>
                   )}
                </div>
                 <div className="border-t border-gray-200">
                  <ul className="divide-y divide-gray-200">
                    {loading ? (
                      <li className="px-4 py-4 flex items-center justify-center">
                        <svg className="animate-spin h-5 w-5 text-ewa-blue" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      </li>
                    ) : error ? (
                      <li className="px-4 py-4 text-center text-red-500">{error}</li>
                    ) : filteredRoutes.length === 0 ? (
                      <li className="px-4 py-8 text-center">
                        <svg className="mx-auto h-8 w-8 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        <p className="text-sm text-gray-500">No hay entregas en la cola</p>
                        <p className="text-xs text-gray-400 mt-1">Las entregas programadas aparecerán aquí</p>
                      </li>
                    ) : (
                       filteredRoutes.map((route, index) => (
                        <li 
                          key={route.id} 
                           className={`px-4 py-4 border-l-4 ${activatedFromCalendar ? 'cursor-pointer hover:bg-gray-50 border-l-blue-400' : 'opacity-50 cursor-not-allowed border-l-gray-300'} ${selectedRoute?.id === route.id ? 'bg-blue-50 border-l-blue-600' : ''}`}
                           onClick={() => activatedFromCalendar && handleViewRoute(route)}
                        >
                          <div className="flex items-start justify-between">
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-800 text-xs font-semibold">{index + 1}</span>
                                <p className="text-sm font-semibold text-gray-900 truncate">{route.name}</p>
                              </div>
                        <p className="text-sm text-gray-600 truncate ml-8">📍 {route.area}</p>
                        <p className="text-xs text-gray-500 truncate ml-8 mt-0.5">🗓️ Sale: {new Date(route.startTime).toLocaleString('es-PR', {year:'numeric', month:'2-digit', day:'2-digit', hour:'2-digit', minute:'2-digit'})}</p>
                              <p className="text-xs text-gray-500 ml-8 mt-1">📦 Entrega independiente con {(Array.isArray(route.stops) ? route.stops.length : (route.details?.stops?.length || 0))} paradas</p>
                              <div className="mt-1 flex items-center">
                                <div className="flex-shrink-0 h-5 w-5 mr-1">
                                  <img 
                                    className="h-5 w-5 rounded-full object-cover border border-gray-200" 
                                    src={`https://randomuser.me/api/portraits/${route.driverName?.includes('María') || route.driverName?.includes('Ana') ? 'women' : 'men'}/${(String(route.id).length % 10) + 1}.jpg`}
                                    alt={route.driverName || 'Conductor'}
                                  />
                                </div>
                                <div>
                                  <span className="ml-1 text-xs text-gray-500">{route.driverName || 'Sin conductor asignado'}</span>
                                  {route.driverName && (
                                    <div className="flex items-center ml-1 mt-1">
                                      <svg className="h-3 w-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                      </svg>
                                      <span className="ml-1 text-xs text-gray-500">{(() => {
                                        const sid = String(route.id || '0');
                                        const a = (sid.length % 9) + 1;
                                        const b = ((sid.charCodeAt(0) || 0) % 9) + 1;
                                        const c = ((sid.charCodeAt(1) || 0) % 9) + 1;
                                        return `(787) ${a}${b}${c}-${a}${b}${a}${c}`;
                                      })()}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                              <span className={`px-2 py-1 inline-flex text-xs leading-4 font-semibold rounded-full ${getStatusBadgeClass(route.status)}`}>
                                {getStatusLabel(route.status)}
                              </span>
                              {selectedRoute?.id === route.id && (
                                <span className="inline-flex items-center gap-1 text-xs text-blue-700 bg-blue-100 border border-blue-300 rounded px-2 py-1">
                                  <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20"><path d="M10 12l-6.5-6.5 1.5-1.5L10 9l5-5 1.5 1.5L10 12z"/></svg>
                                  Seleccionada
                                </span>
                              )}
                            </div>
                          </div>
                        </li>
                      ))
                    )}
                  </ul>
                </div>
              </div>
            </div>

            {/* Delivery Details & Map */}
            <div className="lg:col-span-8">
              <div className="bg-white shadow rounded-lg">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {selectedRoute ? `Detalles de Entrega - ${selectedRoute.name}` : 'Detalles de Entrega'}
                  </h2>
                  <p className="mt-1 text-sm text-gray-600">
                    {selectedRoute 
                      ? 'Información específica de la entrega seleccionada' 
                      : 'Selecciona una entrega de la cola para ver sus detalles y ubicación'}
                  </p>
                </div>
                <div className="p-6">
                {activatedFromCalendar && selectedRoute ? (
                  <div>
                    <div className="mb-4">
                      <SimpleMapBox 
                        latitude={selectedRoute.area === "Ponce" ? 18.0108 : 
                          (Array.isArray(selectedRoute.stops) && selectedRoute.stops.length > 0 ? 
                            (selectedRoute.stops[0]?.lat || 18.2208) : 18.2208)}
                        longitude={selectedRoute.area === "Ponce" ? -66.6140 : 
                          (Array.isArray(selectedRoute.stops) && selectedRoute.stops.length > 0 ? 
                            (selectedRoute.stops[0]?.lng || -66.5901) : -66.5901)}
                        height="400px"
                        className="w-full border border-gray-300 rounded-md"
                        interactive={false}
                        showDirectionArrows={false}
                        routePath={(Array.isArray(selectedRoute.stops) ? selectedRoute.stops : (selectedRoute.details?.stops || []))
                          .map((s:any)=>({lng:Number(s.lng), lat:Number(s.lat)}))
                          .filter(p=>Number.isFinite(p.lng) && Number.isFinite(p.lat))}
                        pickupPoint={(() => {
                          const stops = Array.isArray(selectedRoute.stops) ? selectedRoute.stops : (selectedRoute.details?.stops || []);
                          if (stops && stops.length > 0 && Number.isFinite(stops[0]?.lat) && Number.isFinite(stops[0]?.lng)) {
                            return { lat: Number(stops[0].lat), lng: Number(stops[0].lng) };
                          }
                          // fallback a San Juan
                          return { lat: 18.4655, lng: -66.1057 };
                        })()}
                        pickupLabel="Punto de recogido"
                        fitToPath={true}
                      />
                    </div>
                    
                    <div className="border-t border-gray-200 pt-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-xl font-medium text-gray-900">{selectedRoute.name}</h3>
                          <p className="text-sm text-gray-500">{selectedRoute.area}</p>
                        </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(selectedRoute.status)}`}>
                          {getStatusLabel(selectedRoute.status)}
                        </span>
                        <button
                          type="button"
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
                          title="Descargar PDF (próximamente)"
                          disabled
                        >
                          <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path d="M3 3a2 2 0 012-2h6l4 4v3h-2V6.414L10.586 2H5a1 1 0 00-1 1v6H2V3z" />
                            <path d="M5 12a1 1 0 011-1h2V8h4v3h2a1 1 0 011 1v5a1 1 0 01-1 1H6a1 1 0 01-1-1v-5z" />
                            <path d="M9 10v3h2v-3H9z" />
                          </svg>
                          Descargar PDF
                        </button>
                      </div>
                      </div>
                      
                      <div className="alert-brand mb-4">
                        <div className="flex items-center gap-2 mb-2">
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{color:'#00A8E1'}}>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.768 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                          </svg>
                          <p className="text-sm font-medium" style={{color:'#00A8E1'}}>Entrega Específica</p>
                        </div>
                        <p className="text-sm" style={{color:'#00A8E1'}}>Esta información corresponde únicamente a la entrega <strong>"{selectedRoute.name}"</strong>. Otras entregas en la cola tienen conductores, horarios y paradas diferentes.</p>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="text-sm font-medium text-gray-500 flex items-center gap-1">
                              <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                              Conductor Asignado
                            </h4>
                            <div className="flex items-center mt-1">
                              <div className="flex-shrink-0 h-10 w-10 mr-3">
                                <img 
                                  className="h-10 w-10 rounded-full object-cover border border-gray-200" 
                                  src={`https://randomuser.me/api/portraits/${selectedRoute.driverName?.includes('María') || selectedRoute.driverName?.includes('Ana') ? 'women' : 'men'}/${(String(selectedRoute.id).length % 10) + 1}.jpg`}
                                  alt={selectedRoute.driverName || 'Conductor'}
                                />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-900">{selectedRoute.driverName || 'Sin conductor asignado'}</p>
                                {selectedRoute.driverName && (
                                  <div>
                                    <div className="flex items-center mt-1">
                                      <div className="flex items-center">
                                        {[...Array(5)].map((_, i) => (
                                          <svg key={i} className={`h-3 w-3 ${i < 4 ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                          </svg>
                                        ))}
                                        <span className="ml-1 text-xs text-gray-500">4.0/5.0</span>
                                      </div>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">{selectedRoute.id.length} años de experiencia</p>
                                    <div className="flex items-center mt-1">
                                      <svg className="h-3 w-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                      </svg>
                                      <span className="ml-1 text-xs text-gray-500">{`(787) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`}</span>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-gray-500">Fecha de inicio</h4>
                            <p className="text-sm text-gray-900">{formatDate(selectedRoute.startTime)}</p>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-gray-500">Fin estimado</h4>
                            <p className="text-sm text-gray-900">{formatDate(selectedRoute.estimatedEndTime)}</p>
                          </div>
                          {selectedRoute.actualEndTime && (
                            <div>
                              <h4 className="text-sm font-medium text-gray-500">Fin real</h4>
                              <p className="text-sm text-gray-900">{formatDate(selectedRoute.actualEndTime)}</p>
                            </div>
                          )}
                        </div>
                        <div className="border border-gray-200 rounded-md p-4 flex flex-col items-center justify-center">
                          <h4 className="text-sm font-medium text-gray-500 mb-2">Código de seguimiento</h4>
                          <div className="mb-2">
                            <img 
                              src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=EWA-ROUTE-${selectedRoute.id}`} 
                              alt="Código QR de seguimiento" 
                              width="120" 
                              height="120" 
                              className="border border-gray-200 rounded-md"
                            />
                          </div>
                          <p className="text-xs font-medium text-gray-700 text-center">EWA-ROUTE-{selectedRoute.id}</p>
                          <p className="text-xs text-gray-500 text-center">Escanee para seguimiento en tiempo real</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <h4 className="text-md font-medium text-gray-900 mt-4 flex items-center gap-2">
                        <svg className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                        </svg>
                        Paradas de esta Entrega ({Array.isArray(selectedRoute.stops) ? selectedRoute.stops.length : 
                        (selectedRoute.details && Array.isArray(selectedRoute.details.stops) ? selectedRoute.details.stops.length : 0)})
                      </h4>
                      <p className="text-sm text-gray-600 mb-4 bg-blue-50 p-3 rounded-lg border border-blue-200">
                        📍 <strong>Información específica:</strong> Estas son únicamente las paradas para la entrega seleccionada <strong>"{selectedRoute.name}"</strong>. Cada entrega en la cola tiene sus propias paradas independientes.
                      </p>
                      <ul className="divide-y divide-gray-200 border border-gray-200 rounded-md">
                        {Array.isArray(selectedRoute.stops) ? selectedRoute.stops.map((stop, idx) => {
                          const isExpanded = expandedStopIds.includes(stop.id);
                          return (
                            <li key={stop.id} className="px-4 py-3">
                              <button type="button" onClick={() => toggleStopExpansion(stop.id)} className="w-full text-left">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-start gap-3">
                                    <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gray-200 text-[11px] font-semibold text-gray-700">{idx + 1}</span>
                                    <div>
                                      <div className="text-[11px] text-gray-500 -mt-0.5 mb-0.5">Parada {idx + 1}</div>
                                      <p className="text-sm font-medium text-gray-900">{stop.customer ? `${stop.customer} — ` : ''}{stop.orderId ? `Orden ${stop.orderId}` : stop.address}</p>
                                      <p className="text-xs text-gray-500">{stop.address}</p>
                                      <p className="text-xs text-gray-500">ID: {stop.id}{stop.eta ? ` · ETA: ${stop.eta}` : ''}</p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${stop.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                      {stop.status === 'completed' ? 'Completada' : 'Pendiente'}
                                    </span>
                                    <svg className={`h-4 w-4 text-gray-500 transition-transform ${isExpanded ? 'transform rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.127l3.71-3.896a.75.75 0 111.08 1.04l-4.24 4.46a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z" clipRule="evenodd"/></svg>
                                  </div>
                                </div>
                              </button>
                              {isExpanded && (
                                <div className="mt-3 bg-gray-50 border border-gray-200 rounded-md p-3 text-sm text-gray-700">
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {stop.customer && (
                                      <div>
                                        <div className="text-xs text-gray-500">Cliente</div>
                                        <div className="font-medium text-gray-900">{stop.customer}</div>
                                      </div>
                                    )}
                                    {stop.orderId && (
                                      <div>
                                        <div className="text-xs text-gray-500">Orden</div>
                                        <div className="font-medium text-gray-900">{stop.orderId}</div>
                                      </div>
                                    )}
                                    <div>
                                      <div className="text-xs text-gray-500">Dirección</div>
                                      <div className="text-gray-900">{stop.address}</div>
                                    </div>
                                    {Number.isFinite(stop.lat) && Number.isFinite(stop.lng) && (
                                      <div>
                                        <div className="text-xs text-gray-500">Coordenadas</div>
                                        <div className="text-gray-900">{Number(stop.lat).toFixed(5)}, {Number(stop.lng).toFixed(5)}</div>
                                      </div>
                                    )}
                                    <div>
                                      <div className="text-xs text-gray-500">Estado</div>
                                      <div className="text-gray-900">{stop.status === 'completed' ? 'Completada' : 'Pendiente'}{stop.eta ? ` · ETA: ${stop.eta}` : ''}</div>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </li>
                          );
                        }) : selectedRoute.details && Array.isArray(selectedRoute.details.stops) ? selectedRoute.details.stops.map((stop: {
                          id: string;
                          address: string;
                          lat: number;
                          lng: number;
                          status: 'pending' | 'completed';
                          eta: string;
                        }, idx: number) => {
                          const isExpanded = expandedStopIds.includes(stop.id);
                          return (
                            <li key={stop.id} className="px-4 py-3">
                              <button type="button" onClick={() => toggleStopExpansion(stop.id)} className="w-full text-left">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-start gap-3">
                                    <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gray-200 text-[11px] font-semibold text-gray-700">{idx + 1}</span>
                                    <div>
                                      <div className="text-[11px] text-gray-500 -mt-0.5 mb-0.5">Parada {idx + 1}</div>
                                      <p className="text-sm font-medium text-gray-900">{stop.address}</p>
                                      <p className="text-xs text-gray-500">ID: {stop.id}{stop.eta ? ` · ETA: ${stop.eta}` : ''}</p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${stop.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                      {stop.status === 'completed' ? 'Completada' : 'Pendiente'}
                                    </span>
                                    <svg className={`h-4 w-4 text-gray-500 transition-transform ${isExpanded ? 'transform rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.127l3.71-3.896a.75.75 0 111.08 1.04l-4.24 4.46a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z" clipRule="evenodd"/></svg>
                                  </div>
                                </div>
                              </button>
                              {isExpanded && (
                                <div className="mt-3 bg-gray-50 border border-gray-200 rounded-md p-3 text-sm text-gray-700">
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div>
                                      <div className="text-xs text-gray-500">Dirección</div>
                                      <div className="text-gray-900">{stop.address}</div>
                                    </div>
                                    {Number.isFinite(stop.lat) && Number.isFinite(stop.lng) && (
                                      <div>
                                        <div className="text-xs text-gray-500">Coordenadas</div>
                                        <div className="text-gray-900">{Number(stop.lat).toFixed(5)}, {Number(stop.lng).toFixed(5)}</div>
                                      </div>
                                    )}
                                    <div>
                                      <div className="text-xs text-gray-500">Estado</div>
                                      <div className="text-gray-900">{stop.status === 'completed' ? 'Completada' : 'Pendiente'}{stop.eta ? ` · ETA: ${stop.eta}` : ''}</div>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </li>
                          );
                        }) : (
                          <li className="px-4 py-3 text-center text-gray-500">
                            No hay paradas disponibles para esta ruta
                          </li>
                        )}
                      </ul>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-50 h-96 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                    <div className="text-center">
                      <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <div className="mt-4">
                        <h3 className="text-lg font-medium text-gray-900">Información de Entrega</h3>
                        <p className="mt-2 text-sm text-gray-500">
                          {activatedFromCalendar 
                            ? 'Haz clic en una entrega de la cola para ver su ubicación, detalles del cliente y información de entrega' 
                            : 'Programa entregas desde el calendario para comenzar a gestionar la cola'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Help section removed per request */}
        {/* Pagination */}
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 mt-4 rounded-lg shadow">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Anterior
              </button>
              <button
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Siguiente
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Mostrando <span className="font-medium">1</span> a <span className="font-medium">{filteredRoutes.length}</span> de{' '}
                  <span className="font-medium">{filteredRoutes.length}</span> resultados
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    <span className="sr-only">Anterior</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <button
                    aria-current="page"
                    className="z-10 bg-ewa-light-blue border-ewa-blue text-ewa-blue relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                  >
                    1
                  </button>
                  <button
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    <span className="sr-only">Siguiente</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
    </AdminLayout>
  );
};

export default AdminRoutes;
