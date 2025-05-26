import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Navbar, Footer, Button } from '@ewa/ui';
import { useRouter } from 'next/router';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, title = 'EWA Box Water' }) => {
  const router = useRouter();
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content="EWA Box Water - Sustainable water delivery service" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <div className="sticky top-0 z-50">
        <Navbar>
          <div className="flex items-center justify-between w-full relative">
            {/* Logo y Nombre */}
            <div className="flex items-center">
              <a href="/" className="flex items-center group">
                <div className="bg-ewa-blue text-white font-bold text-xl py-2 px-4 rounded-lg shadow-md group-hover:shadow-lg transition-all duration-300 flex items-center space-x-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4m16 0a8 8 0 01-8 8m8-8a8 8 0 00-8-8m8 8h-8" />
                  </svg>
                  <span>EWA BOX WATER</span>
                </div>
              </a>
            </div>
            
            {/* Menú de navegación para escritorio */}
            <div className="hidden md:flex items-center space-x-8 mx-4">
              <a href="/" className="text-gray-700 hover:text-ewa-blue font-medium py-2 border-b-2 border-transparent hover:border-ewa-blue transition-all duration-200">
                Inicio
              </a>
              <a href="/plans" className="text-gray-700 hover:text-ewa-blue font-medium py-2 border-b-2 border-transparent hover:border-ewa-blue transition-all duration-200">
                Planes
              </a>
              <a href="/blog" className="text-gray-700 hover:text-ewa-blue font-medium py-2 border-b-2 border-transparent hover:border-ewa-blue transition-all duration-200">
                Blog
              </a>
              <a href="/#products" className="text-gray-700 hover:text-ewa-blue font-medium py-2 border-b-2 border-transparent hover:border-ewa-blue transition-all duration-200">
                Productos
              </a>
            </div>
            
            {/* Botón de inicio de sesión */}
            <div className="hidden md:block">
              <a href="/auth" className="inline-block">
                <Button 
                  variant="primary" 
                  size="md" 
                >
                  Iniciar sesión / Registrarse
                </Button>
              </a>
            </div>
            
            {/* Menú móvil - Botón hamburguesa */}
            <div className="md:hidden flex items-center">
              <button 
                onClick={() => {
                  const mobileMenu = document.getElementById('mobile-menu');
                  if (mobileMenu) {
                    mobileMenu.classList.toggle('hidden');
                  }
                }}
                className="p-2 rounded-md text-gray-700 hover:text-ewa-blue focus:outline-none"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </Navbar>
        
        {/* Menú móvil desplegable */}
        <div id="mobile-menu" className="hidden md:hidden bg-white shadow-lg absolute w-full z-50">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <a href="/" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-ewa-blue hover:bg-gray-50">
              Inicio
            </a>
            <a href="/plans" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-ewa-blue hover:bg-gray-50">
              Planes
            </a>
            <a href="/blog" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-ewa-blue hover:bg-gray-50">
              Blog
            </a>
            <a href="/#products" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-ewa-blue hover:bg-gray-50">
              Productos
            </a>
            <a href="/auth" className="block px-3 py-2 rounded-md text-base font-medium bg-ewa-blue text-white hover:bg-ewa-blue-dark">
              Iniciar sesión / Registrarse
            </a>
          </div>
        </div>
      </div>
      
      <main>{children}</main>
      
      <Footer />
    </>
  );
};

export default Layout;
