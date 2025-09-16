import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { Delivery, DeliverySkipRequest, DeliveryRescheduleRequest, DeliveryTimeSlot } from '@ewa/types';
import { smartNotificationService } from '@ewa/utils';

const DeliveriesPage = () => {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [timeSlots, setTimeSlots] = useState<DeliveryTimeSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'history'>('upcoming');
  const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(null);
  const [showSkipModal, setShowSkipModal] = useState(false);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [skipReason, setSkipReason] = useState<DeliverySkipRequest['reason']>('vacation');
  const [customSkipReason, setCustomSkipReason] = useState('');
  const [rescheduleReason, setRescheduleReason] = useState<DeliveryRescheduleRequest['reason']>('not_available');
  const [customRescheduleReason, setCustomRescheduleReason] = useState('');
  const [newDeliveryDate, setNewDeliveryDate] = useState('');
  const [newTimeSlot, setNewTimeSlot] = useState('');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchDeliveries = async () => {
      try {
        // Mock data para demostración
        const mockDeliveries: Delivery[] = [
          {
            id: 'del1',
            subscriptionId: 'sub1',
            userId: 'user1',
            orderId: 'order1',
            routeId: 'route1',
            deliveryType: 'home_delivery',
            status: 'scheduled',
            scheduledDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
            timeSlotId: 'ts1',
            deliveryAddress: {
              street: '123 Calle Principal',
              city: 'San Juan',
              state: 'PR',
              zipCode: '00901',
              instructions: 'Casa azul, timbre funciona'
            },
            recipient: {
              name: 'Juan Pérez',
              phone: '(787) 123-4567',
              email: 'juan@email.com'
            },
            items: [
              {
                productId: 'prod1',
                productName: 'Agua Purificada EWA',
                quantity: 2,
                size: '5 galones'
              }
            ],
            driverId: 'driver1',
            driverName: 'Carlos Rodríguez',
            driverPhone: '(787) 987-6543',
            attempts: 0,
            maxAttempts: 3,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          {
            id: 'del2',
            subscriptionId: 'sub1',
            userId: 'user1',
            orderId: 'order2',
            deliveryType: 'pickup_point',
            pickupPointId: 'pp1',
            status: 'in_transit',
            scheduledDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
            deliveryAddress: {
              street: 'Plaza Las Américas',
              city: 'San Juan',
              state: 'PR',
              zipCode: '00918'
            },
            recipient: {
              name: 'Juan Pérez',
              phone: '(787) 123-4567',
              email: 'juan@email.com'
            },
            items: [
              {
                productId: 'prod1',
                productName: 'Agua Purificada EWA',
                quantity: 1,
                size: '5 galones'
              }
            ],
            driverId: 'driver2',
            driverName: 'Ana García',
            driverPhone: '(787) 555-0123',
            estimatedArrivalTime: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
            attempts: 0,
            maxAttempts: 3,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          {
            id: 'del3',
            subscriptionId: 'sub1',
            userId: 'user1',
            orderId: 'order3',
            deliveryType: 'home_delivery',
            status: 'delivered',
            scheduledDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            actualDeliveryDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            deliveryAddress: {
              street: '123 Calle Principal',
              city: 'San Juan',
              state: 'PR',
              zipCode: '00901'
            },
            recipient: {
              name: 'Juan Pérez',
              phone: '(787) 123-4567',
              email: 'juan@email.com'
            },
            items: [
              {
                productId: 'prod1',
                productName: 'Agua Purificada EWA',
                quantity: 2,
                size: '5 galones'
              }
            ],
            driverId: 'driver1',
            driverName: 'Carlos Rodríguez',
            signature: 'Juan Pérez',
            attempts: 1,
            maxAttempts: 3,
            createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
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
            isAvailable: true,
            maxCapacity: 8,
            currentBookings: 5
          }
        ];

        setDeliveries(mockDeliveries);
        setTimeSlots(mockTimeSlots);
      } catch (error) {
        console.error('Error fetching deliveries:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDeliveries();
  }, []);

  const getStatusBadge = (status: Delivery['status']) => {
    const statusConfig = {
      scheduled: { color: 'bg-blue-100 text-blue-800', text: 'Programada' },
      in_transit: { color: 'bg-yellow-100 text-yellow-800', text: 'En tránsito' },
      out_for_delivery: { color: 'bg-orange-100 text-orange-800', text: 'En ruta' },
      delivered: { color: 'bg-green-100 text-green-800', text: 'Entregada' },
      failed: { color: 'bg-red-100 text-red-800', text: 'Fallida' },
      cancelled: { color: 'bg-gray-100 text-gray-800', text: 'Cancelada' },
      skipped: { color: 'bg-purple-100 text-purple-800', text: 'Omitida' },
      rescheduled: { color: 'bg-indigo-100 text-indigo-800', text: 'Reprogramada' }
    };

    const config = statusConfig[status];
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.text}
      </span>
    );
  };

  const handleSkipDelivery = async () => {
    if (!selectedDelivery) return;

    try {
      // Simular API call
      const skipRequest: DeliverySkipRequest = {
        id: `skip_${Date.now()}`,
        deliveryId: selectedDelivery.id,
        subscriptionId: selectedDelivery.subscriptionId,
        userId: selectedDelivery.userId,
        reason: skipReason,
        customReason: skipReason === 'other' ? customSkipReason : undefined,
        skipDate: selectedDelivery.scheduledDate,
        requestedAt: new Date().toISOString(),
        status: 'pending'
      };

      // Actualizar estado local
      setDeliveries(prev => prev.map(del => 
        del.id === selectedDelivery.id 
          ? { ...del, status: 'skipped' as const, skipReason: skipRequest.reason }
          : del
      ));

      setSuccessMessage('Tu solicitud de omitir entrega ha sido enviada. Te contactaremos para confirmar.');
      setShowSkipModal(false);
      setSelectedDelivery(null);
      setSkipReason('vacation');
      setCustomSkipReason('');

      setTimeout(() => setSuccessMessage(null), 5000);
    } catch (error) {
      console.error('Error skipping delivery:', error);
    }
  };

  const handleRescheduleDelivery = async () => {
    if (!selectedDelivery || !newDeliveryDate || !newTimeSlot) return;

    const rescheduleRequest: DeliveryRescheduleRequest = {
      deliveryId: selectedDelivery.id,
      newDate: newDeliveryDate,
      newTimeSlotId: newTimeSlot,
      reason: rescheduleReason,
      customReason: customRescheduleReason,
      originalDate: selectedDelivery.scheduledDate,
    };

    try {
      // Simular envío de solicitud
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Actualizar estado local
      setDeliveries(prev => prev.map(del => 
        del.id === selectedDelivery.id 
          ? {
              ...del,
              status: 'rescheduled' as const,
              scheduledDate: newDeliveryDate,
              rescheduledFrom: del.scheduledDate,
              rescheduledTo: newDeliveryDate,
              rescheduledReason: rescheduleRequest.reason,
            }
          : del
      ));

      // Obtener usuario actual para enviar email
      const userJson = localStorage.getItem('ewa_user');
      let userEmail = 'test@ewa.com'; // fallback
      let userPhone = '+1234567890'; // fallback
      
      if (userJson) {
        try {
          const userData = JSON.parse(userJson);
          userEmail = userData.email;
          userPhone = userData.phone || '+1234567890';
          
          // Enviar email de recordatorio de entrega reprogramada
          try {
            await smartNotificationService.sendDeliveryReminder(userEmail, userPhone, {
              date: newDeliveryDate,
              estimatedTime: newTimeSlot,
              address: selectedDelivery.deliveryAddress.street + ', ' + 
                      selectedDelivery.deliveryAddress.city + ', ' + 
                      selectedDelivery.deliveryAddress.state + ' ' + 
                      selectedDelivery.deliveryAddress.zipCode
            });
            console.log('Email de recordatorio de entrega reprogramada enviado exitosamente');
          } catch (emailError) {
            console.error('Error enviando email de recordatorio:', emailError);
            // No bloquear la reprogramación si falla el email
          }
        } catch (error) {
          console.error('Error parsing user data:', error);
        }
      }

      setSuccessMessage('Tu solicitud de reprogramación ha sido enviada. Te contactaremos para confirmar.');
      setShowRescheduleModal(false);
      setSelectedDelivery(null);
      setNewDeliveryDate('');
      setNewTimeSlot('');
      setRescheduleReason('not_available');
      setCustomRescheduleReason('');
    } catch (error) {
      console.error('Error rescheduling delivery:', error);
    }
  };

  const upcomingDeliveries = deliveries.filter(del => 
    ['scheduled', 'in_transit', 'out_for_delivery', 'rescheduled'].includes(del.status)
  );

  const deliveryHistory = deliveries.filter(del => 
    ['delivered', 'failed', 'cancelled', 'skipped'].includes(del.status)
  );

  const currentDeliveries = activeTab === 'upcoming' ? upcomingDeliveries : deliveryHistory;

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
            <h1 className="text-3xl font-bold text-gray-900">Mis Entregas</h1>
            <p className="mt-2 text-gray-600">Gestiona y sigue el estado de tus entregas</p>
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

          {/* Tabs */}
          <div className="mb-6">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex">
                <button
                  onClick={() => setActiveTab('upcoming')}
                  className={`py-2 px-4 border-b-2 font-medium text-sm ${
                    activeTab === 'upcoming'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Próximas entregas ({upcomingDeliveries.length})
                </button>
                <button
                  onClick={() => setActiveTab('history')}
                  className={`py-2 px-4 border-b-2 font-medium text-sm ${
                    activeTab === 'history'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Historial ({deliveryHistory.length})
                </button>
              </nav>
            </div>
          </div>

          {/* Lista de entregas */}
          <div className="space-y-4">
            {currentDeliveries.length === 0 ? (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  {activeTab === 'upcoming' ? 'No tienes entregas programadas' : 'No hay entregas en el historial'}
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {activeTab === 'upcoming' 
                    ? 'Tus futuras entregas aparecerán aquí.' 
                    : 'El historial de entregas aparecerá aquí.'
                  }
                </p>
              </div>
            ) : (
              currentDeliveries.map((delivery) => (
                <div key={delivery.id} className="bg-white shadow rounded-lg overflow-hidden">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            Entrega #{delivery.id.slice(-6)}
                          </h3>
                          {getStatusBadge(delivery.status)}
                        </div>
                        <p className="text-gray-600">
                          {delivery.deliveryType === 'home_delivery' ? '🏠 Entrega a domicilio' : '📦 Punto de pickup'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">
                          {new Date(delivery.scheduledDate).toLocaleDateString('es-PR', {
                            weekday: 'long',
                            day: 'numeric',
                            month: 'long'
                          })}
                        </p>
                        {delivery.estimatedArrivalTime && (
                          <p className="text-sm text-gray-500">
                            Estimado: {new Date(delivery.estimatedArrivalTime).toLocaleTimeString('es-PR', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Dirección de entrega:</h4>
                        <p className="text-sm text-gray-600">
                          {delivery.deliveryAddress.street}<br />
                          {delivery.deliveryAddress.city}, {delivery.deliveryAddress.state} {delivery.deliveryAddress.zipCode}
                        </p>
                        {delivery.deliveryAddress.instructions && (
                          <p className="text-sm text-gray-500 mt-1">
                            Instrucciones: {delivery.deliveryAddress.instructions}
                          </p>
                        )}
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Productos:</h4>
                        {delivery.items.map((item, index) => (
                          <p key={index} className="text-sm text-gray-600">
                            {item.quantity}x {item.productName} ({item.size})
                          </p>
                        ))}
                      </div>
                    </div>

                    {delivery.driverName && (
                      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-700">
                          <span className="font-medium">Conductor:</span> {delivery.driverName}
                          {delivery.driverPhone && (
                            <span className="ml-2">📞 {delivery.driverPhone}</span>
                          )}
                        </p>
                      </div>
                    )}

                    {delivery.status === 'delivered' && delivery.actualDeliveryDate && (
                      <div className="mb-4 p-3 bg-green-50 rounded-lg">
                        <p className="text-sm text-green-800">
                          <span className="font-medium">Entregado el:</span> {' '}
                          {new Date(delivery.actualDeliveryDate).toLocaleString('es-PR')}
                          {delivery.signature && (
                            <span className="block mt-1">Recibido por: {delivery.signature}</span>
                          )}
                        </p>
                      </div>
                    )}

                    {delivery.rescheduledFrom && (
                      <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm text-blue-800">
                          <span className="font-medium">Reprogramada desde:</span> {' '}
                          {new Date(delivery.rescheduledFrom).toLocaleDateString('es-PR')}
                          {delivery.rescheduledReason && (
                            <span className="block mt-1">Motivo: {delivery.rescheduledReason}</span>
                          )}
                        </p>
                      </div>
                    )}

                    {activeTab === 'upcoming' && delivery.status === 'scheduled' && (
                      <div className="flex space-x-3">
                        <button
                          onClick={() => {
                            setSelectedDelivery(delivery);
                            setShowSkipModal(true);
                          }}
                          className="flex-1 bg-yellow-600 text-white py-2 px-4 rounded-md hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        >
                          Omitir entrega
                        </button>
                        <button
                          onClick={() => {
                            setSelectedDelivery(delivery);
                            setShowRescheduleModal(true);
                          }}
                          className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          Reprogramar
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Modal para omitir entrega */}
      {showSkipModal && selectedDelivery && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Omitir entrega
              </h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Motivo para omitir:
                </label>
                <select
                  value={skipReason}
                  onChange={(e) => setSkipReason(e.target.value as DeliverySkipRequest['reason'])}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="vacation">Vacaciones</option>
                  <option value="business_trip">Viaje de negocios</option>
                  <option value="temporarily_not_needed">No necesario temporalmente</option>
                  <option value="address_change">Cambio de dirección</option>
                  <option value="other">Otro</option>
                </select>
              </div>

              {skipReason === 'other' && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Especifica el motivo:
                  </label>
                  <textarea
                    value={customSkipReason}
                    onChange={(e) => setCustomSkipReason(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Describe el motivo..."
                  />
                </div>
              )}

              <div className="flex space-x-3">
                <button
                  onClick={handleSkipDelivery}
                  className="flex-1 bg-yellow-600 text-white py-2 px-4 rounded-md hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                >
                  Confirmar omisión
                </button>
                <button
                  onClick={() => {
                    setShowSkipModal(false);
                    setSelectedDelivery(null);
                    setSkipReason('vacation');
                    setCustomSkipReason('');
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

      {/* Modal para reprogramar entrega */}
      {showRescheduleModal && selectedDelivery && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Reprogramar entrega
              </h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Motivo para reprogramar:
                </label>
                <select
                  value={rescheduleReason}
                  onChange={(e) => setRescheduleReason(e.target.value as DeliveryRescheduleRequest['reason'])}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="not_available">No estaré disponible</option>
                  <option value="address_change">Cambio de dirección</option>
                  <option value="preference_change">Cambio de preferencia</option>
                  <option value="emergency">Emergencia</option>
                  <option value="other">Otro</option>
                </select>
              </div>

              {rescheduleReason === 'other' && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Especifica el motivo:
                  </label>
                  <textarea
                    value={customRescheduleReason}
                    onChange={(e) => setCustomRescheduleReason(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Describe el motivo..."
                  />
                </div>
              )}

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nueva fecha preferida:
                </label>
                <input
                  type="date"
                  value={newDeliveryDate}
                  onChange={(e) => setNewDeliveryDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Horario preferido (opcional):
                </label>
                <select
                  value={newTimeSlot}
                  onChange={(e) => setNewTimeSlot(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Sin preferencia</option>
                  {timeSlots.map(slot => (
                    <option key={slot.id} value={slot.id} disabled={!slot.isAvailable}>
                      {slot.label} {!slot.isAvailable && '(No disponible)'}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={handleRescheduleDelivery}
                  disabled={!newDeliveryDate}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  Confirmar reprogramación
                </button>
                <button
                  onClick={() => {
                    setShowRescheduleModal(false);
                    setSelectedDelivery(null);
                    setRescheduleReason('not_available');
                    setCustomRescheduleReason('');
                    setNewDeliveryDate('');
                    setNewTimeSlot('');
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

export default DeliveriesPage;