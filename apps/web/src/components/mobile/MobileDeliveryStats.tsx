import React from 'react';
import { 
  Truck, 
  CheckCircle, 
  Clock, 
  TrendingUp,
  MapPin,
  Calendar
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

interface MobileDeliveryStatsProps {
  deliveries: Delivery[];
  nextDeliveryDate?: string;
}

const MobileDeliveryStats: React.FC<MobileDeliveryStatsProps> = ({
  deliveries,
  nextDeliveryDate
}) => {
  const totalDeliveries = deliveries.length;
  const completedDeliveries = deliveries.filter(d => d.status === 'entregado').length;
  const pendingDeliveries = deliveries.filter(d => d.status === 'pendiente').length;
  const inTransitDeliveries = deliveries.filter(d => d.status === 'en_camino').length;
  const failedDeliveries = deliveries.filter(d => d.status === 'fallido').length;
  
  const completionRate = totalDeliveries > 0 ? Math.round((completedDeliveries / totalDeliveries) * 100) : 0;
  const averageDeliveryTime = '2.5 horas'; // Mock data

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'entregado':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'en_camino':
        return <Truck className="w-5 h-5 text-blue-600" />;
      case 'pendiente':
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case 'fallido':
        return <Clock className="w-5 h-5 text-red-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'entregado':
        return 'bg-green-100 text-green-800';
      case 'en_camino':
        return 'bg-blue-100 text-blue-800';
      case 'pendiente':
        return 'bg-yellow-100 text-yellow-800';
      case 'fallido':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm">
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Estadísticas de Entregas</h3>
            <p className="text-sm text-gray-600">Resumen de tu servicio</p>
          </div>
        </div>
      </div>

      {/* Métricas principales */}
      <div className="p-4">
        <div className="grid grid-cols-2 gap-4 mb-6">
          {/* Tasa de completación */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-green-700 font-medium">Tasa de Éxito</span>
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-green-800">{completionRate}%</p>
            <p className="text-xs text-green-600 mt-1">
              {completedDeliveries} de {totalDeliveries} entregas
            </p>
          </div>

          {/* Tiempo promedio */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-blue-700 font-medium">Tiempo Promedio</span>
              <Clock className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-blue-800">{averageDeliveryTime}</p>
            <p className="text-xs text-blue-600 mt-1">Desde confirmación</p>
          </div>
        </div>

        {/* Próxima entrega destacada */}
        {nextDeliveryDate && (
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-200 mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-purple-900">Próxima Entrega</h4>
                <p className="text-sm text-purple-700">
                  {new Date(nextDeliveryDate).toLocaleDateString('es-ES', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Distribución por estado */}
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900 text-sm">Distribución por Estado</h4>
          
          <div className="space-y-2">
            {/* Entregadas */}
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-800">Entregadas</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-lg font-bold text-green-800">{completedDeliveries}</span>
                <span className="text-xs text-green-600">({completionRate}%)</span>
              </div>
            </div>

            {/* En camino */}
            {inTransitDeliveries > 0 && (
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Truck className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-800">En camino</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-lg font-bold text-blue-800">{inTransitDeliveries}</span>
                  <span className="text-xs text-blue-600">
                    ({Math.round((inTransitDeliveries / totalDeliveries) * 100)}%)
                  </span>
                </div>
              </div>
            )}

            {/* Pendientes */}
            {pendingDeliveries > 0 && (
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Clock className="w-4 h-4 text-yellow-600" />
                  <span className="text-sm font-medium text-yellow-800">Pendientes</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-lg font-bold text-yellow-800">{pendingDeliveries}</span>
                  <span className="text-xs text-yellow-600">
                    ({Math.round((pendingDeliveries / totalDeliveries) * 100)}%)
                  </span>
                </div>
              </div>
            )}

            {/* Fallidas */}
            {failedDeliveries > 0 && (
              <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Clock className="w-4 h-4 text-red-600" />
                  <span className="text-sm font-medium text-red-800">Fallidas</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-lg font-bold text-red-800">{failedDeliveries}</span>
                  <span className="text-xs text-red-600">
                    ({Math.round((failedDeliveries / totalDeliveries) * 100)}%)
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Insights */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-900 text-sm mb-3">💡 Insights</h4>
          <div className="space-y-2 text-sm text-gray-700">
            {completionRate >= 90 && (
              <p>🎉 ¡Excelente! Tu tasa de entrega exitosa es muy alta.</p>
            )}
            {completionRate >= 75 && completionRate < 90 && (
              <p>👍 Buen trabajo, la mayoría de tus entregas son exitosas.</p>
            )}
            {completionRate < 75 && (
              <p>📈 Hay espacio para mejorar la tasa de entrega exitosa.</p>
            )}
            {pendingDeliveries > 0 && (
              <p>⏰ Tienes {pendingDeliveries} entrega{pendingDeliveries !== 1 ? 's' : ''} pendiente{pendingDeliveries !== 1 ? 's' : ''}.</p>
            )}
            {inTransitDeliveries > 0 && (
              <p>🚚 {inTransitDeliveries} entrega{inTransitDeliveries !== 1 ? 's' : ''} está{inTransitDeliveries !== 1 ? 'n' : ''} en camino.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileDeliveryStats;
