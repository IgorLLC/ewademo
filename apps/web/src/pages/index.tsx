import React from 'react';
import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { Button, Card, LoadingSpinner } from '@ewa/ui';
import { getProducts } from '@ewa/api-client';
import { Product } from '@ewa/types';
import Head from 'next/head';

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
    <Layout title="EWA Box Water - Entrega de Agua Sustentable">
      <Head>
        <style jsx global>{`
          .shadow-text {
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
          }
        `}</style>
      </Head>
      {/* Hero Banner */}
      <section className="bg-ewa-light-blue py-20 relative overflow-hidden">
        {/* Fondo con efecto de ondas de agua */}
        <div className="absolute inset-0 opacity-10 z-0">
          <img 
            src="https://images.unsplash.com/photo-1559825481-12a05cc00344?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2001&q=80" 
            alt="Water background" 
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Agua en caja sustentable, directo a tu puerta
              </h1>
              <p className="text-xl text-gray-700 mb-8">
                Agua premium en caja con planes de suscripción que ayudan a reducir los residuos plásticos y te mantienen hidratado.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a href="/auth">
                  <Button size="lg">Comenzar ahora</Button>
                </a>
                <a href="#products">
                  <Button variant="outline" size="lg">Ver Productos</Button>
                </a>
              </div>
            </div>
            <div className="md:w-1/2">
              <div className="relative bg-white p-4 rounded-lg shadow-xl overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1536939459926-301728717817?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80" 
                  alt="Boxed water product" 
                  className="w-full h-64 object-cover rounded-lg"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 rounded-lg">
                  <div className="text-center p-8">
                    <div className="bg-ewa-blue text-white font-bold text-4xl py-4 px-6 rounded-lg inline-block mb-4 shadow-lg">
                      EWA BOX WATER
                    </div>
                    <p className="text-white text-xl font-semibold shadow-text">Agua en caja, mejor para ti y para el planeta</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Values */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">¿Por qué elegir EWA Box Water?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
              <div className="relative w-full h-48 mb-6 overflow-hidden rounded-lg">
                <img 
                  src="https://images.unsplash.com/photo-1527699394565-6c8bd2f4a36e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1471&q=80" 
                  alt="Eco-friendly packaging" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold mb-2">Eco-Friendly</h3>
              <p className="text-gray-600">
                Nuestras cajas están hechas de materiales sostenibles y son 100% reciclables, reduciendo los residuos plásticos.
              </p>
            </div>
            <div className="text-center rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
              <div className="relative w-full h-48 mb-6 overflow-hidden rounded-lg">
                <img 
                  src="https://images.unsplash.com/photo-1621964275191-ccc01ef2134c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80" 
                  alt="Water delivery" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold mb-2">Entrega Conveniente</h3>
              <p className="text-gray-600">
                Entregas regulares según tu horario, para que nunca te quedes sin agua fresca y limpia.
              </p>
            </div>
            <div className="text-center rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
              <div className="relative w-full h-48 mb-6 overflow-hidden rounded-lg">
                <img 
                  src="https://images.unsplash.com/photo-1548839140-29a749e1cf4d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80" 
                  alt="Premium water quality" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold mb-2">Calidad Premium</h3>
              <p className="text-gray-600">
                Agua pura y filtrada que sabe muy bien y te mantiene hidratado durante todo el día.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Product Catalog */}
      <section id="products" className="py-16 bg-gray-50 relative">
        {/* Fondo con efecto de ondas de agua */}
        <div className="absolute inset-0 opacity-5 z-0">
          <img 
            src="https://images.unsplash.com/photo-1559825481-12a05cc00344?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2001&q=80" 
            alt="Water background pattern" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <h2 className="text-3xl font-bold text-center mb-12">Nuestros Productos</h2>
          
          {loading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {products.map((product) => (
                <Card key={product.id} className="h-full flex flex-col">
                  <div className="aspect-w-3 aspect-h-2 mb-4 overflow-hidden rounded-lg">
                    <img
                      src={product.id === 'p1' ? 
                        "https://images.unsplash.com/photo-1564419320461-6870880221ad?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1469&q=80" : 
                        product.id === 'p2' ? 
                        "https://images.unsplash.com/photo-1616118132534-381148898bb4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1528&q=80" : 
                        "https://images.unsplash.com/photo-1606473871883-9760b90f4585?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80"}
                      alt={product.name}
                      className="object-cover rounded-lg w-full h-full transform hover:scale-105 transition-transform duration-300"
                      width={300}
                      height={200}
                    />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                  <p className="text-gray-600 mb-2">{product.sizeOz} oz</p>
                  <p className="text-gray-800 font-bold mb-4">${product.price.toFixed(2)}</p>
                  <div className="mt-auto">
                    <a href="/auth">
                      <Button fullWidth>Suscribirse</Button>
                    </a>
                  </div>
                </Card>
              ))}
            </div>
          )}
          
          <div className="text-center mt-12">
            <a href="/auth">
              <Button size="lg">Crear cuenta</Button>
            </a>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-ewa-blue text-white relative overflow-hidden">
        {/* Imagen de fondo con efecto parallax */}
        <div className="absolute inset-0 opacity-20 z-0">
          <img 
            src="https://images.unsplash.com/photo-1520333789090-1afc82db536a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1471&q=80" 
            alt="Water splash background" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl font-bold mb-6">¿Listo para hacer el cambio?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Únete a miles de clientes que han cambiado a EWA Box Water para un servicio de entrega de agua más sostenible y conveniente.
          </p>
          <a href="/auth">
            <Button variant="secondary" size="lg">Comienza hoy</Button>
          </a>
        </div>
      </section>
    </Layout>
  );
};

export default Home;
