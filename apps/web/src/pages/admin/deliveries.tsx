import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import QRCode from 'react-qr-code';
import AdminLayout from '../../components/AdminLayout';
import { Route } from '@ewa/types';
import { getRoutes } from '@ewa/api-client';

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

function getDayName(date: Date, variant: 'short' | 'long' = 'short'): string {
  return date.toLocaleDateString('es-ES', { weekday: variant });
}

function formatShortDate(date: Date): string {
  return date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' });
}

function isSameDate(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function classNames(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}

function formatDDMMYYYY(date: Date): string {
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const yyyy = date.getFullYear();
  return `${dd}-${mm}-${yyyy}`;
}

function parseYYYYMMDDToDate(key: string): Date {
  // key en formato YYYY-MM-DD
  const [y, m, d] = key.split('-').map((v) => parseInt(v, 10));
  return new Date(y, m - 1, d);
}

const AdminDeliveries: React.FC = () => {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(startOfWeek(new Date()));
  const [statusFilter, setStatusFilter] = useState<string>('scheduled');
  const [selectedDayKey, setSelectedDayKey] = useState<string | null>(null);
  const [showOnlyPending, setShowOnlyPending] = useState<boolean>(true);
  const [selectedDelivery, setSelectedDelivery] = useState<{
    routeId: string;
    stopId: string;
  } | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [submittingRoute, setSubmittingRoute] = useState<boolean>(false);
  const [createdRouteId, setCreatedRouteId] = useState<string | null>(null);
  const router = useRouter();

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
        const data = await getRoutes();
        // Filtrar por la semana visible
        const startKey = formatISODate(week.start);
        const endKey = formatISODate(week.end);
        const filtered = data.filter(r => {
          const dateKey = r.deliveryDate.slice(0, 10);
          return dateKey >= startKey && dateKey <= endKey;
        });
        // Limitar a un máximo de 12 entregas (stops) totales para el demo
        let totalStops = 0;
        const limited: Route[] = [];
        for (const r of filtered) {
          if (totalStops >= 12) break;
          const stops = (r as any).stops?.length ? (r as any).stops : r.details?.stops || [];
          const remaining = 12 - totalStops;
          if (stops.length <= remaining) {
            limited.push(r);
            totalStops += stops.length;
          } else {
            const clone: any = { ...r };
            if ((r as any).stops?.length) {
              clone.stops = stops.slice(0, remaining);
            } else if (r.details?.stops) {
              clone.details = { ...(r.details as any), stops: stops.slice(0, remaining) };
            }
            limited.push(clone);
            totalStops = 12;
            break;
          }
        }
        setRoutes(limited);
        setError(null);
      } catch (e) {
        console.error(e);
        setError('No se pudieron cargar las rutas');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [week.start, week.end]);

  const groupedByDay = useMemo(() => {
    const map = new Map<string, Route[]>();
    for (const route of routes) {
      const key = route.deliveryDate.slice(0, 10);
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(route);
    }
    return map;
  }, [routes]);

  function getStops(route: Route) {
    // Compatibilidad: usar r.stops o r.details?.stops
    return (route as any).stops?.length ? (route as any).stops : route.details?.stops || [];
  }

  const selectedDayRoutes = useMemo(() => {
    if (!selectedDayKey) return [] as Route[];
    return groupedByDay.get(selectedDayKey) || [];
  }, [groupedByDay, selectedDayKey]);

  const selectedDayStops = useMemo(() => {
    const items: Array<{
      routeId: string;
      routeName: string;
      driverName: string;
      stopId: string;
      address: string;
      status: string;
      eta?: string;
      orderId?: string;
      customer?: string;
    }> = [];
    for (const r of selectedDayRoutes) {
      const stops = getStops(r);
      for (const s of stops) {
        items.push({
          routeId: r.id,
          routeName: r.name,
          driverName: r.driverName,
          stopId: s.id,
          address: s.address,
          status: s.status,
          eta: (s as any).eta,
          orderId: (s as any).orderId,
          customer: (s as any).customer,
        });
      }
    }
    const byPending = showOnlyPending ? items.filter(i => i.status === 'pending') : items;
    const bySearch = searchQuery
      ? byPending.filter(i =>
          i.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
          i.routeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          i.driverName.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : byPending;
    return bySearch;
  }, [selectedDayRoutes, showOnlyPending, searchQuery]);

  const paginatedStops = useMemo(() => {
    const start = (page - 1) * pageSize;
    return selectedDayStops.slice(start, start + pageSize);
  }, [selectedDayStops, page, pageSize]);

  useEffect(() => {
    setPage(1);
  }, [selectedDayKey, showOnlyPending, searchQuery]);

  function getDayCounts(dayKey: string) {
    const dayRoutes = groupedByDay.get(dayKey) || [];
    let total = 0;
    let pending = 0;
    for (const r of dayRoutes) {
      const stops = getStops(r);
      total += stops.length;
      pending += stops.filter((s: any) => s.status === 'pending').length;
    }
    return { total, pending };
  }

  function statusPillClasses(status: string, type: 'route' | 'stop' = 'route') {
    const map: Record<string, string> = type === 'route'
      ? {
          scheduled: 'bg-gray-100 text-gray-700',
          pending: 'bg-amber-100 text-amber-800',
          active: 'bg-indigo-100 text-indigo-800',
          'in-progress': 'bg-blue-100 text-blue-800',
          completed: 'bg-green-100 text-green-800',
          failed: 'bg-red-100 text-red-800',
          cancelled: 'bg-gray-200 text-gray-700',
        }
      : {
          pending: 'bg-amber-100 text-amber-800',
          completed: 'bg-green-100 text-green-800',
        };
    return map[status] || 'bg-gray-100 text-gray-700';
  }

  async function handleSubmitDayToRoute() {
    if (!selectedDayKey) return;
    try {
      setSubmittingRoute(true);
      const newRoute: any = {
        name: `Auto Ruta ${formatDDMMYYYY(parseYYYYMMDDToDate(selectedDayKey))}`,
        area: 'General',
        driverId: 'auto',
        driverName: 'Asignar',
        status: 'scheduled',
        deliveryDate: selectedDayKey,
        startTime: `${selectedDayKey}T09:00:00`,
        estimatedEndTime: `${selectedDayKey}T14:00:00`,
        // Usamos stops como arreglo (compatible con nuestro lector getStops)
        stops: selectedDayStops.map((s) => ({
          id: s.stopId,
          address: s.address,
          lat: 0,
          lng: 0,
          status: 'pending',
          eta: s.eta || undefined,
          orderId: s.orderId || undefined,
          customer: s.customer || undefined,
        })),
      };
      // Lazy import para evitar tree-shake del bundle
      const { createRoute } = await import('@ewa/api-client');
      const created = await createRoute(newRoute);
      setCreatedRouteId(created.id);
      try { localStorage.setItem('ewa_routes_enabled', '1'); } catch {}
      // Guardar snapshot demo (máx. 12) para Rutas y evitar acumulación
      try {
        const snapshot = {
          id: created.id,
          name: created.name,
          area: created.area,
          driverId: created.driverId,
          driverName: created.driverName,
          status: created.status,
          startTime: created.startTime,
          estimatedEndTime: created.estimatedEndTime,
          stops: (newRoute.stops || []).slice(0, 12),
          demo: true,
          fromDeliveries: true,
        };
        localStorage.setItem('ewa_routes_snapshot', JSON.stringify(snapshot));
      } catch {}
      // No acumular en Calendario: no agregamos más rutas al listado del demo
    } catch (e) {
      console.error(e);
      setError('No se pudo enviar a ruta');
    } finally {
      setSubmittingRoute(false);
    }
  }

  const handlePrevWeek = () => setCurrentWeekStart(addDays(week.start, -7));
  const handleNextWeek = () => setCurrentWeekStart(addDays(week.start, 7));
  const statusesToShow = statusFilter === 'all' ? undefined : statusFilter;

  return (
    <AdminLayout title="Calendario de Entregas" description="Gestión semanal de entregas de suscripciones" currentPage="deliveries">
      <div className="bg-white shadow rounded-lg p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="flex items-center gap-2">
            <button onClick={handlePrevWeek} className="px-2 py-1 border rounded">&larr;</button>
            <div className="font-medium">
              Semana {formatDDMMYYYY(week.start)} - {formatDDMMYYYY(week.end)}
            </div>
            <button onClick={handleNextWeek} className="px-2 py-1 border rounded">&rarr;</button>
          </div>
          <div className="flex items-center gap-2">
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="border rounded px-2 py-1">
              <option value="scheduled">Programadas</option>
              <option value="in-progress">En progreso</option>
              <option value="active">Activas</option>
              <option value="completed">Completadas</option>
              <option value="pending">Pendientes</option>
              <option value="all">Todas</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="p-6 text-center">Cargando...</div>
        ) : error ? (
          <div className="p-4 text-red-600">{error}</div>
        ) : (
          <>
            {/* Encabezados con nombres de los días */}
            <div className="grid grid-cols-1 md:grid-cols-7 gap-3 mt-4">
              {week.days.map((day) => {
                const key = formatISODate(day);
                const counts = getDayCounts(key);
                const isToday = isSameDate(day, new Date());
                return (
                  <div
                    key={`hdr-${key}`}
                    className={classNames('text-center text-sm font-semibold', isToday ? 'text-ewa-blue' : 'text-gray-700')}
                  >
                    <div>{getDayName(day, 'long')}</div>
                    <div className="mt-1 inline-flex items-center gap-2">
                      <span className="text-xs text-gray-500">{formatDDMMYYYY(day)}</span>
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">{counts.pending}/{counts.total}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Columnas por día con contenido (vista minimal) */}
            <div className="grid grid-cols-1 md:grid-cols-7 gap-3 mt-2">
            {week.days.map((day) => {
              const key = formatISODate(day);
              const dailyRoutes = (groupedByDay.get(key) || []).filter(r => !statusesToShow || r.status === statusesToShow);
              // Lista minimal de entregas (stops) para el día (sin muchos detalles)
              const dayStops = dailyRoutes.flatMap(r => getStops(r));
              const isToday = isSameDate(day, new Date());
              return (
                  <div
                    key={key}
                    className={classNames('border rounded p-2 min-h-[200px] cursor-pointer hover:border-ewa-blue/50 transition-colors', isToday && 'border-ewa-blue/60')}
                    onClick={() => setSelectedDayKey(prev => (prev === key ? null : key))}
                  >
                  <div className="text-sm text-gray-600 mb-2">
                    <span className="font-medium">{getDayName(day, 'short')}</span> · {formatDDMMYYYY(day)}
                  </div>
                  {dayStops.length === 0 ? (
                    <div className="text-xs text-gray-400">Sin entregas</div>
                  ) : (
                    <>
                      <ul className="space-y-1">
                        {dayStops.slice(0, 5).map((s: any) => (
                          <li key={s.id} className="text-xs text-gray-700 truncate">
                            • {s.customer || 'Cliente'} — {(s.orderId ? `Orden ${s.orderId}` : 'Entrega')} 
                          </li>
                        ))}
                        {dayStops.length > 5 && (
                          <li className="text-xs text-gray-400">… y {dayStops.length - 5} más</li>
                        )}
                      </ul>
                      <div className="mt-2 text-right">
                        <button
                          className="text-xs text-ewa-blue hover:underline"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedDayKey(key);
                          }}
                        >
                          Ver resumen del día ({dayStops.length})
                        </button>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
            </div>

            {/* Panel de resumen del día seleccionado */}
            {selectedDayKey && (
              <div className="mt-6 border rounded-lg bg-white">
                <div className="p-4 border-b flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                  <div>
                    <div className="text-sm text-gray-500">Resumen del día</div>
                    <div className="text-lg font-semibold">{formatDDMMYYYY(parseYYYYMMDDToDate(selectedDayKey))}</div>
                    <div className="text-xs text-gray-600 mt-1">
                      Rutas: {selectedDayRoutes.length} · Entregas: {selectedDayStops.length}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={showOnlyPending}
                        onChange={(e) => setShowOnlyPending(e.target.checked)}
                      />
                      Solo pendientes
                    </label>
                    <button
                      className="text-sm px-3 py-1 border rounded"
                      onClick={() => {
                        setSelectedDayKey(null);
                        setSelectedDelivery(null);
                      }}
                    >
                      Cerrar
                    </button>
                  </div>
                </div>

                <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Lista de entregas del día */}
                  <div className="md:col-span-2">
                    <div className="flex items-center justify-between gap-3 mb-2">
                      <div className="text-sm font-medium">Entregas</div>
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          placeholder="Buscar por dirección, ruta o conductor"
                          className="border rounded px-2 py-1 text-sm w-64"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <select className="border rounded px-2 py-1 text-sm" value={pageSize} onChange={(e) => setPageSize(Number(e.target.value))}>
                          <option value={10}>10</option>
                          <option value={20}>20</option>
                          <option value={50}>50</option>
                        </select>
                      </div>
                    </div>
                    {selectedDayStops.length === 0 ? (
                      <div className="text-sm text-gray-500">No hay entregas para mostrar.</div>
                    ) : (
                      <ul className="divide-y border rounded">
                        {paginatedStops.map((s) => (
                          <li
                            key={`${s.routeId}-${s.stopId}`}
                            className={`p-3 hover:bg-gray-50 cursor-pointer ${selectedDelivery && selectedDelivery.routeId === s.routeId && selectedDelivery.stopId === s.stopId ? 'bg-ewa-light-blue/30' : ''}`}
                            onClick={() => setSelectedDelivery({ routeId: s.routeId, stopId: s.stopId })}
                          >
                            <div className="text-sm font-medium truncate">{s.customer || 'Cliente'} — {(s.orderId ? `Orden ${s.orderId}` : 'Entrega')}</div>
                            <div className="text-xs text-gray-500">Ruta: {s.routeName} · Conductor: {s.driverName}</div>
                            <div className="text-xs mt-1 inline-flex items-center gap-2">
                              <span>Estado:</span>
                              <span className={classNames('px-2 py-0.5 rounded-full', statusPillClasses(s.status, 'stop'))}>{s.status}</span>
                              {s.eta ? <span>· ETA: {s.eta}</span> : null}
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                    <div className="mt-4 flex items-center justify-end gap-3">
                      <button
                        className="px-3 py-1 border rounded disabled:opacity-50"
                        disabled={submittingRoute || selectedDayStops.length === 0}
                        onClick={handleSubmitDayToRoute}
                      >
                        {submittingRoute ? 'Generando ruta…' : 'Enviar a ruta'}
                      </button>
                      {createdRouteId && (
                        <button
                          className="px-3 py-1 border rounded"
                          onClick={() => router.push(`/admin/routes?activated=1&routeId=${createdRouteId}`)}
                        >
                          Ver en Rutas
                        </button>
                      )}
                    </div>
                    {selectedDayStops.length > pageSize && (
                      <div className="flex items-center justify-between mt-3 text-sm">
                        <div>
                          Mostrando {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, selectedDayStops.length)} de {selectedDayStops.length}
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            className="px-2 py-1 border rounded disabled:opacity-50"
                            disabled={page === 1}
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                          >Anterior</button>
                          <button
                            className="px-2 py-1 border rounded disabled:opacity-50"
                            disabled={page * pageSize >= selectedDayStops.length}
                            onClick={() => setPage((p) => p + 1)}
                          >Siguiente</button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Detalle contextual de la entrega seleccionada */}
                  <div className="md:col-span-1">
                    <div className="text-sm font-medium mb-2">Detalle</div>
                    {!selectedDelivery ? (
                      <div className="text-sm text-gray-500">Selecciona una entrega para ver detalles.</div>
                    ) : (
                      (() => {
                        const route = selectedDayRoutes.find(r => r.id === selectedDelivery.routeId);
                        const stop = route ? getStops(route).find((st: any) => st.id === selectedDelivery.stopId) : null;
                        if (!route || !stop) return <div className="text-sm text-gray-500">No se encontró la entrega.</div>;
                        return (
                          <div className="border rounded p-3 text-sm space-y-2">
                            <div className="font-medium">{stop.address}</div>
                            <div className="text-gray-600">Estado: {stop.status}{stop.eta ? ` · ETA: ${stop.eta}` : ''}</div>
                            <div className="text-gray-600">Ruta: {route.name} — {route.area}</div>
                            <div className="text-gray-600">Conductor: {route.driverName}</div>
                            <div className="text-gray-600">Fecha: {formatDDMMYYYY(parseYYYYMMDDToDate(selectedDayKey))}</div>
                            {createdRouteId && (
                              <div className="pt-2 border-t">
                                <div className="text-xs text-gray-500 mb-2">QR de ruta creada</div>
                                <div className="bg-white p-2 inline-block">
                                  <QRCode value={`route:${createdRouteId}`} size={128} />
                                </div>
                                <div className="text-xs text-gray-600 mt-2 break-all">ID: {createdRouteId}</div>
                              </div>
                            )}
                          </div>
                        );
                      })()
                    )}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminDeliveries;


