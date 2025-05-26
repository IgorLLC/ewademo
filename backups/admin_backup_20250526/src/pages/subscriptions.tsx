import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { Subscription, Plan, User } from '@ewa/types';
import axios from 'axios';

// Definimos tipos extendidos para nuestros datos mock
type ExtendedPlan = Plan & {
  name: string;
  price: number;
};

type ExtendedUser = User & {
  address: string;
  phone: string;
  signupDate: string;
};

type ExtendedSubscription = Subscription & {
  startDate: string;
  nextDeliveryDate: string | null;
  frequency: 'weekly' | 'biweekly' | 'monthly';
  quantity: number;
  pauseDate?: string;
};

const SubscriptionsPage = () => {
  // Actualizamos el tipo del estado para usar nuestros tipos extendidos
  const [subscriptions, setSubscriptions] = useState<Array<ExtendedSubscription & { plan?: ExtendedPlan, user?: ExtendedUser }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    // Usamos datos mock directamente en lugar de hacer llamadas a la API
    try {
      // Datos mock de planes
      const mockPlans: ExtendedPlan[] = [
        {
          id: "plan1",
          name: "EWA Box Water - Small (Weekly)",
          productId: "p1",
          frequency: "weekly",
          minQty: 6,
          price: 11.94 // 6 * 1.99
        },
        {
          id: "plan2",
          name: "EWA Box Water - Medium (Biweekly)",
          productId: "p2",
          frequency: "biweekly",
          minQty: 12,
          price: 29.88 // 12 * 2.49
        },
        {
          id: "plan3",
          name: "EWA Box Water - Large (Monthly)",
          productId: "p3",
          frequency: "monthly",
          minQty: 24,
          price: 71.76 // 24 * 2.99
        }
      ];
      
      // Datos mock de usuarios
      const mockUsers: ExtendedUser[] = [
        {
          id: "u1",
          name: "John Doe",
          email: "john@example.com",
          role: "customer",
          address: "123 Main St, Boston, MA",
          phone: "555-123-4567",
          signupDate: "2025-01-15"
        },
        {
          id: "u2",
          name: "Jane Smith",
          email: "jane@example.com",
          role: "customer",
          address: "456 Elm St, Boston, MA",
          phone: "555-987-6543",
          signupDate: "2025-02-20"
        },
        {
          id: "u4",
          name: "Michael Johnson",
          email: "michael@example.com",
          role: "customer",
          address: "101 Pine St, Cambridge, MA",
          phone: "555-222-3333",
          signupDate: "2025-03-10"
        },
        {
          id: "u5",
          name: "Sarah Williams",
          email: "sarah@example.com",
          role: "customer",
          address: "202 Maple Ave, Somerville, MA",
          phone: "555-444-5555",
          signupDate: "2025-04-05"
        }
      ];
      
      // Datos mock de suscripciones
      const mockSubscriptions: ExtendedSubscription[] = [
        {
          id: "sub1",
          planId: "plan1",
          userId: "u1",
          status: "active",
          startDate: "2025-01-20",
          nextDeliveryDate: "2025-05-28",
          frequency: "weekly",
          quantity: 6
        },
        {
          id: "sub2",
          planId: "plan2",
          userId: "u2",
          status: "paused",
          startDate: "2025-02-25",
          nextDeliveryDate: null,
          pauseDate: "2025-05-10",
          frequency: "biweekly",
          quantity: 12
        },
        {
          id: "sub3",
          planId: "plan3",
          userId: "u4",
          status: "active",
          startDate: "2025-03-15",
          nextDeliveryDate: "2025-06-15",
          frequency: "monthly",
          quantity: 24
        },
        {
          id: "sub4",
          planId: "plan1",
          userId: "u5",
          status: "active",
          startDate: "2025-04-10",
          nextDeliveryDate: "2025-05-29",
          frequency: "weekly",
          quantity: 8
        }
      ];
      
      // Unir los datos de suscripciones con planes y usuarios
      const enrichedSubscriptions = mockSubscriptions.map((sub) => {
        const plan = mockPlans.find((p) => p.id === sub.planId);
        const user = mockUsers.find((u) => u.id === sub.userId);
        return { ...sub, plan, user } as (ExtendedSubscription & { plan?: ExtendedPlan, user?: ExtendedUser });
      });
      
      setSubscriptions(enrichedSubscriptions as any);
    } catch (err) {
      setError('Failed to load subscriptions. Please try again later.');
      console.error('Error loading subscriptions:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Filter subscriptions based on search term and status filter
  const filteredSubscriptions = subscriptions.filter(sub => {
    const matchesSearch = 
      (sub.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) || false) || 
      (sub.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
      (sub.plan?.name?.toLowerCase().includes(searchTerm.toLowerCase()) || false);
    
    const matchesStatus = statusFilter === 'all' || sub.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Format date to readable string
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <Layout title="Subscriptions - EWA Box Water Admin">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">Subscriptions</h1>
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

          {/* Search and Filter */}
          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <div className="md:flex md:items-center md:justify-between">
              <div className="md:flex-1">
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Search subscriptions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="focus:ring-ewa-blue focus:border-ewa-blue block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>
              <div className="mt-4 md:mt-0 md:ml-4">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-ewa-blue focus:border-ewa-blue sm:text-sm rounded-md"
                >
                  <option value="all">All Statuses</option>
                  <option value="active">Active</option>
                  <option value="paused">Paused</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <div className="mt-4 md:mt-0 md:ml-4">
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-ewa-blue hover:bg-ewa-dark-blue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ewa-blue"
                >
                  Add Subscription
                </button>
              </div>
            </div>
          </div>

          {/* Subscriptions Table */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            {loading ? (
              <div className="px-4 py-5 sm:p-6 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-ewa-blue mx-auto"></div>
                <p className="mt-2 text-sm text-gray-500">Loading subscriptions...</p>
              </div>
            ) : filteredSubscriptions.length === 0 ? (
              <div className="px-4 py-5 sm:p-6 text-center">
                <p className="text-gray-500">No subscriptions found matching your criteria.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Customer
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Plan
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Start Date
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Next Delivery
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                      <th scope="col" className="relative px-6 py-3">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredSubscriptions.map((subscription) => (
                      <tr key={subscription.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {subscription.user?.name || 'Unknown User'}
                              </div>
                              <div className="text-sm text-gray-500">
                                {subscription.user?.email || 'No email'}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{subscription.plan?.name || 'Unknown Plan'}</div>
                          <div className="text-sm text-gray-500">{subscription.frequency}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            subscription.status === 'active' ? 'bg-green-100 text-green-800' : 
                            subscription.status === 'paused' ? 'bg-yellow-100 text-yellow-800' : 
                            'bg-red-100 text-red-800'
                          }`}>
                            {subscription.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(subscription.startDate)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {subscription.nextDeliveryDate ? formatDate(subscription.nextDeliveryDate) : 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          ${subscription.plan?.price.toFixed(2) || '0.00'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <button className="text-ewa-blue hover:text-ewa-dark-blue">
                              View
                            </button>
                            <button className="text-ewa-blue hover:text-ewa-dark-blue">
                              Edit
                            </button>
                            <button className="text-red-600 hover:text-red-900">
                              Cancel
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Pagination */}
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 mt-4 rounded-lg shadow">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Previous
              </button>
              <button
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredSubscriptions.length}</span> of{' '}
                  <span className="font-medium">{filteredSubscriptions.length}</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    <span className="sr-only">Previous</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <button
                    aria-current="page"
                    className="z-10 bg-ewa-light-blue border-ewa-blue text-ewa-blue relative inline-flex items-center px-4 py-2 border text-sm font-medium"
                  >
                    1
                  </button>
                  <button
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    <span className="sr-only">Next</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SubscriptionsPage;
