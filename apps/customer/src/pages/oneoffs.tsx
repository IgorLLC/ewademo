import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { getOneOffOrders, getProducts } from '@ewa/api-client';
import { OneOffOrder, Product } from '@ewa/types';

const OneOffOrdersPage = () => {
  const [orders, setOrders] = useState<OneOffOrder[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('ewa_user') || '{}');
        const [ordersData, productsData] = await Promise.all([
          getOneOffOrders(user.id),
          getProducts()
        ]);
        
        setOrders(ordersData);
        setProducts(productsData);
      } catch (err) {
        setError('Failed to load orders. Please try again later.');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getProductById = (productId: string): Product | undefined => {
    return products.find(product => product.id === productId);
  };

  const getStatusBadgeClass = (status: string): string => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatOrderDate = (orderId: string): string => {
    // Mock function to generate a date based on the order ID
    // In a real app, this would come from the order data
    const orderNumber = parseInt(orderId.replace(/\D/g, ''), 10) || 0;
    const date = new Date();
    date.setDate(date.getDate() - orderNumber * 3); // Just for demo purposes
    return date.toLocaleDateString();
  };

  const formatDeliveryDate = (orderId: string, status: string): string => {
    // Mock function to generate a delivery date based on the order ID
    // In a real app, this would come from the order data
    if (status === 'delivered') {
      const orderNumber = parseInt(orderId.replace(/\D/g, ''), 10) || 0;
      const date = new Date();
      date.setDate(date.getDate() - orderNumber * 2); // Just for demo purposes
      return date.toLocaleDateString();
    } else {
      const date = new Date();
      date.setDate(date.getDate() + 2); // Estimated delivery in 2 days
      return date.toLocaleDateString();
    }
  };

  return (
    <Layout title="One-Off Orders - EWA Box Water">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold text-gray-900">One-Off Orders</h1>
            <a
              href="/"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-ewa-blue hover:bg-ewa-dark-blue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ewa-blue"
            >
              Place New Order
            </a>
          </div>
          
          {error && (
            <div className="mb-4 bg-red-50 border-l-4 border-red-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-ewa-blue"></div>
            </div>
          ) : orders.length === 0 ? (
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:p-6 text-center">
                <h3 className="text-lg leading-6 font-medium text-gray-900">No one-off orders</h3>
                <div className="mt-2 max-w-xl text-sm text-gray-500 mx-auto">
                  <p>You haven't placed any one-off orders yet. Visit our products page to place an order.</p>
                </div>
                <div className="mt-5">
                  <a
                    href="/"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-ewa-blue hover:bg-ewa-dark-blue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ewa-blue"
                  >
                    View Products
                  </a>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Order ID
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Product
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Order Date
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Delivery Date
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {orders.map(order => {
                      const product = getProductById(order.productId);
                      if (!product) return null;

                      return (
                        <tr key={order.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            #{order.id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {product.name} ({product.sizeOz} oz)
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatOrderDate(order.id)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDeliveryDate(order.id, order.status)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(order.status)}`}>
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {order.status === 'pending' ? (
                              <button
                                type="button"
                                className="text-ewa-blue hover:text-ewa-dark-blue font-medium"
                              >
                                Track Order
                              </button>
                            ) : (
                              <button
                                type="button"
                                className="text-ewa-blue hover:text-ewa-dark-blue font-medium"
                              >
                                Reorder
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default OneOffOrdersPage;
