import React from 'react';
import { Button } from '@ewa/ui';
import { useRouter } from 'next/router';

interface HeroSectionProps {
  user?: any;
  onAccessRedirect: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ user, onAccessRedirect }) => {
  const router = useRouter();

  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img 
          src="/images/landing/hero/hero-background.jpeg" 
          alt="EWA Box Water - Fondo del hero"
          className="w-full h-full object-cover"
        />
        {/* Overlay for better text contrast */}
        <div className="absolute inset-0 bg-blue-900/30"></div>
      </div>
      
      {/* Background Elements */}
      <div className="absolute inset-0">
        {/* Water drops and elements scattered across */}
        <div className="absolute top-20 left-10 w-16 h-16 bg-blue-200/60 rounded-full opacity-60 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-12 h-12 bg-blue-300/60 rounded-full opacity-40 animate-bounce"></div>
        <div className="absolute bottom-40 left-20 w-20 h-20 bg-blue-100/60 rounded-full opacity-50 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-14 h-14 bg-blue-200/60 rounded-full opacity-60 animate-bounce"></div>
      </div>

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between min-h-screen">
          {/* Left Content */}
          <div className="lg:w-1/2 text-center lg:text-left mb-12 lg:mb-0">
            <h1 className="text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight drop-shadow-lg">
              Conoce tu nuevo compañero
              <span className="block text-4xl lg:text-5xl text-blue-200 mt-2 drop-shadow-lg">
                de hidratación
              </span>
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto lg:mx-0 drop-shadow-md">
              ...y despídete de las mañanas deshidratadas
            </p>
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              {user ? (
                <Button 
                  size="lg" 
                  onClick={onAccessRedirect}
                  className="bg-blue-600 text-white hover:bg-blue-700 px-8 py-4 text-lg font-semibold rounded-lg flex items-center gap-2 transition-all duration-300"
                >
                  {user.role === 'admin' || user.role === 'operator' || user.role === 'editor' ? 'Ir al Panel Admin' : 'Ver Mi Cuenta'}
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Button>
              ) : (
                <>
                  <Button 
                    size="lg" 
                    onClick={() => router.push('/plans')}
                    className="bg-blue-600 text-white hover:bg-blue-700 px-8 py-4 text-lg font-semibold rounded-lg flex items-center gap-2 transition-all duration-300"
                  >
                    Ver Planes de Agua
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Button>
                  <Button 
                    size="lg" 
                    onClick={() => router.push('/register')}
                    className="bg-white text-blue-600 border-2 border-blue-600 hover:bg-blue-50 px-8 py-4 text-lg font-semibold rounded-lg flex items-center gap-2 transition-all duration-300"
                  >
                    Suscribirse y Ahorrar
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Right Product Display */}
          <div className="lg:w-1/2 flex justify-center">
            <div className="relative">
              {/* Hero Image */}
              <div className="relative w-full max-w-lg">
                <img 
                  src="/images/landing/hero/image1.jpeg" 
                  alt="EWA Box Water - Productos de agua sustentable" 
                  className="w-full h-auto rounded-2xl shadow-2xl"
                />
                {/* Optional overlay for better text contrast if needed */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent rounded-2xl"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
