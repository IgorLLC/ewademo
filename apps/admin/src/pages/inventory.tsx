import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { Button, Card } from '@ewa/ui';
import { Product } from '@ewa/types';

// Extendemos el tipo Product para incluir información de inventario
interface ExtendedProduct extends Product {
  stock: number;
  reorderLevel: number;
  lastRestocked: string;
  warehouse: string;
}

// Tipo para las rutas de entrega
interface DeliveryRoute {
  id: string;
  name: string;
  date: string;
  driver: string;
  status: 'pending' | 'in-progress' | 'completed';
  stops: number;
  products: {
    productId: string;
    quantity: number;
  }[];
}

const InventoryPage: React.FC = () => {
  const [products, setProducts] = useState<ExtendedProduct[]>([]);
  const [routes, setRoutes] = useState<DeliveryRoute[]>([]);
  const [activeTab, setActiveTab] = useState<'inventory' | 'routes'>('inventory');
  const [isMapVisible, setIsMapVisible] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState<DeliveryRoute | null>(null);

  useEffect(() => {
    // Simulamos la carga de datos de inventario
    const mockProducts: ExtendedProduct[] = [
      {
        id: 'prod_1',
        name: 'Small Box Water',
        description: '330ml box water, eco-friendly packaging',
        price: 1.99,
        image: '/images/small-box.jpg',
        stock: 1250,
        reorderLevel: 500,
        lastRestocked: '2023-10-15',
        warehouse: 'San Juan Main'
      },
      {
        id: 'prod_2',
        name: 'Medium Box Water',
        description: '500ml box water, eco-friendly packaging',
        price: 2.49,
        image: '/images/medium-box.jpg',
        stock: 850,
        reorderLevel: 400,
        lastRestocked: '2023-10-12',
        warehouse: 'San Juan Main'
      },
      {
        id: 'prod_3',
        name: 'Large Box Water',
        description: '1L box water, eco-friendly packaging',
        price: 3.99,
        image: '/images/large-box.jpg',
        stock: 620,
        reorderLevel: 300,
        lastRestocked: '2023-10-10',
        warehouse: 'Ponce Distribution'
      },
      {
        id: 'prod_4',
        name: 'Box Water 6-Pack',
        description: '6x330ml box water pack, eco-friendly packaging',
        price: 10.99,
        image: '/images/6pack-box.jpg',
        stock: 320,
        reorderLevel: 150,
        lastRestocked: '2023-10-08',
        warehouse: 'Mayagüez Storage'
      },
      {
        id: 'prod_5',
        name: 'Box Water 12-Pack',
        description: '12x330ml box water pack, eco-friendly packaging',
        price: 19.99,
        image: '/images/12pack-box.jpg',
        stock: 180,
        reorderLevel: 100,
        lastRestocked: '2023-10-05',
        warehouse: 'San Juan Main'
      }
    ];

    // Simulamos la carga de datos de rutas
    const mockRoutes: DeliveryRoute[] = [
      {
        id: 'route_1',
        name: 'San Juan Downtown Route',
        date: '2023-10-25',
        driver: 'Carlos Rodríguez',
        status: 'pending',
        stops: 12,
        products: [
          { productId: 'prod_1', quantity: 120 },
          { productId: 'prod_2', quantity: 80 }
        ]
      },
      {
        id: 'route_2',
        name: 'Río Piedras Delivery',
        date: '2023-10-24',
        driver: 'Ana Morales',
        status: 'in-progress',
        stops: 8,
        products: [
          { productId: 'prod_1', quantity: 60 },
          { productId: 'prod_3', quantity: 40 }
        ]
      },
      {
        id: 'route_3',
        name: 'Caguas Business District',
        date: '2023-10-23',
        driver: 'Miguel Torres',
        status: 'completed',
        stops: 15,
        products: [
          { productId: 'prod_2', quantity: 100 },
          { productId: 'prod_4', quantity: 25 }
        ]
      },
      {
        id: 'route_4',
        name: 'Mayagüez Restaurants',
        date: '2023-10-26',
        driver: 'Luisa Vega',
        status: 'pending',
        stops: 10,
        products: [
          { productId: 'prod_3', quantity: 80 },
          { productId: 'prod_5', quantity: 15 }
        ]
      },
      {
        id: 'route_5',
        name: 'Ponce Retail Stores',
        date: '2023-10-27',
        driver: 'Roberto Díaz',
        status: 'pending',
        stops: 7,
        products: [
          { productId: 'prod_1', quantity: 50 },
          { productId: 'prod_2', quantity: 40 },
          { productId: 'prod_4', quantity: 30 }
        ]
      }
    ];

    setProducts(mockProducts);
    setRoutes(mockRoutes);
  }, []);

  const getStockStatusClass = (product: ExtendedProduct) => {
    if (product.stock <= product.reorderLevel) {
      return 'text-red-600';
    } else if (product.stock <= product.reorderLevel * 1.5) {
      return 'text-yellow-600';
    } else {
      return 'text-green-600';
    }
  };

  const getRouteStatusClass = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-blue-100 text-blue-800';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleRestock = (productId: string) => {
    // Simulamos el reabastecimiento de productos
    setProducts(products.map(product => {
      if (product.id === productId) {
        return {
          ...product,
          stock: product.stock + 500,
          lastRestocked: new Date().toISOString().split('T')[0]
        };
      }
      return product;
    }));
  };

  const handleViewRoute = (route: DeliveryRoute) => {
    setSelectedRoute(route);
    setIsMapVisible(true);
  };

  const renderInventoryTab = () => (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Inventory Management</h2>
        <div>
          <Button
            onClick={() => alert('Export functionality would go here')}
            variant="secondary"
            className="mr-2"
          >
            Export Inventory
          </Button>
          <Button onClick={() => alert('Add product functionality would go here')}>
            Add New Product
          </Button>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Product
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stock
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Reorder Level
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Restocked
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Warehouse
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map((product) => (
              <tr key={product.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full"></div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{product.name}</div>
                      <div className="text-sm text-gray-500">{product.description}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className={`text-sm font-semibold ${getStockStatusClass(product)}`}>
                    {product.stock} units
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {product.reorderLevel} units
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {product.lastRestocked}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {product.warehouse}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleRestock(product.id)}
                    className="text-ewa-blue hover:text-ewa-blue-dark mr-4"
                  >
                    Restock
                  </button>
                  <button
                    onClick={() => alert(`Edit product ${product.id}`)}
                    className="text-gray-600 hover:text-gray-900"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderRoutesTab = () => (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Delivery Routes</h2>
        <div>
          <Button
            onClick={() => alert('Plan new route functionality would go here')}
          >
            Plan New Route
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {routes.map((route) => (
          <Card key={route.id} className="overflow-hidden">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                {route.name}
              </h3>
              <div className="mt-2 max-w-xl text-sm text-gray-500">
                <p>Date: {route.date}</p>
                <p>Driver: {route.driver}</p>
                <p>Stops: {route.stops}</p>
                <div className="mt-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRouteStatusClass(route.status)}`}>
                    {route.status.charAt(0).toUpperCase() + route.status.slice(1)}
                  </span>
                </div>
              </div>
              <div className="mt-5">
                <button
                  type="button"
                  onClick={() => handleViewRoute(route)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-ewa-blue hover:bg-ewa-blue-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ewa-blue"
                >
                  View Route
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {isMapVisible && selectedRoute && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-screen overflow-y-auto">
            <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Route Details: {selectedRoute.name}
              </h3>
              <button
                onClick={() => {
                  setIsMapVisible(false);
                  setSelectedRoute(null);
                }}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="border-t border-gray-200">
              <div className="px-4 py-5 sm:p-6">
                <div className="mb-4">
                  <p className="text-sm text-gray-500">Date: {selectedRoute.date}</p>
                  <p className="text-sm text-gray-500">Driver: {selectedRoute.driver}</p>
                  <p className="text-sm text-gray-500">Status: {selectedRoute.status}</p>
                  <p className="text-sm text-gray-500">Total Stops: {selectedRoute.stops}</p>
                </div>
                <div className="mb-4">
                  <h4 className="text-md font-medium text-gray-900 mb-2">Products for Delivery:</h4>
                  <ul className="list-disc pl-5">
                    {selectedRoute.products.map((item) => {
                      const product = products.find(p => p.id === item.productId);
                      return (
                        <li key={item.productId} className="text-sm text-gray-600">
                          {product ? product.name : 'Unknown Product'} - {item.quantity} units
                        </li>
                      );
                    })}
                  </ul>
                </div>
                <div className="bg-gray-100 h-64 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-gray-500 mb-2">Map View (Placeholder)</p>
                    <p className="text-xs text-gray-400">This would integrate with MapBox to show the delivery route</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <Layout title="Inventory Management - EWA Box Water">
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <div className="sm:hidden">
            <select
              id="tabs"
              name="tabs"
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-ewa-blue focus:border-ewa-blue sm:text-sm rounded-md"
              value={activeTab}
              onChange={(e) => setActiveTab(e.target.value as 'inventory' | 'routes')}
            >
              <option value="inventory">Inventory</option>
              <option value="routes">Delivery Routes</option>
            </select>
          </div>
          <div className="hidden sm:block">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                <button
                  onClick={() => setActiveTab('inventory')}
                  className={`${
                    activeTab === 'inventory'
                      ? 'border-ewa-blue text-ewa-blue'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  Inventory
                </button>
                <button
                  onClick={() => setActiveTab('routes')}
                  className={`${
                    activeTab === 'routes'
                      ? 'border-ewa-blue text-ewa-blue'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  Delivery Routes
                </button>
              </nav>
            </div>
          </div>
        </div>

        {activeTab === 'inventory' ? renderInventoryTab() : renderRoutesTab()}
      </div>
    </Layout>
  );
};

export default InventoryPage;
