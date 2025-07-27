import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { Button, Card, LoadingSpinner, ErrorMessage } from '@ewa/ui';
import { getPlans, getProducts } from '@ewa/api-client';
import { Plan, Product } from '@ewa/types';
import Link from 'next/link';

const Plans = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [plansData, productsData] = await Promise.all([
          getPlans(),
          getProducts()
        ]);
        setPlans(plansData);
        setProducts(productsData);
      } catch (err) {
        setError('Failed to load plans. Please try again later.');
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

  return (
    <Layout title="EWA Box Water - Subscription Plans">
      <section className="bg-ewa-light-blue py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-6">Subscription Plans</h1>
          <p className="text-xl max-w-2xl mx-auto">
            Choose the perfect water delivery plan for your needs. All plans include free delivery and our eco-friendly box water.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : error ? (
            <ErrorMessage message={error} className="max-w-md mx-auto" />
          ) : (
            <>
              <h2 className="text-3xl font-bold text-center mb-12">Select Your Plan</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {plans.map((plan) => {
                  const product = getProductById(plan.productId);
                  if (!product) return null;

                  return (
                    <Card key={plan.id} className="h-full flex flex-col">
                      <div className="text-center mb-6">
                        <h3 className="text-2xl font-bold mb-2">{product.name}</h3>
                        <div className="text-ewa-blue text-lg font-semibold mb-2">
                          {getFrequencyLabel(plan.frequency)}
                        </div>
                        <div className="text-3xl font-bold mb-1">
                          ${product.price.toFixed(2)}
                          <span className="text-base text-gray-600 font-normal"> / box</span>
                        </div>
                        <div className="text-gray-600 mb-4">
                          Minimum {plan.minQty} boxes per delivery
                        </div>
                      </div>

                      <ul className="space-y-3 mb-8">
                        <li className="flex items-center">
                          <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                          {product.sizeOz} oz premium box water
                        </li>
                        <li className="flex items-center">
                          <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                          Free delivery
                        </li>
                        <li className="flex items-center">
                          <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                          Eco-friendly packaging
                        </li>
                        <li className="flex items-center">
                          <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                          Cancel or pause anytime
                        </li>
                      </ul>

                      <div className="mt-auto">
                        <Link href="/customer/login">
                          <Button fullWidth>Subscribe</Button>
                        </Link>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">One-Off Orders</h2>
          <div className="max-w-2xl mx-auto text-center">
            <p className="text-lg mb-8">
              Need a one-time delivery without committing to a subscription? We've got you covered with our one-off order options.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {products.map((product) => (
                <div key={product.id} className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="font-bold mb-2">{product.name}</h3>
                  <p className="text-gray-600 mb-2">{product.sizeOz} oz</p>
                  <p className="font-bold mb-4">${product.price.toFixed(2)}</p>
                  <Link href="/customer/login">
                    <Button variant="outline" fullWidth>Buy Now</Button>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-ewa-blue text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Questions About Our Plans?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Our customer service team is ready to help you choose the right plan for your needs.
          </p>
          <Button variant="secondary" size="lg">Contact Us</Button>
        </div>
      </section>
    </Layout>
  );
};

export default Plans;
