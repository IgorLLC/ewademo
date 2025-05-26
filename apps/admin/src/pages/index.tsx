import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { getMRR, getChurn, getFulfillmentRate } from '@ewa/api-client';

const Dashboard = () => {
  const [metrics, setMetrics] = useState({
    mrr: 0,
    churn: 0,
    fulfillmentRate: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const [mrr, churn, fulfillmentRate] = await Promise.all([
          getMRR(),
          getChurn(),
          getFulfillmentRate()
        ]);
        
        setMetrics({
          mrr,
          churn,
          fulfillmentRate
        });
      } catch (err) {
        setError('Failed to load metrics. Please try again later.');
        console.error('Error fetching metrics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  // Mock data for charts
  const revenueData = [
    { month: 'Jan', revenue: 1800 },
    { month: 'Feb', revenue: 2000 },
    { month: 'Mar', revenue: 2200 },
    { month: 'Apr', revenue: 2400 },
    { month: 'May', revenue: 2500 },
    { month: 'Jun', revenue: 2700 }
  ];

  const subscriptionData = [
    { month: 'Jan', active: 120, paused: 15 },
    { month: 'Feb', active: 140, paused: 18 },
    { month: 'Mar', active: 160, paused: 20 },
    { month: 'Apr', active: 180, paused: 22 },
    { month: 'May', active: 200, paused: 25 },
    { month: 'Jun', active: 220, paused: 28 }
  ];

  return (
    <Layout title="Dashboard - EWA Box Water Admin">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="py-4">
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

          {/* Key Metrics */}
          <div className="mt-4">
            <h2 className="text-lg leading-6 font-medium text-gray-900 mb-4">Key Metrics</h2>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {/* MRR Card */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-ewa-light-blue rounded-md p-3">
                      <svg className="h-6 w-6 text-ewa-blue" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Monthly Recurring Revenue</dt>
                        <dd>
                          {loading ? (
                            <div className="animate-pulse h-8 w-24 bg-gray-200 rounded"></div>
                          ) : (
                            <div className="text-lg font-medium text-gray-900">${metrics.mrr.toLocaleString()}</div>
                          )}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-4 sm:px-6">
                  <div className="text-sm">
                    <a href="/metrics" className="font-medium text-ewa-blue hover:text-ewa-dark-blue">
                      View detailed report →
                    </a>
                  </div>
                </div>
              </div>

              {/* Churn Rate Card */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-ewa-light-blue rounded-md p-3">
                      <svg className="h-6 w-6 text-ewa-blue" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                      </svg>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Churn Rate</dt>
                        <dd>
                          {loading ? (
                            <div className="animate-pulse h-8 w-24 bg-gray-200 rounded"></div>
                          ) : (
                            <div className="text-lg font-medium text-gray-900">{(metrics.churn * 100).toFixed(2)}%</div>
                          )}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-4 sm:px-6">
                  <div className="text-sm">
                    <a href="/metrics" className="font-medium text-ewa-blue hover:text-ewa-dark-blue">
                      View detailed report →
                    </a>
                  </div>
                </div>
              </div>

              {/* Fulfillment Rate Card */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-ewa-light-blue rounded-md p-3">
                      <svg className="h-6 w-6 text-ewa-blue" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Fulfillment Rate</dt>
                        <dd>
                          {loading ? (
                            <div className="animate-pulse h-8 w-24 bg-gray-200 rounded"></div>
                          ) : (
                            <div className="text-lg font-medium text-gray-900">{(metrics.fulfillmentRate * 100).toFixed(2)}%</div>
                          )}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-4 sm:px-6">
                  <div className="text-sm">
                    <a href="/metrics" className="font-medium text-ewa-blue hover:text-ewa-dark-blue">
                      View detailed report →
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Revenue Chart */}
          <div className="mt-8">
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Monthly Revenue</h3>
              <div className="h-64">
                <div className="h-full flex items-end">
                  {revenueData.map((item, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center">
                      <div 
                        className="w-8 bg-ewa-blue rounded-t" 
                        style={{ height: `${(item.revenue / 3000) * 100}%` }}
                      ></div>
                      <div className="mt-2 text-xs text-gray-500">{item.month}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Subscription Stats */}
          <div className="mt-8">
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Subscription Stats</h3>
              <div className="h-64">
                <div className="h-full flex items-end">
                  {subscriptionData.map((item, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center">
                      <div className="w-12 flex flex-col">
                        <div 
                          className="w-full bg-yellow-400 rounded-t" 
                          style={{ height: `${(item.paused / 250) * 100}%` }}
                        ></div>
                        <div 
                          className="w-full bg-green-500" 
                          style={{ height: `${(item.active / 250) * 100}%` }}
                        ></div>
                      </div>
                      <div className="mt-2 text-xs text-gray-500">{item.month}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-4 flex justify-center">
                <div className="flex items-center mr-6">
                  <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                  <span className="text-sm text-gray-600">Active</span>
                </div>
                <div className="flex items-center">
                  <span className="w-3 h-3 bg-yellow-400 rounded-full mr-2"></span>
                  <span className="text-sm text-gray-600">Paused</span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="mt-8">
            <div className="bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Activity</h3>
              </div>
              <div className="border-t border-gray-200">
                <ul className="divide-y divide-gray-200">
                  <li className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-ewa-blue truncate">New subscription</p>
                      <div className="ml-2 flex-shrink-0 flex">
                        <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Just now
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <p className="text-sm text-gray-500">John Doe subscribed to EWA Box Water - Medium (Weekly)</p>
                      </div>
                    </div>
                  </li>
                  <li className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-ewa-blue truncate">Subscription paused</p>
                      <div className="ml-2 flex-shrink-0 flex">
                        <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                          2 hours ago
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <p className="text-sm text-gray-500">Jane Smith paused her subscription</p>
                      </div>
                    </div>
                  </li>
                  <li className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-ewa-blue truncate">One-off order</p>
                      <div className="ml-2 flex-shrink-0 flex">
                        <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          5 hours ago
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <p className="text-sm text-gray-500">New one-off order from Michael Johnson</p>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
