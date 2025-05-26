import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { getSubscriptions, getPlans, getProducts, updateSubscription } from '@ewa/api-client';
import { Subscription, Plan, Product } from '@ewa/types';

const SubscriptionsPage = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('ewa_user') || '{}');
        const [subscriptionsData, plansData, productsData] = await Promise.all([
          getSubscriptions(user.id),
          getPlans(),
          getProducts()
        ]);
        
        setSubscriptions(subscriptionsData);
        setPlans(plansData);
        setProducts(productsData);
      } catch (err) {
        setError('Failed to load subscriptions. Please try again later.');
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

  const getPlanById = (planId: string): Plan | undefined => {
    return plans.find(plan => plan.id === planId);
  };

  const getFrequencyLabel = (frequency: string): string => {
    switch (frequency) {
      case 'weekly':
        return 'Weekly Delivery';
      case 'biweekly':
        return 'Every Two Weeks';
      case 'monthly':
        return 'Monthly Delivery';
      default:
        return frequency;
    }
  };

  const handleStatusChange = async (subscriptionId: string, newStatus: 'active' | 'paused') => {
    try {
      setLoading(true);
      await updateSubscription(subscriptionId, { status: newStatus });
      
      // Update local state
      setSubscriptions(prevSubscriptions => 
        prevSubscriptions.map(sub => 
          sub.id === subscriptionId ? { ...sub, status: newStatus } : sub
        )
      );
      
      setSuccessMessage(`Subscription successfully ${newStatus === 'active' ? 'activated' : 'paused'}.`);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (err) {
      setError(`Failed to update subscription. Please try again.`);
      console.error('Error updating subscription:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSkipDelivery = () => {
    setSuccessMessage('Your next delivery has been skipped.');
    
    // Clear success message after 3 seconds
    setTimeout(() => {
      setSuccessMessage(null);
    }, 3000);
  };

  return (
    <Layout title="My Subscriptions - EWA Box Water">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-2xl font-semibold text-gray-900 mb-6">My Subscriptions</h1>
          
          {successMessage && (
            <div className="mb-4 bg-green-50 border-l-4 border-green-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-green-700">{successMessage}</p>
                </div>
              </div>
            </div>
          )}

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
          ) : subscriptions.length === 0 ? (
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:p-6 text-center">
                <h3 className="text-lg leading-6 font-medium text-gray-900">No active subscriptions</h3>
                <div className="mt-2 max-w-xl text-sm text-gray-500 mx-auto">
                  <p>You don't have any active subscriptions yet. Visit our plans page to subscribe.</p>
                </div>
                <div className="mt-5">
                  <a
                    href="/"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-ewa-blue hover:bg-ewa-dark-blue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ewa-blue"
                  >
                    View Plans
                  </a>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white shadow overflow-hidden sm:rounded-lg divide-y divide-gray-200">
              {subscriptions.map(subscription => {
                const plan = getPlanById(subscription.planId);
                if (!plan) return null;
                
                const product = getProductById(plan.productId);
                if (!product) return null;

                return (
                  <div key={subscription.id} className="px-4 py-5 sm:p-6">
                    <div className="md:flex md:items-center md:justify-between">
                      <div className="md:flex-1">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                          {product.name} - {getFrequencyLabel(plan.frequency)}
                        </h3>
                        <div className="mt-2 max-w-xl text-sm text-gray-500">
                          <p>
                            {plan.minQty} boxes per delivery • ${product.price.toFixed(2)} per box •
                            Status: <span className={`font-medium ${subscription.status === 'active' ? 'text-green-600' : 'text-yellow-600'}`}>
                              {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
                            </span>
                          </p>
                        </div>
                        <div className="mt-3 text-sm">
                          <span className="font-medium text-ewa-blue">
                            Next delivery: {new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="mt-4 md:mt-0 md:ml-6 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                        {subscription.status === 'active' ? (
                          <>
                            <button
                              onClick={() => handleStatusChange(subscription.id, 'paused')}
                              type="button"
                              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ewa-blue"
                            >
                              Pause
                            </button>
                            <button
                              onClick={handleSkipDelivery}
                              type="button"
                              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ewa-blue"
                            >
                              Skip Next
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => handleStatusChange(subscription.id, 'active')}
                            type="button"
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-ewa-blue hover:bg-ewa-dark-blue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ewa-blue"
                          >
                            Reactivate
                          </button>
                        )}
                        <button
                          type="button"
                          className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ewa-blue"
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default SubscriptionsPage;
