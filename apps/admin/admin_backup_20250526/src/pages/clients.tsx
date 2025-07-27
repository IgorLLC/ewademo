import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { User } from '@ewa/types';

// Tipo extendido para clientes con campos adicionales
type ExtendedUser = User & {
  address: string;
  phone: string;
  signupDate: string;
  type?: string;
  businessContact?: string;
};

const ClientsPage = () => {
  const [clients, setClients] = useState<ExtendedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [selectedClient, setSelectedClient] = useState<ExtendedUser | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    // Simulamos la carga de clientes desde el mock
    const fetchClients = async () => {
      try {
        // Datos mock de clientes
        const mockClients = [
          {
            id: "u1",
            name: "Juan Rivera",
            email: "juan@cliente.com",
            role: "customer",
            address: "Calle Loíza 123, San Juan, PR 00911",
            phone: "787-123-4567",
            signupDate: "2025-01-15",
            type: "B2C"
          },
          {
            id: "u3",
            name: "Restaurante Sobao",
            email: "info@sobao.com",
            role: "customer",
            address: "Calle Comercio 88, Caguas, PR 00725",
            phone: "787-456-7890",
            signupDate: "2025-02-01",
            type: "B2B",
            businessContact: "Carlos Rodríguez"
          },
          {
            id: "u4",
            name: "Ana Vázquez",
            email: "ana@ejemplo.com",
            role: "customer",
            address: "PR-2 Km 149.5, Mayagüez Mall, Mayagüez, PR 00680",
            phone: "787-222-3333",
            signupDate: "2025-03-10",
            type: "B2C"
          },
          {
            id: "u5",
            name: "Roberto Sánchez",
            email: "roberto@ejemplo.com",
            role: "customer",
            address: "Plaza del Caribe, Ave. Rafael Cordero, Ponce, PR 00731",
            phone: "787-444-5555",
            signupDate: "2025-04-05",
            type: "B2C"
          }
        ];
        
        setClients(mockClients);
      } catch (err) {
        setError('Error al cargar los clientes. Por favor, intenta nuevamente.');
        console.error('Error fetching clients:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  // Filtrar clientes según término de búsqueda y tipo
  const filteredClients = clients.filter(client => {
    const matchesSearch = 
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.address.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = typeFilter === 'all' || client.type === typeFilter;
    
    return matchesSearch && matchesType;
  });

  // Datos mock para historial de suscripciones
  const mockSubscriptionHistory = [
    {
      id: "sub1",
      planName: "EWA Box Water - Small (Weekly)",
      startDate: "2025-01-20",
      status: "active",
      lastDelivery: "2025-05-20",
      nextDelivery: "2025-05-27"
    },
    {
      id: "sub2",
      planName: "EWA Box Water - Medium (Biweekly)",
      startDate: "2024-10-15",
      status: "cancelled",
      lastDelivery: "2025-01-10",
      nextDelivery: null,
      cancellationDate: "2025-01-15",
      cancellationReason: "Cambio a plan semanal"
    }
  ];

  // Datos mock para historial de pedidos
  const mockOrderHistory = [
    {
      id: "ord1",
      date: "2025-05-15",
      products: "EWA Box Water - Large (24 unidades)",
      total: 71.76,
      status: "delivered"
    },
    {
      id: "ord2",
      date: "2025-04-20",
      products: "EWA Box Water - Medium (12 unidades)",
      total: 29.88,
      status: "delivered"
    },
    {
      id: "ord3",
      date: "2025-03-05",
      products: "EWA Box Water - Small (6 unidades)",
      total: 11.94,
      status: "delivered"
    }
  ];

  const openClientDetail = (client: ExtendedUser) => {
    setSelectedClient(client);
    setShowDetailModal(true);
  };

  const closeClientDetail = () => {
    setSelectedClient(null);
    setShowDetailModal(false);
  };

  return (
    <Layout title="Gestión de Clientes - EWA Box Water Admin">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">Gestión de Clientes</h1>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="py-4">
          {error && (
            <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Search and Filter */}
          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <div className="md:flex md:items-center md:justify-between">
              <div className="md:flex-1">
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Buscar por nombre, email o dirección"
                    className="focus:ring-ewa-blue focus:border-ewa-blue block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="mt-4 md:mt-0 md:ml-4">
                <select
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-ewa-blue focus:border-ewa-blue sm:text-sm rounded-md"
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                >
                  <option value="all">Todos los tipos</option>
                  <option value="B2C">B2C</option>
                  <option value="B2B">B2B</option>
                </select>
              </div>
              <div className="mt-4 md:mt-0 md:ml-4">
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-ewa-blue hover:bg-ewa-dark-blue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ewa-blue"
                >
                  Nuevo Cliente
                </button>
              </div>
            </div>
          </div>

          {/* Clients Table */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-ewa-blue"></div>
            </div>
          ) : (
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <ul className="divide-y divide-gray-200">
                {filteredClients.map((client) => (
                  <li key={client.id}>
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-ewa-light-blue flex items-center justify-center">
                            <span className="text-ewa-blue font-medium">{client.name.charAt(0)}</span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{client.name}</div>
                            <div className="text-sm text-gray-500">{client.email}</div>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            client.type === 'B2B' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'
                          }`}>
                            {client.type}
                          </span>
                          <div className="ml-4 flex-shrink-0 flex">
                            <button
                              onClick={() => openClientDetail(client)}
                              className="ml-2 bg-white rounded-md font-medium text-ewa-blue hover:text-ewa-dark-blue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ewa-blue"
                            >
                              Ver detalles
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="mt-2 sm:flex sm:justify-between">
                        <div className="sm:flex">
                          <div className="flex items-center text-sm text-gray-500">
                            <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {client.address}
                          </div>
                        </div>
                        <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                          <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          {client.phone}
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Client Detail Modal */}
      {showDetailModal && selectedClient && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                      Detalles del Cliente
                    </h3>
                    
                    <div className="bg-gray-50 p-4 rounded-lg mb-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">Información Personal</h4>
                          <p className="mt-1 text-sm text-gray-900"><span className="font-medium">Nombre:</span> {selectedClient.name}</p>
                          <p className="mt-1 text-sm text-gray-900"><span className="font-medium">Email:</span> {selectedClient.email}</p>
                          <p className="mt-1 text-sm text-gray-900"><span className="font-medium">Teléfono:</span> {selectedClient.phone}</p>
                          <p className="mt-1 text-sm text-gray-900"><span className="font-medium">Dirección:</span> {selectedClient.address}</p>
                          <p className="mt-1 text-sm text-gray-900"><span className="font-medium">Tipo:</span> {selectedClient.type}</p>
                          {selectedClient.businessContact && (
                            <p className="mt-1 text-sm text-gray-900"><span className="font-medium">Contacto de negocio:</span> {selectedClient.businessContact}</p>
                          )}
                          <p className="mt-1 text-sm text-gray-900"><span className="font-medium">Fecha de registro:</span> {new Date(selectedClient.signupDate).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">Estadísticas</h4>
                          <p className="mt-1 text-sm text-gray-900"><span className="font-medium">Suscripciones activas:</span> 1</p>
                          <p className="mt-1 text-sm text-gray-900"><span className="font-medium">Pedidos totales:</span> 3</p>
                          <p className="mt-1 text-sm text-gray-900"><span className="font-medium">Valor total:</span> $113.58</p>
                          <p className="mt-1 text-sm text-gray-900"><span className="font-medium">Última compra:</span> 15/05/2025</p>
                        </div>
                      </div>
                    </div>

                    <div className="mb-6">
                      <h4 className="text-md font-medium text-gray-700 mb-2">Historial de Suscripciones</h4>
                      <div className="bg-white shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plan</th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha de inicio</th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Última entrega</th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Próxima entrega</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {mockSubscriptionHistory.map((sub) => (
                              <tr key={sub.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{sub.planName}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(sub.startDate).toLocaleDateString()}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                    sub.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                  }`}>
                                    {sub.status === 'active' ? 'Activa' : 'Cancelada'}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sub.lastDelivery ? new Date(sub.lastDelivery).toLocaleDateString() : '-'}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{sub.nextDelivery ? new Date(sub.nextDelivery).toLocaleDateString() : '-'}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-md font-medium text-gray-700 mb-2">Historial de Pedidos</h4>
                      <div className="bg-white shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Productos</th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {mockOrderHistory.map((order) => (
                              <tr key={order.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.id}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(order.date).toLocaleDateString()}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.products}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${order.total.toFixed(2)}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                    Entregado
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ewa-blue sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={closeClientDetail}
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default ClientsPage;
