import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { PickupPoint, DeliveryTimeSlot } from '@ewa/types';

const PickupPointsPage = () => {
  const [pickupPoints, setPickupPoints] = useState<PickupPoint[]>([]);
  const [selectedPoint, setSelectedPoint] = useState<PickupPoint | null>(null);
  const [timeSlots, setTimeSlots] = useState<DeliveryTimeSlot[]>([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [showBooking, setShowBooking] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('all');

  useEffect(() => {
    const fetchPickupPoints = async () => {
      try {
        // Mock data para demostración
        const mockPickupPoints: PickupPoint[] = [
          {
            id: 'pp1',
            name: 'Plaza Las Américas',
            address: 'Ave Roosevelt 525',
            city: 'San Juan',
            state: 'PR',
            zipCode: '00918',
            lat: 18.4226,
            lng: -66.0744,
            isActive: true,
            operatingHours: {
              monday: { open: '09:00', close: '21:00' },
              tuesday: { open: '09:00', close: '21:00' },
              wednesday: { open: '09:00', close: '21:00' },
              thursday: { open: '09:00', close: '21:00' },
              friday: { open: '09:00', close: '22:00' },
              saturday: { open: '09:00', close: '22:00' },
              sunday: { open: '11:00', close: '19:00' }
            },
            capacity: 50,
            currentLoad: 23,
            contactPhone: '(787) 767-5202',
            instructions: 'Ubicado en el área de food court, cerca de Starbucks',
            features: ['Estacionamiento gratuito', 'Aire acondicionado', 'Seguridad 24/7'],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          {
            id: 'pp2',
            name: 'Plaza del Mercado de Santurce',
            address: 'Calle Dos Hermanos',
            city: 'San Juan',
            state: 'PR',
            zipCode: '00909',
            lat: 18.4526,
            lng: -66.0744,
            isActive: true,
            operatingHours: {
              monday: { open: '08:00', close: '18:00' },
              tuesday: { open: '08:00', close: '18:00' },
              wednesday: { open: '08:00', close: '18:00' },
              thursday: { open: '08:00', close: '18:00' },
              friday: { open: '08:00', close: '19:00' },
              saturday: { open: '08:00', close: '19:00' },
              sunday: { closed: true, open: '', close: '' }
            },
            capacity: 30,
            currentLoad: 12,
            contactPhone: '(787) 725-8833',
            instructions: 'Entrada por la Calle Dos Hermanos, buscar el kiosco de EWA',
            features: ['Ambiente local', 'Fácil acceso', 'Horarios extendidos'],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          {
            id: 'pp3',
            name: 'Centro Comercial Montehiedra',
            address: 'Ave Luis Muñoz Rivera',
            city: 'Bayamón',
            state: 'PR',
            zipCode: '00961',
            lat: 18.3926,
            lng: -66.1544,
            isActive: true,
            operatingHours: {
              monday: { open: '10:00', close: '20:00' },
              tuesday: { open: '10:00', close: '20:00' },
              wednesday: { open: '10:00', close: '20:00' },
              thursday: { open: '10:00', close: '20:00' },
              friday: { open: '10:00', close: '21:00' },
              saturday: { open: '10:00', close: '21:00' },
              sunday: { open: '12:00', close: '18:00' }
            },
            capacity: 40,
            currentLoad: 18,
            contactPhone: '(787) 288-9090',
            instructions: 'Primer piso, cerca de la entrada principal',
            features: ['Amplio estacionamiento', 'Múltiples tiendas', 'Restaurantes cercanos'],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        ];

        const mockTimeSlots: DeliveryTimeSlot[] = [
          {
            id: 'ts1',
            label: 'Mañana (9:00 AM - 12:00 PM)',
            startTime: '09:00',
            endTime: '12:00',
            isAvailable: true,
            maxCapacity: 10,
            currentBookings: 3
          },
          {
            id: 'ts2',
            label: 'Tarde (12:00 PM - 5:00 PM)',
            startTime: '12:00',
            endTime: '17:00',
            isAvailable: true,
            maxCapacity: 15,
            currentBookings: 8
          },
          {
            id: 'ts3',
            label: 'Noche (5:00 PM - 8:00 PM)',
            startTime: '17:00',
            endTime: '20:00',
            isAvailable: false,
            maxCapacity: 8,
            currentBookings: 8
          }
        ];

        setPickupPoints(mockPickupPoints);
        setTimeSlots(mockTimeSlots);
      } catch (error) {
        console.error('Error fetching pickup points:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPickupPoints();
  }, []);

  const handleBookPickup = () => {
    if (!selectedPoint || !selectedTimeSlot) return;

    setSuccessMessage(`¡Perfecto! Tu pickup ha sido programado en ${selectedPoint.name} para el horario seleccionado.`);
    setShowBooking(false);
    setSelectedPoint(null);
    setSelectedTimeSlot('');

    setTimeout(() => {
      setSuccessMessage(null);
    }, 5000);
  };

  const getAvailabilityColor = (currentLoad: number, capacity: number) => {
    const percentage = (currentLoad / capacity) * 100;
    if (percentage < 50) return 'text-green-600';
    if (percentage < 80) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getOperatingStatus = (hours: PickupPoint['operatingHours']) => {
    const now = new Date();
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const currentDay = dayNames[now.getDay()] as keyof typeof hours;
    const currentTime = now.getHours() * 100 + now.getMinutes();
    
    const todayHours = hours[currentDay];
    if (todayHours.closed) return { status: 'Cerrado', color: 'text-red-600' };
    
    const openTime = parseInt(todayHours.open.replace(':', ''));
    const closeTime = parseInt(todayHours.close.replace(':', ''));
    
    if (currentTime >= openTime && currentTime <= closeTime) {
      return { status: 'Abierto', color: 'text-green-600' };
    }
    return { status: 'Cerrado', color: 'text-red-600' };
  };

  const filteredPoints = pickupPoints.filter(point => {
    const matchesSearch = point.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         point.address.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCity = selectedCity === 'all' || point.city === selectedCity;
    return matchesSearch && matchesCity;
  });

  const cities = [...new Set(pickupPoints.map(point => point.city))];

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Puntos de Pickup</h1>
            <p className="mt-2 text-gray-600">Encuentra el punto de recogida más conveniente para ti</p>
          </div>

          {successMessage && (
            <div className="mb-6 bg-green-50 border-l-4 border-green-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-green-700">{successMessage}</p>
                </div>
              </div>
            </div>
          )}

          {/* Filtros */}
          <div className="mb-6 bg-white shadow rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Buscar por nombre o dirección
                </label>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Escribe para buscar..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Filtrar por ciudad
                </label>
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">Todas las ciudades</option>
                  {cities.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Lista de puntos de pickup */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredPoints.map((point) => {
              const operatingStatus = getOperatingStatus(point.operatingHours);
              return (
                <div key={point.id} className="bg-white shadow rounded-lg overflow-hidden">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">{point.name}</h3>
                        <p className="text-gray-600">{point.address}, {point.city}</p>
                      </div>
                      <div className="text-right">
                        <span className={`text-sm font-medium ${operatingStatus.color}`}>
                          {operatingStatus.status}
                        </span>
                        <p className="text-sm text-gray-500 mt-1">
                          Disponibilidad: <span className={getAvailabilityColor(point.currentLoad, point.capacity)}>
                            {point.currentLoad}/{point.capacity}
                          </span>
                        </p>
                      </div>
                    </div>

                    {point.instructions && (
                      <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm text-blue-800">
                          <span className="font-medium">Instrucciones:</span> {point.instructions}
                        </p>
                      </div>
                    )}

                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Características:</h4>
                      <div className="flex flex-wrap gap-2">
                        {point.features.map((feature, index) => (
                          <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Horarios de operación:</h4>
                      <div className="text-sm text-gray-600 space-y-1">
                        {Object.entries(point.operatingHours).map(([day, hours]) => (
                          <div key={day} className="flex justify-between">
                            <span className="capitalize">{day}:</span>
                            <span>
                              {hours.closed ? 'Cerrado' : `${hours.open} - ${hours.close}`}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {point.contactPhone && (
                      <div className="mb-4">
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Teléfono:</span> {point.contactPhone}
                        </p>
                      </div>
                    )}

                    <button
                      onClick={() => {
                        setSelectedPoint(point);
                        setShowBooking(true);
                      }}
                      disabled={!point.isActive || operatingStatus.status === 'Cerrado' || point.currentLoad >= point.capacity}
                      className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      {point.currentLoad >= point.capacity ? 'Sin disponibilidad' : 'Seleccionar este punto'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredPoints.length === 0 && (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No se encontraron puntos de pickup</h3>
              <p className="mt-1 text-sm text-gray-500">Intenta ajustar tus filtros de búsqueda.</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal de reserva */}
      {showBooking && selectedPoint && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Reservar pickup en {selectedPoint.name}
              </h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Selecciona un horario:
                </label>
                <div className="space-y-2">
                  {timeSlots.map((slot) => (
                    <label key={slot.id} className="flex items-start">
                      <input
                        type="radio"
                        name="timeSlot"
                        value={slot.id}
                        checked={selectedTimeSlot === slot.id}
                        onChange={(e) => setSelectedTimeSlot(e.target.value)}
                        disabled={!slot.isAvailable}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 mt-1"
                      />
                      <div className="ml-3 flex-1">
                        <span className={`text-sm ${slot.isAvailable ? 'text-gray-900' : 'text-gray-400'}`}>
                          {slot.label}
                        </span>
                        <p className="text-xs text-gray-500">
                          Disponible: {slot.maxCapacity - slot.currentBookings}/{slot.maxCapacity}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={handleBookPickup}
                  disabled={!selectedTimeSlot}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  Confirmar reserva
                </button>
                <button
                  onClick={() => {
                    setShowBooking(false);
                    setSelectedPoint(null);
                    setSelectedTimeSlot('');
                  }}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default PickupPointsPage;