import React from 'react';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Layout from '../components/Layout';
import { Button, Card, LoadingSpinner } from '@ewa/ui';
import { getProducts } from '@ewa/api-client';
import { Product } from '@ewa/types';

const Home = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <Layout title="EWA Box Water - Sustainable Water Delivery">
      {/* Hero Banner */}
      <section className="bg-ewa-light-blue py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Sustainable Water Delivery, Right to Your Door
              </h1>
              <p className="text-xl text-gray-700 mb-8">
                Premium boxed water with subscription plans that help reduce plastic waste and keep you hydrated.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/plans">
                  <Button size="lg">View Plans</Button>
                </Link>
                <Link href="#products">
                  <Button variant="outline" size="lg">Shop Products</Button>
                </Link>
              </div>
            </div>
            <div className="md:w-1/2">
              <div className="relative">
                <img
                  src="/images/hero-water-box.jpg"
                  alt="EWA Box Water"
                  className="rounded-lg shadow-xl"
                  width={600}
                  height={400}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Values */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose EWA Box Water?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-ewa-light-blue p-6 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-ewa-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Eco-Friendly</h3>
              <p className="text-gray-600">
                Our boxes are made from sustainable materials and are 100% recyclable, reducing plastic waste.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-ewa-light-blue p-6 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-ewa-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Convenient Delivery</h3>
              <p className="text-gray-600">
                Regular deliveries on your schedule, so you never run out of fresh, clean water.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-ewa-light-blue p-6 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-ewa-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Premium Quality</h3>
              <p className="text-gray-600">
                Pure, filtered water that tastes great and keeps you hydrated throughout the day.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Product Catalog */}
      <section id="products" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Products</h2>
          
          {loading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {products.map((product) => (
                <Card key={product.id} className="h-full flex flex-col">
                  <div className="aspect-w-3 aspect-h-2 mb-4">
                    <img
                      src={`/images/product-${product.id}.jpg`}
                      alt={product.name}
                      className="object-cover rounded-lg"
                      width={300}
                      height={200}
                    />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                  <p className="text-gray-600 mb-2">{product.sizeOz} oz</p>
                  <p className="text-gray-800 font-bold mb-4">${product.price.toFixed(2)}</p>
                  <div className="mt-auto">
                    <Link href="/plans">
                      <Button fullWidth>Subscribe</Button>
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          )}
          
          <div className="text-center mt-12">
            <Link href="/plans">
              <Button size="lg">View All Plans</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-ewa-blue text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Make the Switch?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of customers who have switched to EWA Box Water for a more sustainable and convenient water delivery service.
          </p>
          <Link href="/plans">
            <Button variant="secondary" size="lg">Get Started Today</Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default Home;
