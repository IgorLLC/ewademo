import React, { useState } from 'react';
import { 
  Truck, 
  CheckCircle, 
  XCircle, 
  Clock, 
  MapPin, 
  Calendar,
  ChevronDown,
  ChevronUp,
  Eye
} from 'lucide-react';

interface Delivery {
  id: string;
  date: string;
  status: 'entregado' | 'pendiente' | 'en_camino' | 'fallido';
  address: string;
  quantity: number;
  driverName?: string;
  estimatedTime?: string;
  actualTime?: string;
  notes?: string;
}

interface MobileDeliveryHistoryProps {
  deliveries: Delivery[];
  subscriptionId: string;
}

const MobileDeliveryHistory: React.FC<MobileDeliveryHistoryProps> = ({
  deliveries,
  subscriptionId
}) => {
  const [expandedDelivery, setExpandedDelivery] = useState<string | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'entregado':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'en_camino':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pendiente':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'fallido':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'entregado':
        return <CheckCircle className="w-6 h-6 text-green-600" />;
      case 'en_camino':
        return <Truck className="w-6 h-6 text-blue-600" />;
      case 'pendiente':
        return <Clock className="w-6 h-6 text-yellow-600" />;
      case 'fallido':
        return <XCircle className="w-6 h-6 text-red-600" />;
      default:
        return <Clock className="w-6 h-6 text-gray-600" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'entregado':
        return '✅ Entregado';
      case 'en_camino':
        return '🚚 En camino';
      case 'pendiente':
        return '⏳ Pendiente';
      case 'fallido':
        return '❌ Fallido';
      default:
        return '❓ Desconocido';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Hoy';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Ayer';
    } else {
      return date.toLocaleDateString('es-ES', {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      });
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const toggleExpanded = (deliveryId: string) => {
    setExpandedDelivery(expandedDelivery === deliveryId ? null : deliveryId);
  };

  if (deliveries.length === 0) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Truck className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No hay entregas registradas
          </h3>
          <p className="text-gray-600 text-sm">
            Las entregas aparecerán aquí una vez que se procesen
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm">
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
            <Truck className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Historial de Entregas</h3>
            <p className="text-sm text-gray-600">
              {deliveries.length} entrega{deliveries.length !== 1 ? 's' : ''} registrada{deliveries.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
      </div>

      {/* Lista de entregas */}
      <div className="divide-y divide-gray-100">
        {deliveries.map((delivery) => (
          <div key={delivery.id} className="p-4">
            {/* Información básica */}
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3 flex-1">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  delivery.status === 'entregado' 
                    ? 'bg-green-100 border border-green-200' 
                    : delivery.status === 'en_camino'
                    ? 'bg-blue-100 border border-blue-200'
                    : delivery.status === 'pendiente'
                    ? 'bg-yellow-100 border border-yellow-200'
                    : 'bg-red-100 border border-red-200'
                }`}>
                  {getStatusIcon(delivery.status)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(delivery.status)}`}>
                      {getStatusText(delivery.status)}
                    </span>
                    <span className="text-xs text-gray-500">
                      {formatDate(delivery.date)}
                    </span>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-sm text-gray-900 font-medium">
                      {delivery.quantity} unidad{delivery.quantity !== 1 ? 'es' : ''} • Box Water Premium
                    </p>
                    
                    <div className="flex items-center space-x-1 text-xs text-gray-600">
                      <MapPin className="w-3 h-3" />
                      <span className="truncate">{delivery.address}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <button
                onClick={() => toggleExpanded(delivery.id)}
                className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
              >
                {expandedDelivery === delivery.id ? (
                  <ChevronUp className="w-4 h-4 text-gray-600" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-600" />
                )}
              </button>
            </div>

            {/* Información expandida */}
            {expandedDelivery === delivery.id && (
              <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
                {/* Detalles de tiempo */}
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-gray-500">Fecha programada</p>
                    <p className="font-medium text-gray-900">
                      {new Date(delivery.date).toLocaleDateString('es-ES', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  
                  {delivery.actualTime && (
                    <div>
                      <p className="text-gray-500">Hora de entrega</p>
                      <p className="font-medium text-gray-900">
                        {formatTime(delivery.actualTime)}
                      </p>
                    </div>
                  )}
                </div>

                {/* Información del conductor */}
                {delivery.driverName && (
                  <div>
                    <p className="text-gray-500 text-sm mb-1">Conductor asignado</p>
                    <p className="text-sm text-gray-900 font-medium">
                      {delivery.driverName}
                    </p>
                  </div>
                )}

                {/* Notas */}
                {delivery.notes && (
                  <div>
                    <p className="text-gray-500 text-sm mb-1">Notas</p>
                    <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded-lg">
                      {delivery.notes}
                    </p>
                  </div>
                )}

                {/* Acciones */}
                <div className="flex space-x-2 pt-2">
                  <button className="flex-1 flex items-center justify-center space-x-2 bg-blue-50 hover:bg-blue-100 text-blue-700 py-2 px-3 rounded-lg transition-colors text-sm">
                    <Eye className="w-4 h-4" />
                    <span>Ver detalles</span>
                  </button>
                  
                  {delivery.status === 'pendiente' && (
                    <button className="flex-1 flex items-center justify-center space-x-2 bg-green-50 hover:bg-green-100 text-green-700 py-2 px-3 rounded-lg transition-colors text-sm">
                      <Truck className="w-4 h-4" />
                      <span>Seguir envío</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer con estadísticas */}
      <div className="p-4 bg-gray-50 border-t border-gray-100">
        <div className="grid grid-cols-3 gap-4 text-center text-sm">
          <div>
            <p className="text-gray-500">Total</p>
            <p className="font-semibold text-gray-900">{deliveries.length}</p>
          </div>
          <div>
            <p className="text-gray-500">Entregadas</p>
            <p className="font-semibold text-green-600">
              {deliveries.filter(d => d.status === 'entregado').length}
            </p>
          </div>
          <div>
            <p className="text-gray-500">Pendientes</p>
            <p className="font-semibold text-yellow-600">
              {deliveries.filter(d => d.status === 'pendiente').length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileDeliveryHistory;
