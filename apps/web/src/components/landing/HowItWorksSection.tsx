import React, { useState } from 'react';
import { Button } from '@ewa/ui';

const HowItWorksSection: React.FC = () => {
  const [activeProduct, setActiveProduct] = useState('morning');

  const products = [
    { id: 'morning', label: 'ewa box water' },
    { id: 'focus', label: 'hidratación premium' },
    { id: 'sleep', label: 'descanso profundo' }
  ];

  const steps = [
    {
      number: "1",
      text: "Toma 1 caja antes de tu primera actividad del día."
    },
    {
      number: "2", 
      text: "Disfruta tu día manteniéndote hidratado."
    },
    {
      number: "3",
      text: "Despierta sintiéndote renovado y energizado."
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Left Content */}
          <div className="lg:w-1/2">
            <div className="text-sm text-gray-500 mb-4">cómo funcionan nuestros productos</div>
            
            {/* Product Tabs */}
            <div className="flex space-x-6 mb-8">
              {products.map((product) => (
                <button
                  key={product.id}
                  onClick={() => setActiveProduct(product.id)}
                  className={`text-2xl font-bold pb-2 border-b-2 transition-colors ${
                    activeProduct === product.id
                      ? 'text-gray-800 border-gray-800'
                      : 'text-gray-400 border-transparent hover:text-gray-600'
                  }`}
                >
                  {product.label}
                </button>
              ))}
            </div>

            {/* Steps */}
            <div className="space-y-6 mb-8">
              {steps.map((step, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                    {step.number}
                  </div>
                  <p className="text-lg text-gray-700 leading-relaxed">{step.text}</p>
                </div>
              ))}
            </div>

            <Button 
              className="bg-white text-blue-600 border-2 border-blue-600 hover:bg-blue-50 px-6 py-3 rounded-lg flex items-center gap-2 transition-all duration-300"
            >
              aprender más
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Button>
          </div>

          {/* Right Image */}
          <div className="lg:w-1/2">
            <div className="relative rounded-2xl overflow-hidden h-80">
              <img 
                src="/images/landing/hero/hero-background.jpeg" 
                alt="Proceso de hidratación con EWA Box Water"
                className="w-full h-full object-cover"
              />
              {/* Overlay for better text contrast */}
              <div className="absolute inset-0 bg-blue-900/20"></div>
              
              {/* Floating elements */}
              <div className="absolute top-8 right-8">
                <div className="w-16 h-20 bg-white/90 rounded-lg shadow-lg flex items-center justify-center">
                  <span className="text-blue-600 font-bold text-sm">EWA</span>
                </div>
              </div>
              
              <div className="absolute bottom-8 left-8">
                <div className="w-12 h-16 bg-white/90 rounded-lg shadow-lg flex items-center justify-center">
                  <span className="text-blue-600 font-bold text-xs">EWA</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
