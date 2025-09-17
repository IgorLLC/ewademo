import React, { useState } from 'react';
import { Button } from '@ewa/ui';
import { useRouter } from 'next/router';

const ProductSection: React.FC = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('play');

  const tabs = [
    { id: 'play', label: 'Hidratación' },
    { id: 'work', label: 'Trabajo' },
    { id: 'sleep', label: 'Descanso' }
  ];

  const products = [
    {
      id: 1,
      name: "Agua Natural - Más Vendido",
      flavor: "Natural",
      badge: "más vendido",
      reviews: 780,
      description: "Diseñado para mantenerte hidratado todo el día",
      price: "Desde $30.60",
      image: "/images/landing/products/product-1.jpeg"
    },
    {
      id: 2,
      name: "Agua con Electrolitos",
      flavor: "Con Electrolitos",
      reviews: 780,
      description: "Diseñado para mantenerte hidratado todo el día",
      price: "Desde $30.60",
      image: "/images/landing/products/product-2.jpeg"
    },
    {
      id: 3,
      name: "Agua Alcalina",
      flavor: "Alcalina",
      reviews: 780,
      description: "Diseñado para mantenerte hidratado todo el día",
      price: "Desde $30.60",
      image: "/images/landing/products/product-1.jpeg" // Reutilizar imagen por ahora
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Section Title */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-8">
            Nuestros productos respaldados por la ciencia
          </h2>
          
          {/* Tabs */}
          <div className="flex justify-center space-x-8 mb-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`text-lg font-medium pb-2 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'text-blue-600 border-blue-600'
                    : 'text-gray-500 border-transparent hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Left Panel */}
          <div className="lg:w-1/3">
            <div className="bg-blue-50 p-8 rounded-lg h-full">
              <p className="text-gray-700 text-lg leading-relaxed mb-6">
                Mezcla patentada de electrolitos y más para rehidratar y reponer.
              </p>
              <Button 
                onClick={() => router.push('/plans')}
                className="bg-white text-blue-600 border-2 border-blue-600 hover:bg-blue-50 px-6 py-3 rounded-lg flex items-center gap-2 transition-all duration-300"
              >
                Ver Planes de Agua
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Button>
            </div>
          </div>

          {/* Product Cards */}
          <div className="lg:w-2/3">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <div key={product.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                  {/* Product Image */}
                  <div className="h-48 relative overflow-hidden">
                    <img 
                      src={product.image} 
                      alt={`${product.name} - ${product.flavor}`}
                      className="w-full h-full object-cover"
                    />
                    {product.badge && (
                      <div className="absolute top-2 left-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded">
                        {product.badge}
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="p-6">
                    <div className="text-sm text-gray-500 mb-2">6 Pack</div>
                    <h3 className="font-bold text-gray-800 mb-1">ewa box water</h3>
                    <h4 className="font-semibold text-gray-700 mb-3">{product.flavor}</h4>
                    
                    {/* Reviews */}
                    <div className="flex items-center mb-3">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 24 24">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                          </svg>
                        ))}
                      </div>
                      <span className="text-sm text-gray-600 ml-2">{product.reviews} reseñas</span>
                    </div>

                    <p className="text-sm text-gray-600 mb-4">{product.description}</p>
                    <div className="text-lg font-bold text-gray-800 mb-4">{product.price}</div>
                    
                    <a href="#" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                      aprender más
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductSection;
