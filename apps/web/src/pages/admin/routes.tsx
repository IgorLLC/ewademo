import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { getRoutes } from '@ewa/api-client';
import SimpleMapBox from '../../components/SimpleMapBox';
import AdminLayout from '../../components/AdminLayout';

// Definir el tipo de parada en una ruta
interface RouteStop {
  id: string;
  address: string;
  lat: number;
  lng: number;
  status: 'pending' | 'completed';
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

  useEffect(() => {
    // Cargar rutas cuando el componente se monta
    fetchRoutes();
  }, []);

  const fetchRoutes = async () => {
    try {
      // Intentar obtener datos de la API
      const routesData = await getRoutes();
      
      // Verificar si los datos tienen la estructura esperada
      if (Array.isArray(routesData) && routesData.length > 0) {
        // Verificar si los datos tienen la estructura que esperamos
        const hasExpectedStructure = routesData.some(route => 
          typeof route.name === 'string' && typeof route.area === 'string');
        
        if (hasExpectedStructure) {
          setRoutes(routesData as unknown as ExtendedRoute[]);
          return;
        }
      }
      
      // Si llegamos aquí, los datos no tienen la estructura esperada
      // Usar datos mock de Puerto Rico
      const puertoRicoRoutes: ExtendedRoute[] = [
        {
          id: "route1",
          name: "Ruta San Juan - Condado",
          driverId: "d1",
          driverName: "Carlos Rodríguez",
          status: "in-progress",
          area: "San Juan",
          stops: [
            {
              id: "stop1",
              address: "Calle Loíza 123, San Juan, PR 00911",
              lat: 18.4655,
              lng: -66.0572,
              status: "pending"
            },
            {
              id: "stop2",
              address: "Calle Taft 45, Condado, San Juan, PR 00911",
              lat: 18.4612,
              lng: -66.0650,
              status: "completed"
            },
            {
              id: "stop3",
              address: "Ashford Avenue 1058, Condado, San Juan, PR 00907",
              lat: 18.4571,
              lng: -66.0788,
              status: "pending"
            }
          ],
          startTime: "2025-05-26T08:00:00",
          estimatedEndTime: "2025-05-26T12:00:00"
        },
        {
          id: "route2",
          name: "Ruta Río Piedras - Universidad",
          driverId: "d2",
          driverName: "Ana Martínez",
          status: "completed",
          area: "Río Piedras",
          stops: [
            {
              id: "stop4",
              address: "Ave. Universidad 45, Río Piedras, PR 00925",
              lat: 18.4037,
              lng: -66.0501,
              status: "completed"
            },
            {
              id: "stop5",
              address: "Calle Gandhi, Río Piedras, PR 00927",
              lat: 18.4008,
              lng: -66.0499,
              status: "completed"
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
          driverName: "Luis Vega",
          status: "active",
          area: "Ponce",
          stops: [
            {
              id: "stop6",
              address: "Calle Marina 78, Ponce, PR 00716",
              lat: 18.0108,
              lng: -66.6140,
              status: "pending"
            },
            {
              id: "stop7",
              address: "Plaza Las Delicias, Ponce, PR 00730",
              lat: 18.0115,
              lng: -66.6141,
              status: "pending"
            },
            {
              id: "stop8",
              address: "Calle Cristina 52, Ponce, PR 00731",
              lat: 18.0125,
              lng: -66.6133,
              status: "pending"
            }
          ],
          startTime: "2025-05-26T10:00:00",
          estimatedEndTime: "2025-05-26T14:00:00"
        },
        {
          id: "route4",
          name: "Ruta Mayagüez",
          driverId: "d4",
          driverName: "Roberto Sánchez",
          status: "scheduled",
          area: "Mayagüez",
          stops: [
            {
              id: "stop9",
              address: "Calle Méndez Vigo 55, Mayagüez, PR 00680",
              lat: 18.2010,
              lng: -67.1391,
              status: "pending"
            },
            {
              id: "stop10",
              address: "Plaza Colón, Mayagüez, PR 00680",
              lat: 18.2019,
              lng: -67.1397,
              status: "pending"
            }
          ],
          startTime: "2025-05-27T09:00:00",
          estimatedEndTime: "2025-05-27T12:00:00"
        },
        {
          id: "route5",
          name: "Ruta Caguas",
          driverId: "d5",
          driverName: "María Torres",
          status: "scheduled",
          area: "Caguas",
          stops: [
            {
              id: "stop11",
              address: "Calle Gautier Benítez 42, Caguas, PR 00725",
              lat: 18.2341,
              lng: -66.0361,
              status: "pending"
            },
            {
              id: "stop12",
              address: "Plaza Palmer, Caguas, PR 00725",
              lat: 18.2349,
              lng: -66.0356,
              status: "pending"
            },
            {
              id: "stop13",
              address: "Calle Padial 15, Caguas, PR 00725",
              lat: 18.2353,
              lng: -66.0372,
              status: "pending"
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

  // Filtrar rutas según el término de búsqueda y el filtro de estado
  const filteredRoutes = routes.filter(route => {
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

  return (
    <AdminLayout 
      title="Gestión de Rutas" 
      description="Administración de rutas de entrega" 
      currentPage="routes"
    >
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <h1 className="text-2xl font-semibold text-gray-900">Gestión de Rutas</h1>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
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
                    placeholder="Buscar rutas..."
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Routes list */}
            <div className="md:col-span-1">
              <div className="bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                  <h2 className="text-lg font-medium text-gray-900">Rutas de entrega</h2>
                  <p className="mt-1 text-sm text-gray-500">Listado de rutas de entrega programadas y completadas</p>
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
                      <li className="px-4 py-4 text-center text-gray-500">No se encontraron rutas</li>
                    ) : (
                      filteredRoutes.map(route => (
                        <li 
                          key={route.id} 
                          className={`px-4 py-4 cursor-pointer hover:bg-gray-50 ${selectedRoute?.id === route.id ? 'bg-gray-50' : ''}`}
                          onClick={() => handleViewRoute(route)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-medium text-gray-900 truncate">{route.name}</p>
                              <p className="text-sm text-gray-500 truncate">{route.area}</p>
                              <div className="mt-1 flex items-center">
                                <div className="flex-shrink-0 h-5 w-5 mr-1">
                                  <img 
                                    className="h-5 w-5 rounded-full object-cover border border-gray-200" 
                                    src={`https://randomuser.me/api/portraits/${route.driverName?.includes('María') || route.driverName?.includes('Ana') ? 'women' : 'men'}/${route.id.charCodeAt(0) % 10 + 1}.jpg`}
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
                                      <span className="ml-1 text-xs text-gray-500">{`(787) ${route.id.charCodeAt(0) % 9 + 1}${route.id.charCodeAt(1) % 9 + 1}${route.id.charCodeAt(0) % 9 + 1}-${route.id.charCodeAt(0) % 9 + 1}${route.id.charCodeAt(1) % 9 + 1}${route.id.charCodeAt(0) % 9 + 1}${route.id.charCodeAt(1) % 9 + 1}`}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div>
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(route.status)}`}>
                                {getStatusLabel(route.status)}
                              </span>
                            </div>
                          </div>
                        </li>
                      ))
                    )}
                  </ul>
                </div>
              </div>
            </div>

            {/* Map and details */}
            <div className="md:col-span-2">
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Mapa de ruta</h2>
                {selectedRoute ? (
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
                        interactive={true}
                      />
                    </div>
                    
                    <div className="border-t border-gray-200 pt-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-xl font-medium text-gray-900">{selectedRoute.name}</h3>
                          <p className="text-sm text-gray-500">{selectedRoute.area}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={() => window.alert('PDF descargado (simulación)')}
                            className="p-1 rounded-md hover:bg-gray-100"
                            title="Descargar PDF"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </button>
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(selectedRoute.status)}`}>
                            {getStatusLabel(selectedRoute.status)}
                          </span>
                        </div>
                      </div>
                      
                      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="text-sm font-medium text-gray-500">Conductor</h4>
                            <div className="flex items-center mt-1">
                              <div className="flex-shrink-0 h-10 w-10 mr-3">
                                <img 
                                  className="h-10 w-10 rounded-full object-cover border border-gray-200" 
                                  src={`https://randomuser.me/api/portraits/${selectedRoute.driverName?.includes('María') || selectedRoute.driverName?.includes('Ana') ? 'women' : 'men'}/${selectedRoute.id.charCodeAt(0) % 10 + 1}.jpg`}
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
                      <h4 className="text-md font-medium text-gray-900 mt-4 mb-2">Paradas ({Array.isArray(selectedRoute.stops) ? selectedRoute.stops.length : 
                        (selectedRoute.details && Array.isArray(selectedRoute.details.stops) ? selectedRoute.details.stops.length : 0)})</h4>
                      <ul className="divide-y divide-gray-200 border border-gray-200 rounded-md">
                        {Array.isArray(selectedRoute.stops) ? selectedRoute.stops.map((stop) => (
                          <li key={stop.id} className="px-4 py-3">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm font-medium text-gray-900">{stop.address}</p>
                                <p className="text-xs text-gray-500">ID: {stop.id}</p>
                              </div>
                              <div>
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  stop.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                  {stop.status === 'completed' ? 'Completada' : 'Pendiente'}
                                </span>
                              </div>
                            </div>
                          </li>
                        )) : selectedRoute.details && Array.isArray(selectedRoute.details.stops) ? selectedRoute.details.stops.map((stop: {
                          id: string;
                          address: string;
                          lat: number;
                          lng: number;
                          status: 'pending' | 'completed';
                          eta: string;
                        }) => (
                          <li key={stop.id} className="px-4 py-3">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm font-medium text-gray-900">{stop.address}</p>
                                <p className="text-xs text-gray-500">ID: {stop.id}</p>
                              </div>
                              <div>
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  stop.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                  {stop.status === 'completed' ? 'Completada' : 'Pendiente'}
                                </span>
                              </div>
                            </div>
                          </li>
                        )) : (
                          <li className="px-4 py-3 text-center text-gray-500">
                            No hay paradas disponibles para esta ruta
                          </li>
                        )}
                      </ul>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-100 h-96 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                      </svg>
                      <p className="mt-2 text-sm text-gray-500">Selecciona una ruta para ver su visualización en el mapa</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

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
      </div>
    </AdminLayout>
  );
};

export default AdminRoutes;
