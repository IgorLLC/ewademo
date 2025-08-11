import React, { useEffect, useMemo, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { Delivery } from '@ewa/types';
import { getDeliveries, updateDeliveryStatus } from '@ewa/api-client';

type WeekView = {
  start: Date;
  end: Date;
  days: Date[];
};

function startOfWeek(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = (day === 0 ? -6 : 1) - day; // Lunes como inicio de semana
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function formatISODate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

const AdminDeliveries: React.FC = () => {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(startOfWeek(new Date()));
  const [statusFilter, setStatusFilter] = useState<string>('scheduled');

  const week: WeekView = useMemo(() => {
    const start = currentWeekStart;
    const end = addDays(start, 6);
    const days = Array.from({ length: 7 }, (_, i) => addDays(start, i));
    return { start, end, days };
  }, [currentWeekStart]);

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const data = await getDeliveries({
          startDate: formatISODate(week.start),
          endDate: formatISODate(week.end),
          status: undefined,
        });
        setDeliveries(data);
      } catch (e) {
        console.error(e);
        // Fallback local si la API falla
        const fallback: Delivery[] = [
          {
            id: 'fd1',
            subscriptionId: 'sub2',
            userId: 'u3',
            orderId: 'o2',
            routeId: undefined,
            pickupPointId: undefined,
            deliveryType: 'home_delivery',
            status: 'scheduled',
            scheduledDate: formatISODate(new Date()),
            deliveryAddress: { street: 'Fallback 123', city: 'San Juan', state: 'PR', zipCode: '00911' },
            recipient: { name: 'Cliente Demo', phone: '555-111-2222', email: 'demo@example.com' },
            items: [{ productId: 'p1', productName: 'Small Box Water', quantity: 1, size: '500ml' }],
            attempts: 0,
            maxAttempts: 3,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ];
        setDeliveries(fallback);
        setError(null);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [week.start, week.end]);

  const groupedByDay = useMemo(() => {
    const map = new Map<string, Delivery[]>();
    for (const del of deliveries) {
      const key = del.scheduledDate.slice(0, 10);
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(del);
    }
    return map;
  }, [deliveries]);

  const handleMarkProcessed = async (delivery: Delivery) => {
    try {
      const updated = await updateDeliveryStatus(delivery.id, 'in_transit');
      setDeliveries(prev => prev.map(d => (d.id === delivery.id ? updated : d)));
    } catch (e) {
      console.error(e);
      setError('No se pudo marcar como procesado');
    }
  };

  const handlePrevWeek = () => setCurrentWeekStart(addDays(week.start, -7));
  const handleNextWeek = () => setCurrentWeekStart(addDays(week.start, 7));

  const statusesToShow = statusFilter === 'all' ? undefined : statusFilter;
  const deliveriesToShow = useMemo(() => {
    if (!statusesToShow) return deliveries;
    return deliveries.filter(d => d.status === statusesToShow);
  }, [deliveries, statusesToShow]);

  return (
    <AdminLayout title="Calendario de Entregas" description="Gestión semanal de entregas de suscripciones" currentPage="deliveries">
      <div className="bg-white shadow rounded-lg p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="flex items-center gap-2">
            <button onClick={handlePrevWeek} className="px-2 py-1 border rounded">&larr;</button>
            <div className="font-medium">
              Semana {formatISODate(week.start)} - {formatISODate(week.end)}
            </div>
            <button onClick={handleNextWeek} className="px-2 py-1 border rounded">&rarr;</button>
          </div>
          <div className="flex items-center gap-2">
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="border rounded px-2 py-1">
              <option value="scheduled">Pendientes</option>
              <option value="in_transit">En tránsito</option>
              <option value="out_for_delivery">Saliendo</option>
              <option value="delivered">Entregadas</option>
              <option value="failed">Fallidas</option>
              <option value="cancelled">Canceladas</option>
              <option value="rescheduled">Reprogramadas</option>
              <option value="skipped">Omitidas</option>
              <option value="all">Todas</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="p-6 text-center">Cargando...</div>
        ) : error ? (
          <div className="p-4 text-red-600">{error}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-7 gap-3 mt-4">
            {week.days.map((day) => {
              const key = formatISODate(day);
              const daily = (groupedByDay.get(key) || []).filter(d =>
                !statusesToShow || d.status === statusesToShow
              );
              return (
                <div key={key} className="border rounded p-2 min-h-[200px]">
                  <div className="text-sm text-gray-600 mb-2">{key}</div>
                  {daily.length === 0 ? (
                    <div className="text-xs text-gray-400">Sin entregas</div>
                  ) : (
                    <ul className="space-y-2">
                      {daily.map((d) => (
                        <li key={d.id} className="border rounded p-2">
                          <div className="text-sm font-medium">{d.recipient.name}</div>
                          <div className="text-xs text-gray-500">
                            {d.deliveryAddress.street}, {d.deliveryAddress.city}
                          </div>
                          <div className="text-xs mt-1">Estado: {d.status}</div>
                          {d.status === 'scheduled' && (
                            <button
                              onClick={() => handleMarkProcessed(d)}
                              className="mt-2 text-xs px-2 py-1 bg-blue-600 text-white rounded"
                            >
                              Marcar como procesado
                            </button>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminDeliveries;


