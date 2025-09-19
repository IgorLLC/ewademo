import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import CustomerLayout from '../../components/CustomerLayout';
import { createOneOffOrder, getCurrentUser, getOneOffOrders, getProducts } from '@ewa/api-client';
import { OneOffOrder, Product, User } from '@ewa/types';
import { products as catalogProducts } from '../../data/products';

const statusCopy: Record<OneOffOrder['status'], { label: string; tone: string }> = {
  pending: { label: 'Pendiente', tone: 'bg-amber-100 text-amber-700 border-amber-200' },
  delivered: { label: 'Entregado', tone: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
};

const OneOffOrdersPage = () => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<OneOffOrder[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [createError, setCreateError] = useState<string | null>(null);
  const [createSuccess, setCreateSuccess] = useState<string | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fallbackProducts = useMemo<Product[]>(
    () =>
      catalogProducts
        .filter((item) => item.oneOffEligible !== false)
        .map((item) => ({
          id: item.sku ?? item.slug,
          name: item.name,
          description: item.shortDescription,
          sizeOz: typeof item.sizeOz === 'number' ? item.sizeOz : 0,
          sku: item.sku ?? item.slug,
          price: typeof item.unitPrice === 'number' ? item.unitPrice : 0,
        })),
    [],
  );

  const catalogMap = useMemo(() => {
    const map = new Map<string, (typeof catalogProducts)[number]>();
    catalogProducts.forEach((item) => {
      map.set(item.sku ?? item.slug, item);
    });
    return map;
  }, []);

  useEffect(() => {
    const current = getCurrentUser();
    if (!current || current.role !== 'customer') {
      router.replace('/auth');
      return;
    }

    setUser(current);

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const [ordersData, productsData] = await Promise.all([
          getOneOffOrders(current.id),
          getProducts(),
        ]);
        setOrders(ordersData);
        const effectiveProducts = productsData.length > 0 ? productsData : fallbackProducts;
        setProducts(effectiveProducts);
        setSelectedProductId((prev) => prev || effectiveProducts[0]?.id || '');
      } catch (err) {
        console.error('Error loading one-off orders:', err);
        setError('No pudimos cargar tus pedidos únicos. Intenta de nuevo más tarde.');
        setProducts(fallbackProducts);
        setSelectedProductId((prev) => prev || fallbackProducts[0]?.id || '');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [router, fallbackProducts]);

  const productMap = useMemo(() => {
    return products.reduce<Record<string, Product>>((acc, product) => {
      acc[product.id] = product;
      return acc;
    }, {});
  }, [products]);

  const handleCreateOrder = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!user || !selectedProductId) return;

    setCreateError(null);
    setCreateSuccess(null);
    setIsSubmitting(true);

    try {
      const newOrder = await createOneOffOrder({
        productId: selectedProductId,
        userId: user.id,
        status: 'pending',
      });

      setOrders((prev) => [newOrder, ...prev]);
      setCreateSuccess('Pedido registrado. Te notificaremos cuando esté en camino.');
    } catch (err) {
      console.error('Error creating one-off order:', err);
      setCreateError('No pudimos crear el pedido en este momento. Intenta nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-ewa-blue" />
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Pedidos únicos - EWA Box Water</title>
        <meta name="description" content="Consulta el historial de tus compras individuales" />
      </Head>

      <CustomerLayout
        user={user}
        title="Pedidos únicos"
        description="Registra compras adicionales puntuales y consulta su historial."
      >
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3">
            {error}
          </div>
        )}

        {!loading && (products.length === 0 ? (
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900">No hay productos disponibles</h3>
            <p className="mt-2 text-gray-600">
              Todavía no hay productos para pedidos individuales. Escríbenos si necesitas asistencia.
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleCreateOrder}
            className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 space-y-4 mb-10"
          >
            <div className="space-y-1">
              <h3 className="text-lg font-semibold text-gray-900">Registrar nuevo pedido único</h3>
              <p className="text-sm text-gray-600">
                Selecciona el producto que necesitas y confirmaremos la entrega lo antes posible.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="flex flex-col gap-2 text-sm text-gray-700">
                Producto
                <select
                  className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-ewa-blue focus:outline-none focus:ring-2 focus:ring-ewa-blue/20"
                  value={selectedProductId}
                  onChange={(event) => setSelectedProductId(event.target.value)}
                  required
                >
                  {products.map((product) => {
                    const detail = catalogMap.get(product.id) ?? catalogMap.get(product.sku);
                    return (
                      <option key={product.id} value={product.id}>
                        {product.name}
                        {detail?.volumeLabel ? ` · ${detail.volumeLabel}` : ''}
                        {product.price ? ` · $${product.price.toFixed(2)}` : ''}
                      </option>
                    );
                  })}
                </select>
              </label>

              {selectedProductId && (
                <div className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm text-gray-600">
                  <div className="font-medium text-gray-800">
                    {productMap[selectedProductId]?.name}
                  </div>
                  {catalogMap.get(selectedProductId)?.volumeLabel && (
                    <p className="text-xs text-gray-500">
                      {catalogMap.get(selectedProductId)?.volumeLabel}
                    </p>
                  )}
                  <div>{productMap[selectedProductId]?.description || 'Entrega puntual coordinada por nuestro equipo.'}</div>
                </div>
              )}
            </div>

            {createError && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
                {createError}
              </div>
            )}

            {createSuccess && (
              <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm text-emerald-700">
                {createSuccess}
              </div>
            )}

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="submit"
                disabled={isSubmitting || !selectedProductId}
                className="inline-flex items-center gap-2 rounded-full bg-ewa-blue px-5 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-ewa-dark-blue disabled:cursor-not-allowed disabled:bg-gray-300"
              >
                {isSubmitting && (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                )}
                Confirmar pedido
              </button>
              <span className="text-xs text-gray-500">
                Los pedidos únicos aparecen abajo con su estado actual.
              </span>
            </div>
          </form>
        ))}

        {loading ? (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-ewa-blue mx-auto" />
            <p className="mt-4 text-gray-600">Cargando tus pedidos…</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay pedidos registrados</h3>
            <p className="text-gray-600">
              Cuando realices compras adicionales aparecerán aquí con su estado y detalle.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {orders.map((order) => {
              const product = productMap[order.productId];
              const catalogDetail = catalogMap.get(order.productId) ?? (product?.sku ? catalogMap.get(product.sku) : undefined);
              const volumeLabel = catalogDetail?.volumeLabel;
              const formattedSize = !volumeLabel && product?.sizeOz
                ? `${Number.isInteger(product.sizeOz) ? product.sizeOz : product.sizeOz.toFixed(1)} oz`
                : volumeLabel;
              const statusInfo = statusCopy[order.status] ?? statusCopy.pending;
              return (
                <article
                  key={order.id}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col gap-4"
                >
                  <header className="flex items-center justify-between gap-3">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">
                        {product?.name || 'Producto'}
                      </h3>
                      <p className="text-sm text-gray-500">ID pedido: {order.id}</p>
                    </div>
                    <span className={`px-3 py-1 text-sm font-medium rounded-full border ${statusInfo.tone}`}>
                      {statusInfo.label}
                    </span>
                  </header>
                  <dl className="grid grid-cols-1 gap-3 text-sm text-gray-600">
                    <div>
                      <dt className="font-medium text-gray-500">Cantidad</dt>
                      <dd>{formattedSize || 'Sin detalle'}</dd>
                    </div>
                    <div>
                      <dt className="font-medium text-gray-500">Precio estimado</dt>
                      <dd>{product ? `$${product.price.toFixed(2)}` : 'Pendiente'}</dd>
                    </div>
                    <div>
                      <dt className="font-medium text-gray-500">Estado</dt>
                      <dd>{statusInfo.label}</dd>
                    </div>
                  </dl>
                </article>
              );
            })}
          </div>
        )}
      </CustomerLayout>
    </>
  );
};

export default OneOffOrdersPage;
