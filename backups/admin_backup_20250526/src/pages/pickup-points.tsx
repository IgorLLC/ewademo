import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';

// Tipo para los puntos de recogida
type PickupPoint = {
  id: string;
  name: string;
  address: string;
  city: string;
  schedule: {
    day: string;
    hours: string;
  }[];
  active: boolean;
  coordinates?: {
    lat: number;
    lng: number;
  };
};

const PickupPointsPage = () => {
  const [pickupPoints, setPickupPoints] = useState<PickupPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedPoint, setSelectedPoint] = useState<PickupPoint | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    schedule: [{ day: 'Lunes', hours: '9:00 AM - 5:00 PM' }],
    active: true
  });

  useEffect(() => {
    // Simulamos la carga de puntos de recogida desde el mock
    const fetchPickupPoints = async () => {
      try {
        // Datos mock de puntos de recogida
        const mockPickupPoints = [
          {
            id: "pp1",
            name: "Parque Central",
            address: "Calle Parque Central 123",
            city: "San Juan",
            schedule: [
              { day: "Lunes", hours: "9:00 AM - 5:00 PM" },
              { day: "Miércoles", hours: "9:00 AM - 5:00 PM" },
              { day: "Viernes", hours: "9:00 AM - 5:00 PM" }
            ],
            active: true,
            coordinates: {
              lat: 18.4655,
              lng: -66.1057
            }
          },
          {
            id: "pp2",
            name: "Plaza del Caribe",
            address: "Ave. Rafael Cordero",
            city: "Ponce",
            schedule: [
              { day: "Martes", hours: "10:00 AM - 6:00 PM" },
              { day: "Jueves", hours: "10:00 AM - 6:00 PM" },
              { day: "Sábado", hours: "9:00 AM - 3:00 PM" }
            ],
            active: true,
            coordinates: {
              lat: 18.0108,
              lng: -66.6122
            }
          },
          {
            id: "pp3",
            name: "Paseo de Diego",
            address: "Calle De Diego 123",
            city: "Río Piedras",
            schedule: [
              { day: "Lunes", hours: "8:00 AM - 4:00 PM" },
              { day: "Martes", hours: "8:00 AM - 4:00 PM" },
              { day: "Miércoles", hours: "8:00 AM - 4:00 PM" },
              { day: "Jueves", hours: "8:00 AM - 4:00 PM" },
              { day: "Viernes", hours: "8:00 AM - 4:00 PM" }
            ],
            active: false,
            coordinates: {
              lat: 18.3985,
              lng: -66.0502
            }
          }
        ];
        
        setPickupPoints(mockPickupPoints);
      } catch (err) {
        setError('Error al cargar los puntos de recogida. Por favor, intenta nuevamente.');
        console.error('Error fetching pickup points:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPickupPoints();
  }, []);

  const handleAddPoint = () => {
    setFormData({
      name: '',
      address: '',
      city: '',
      schedule: [{ day: 'Lunes', hours: '9:00 AM - 5:00 PM' }],
      active: true
    });
    setShowAddModal(true);
  };

  const handleEditPoint = (point: PickupPoint) => {
    setSelectedPoint(point);
    setFormData({
      name: point.name,
      address: point.address,
      city: point.city,
      schedule: [...point.schedule],
      active: point.active
    });
    setShowEditModal(true);
  };

  const handleToggleActive = (pointId: string, currentActive: boolean) => {
    // En un entorno real, esto sería una llamada a la API
    setPickupPoints(prevPoints => 
      prevPoints.map(point => 
        point.id === pointId ? { ...point, active: !currentActive } : point
      )
    );
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const target = e.target as HTMLInputElement;
      setFormData({
        ...formData,
        [name]: target.checked
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleScheduleChange = (index: number, field: 'day' | 'hours', value: string) => {
    const newSchedule = [...formData.schedule];
    newSchedule[index][field] = value;
    setFormData({
      ...formData,
      schedule: newSchedule
    });
  };

  const addScheduleItem = () => {
    setFormData({
      ...formData,
      schedule: [...formData.schedule, { day: 'Lunes', hours: '9:00 AM - 5:00 PM' }]
    });
  };

  const removeScheduleItem = (index: number) => {
    const newSchedule = [...formData.schedule];
    newSchedule.splice(index, 1);
    setFormData({
      ...formData,
      schedule: newSchedule
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // En un entorno real, esto sería una llamada a la API
    if (showAddModal) {
      // Agregar nuevo punto de recogida
      const newPoint: PickupPoint = {
        id: `pp${pickupPoints.length + 1}`,
        name: formData.name,
        address: formData.address,
        city: formData.city,
        schedule: formData.schedule,
        active: formData.active,
        coordinates: {
          lat: 18.2000 + Math.random() * 0.5,
          lng: -66.5000 - Math.random() * 0.5
        }
      };
      
      setPickupPoints(prevPoints => [...prevPoints, newPoint]);
      setShowAddModal(false);
    } else if (showEditModal && selectedPoint) {
      // Actualizar punto de recogida existente
      setPickupPoints(prevPoints => 
        prevPoints.map(point => 
          point.id === selectedPoint.id ? {
            ...point,
            name: formData.name,
            address: formData.address,
            city: formData.city,
            schedule: formData.schedule,
            active: formData.active
          } : point
        )
      );
      setShowEditModal(false);
    }
    
    // Limpiar el formulario
    setFormData({
      name: '',
      address: '',
      city: '',
      schedule: [{ day: 'Lunes', hours: '9:00 AM - 5:00 PM' }],
      active: true
    });
    setSelectedPoint(null);
  };

  return (
    <Layout title="Puntos de Recogida - EWA Box Water Admin">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">Puntos de Recogida (Pop-ups)</h1>
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

          <div className="mb-6 flex justify-end">
            <button
              type="button"
              onClick={handleAddPoint}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-ewa-blue hover:bg-ewa-dark-blue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ewa-blue"
            >
              <svg className="mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Crear Nuevo Punto de Recogida
            </button>
          </div>

          {/* Mock Map */}
          <div className="bg-white shadow rounded-lg p-4 mb-6">
            <div className="relative h-96 bg-gray-200 rounded-lg overflow-hidden">
              {/* Simulación de un mapa */}
              <div className="absolute inset-0 bg-blue-50">
                <div className="absolute top-4 left-4 bg-white p-2 rounded shadow z-10">
                  <p className="text-sm font-medium text-gray-700">Mapa de Puntos de Recogida</p>
                  <p className="text-xs text-gray-500">Simulación de MapBox</p>
                </div>
                
                {/* Marcadores de puntos de recogida */}
                {pickupPoints.map((point) => (
                  <div 
                    key={point.id} 
                    className={`absolute w-6 h-6 rounded-full flex items-center justify-center transform -translate-x-1/2 -translate-y-1/2 ${
                      point.active ? 'bg-ewa-blue' : 'bg-gray-400'
                    }`}
                    style={{ 
                      top: `${((point.coordinates?.lat || 18.2) - 18.0) * 300 + 50}px`, 
                      left: `${((point.coordinates?.lng || -66.5) + 67) * 300 + 50}px` 
                    }}
                    title={point.name}
                  >
                    <svg className="h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Pickup Points Table */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-ewa-blue"></div>
            </div>
          ) : (
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <ul className="divide-y divide-gray-200">
                {pickupPoints.map((point) => (
                  <li key={point.id}>
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className={`flex-shrink-0 h-10 w-10 rounded-full ${point.active ? 'bg-ewa-light-blue' : 'bg-gray-200'} flex items-center justify-center`}>
                            <svg className={`h-6 w-6 ${point.active ? 'text-ewa-blue' : 'text-gray-500'}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{point.name}</div>
                            <div className="text-sm text-gray-500">{point.address}, {point.city}</div>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            point.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {point.active ? 'Activo' : 'Inactivo'}
                          </span>
                          <div className="ml-4 flex-shrink-0 flex">
                            <button
                              onClick={() => handleEditPoint(point)}
                              className="ml-2 bg-white rounded-md font-medium text-ewa-blue hover:text-ewa-dark-blue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ewa-blue"
                            >
                              Editar
                            </button>
                            <button
                              onClick={() => handleToggleActive(point.id, point.active)}
                              className={`ml-4 bg-white rounded-md font-medium ${
                                point.active ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'
                              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ewa-blue`}
                            >
                              {point.active ? 'Desactivar' : 'Activar'}
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="mt-2">
                        <div className="text-sm text-gray-500">
                          <span className="font-medium">Horario:</span>{' '}
                          {point.schedule.map((s, index) => (
                            <span key={index}>
                              {s.day}: {s.hours}
                              {index < point.schedule.length - 1 ? ' | ' : ''}
                            </span>
                          ))}
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

      {/* Add/Edit Pickup Point Modal */}
      {(showAddModal || (showEditModal && selectedPoint)) && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleSubmit}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                      <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                        {showAddModal ? 'Crear Nuevo Punto de Recogida' : 'Editar Punto de Recogida'}
                      </h3>
                      
                      <div className="mb-4">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nombre</label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          className="mt-1 focus:ring-ewa-blue focus:border-ewa-blue block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      
                      <div className="mb-4">
                        <label htmlFor="address" className="block text-sm font-medium text-gray-700">Dirección</label>
                        <input
                          type="text"
                          id="address"
                          name="address"
                          className="mt-1 focus:ring-ewa-blue focus:border-ewa-blue block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          value={formData.address}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      
                      <div className="mb-4">
                        <label htmlFor="city" className="block text-sm font-medium text-gray-700">Ciudad</label>
                        <input
                          type="text"
                          id="city"
                          name="city"
                          className="mt-1 focus:ring-ewa-blue focus:border-ewa-blue block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          value={formData.city}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Horario</label>
                        {formData.schedule.map((scheduleItem, index) => (
                          <div key={index} className="flex items-center mb-2">
                            <select
                              className="mr-2 focus:ring-ewa-blue focus:border-ewa-blue block shadow-sm sm:text-sm border-gray-300 rounded-md"
                              value={scheduleItem.day}
                              onChange={(e) => handleScheduleChange(index, 'day', e.target.value)}
                            >
                              <option value="Lunes">Lunes</option>
                              <option value="Martes">Martes</option>
                              <option value="Miércoles">Miércoles</option>
                              <option value="Jueves">Jueves</option>
                              <option value="Viernes">Viernes</option>
                              <option value="Sábado">Sábado</option>
                              <option value="Domingo">Domingo</option>
                            </select>
                            <input
                              type="text"
                              className="flex-1 focus:ring-ewa-blue focus:border-ewa-blue block shadow-sm sm:text-sm border-gray-300 rounded-md"
                              placeholder="9:00 AM - 5:00 PM"
                              value={scheduleItem.hours}
                              onChange={(e) => handleScheduleChange(index, 'hours', e.target.value)}
                              required
                            />
                            {formData.schedule.length > 1 && (
                              <button
                                type="button"
                                className="ml-2 text-red-600 hover:text-red-900"
                                onClick={() => removeScheduleItem(index)}
                              >
                                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            )}
                          </div>
                        ))}
                        <button
                          type="button"
                          className="mt-2 inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-ewa-blue bg-ewa-light-blue hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ewa-blue"
                          onClick={addScheduleItem}
                        >
                          <svg className="mr-1 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                          Agregar Horario
                        </button>
                      </div>
                      
                      <div className="mb-4 flex items-center">
                        <input
                          type="checkbox"
                          id="active"
                          name="active"
                          className="h-4 w-4 text-ewa-blue focus:ring-ewa-blue border-gray-300 rounded"
                          checked={formData.active}
                          onChange={(e) => setFormData({...formData, active: e.target.checked})}
                        />
                        <label htmlFor="active" className="ml-2 block text-sm text-gray-900">
                          Activo
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-ewa-blue text-base font-medium text-white hover:bg-ewa-dark-blue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ewa-blue sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    {showAddModal ? 'Crear' : 'Guardar Cambios'}
                  </button>
                  <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ewa-blue sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={() => {
                      setShowAddModal(false);
                      setShowEditModal(false);
                    }}
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default PickupPointsPage;
