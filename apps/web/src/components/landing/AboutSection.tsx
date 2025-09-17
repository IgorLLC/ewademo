import React from 'react';
import { Button } from '@ewa/ui';

const AboutSection: React.FC = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Left - Images Grid */}
          <div className="lg:w-1/2">
            <div className="grid grid-cols-2 gap-4">
              {/* Team/Facility Image */}
              <div className="col-span-2">
                <img 
                  src="/images/landing/about/team-facility.jpeg" 
                  alt="Equipo EWA Box Water y nuestras instalaciones"
                  className="w-full h-48 object-cover rounded-lg shadow-lg"
                />
              </div>
              
              {/* Process Image */}
              <div className="col-span-2">
                <img 
                  src="/images/landing/about/process.jpeg" 
                  alt="Proceso de producción de agua sustentable"
                  className="w-full h-48 object-cover rounded-lg shadow-lg"
                />
              </div>
            </div>
          </div>

          {/* Right - About Content */}
          <div className="lg:w-1/2">
            <h2 className="text-4xl font-bold text-gray-800 mb-6">
              Más sobre nosotros
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed mb-8">
              No hay límite para lo que puedes lograr cuando tu mente y cuerpo están operando en su máximo potencial. 
              Conoce más sobre nuestro compromiso con datos clínicos, tecnología patentada pendiente e ingredientes respaldados por la ciencia.
            </p>
            <Button 
              className="bg-white text-blue-600 border-2 border-blue-600 hover:bg-blue-50 px-6 py-3 rounded-lg flex items-center gap-2 transition-all duration-300"
            >
              conocer la historia completa
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
