import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { getUserById, getPlans, getProducts, createSubscription } from '@ewa/api-client';
import { User, Plan, Product, Subscription } from '@ewa/types';
import AdminLayout from '../../../../../components/AdminLayout';

// Mock plans data
const mockPlans: Plan[] = [
  {
    id: 'plan1',
    name: 'Plan Premium Mensual',
    productId: 'prod1',
    frequency: 'monthly',
    minQty: 1
  },
  {
    id: 'plan2',
    name: 'Plan Básico Semanal',
    productId: 'prod2',
    frequency: 'weekly',
    minQty: 1
  },
  {
    id: 'plan3',
    name: 'Plan Empresarial Quincenal',
    productId: 'prod1',
    frequency: 'biweekly',
    minQty: 2
  }
];

// Mock products data
const mockProducts: Product[] = [
  {
    id: 'prod1',
    name: 'Agua Premium',
    sizeOz: 160, // 5 galones
    sku: 'EWA-PREM-5GAL',
    price: 25.99
  },
  {
    id: 'prod2',
    name: 'Agua Básica',
    sizeOz: 96, // 3 galones
    sku: 'EWA-BASIC-3GAL',
    price: 18.99
  }
];

const NewSubscription = () => {
  const router = useRouter();
  const { id } = router.query;
  const [user, setUser] = useState<User | null>(null);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    planId: '',
    quantity: 1,
    address: '',
    startDate: new Date().toISOString().split('T')[0], // Today's date
    notes: ''
  });

  useEffect(() => {
    if (id && typeof id === 'string') {
      loadData(id);
    }
  }, [id]);

  const loadData = async (userId: string) => {
    try {
      setIsLoading(true);
      const [userData, plansData, productsData] = await Promise.all([
        getUserById(userId),
        getPlans(),
        getProducts()
      ]);
      
      setUser(userData);
      setPlans(plansData);
      setProducts(productsData);
      
      // Pre-fill address if user has one
      if (userData.address) {
        const fullAddress = `${userData.address.street}, ${userData.address.city}, ${userData.address.state || ''} ${userData.address.zipCode || ''}`.trim();
        setFormData(prev => ({ ...prev, address: fullAddress }));
      }
    } catch (err: any) {
      console.error('Error loading data:', err);
      setError('Error al cargar la información necesaria.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'quantity' ? parseInt(value) || 1 : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      if (typeof id !== 'string') return;
      
      const selectedPlan = plans.find(p => p.id === formData.planId);
      if (!selectedPlan) {
        throw new Error('Plan seleccionado no válido');
      }

      const subscriptionData: Omit<Subscription, 'id'> = {
        planId: formData.planId,
        userId: id,
        status: 'active',
        productId: selectedPlan.productId,
        quantity: formData.quantity,
        address: formData.address,
        nextDeliveryDate: formData.startDate,
        frequency: selectedPlan.frequency,
        createdAt: new Date().toISOString()
      };
      
      await createSubscription(subscriptionData);
      
      // Redirect back to user subscriptions with success message
      router.push(`/admin/users/${id}/subscriptions?success=created`);
    } catch (err: any) {
      console.error('Error creating subscription:', err);
      setError(err.message || 'Error al crear la suscripción. Por favor intenta nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push(`/admin/users/${id}/subscriptions`);
  };

  const getSelectedProduct = () => {
    const selectedPlan = plans.find(p => p.id === formData.planId);
    if (!selectedPlan) return null;
    return products.find(p => p.id === selectedPlan.productId);
  };

  const getEstimatedCost = () => {
    const product = getSelectedProduct();
    if (!product) return 0;
    return product.price * formData.quantity;
  };

  if (isLoading) {
    return (
      <AdminLayout 
        title="Nueva Suscripción" 
        description="Cargando información..." 
        currentPage="users"
      >
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-ewa-blue"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout 
      title={`Nueva Suscripción - ${user?.name}`} 
      description="Crear nueva suscripción para el cliente" 
      currentPage="users"
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <button
                onClick={handleCancel}
                className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 mb-2"
              >
                <svg className="mr-1 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Volver a suscripciones
              </button>
              <h1 className="text-2xl font-bold text-gray-900">Nueva Suscripción</h1>
              <p className="mt-2 text-gray-600">
                Crear una nueva suscripción para <strong>{user?.name}</strong> ({user?.email})
              </p>
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4">
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

        {/* Subscription Form */}
        <div className="bg-white shadow rounded-lg">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            
            {/* Plan Selection */}
            <div>
              <label htmlFor="planId" className="block text-sm font-medium text-gray-700">
                Plan de Suscripción *
              </label>
              <select
                id="planId"
                name="planId"
                required
                value={formData.planId}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-ewa-blue focus:border-ewa-blue"
              >
                <option value="">Seleccionar un plan</option>
                {plans.map((plan) => {
                  const product = products.find(p => p.id === plan.productId);
                  return (
                    <option key={plan.id} value={plan.id}>
                      {plan.name} - {product?.name} ({product?.sizeOz ? `${Math.round(product.sizeOz / 32)} galones` : 'N/A'}) - 
                      {plan.frequency === 'weekly' ? ' Semanal' : plan.frequency === 'monthly' ? ' Mensual' : ' Quincenal'} - 
                      ${product?.price || 0}/unidad
                    </option>
                  );
                })}
              </select>
            </div>

            {/* Quantity */}
            <div>
              <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
                Cantidad *
              </label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                min="1"
                max="10"
                required
                value={formData.quantity}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-ewa-blue focus:border-ewa-blue"
              />
              {formData.planId && (
                <p className="mt-1 text-sm text-gray-500">
                  Mínimo requerido: {plans.find(p => p.id === formData.planId)?.minQty || 1} unidad(es)
                </p>
              )}
            </div>

            {/* Delivery Address */}
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                Dirección de Entrega *
              </label>
              <textarea
                id="address"
                name="address"
                rows={3}
                required
                value={formData.address}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-ewa-blue focus:border-ewa-blue"
                placeholder="Dirección completa de entrega..."
              />
            </div>

            {/* Start Date */}
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                Fecha de Primera Entrega *
              </label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                required
                min={new Date().toISOString().split('T')[0]}
                value={formData.startDate}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-ewa-blue focus:border-ewa-blue"
              />
            </div>

            {/* Notes */}
            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                Notas Adicionales
              </label>
              <textarea
                id="notes"
                name="notes"
                rows={3}
                value={formData.notes}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-ewa-blue focus:border-ewa-blue"
                placeholder="Instrucciones especiales, comentarios, etc."
              />
            </div>

            {/* Summary */}
            {formData.planId && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Resumen de la Suscripción</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Plan:</span>
                    <span className="font-medium">{plans.find(p => p.id === formData.planId)?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Producto:</span>
                    <span className="font-medium">{getSelectedProduct()?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Cantidad:</span>
                    <span className="font-medium">{formData.quantity} unidad(es)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Frecuencia:</span>
                    <span className="font-medium">
                      {plans.find(p => p.id === formData.planId)?.frequency === 'weekly' ? 'Semanal' : 
                       plans.find(p => p.id === formData.planId)?.frequency === 'monthly' ? 'Mensual' : 'Quincenal'}
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-gray-200">
                    <span className="text-gray-600">Costo estimado por entrega:</span>
                    <span className="font-bold text-lg text-ewa-blue">
                      ${getEstimatedCost().toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Form Actions */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ewa-blue"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-ewa-blue hover:bg-ewa-dark-blue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ewa-blue disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                    Creando...
                  </div>
                ) : (
                  'Crear Suscripción'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
};

export default NewSubscription;