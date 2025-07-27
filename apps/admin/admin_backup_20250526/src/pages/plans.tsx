import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { Plan, Product } from '@ewa/types';

// Tipos extendidos para planes y productos con campos adicionales
type ExtendedPlan = Plan & {
  name: string;
  price: number;
  active: boolean;
};

type ExtendedProduct = Product & {
  description?: string;
};

const PlansPage = () => {
  const [plans, setPlans] = useState<ExtendedPlan[]>([]);
  const [products, setProducts] = useState<ExtendedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<ExtendedPlan | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    productId: '',
    frequency: 'weekly',
    minQty: 6,
    price: 0
  });

  useEffect(() => {
    // Simulamos la carga de planes y productos desde el mock
    const fetchData = async () => {
      try {
        // Datos mock de productos
        const mockProducts = [
          {
            id: "p1",
            name: "EWA Box Water - Small",
            sizeOz: 8,
            sku: "EWA-S-8OZ",
            price: 1.99,
            description: "Caja de agua pequeña, perfecta para niños y porciones individuales."
          },
          {
            id: "p2",
            name: "EWA Box Water - Medium",
            sizeOz: 16,
            sku: "EWA-M-16OZ",
            price: 2.49,
            description: "Caja de agua mediana, ideal para uso diario."
          },
          {
            id: "p3",
            name: "EWA Box Water - Large",
            sizeOz: 32,
            sku: "EWA-L-32OZ",
            price: 2.99,
            description: "Caja de agua grande, perfecta para deportistas y actividades al aire libre."
          }
        ];
        
        // Datos mock de planes
        const mockPlans = [
          {
            id: "plan1",
            name: "EWA Box Water - Small (Weekly)",
            productId: "p1",
            frequency: "weekly",
            minQty: 6,
            price: 11.94, // 6 * 1.99
            active: true
          },
          {
            id: "plan2",
            name: "EWA Box Water - Medium (Biweekly)",
            productId: "p2",
            frequency: "biweekly",
            minQty: 12,
            price: 29.88, // 12 * 2.49
            active: true
          },
          {
            id: "plan3",
            name: "EWA Box Water - Large (Monthly)",
            productId: "p3",
            frequency: "monthly",
            minQty: 24,
            price: 71.76, // 24 * 2.99
            active: true
          },
          {
            id: "plan4",
            name: "EWA Box Water - Small (Monthly)",
            productId: "p1",
            frequency: "monthly",
            minQty: 20,
            price: 35.82, // 20 * 1.99 * 0.9 (descuento)
            active: false
          }
        ];
        
        setProducts(mockProducts);
        setPlans(mockPlans);
      } catch (err) {
        setError('Error al cargar los planes. Por favor, intenta nuevamente.');
        console.error('Error fetching plans:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getProductById = (productId: string): ExtendedProduct | undefined => {
    return products.find(product => product.id === productId);
  };

  const getFrequencyLabel = (frequency: string): string => {
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

  const handleAddPlan = () => {
    setFormData({
      name: '',
      productId: products.length > 0 ? products[0].id : '',
      frequency: 'weekly',
      minQty: 6,
      price: 0
    });
    setShowAddModal(true);
  };

  const handleEditPlan = (plan: ExtendedPlan) => {
    setSelectedPlan(plan);
    setFormData({
      name: plan.name,
      productId: plan.productId,
      frequency: plan.frequency,
      minQty: plan.minQty,
      price: plan.price
    });
    setShowEditModal(true);
  };

  const handleToggleActive = (planId: string, currentActive: boolean) => {
    // En un entorno real, esto sería una llamada a la API
    setPlans(prevPlans => 
      prevPlans.map(plan => 
        plan.id === planId ? { ...plan, active: !currentActive } : plan
      )
    );
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'minQty' || name === 'price') {
      setFormData({
        ...formData,
        [name]: parseFloat(value) || 0
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
    
    // Actualizar automáticamente el precio basado en el producto y cantidad
    if (name === 'productId' || name === 'minQty') {
      const productId = name === 'productId' ? value : formData.productId;
      const minQty = name === 'minQty' ? parseFloat(value) || 0 : formData.minQty;
      
      const product = getProductById(productId);
      if (product) {
        let price = product.price * minQty;
        
        // Aplicar descuento para planes mensuales (10%)
        if (formData.frequency === 'monthly') {
          price = price * 0.9;
        }
        
        setFormData(prev => ({
          ...prev,
          price: parseFloat(price.toFixed(2))
        }));
      }
    }
    
    // Actualizar automáticamente el nombre basado en el producto y frecuencia
    if (name === 'productId' || name === 'frequency') {
      const productId = name === 'productId' ? value : formData.productId;
      const frequency = name === 'frequency' ? value : formData.frequency;
      
      const product = getProductById(productId);
      if (product) {
        const frequencyLabel = getFrequencyLabel(frequency);
        const planName = `${product.name} (${frequencyLabel})`;
        
        setFormData(prev => ({
          ...prev,
          name: planName
        }));
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // En un entorno real, esto sería una llamada a la API
    if (showAddModal) {
      // Agregar nuevo plan
      const newPlan: ExtendedPlan = {
        id: `plan${plans.length + 1}`,
        name: formData.name,
        productId: formData.productId,
        frequency: formData.frequency as 'weekly' | 'biweekly' | 'monthly',
        minQty: formData.minQty,
        price: formData.price,
        active: true
      };
      
      setPlans(prevPlans => [...prevPlans, newPlan]);
      setShowAddModal(false);
    } else if (showEditModal && selectedPlan) {
      // Actualizar plan existente
      setPlans(prevPlans => 
        prevPlans.map(plan => 
          plan.id === selectedPlan.id ? {
            ...plan,
            name: formData.name,
            productId: formData.productId,
            frequency: formData.frequency as 'weekly' | 'biweekly' | 'monthly',
            minQty: formData.minQty,
            price: formData.price
          } : plan
        )
      );
      setShowEditModal(false);
    }
    
    // Limpiar el formulario
    setFormData({
      name: '',
      productId: '',
      frequency: 'weekly',
      minQty: 6,
      price: 0
    });
    setSelectedPlan(null);
  };

  return (
    <Layout title="Planes y Precios - EWA Box Water Admin">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">Planes y Precios</h1>
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
              onClick={handleAddPlan}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-ewa-blue hover:bg-ewa-dark-blue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ewa-blue"
            >
              <svg className="mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Crear Nuevo Plan
            </button>
          </div>

          {/* Plans Table */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-ewa-blue"></div>
            </div>
          ) : (
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Plan
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Producto
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Frecuencia
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Cantidad Mínima
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Precio
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {plans.map((plan) => {
                    const product = getProductById(plan.productId);
                    return (
                      <tr key={plan.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {plan.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {product?.name || 'Producto no encontrado'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {getFrequencyLabel(plan.frequency)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {plan.minQty} unidades
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          ${plan.price.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            plan.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {plan.active ? 'Activo' : 'Inactivo'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleEditPlan(plan)}
                            className="text-ewa-blue hover:text-ewa-dark-blue mr-3"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleToggleActive(plan.id, plan.active)}
                            className={plan.active ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'}
                          >
                            {plan.active ? 'Desactivar' : 'Activar'}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Add Plan Modal */}
      {showAddModal && (
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
                        Crear Nuevo Plan
                      </h3>
                      
                      <div className="mb-4">
                        <label htmlFor="productId" className="block text-sm font-medium text-gray-700">Producto</label>
                        <select
                          id="productId"
                          name="productId"
                          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-ewa-blue focus:border-ewa-blue sm:text-sm rounded-md"
                          value={formData.productId}
                          onChange={handleInputChange}
                          required
                        >
                          {products.map(product => (
                            <option key={product.id} value={product.id}>
                              {product.name} (${product.price.toFixed(2)})
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      <div className="mb-4">
                        <label htmlFor="frequency" className="block text-sm font-medium text-gray-700">Frecuencia</label>
                        <select
                          id="frequency"
                          name="frequency"
                          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-ewa-blue focus:border-ewa-blue sm:text-sm rounded-md"
                          value={formData.frequency}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="weekly">Semanal</option>
                          <option value="biweekly">Quincenal</option>
                          <option value="monthly">Mensual</option>
                        </select>
                      </div>
                      
                      <div className="mb-4">
                        <label htmlFor="minQty" className="block text-sm font-medium text-gray-700">Cantidad Mínima</label>
                        <input
                          type="number"
                          id="minQty"
                          name="minQty"
                          min="1"
                          className="mt-1 focus:ring-ewa-blue focus:border-ewa-blue block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          value={formData.minQty}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      
                      <div className="mb-4">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nombre del Plan</label>
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
                        <label htmlFor="price" className="block text-sm font-medium text-gray-700">Precio Total</label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="text-gray-500 sm:text-sm">$</span>
                          </div>
                          <input
                            type="number"
                            id="price"
                            name="price"
                            step="0.01"
                            min="0"
                            className="focus:ring-ewa-blue focus:border-ewa-blue block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                            value={formData.price}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-ewa-blue text-base font-medium text-white hover:bg-ewa-dark-blue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ewa-blue sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Guardar
                  </button>
                  <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ewa-blue sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={() => setShowAddModal(false)}
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Plan Modal */}
      {showEditModal && selectedPlan && (
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
                        Editar Plan
                      </h3>
                      
                      <div className="mb-4">
                        <label htmlFor="productId" className="block text-sm font-medium text-gray-700">Producto</label>
                        <select
                          id="productId"
                          name="productId"
                          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-ewa-blue focus:border-ewa-blue sm:text-sm rounded-md"
                          value={formData.productId}
                          onChange={handleInputChange}
                          required
                        >
                          {products.map(product => (
                            <option key={product.id} value={product.id}>
                              {product.name} (${product.price.toFixed(2)})
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      <div className="mb-4">
                        <label htmlFor="frequency" className="block text-sm font-medium text-gray-700">Frecuencia</label>
                        <select
                          id="frequency"
                          name="frequency"
                          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-ewa-blue focus:border-ewa-blue sm:text-sm rounded-md"
                          value={formData.frequency}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="weekly">Semanal</option>
                          <option value="biweekly">Quincenal</option>
                          <option value="monthly">Mensual</option>
                        </select>
                      </div>
                      
                      <div className="mb-4">
                        <label htmlFor="minQty" className="block text-sm font-medium text-gray-700">Cantidad Mínima</label>
                        <input
                          type="number"
                          id="minQty"
                          name="minQty"
                          min="1"
                          className="mt-1 focus:ring-ewa-blue focus:border-ewa-blue block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          value={formData.minQty}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      
                      <div className="mb-4">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nombre del Plan</label>
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
                        <label htmlFor="price" className="block text-sm font-medium text-gray-700">Precio Total</label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="text-gray-500 sm:text-sm">$</span>
                          </div>
                          <input
                            type="number"
                            id="price"
                            name="price"
                            step="0.01"
                            min="0"
                            className="focus:ring-ewa-blue focus:border-ewa-blue block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                            value={formData.price}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-ewa-blue text-base font-medium text-white hover:bg-ewa-dark-blue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ewa-blue sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Guardar Cambios
                  </button>
                  <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ewa-blue sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={() => setShowEditModal(false)}
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

export default PlansPage;
