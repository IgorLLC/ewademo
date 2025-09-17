import React from 'react';

const TestimonialSection: React.FC = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center justify-between">
          {/* Main Quote */}
          <div className="lg:w-2/3 text-center lg:text-left mb-8 lg:mb-0">
            <blockquote className="text-2xl lg:text-3xl font-medium text-gray-800 leading-relaxed">
              "Productos como el agua embotellada tradicional solo hidratan, pero EWA Box Water hace eso y mucho más."
            </blockquote>
          </div>

          {/* Review Box */}
          <div className="lg:w-1/3 flex justify-center lg:justify-end">
            <div className="bg-blue-600 text-white p-8 rounded-lg shadow-lg max-w-sm">
              <h3 className="text-xl font-bold mb-4">Más de 1,600 Reseñas de 5 Estrellas</h3>
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-6 h-6 text-yellow-400 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                ))}
              </div>
              <a href="#" className="text-blue-200 hover:text-white underline">
                leer las reseñas
              </a>
            </div>
          </div>
        </div>

        {/* Brand Mentions */}
        <div className="mt-16 text-center">
          <p className="text-gray-500 text-sm mb-8">Mencionado en:</p>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            <div className="text-gray-600 font-semibold">BRIT+CO</div>
            <div className="text-gray-600 font-semibold">Entrepreneur</div>
            <div className="text-gray-600 font-semibold">BUSINESS INSIDER</div>
            <div className="text-gray-600 font-semibold">Honest Brand Reviews</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;
