import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { Metrics } from '@ewa/types';
import axios from 'axios';

const MetricsPage = () => {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState('month');

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        // In a real app, this would be a call to an API endpoint
        const response = await axios.get('/api/metrics');
        setMetrics(response.data);
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
  const monthlyRevenueData = [
    { month: 'Jan', revenue: 12500 },
    { month: 'Feb', revenue: 14000 },
    { month: 'Mar', revenue: 15200 },
    { month: 'Apr', revenue: 16800 },
    { month: 'May', revenue: 18000 },
    { month: 'Jun', revenue: 19500 },
    { month: 'Jul', revenue: 21000 },
    { month: 'Aug', revenue: 22500 },
    { month: 'Sep', revenue: 24000 },
    { month: 'Oct', revenue: 25500 },
    { month: 'Nov', revenue: 27000 },
    { month: 'Dec', revenue: 28500 }
  ];

  const customerGrowthData = [
    { month: 'Jan', customers: 120 },
    { month: 'Feb', customers: 145 },
    { month: 'Mar', customers: 170 },
    { month: 'Apr', customers: 210 },
    { month: 'May', customers: 250 },
    { month: 'Jun', customers: 290 },
    { month: 'Jul', customers: 340 },
    { month: 'Aug', customers: 390 },
    { month: 'Sep', customers: 430 },
    { month: 'Oct', customers: 480 },
    { month: 'Nov', customers: 520 },
    { month: 'Dec', customers: 580 }
  ];

  const productDistributionData = [
    { product: 'Small Box', percentage: 25 },
    { product: 'Medium Box', percentage: 45 },
    { product: 'Large Box', percentage: 20 },
    { product: 'One-off Orders', percentage: 10 }
  ];

  const frequencyDistributionData = [
    { frequency: 'Weekly', percentage: 35 },
    { frequency: 'Bi-weekly', percentage: 40 },
    { frequency: 'Monthly', percentage: 25 }
  ];

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Get max value for scaling charts
  const maxRevenue = Math.max(...monthlyRevenueData.map(item => item.revenue));
  const maxCustomers = Math.max(...customerGrowthData.map(item => item.customers));

  return (
    <Layout title="Metrics - EWA Box Water Admin">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">Business Metrics</h1>
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

          {/* Time Range Filter */}
          <div className="bg-white shadow rounded-lg p-4 mb-6">
            <div className="sm:flex sm:items-center sm:justify-between">
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">Performance Metrics</h3>
                <p className="mt-1 text-sm text-gray-500">
                  View key performance indicators for your business
                </p>
              </div>
              <div className="mt-3 sm:mt-0 sm:ml-4">
                <select
                  id="timeRange"
                  name="timeRange"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-ewa-blue focus:border-ewa-blue sm:text-sm rounded-md"
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                >
                  <option value="week">Last Week</option>
                  <option value="month">Last Month</option>
                  <option value="quarter">Last Quarter</option>
                  <option value="year">Last Year</option>
                  <option value="all">All Time</option>
                </select>
              </div>
            </div>
          </div>

          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
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
                          <div className="text-lg font-medium text-gray-900">{formatCurrency(metrics?.mrr || 0)}</div>
                        )}
                      </dd>
                    </dl>
                  </div>
                </div>
                <div className="mt-4">
                  <div className={`text-sm font-medium ${metrics?.mrrGrowth && metrics.mrrGrowth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {metrics?.mrrGrowth && metrics.mrrGrowth > 0 ? '↑' : '↓'} {Math.abs((metrics?.mrrGrowth || 0) * 100).toFixed(1)}% from last {timeRange}
                  </div>
                </div>
              </div>
            </div>

            {/* Customer Count Card */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 bg-ewa-light-blue rounded-md p-3">
                    <svg className="h-6 w-6 text-ewa-blue" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Total Customers</dt>
                      <dd>
                        {loading ? (
                          <div className="animate-pulse h-8 w-24 bg-gray-200 rounded"></div>
                        ) : (
                          <div className="text-lg font-medium text-gray-900">{metrics?.totalCustomers || 0}</div>
                        )}
                      </dd>
                    </dl>
                  </div>
                </div>
                <div className="mt-4">
                  <div className={`text-sm font-medium ${metrics?.customerGrowth && metrics.customerGrowth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {metrics?.customerGrowth && metrics.customerGrowth > 0 ? '↑' : '↓'} {Math.abs((metrics?.customerGrowth || 0) * 100).toFixed(1)}% from last {timeRange}
                  </div>
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
                          <div className="text-lg font-medium text-gray-900">{((metrics?.churn || 0) * 100).toFixed(2)}%</div>
                        )}
                      </dd>
                    </dl>
                  </div>
                </div>
                <div className="mt-4">
                  <div className={`text-sm font-medium ${metrics?.churnChange && metrics.churnChange < 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {metrics?.churnChange && metrics.churnChange < 0 ? '↓' : '↑'} {Math.abs((metrics?.churnChange || 0) * 100).toFixed(1)}% from last {timeRange}
                  </div>
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
                          <div className="text-lg font-medium text-gray-900">{((metrics?.fulfillmentRate || 0) * 100).toFixed(2)}%</div>
                        )}
                      </dd>
                    </dl>
                  </div>
                </div>
                <div className="mt-4">
                  <div className={`text-sm font-medium ${metrics?.fulfillmentChange && metrics.fulfillmentChange > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {metrics?.fulfillmentChange && metrics.fulfillmentChange > 0 ? '↑' : '↓'} {Math.abs((metrics?.fulfillmentChange || 0) * 100).toFixed(1)}% from last {timeRange}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Revenue Chart */}
          <div className="mt-8 bg-white shadow rounded-lg p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Monthly Revenue</h3>
            <div className="h-80">
              <div className="h-full flex items-end">
                {monthlyRevenueData.map((item, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div 
                      className="w-12 bg-ewa-blue rounded-t" 
                      style={{ height: `${(item.revenue / maxRevenue) * 100}%` }}
                    ></div>
                    <div className="mt-2 text-xs text-gray-500">{item.month}</div>
                    <div className="text-xs text-gray-700 mt-1">{formatCurrency(item.revenue)}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Customer Growth Chart */}
          <div className="mt-8 bg-white shadow rounded-lg p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Customer Growth</h3>
            <div className="h-80">
              <div className="h-full flex items-end">
                {customerGrowthData.map((item, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div 
                      className="w-12 bg-green-500 rounded-t" 
                      style={{ height: `${(item.customers / maxCustomers) * 100}%` }}
                    ></div>
                    <div className="mt-2 text-xs text-gray-500">{item.month}</div>
                    <div className="text-xs text-gray-700 mt-1">{item.customers}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Distribution Charts */}
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
            {/* Product Distribution */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Product Distribution</h3>
              <div className="h-64">
                <div className="h-full flex items-center justify-center">
                  <div className="w-48 h-48 rounded-full border-8 border-gray-100 relative">
                    {productDistributionData.map((item, index) => {
                      // Calculate the segment position
                      let startAngle = 0;
                      for (let i = 0; i < index; i++) {
                        startAngle += (productDistributionData[i].percentage / 100) * 360;
                      }
                      const endAngle = startAngle + (item.percentage / 100) * 360;
                      
                      // Generate a unique color for each segment
                      const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'];
                      
                      return (
                        <div 
                          key={index}
                          className="absolute inset-0"
                          style={{
                            background: `conic-gradient(transparent ${startAngle}deg, ${colors[index % colors.length]} ${startAngle}deg ${endAngle}deg, transparent ${endAngle}deg)`,
                            borderRadius: '50%'
                          }}
                        ></div>
                      );
                    })}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-32 h-32 bg-white rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2">
                {productDistributionData.map((item, index) => {
                  const colors = ['bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-red-500'];
                  return (
                    <div key={index} className="flex items-center">
                      <span className={`w-3 h-3 ${colors[index % colors.length]} rounded-full mr-2`}></span>
                      <span className="text-sm text-gray-600">{item.product} ({item.percentage}%)</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Frequency Distribution */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Subscription Frequency</h3>
              <div className="h-64">
                <div className="h-full flex items-center justify-center">
                  <div className="w-48 h-48 rounded-full border-8 border-gray-100 relative">
                    {frequencyDistributionData.map((item, index) => {
                      // Calculate the segment position
                      let startAngle = 0;
                      for (let i = 0; i < index; i++) {
                        startAngle += (frequencyDistributionData[i].percentage / 100) * 360;
                      }
                      const endAngle = startAngle + (item.percentage / 100) * 360;
                      
                      // Generate a unique color for each segment
                      const colors = ['#8B5CF6', '#EC4899', '#06B6D4'];
                      
                      return (
                        <div 
                          key={index}
                          className="absolute inset-0"
                          style={{
                            background: `conic-gradient(transparent ${startAngle}deg, ${colors[index % colors.length]} ${startAngle}deg ${endAngle}deg, transparent ${endAngle}deg)`,
                            borderRadius: '50%'
                          }}
                        ></div>
                      );
                    })}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-32 h-32 bg-white rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2">
                {frequencyDistributionData.map((item, index) => {
                  const colors = ['bg-purple-500', 'bg-pink-500', 'bg-cyan-500'];
                  return (
                    <div key={index} className="flex items-center">
                      <span className={`w-3 h-3 ${colors[index % colors.length]} rounded-full mr-2`}></span>
                      <span className="text-sm text-gray-600">{item.frequency} ({item.percentage}%)</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Additional Metrics */}
          <div className="mt-8 bg-white shadow rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Additional Metrics</h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">Detailed performance indicators</p>
            </div>
            <div className="border-t border-gray-200">
              <dl>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Average Revenue Per User (ARPU)</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{formatCurrency(metrics?.arpu || 0)}</dd>
                </div>
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Customer Acquisition Cost (CAC)</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{formatCurrency(metrics?.cac || 0)}</dd>
                </div>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Customer Lifetime Value (LTV)</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{formatCurrency(metrics?.ltv || 0)}</dd>
                </div>
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">LTV:CAC Ratio</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{((metrics?.ltv || 0) / (metrics?.cac || 1)).toFixed(2)}</dd>
                </div>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Average Subscription Duration</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{metrics?.avgSubscriptionMonths || 0} months</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default MetricsPage;
