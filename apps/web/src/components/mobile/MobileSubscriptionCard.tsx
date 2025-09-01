import React, { useState } from 'react';
import { 
  Package, 
  Calendar, 
  MapPin, 
  ChevronDown, 
  ChevronUp,
  Pause,
  Play,
  Edit,
  Trash2
} from 'lucide-react';

interface Subscription {
  id: string;
  planId: string;
  status: 'active' | 'paused' | 'cancelled';
  quantity: number;
  nextDeliveryDate: string;
  address: string;
  frequency: string;
  createdAt: string;
}

interface MobileSubscriptionCardProps {
  subscription: Subscription;
  planName: string;
  productName: string;
  onStatusChange: (id: string, status: 'active' | 'paused') => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const MobileSubscriptionCard: React.FC<MobileSubscriptionCardProps> = ({
  subscription,
  planName,
  productName,
  onStatusChange,
  onEdit,
  onDelete
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showActions, setShowActions] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatShortDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'paused':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return '● Activa';
      case 'paused':
        return '⏸ Pausada';
      case 'cancelled':
        return '❌ Cancelada';
      default:
        return '❓ Desconocido';
    }
  };

  const getFrequencyText = (frequency: string) => {
    switch (frequency) {
      case 'weekly':
        return 'Semanal';
      case 'biweekly':
        return 'Quincenal';
      case 'monthly':
        return 'Mensual';
      default:
        return frequency;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header de la tarjeta */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-8 h-8 bg-ewa-blue rounded-lg flex items-center justify-center">
                <Package className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-base">
                  {productName}
                </h3>
                <p className="text-sm text-gray-600">{planName}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>Próxima: {formatShortDate(subscription.nextDeliveryDate)}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Package className="w-4 h-4" />
                <span>{subscription.quantity} unidades</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col items-end space-y-2">
            <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColor(subscription.status)}`}>
              {getStatusText(subscription.status)}
            </span>
            
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {isExpanded ? (
                <ChevronUp className="w-4 h-4 text-gray-600" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-600" />
              )}
            </button>
          </div>
        </div>

        {/* Información expandible */}
        {isExpanded && (
          <div className="space-y-3 pt-3 border-t border-gray-100">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-gray-500">Frecuencia</p>
                <p className="font-medium text-gray-900">
                  {getFrequencyText(subscription.frequency)}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Activa desde</p>
                <p className="font-medium text-gray-900">
                  {formatShortDate(subscription.createdAt)}
                </p>
              </div>
            </div>
            
            <div>
              <p className="text-gray-500 text-sm mb-1">Dirección de entrega</p>
              <div className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-gray-900">{subscription.address}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Acciones de la tarjeta */}
      <div className="border-t border-gray-100 bg-gray-50">
        <div className="flex items-center justify-between p-3">
          <div className="flex space-x-2">
            <button
              onClick={() => onEdit(subscription.id)}
              className="flex items-center space-x-1 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <Edit className="w-4 h-4" />
              <span>Editar</span>
            </button>
            
            <button
              onClick={() => setShowActions(!showActions)}
              className="flex items-center space-x-1 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <span>Acciones</span>
            </button>
          </div>
          
          {/* Botón principal de acción */}
          {subscription.status === 'active' ? (
            <button
              onClick={() => onStatusChange(subscription.id, 'paused')}
              className="flex items-center space-x-2 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white text-sm font-medium rounded-lg transition-colors"
            >
              <Pause className="w-4 h-4" />
              <span>Pausar</span>
            </button>
          ) : (
            <button
              onClick={() => onStatusChange(subscription.id, 'active')}
              className="flex items-center space-x-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-sm font-medium rounded-lg transition-colors"
            >
              <Play className="w-4 h-4" />
              <span>Reactivar</span>
            </button>
          )}
        </div>

        {/* Acciones adicionales */}
        {showActions && (
          <div className="border-t border-gray-200 bg-white p-3 space-y-2">
            <button
              onClick={() => onDelete(subscription.id)}
              className="w-full flex items-center justify-center space-x-2 px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              <span>Cancelar Suscripción</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileSubscriptionCard;
