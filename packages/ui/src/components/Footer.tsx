import React from 'react';

export interface FooterProps {
  children?: React.ReactNode;
}

const Footer: React.FC<FooterProps> = ({ children }) => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div>
            <img
              src="/images/branding/ewa-logo.svg"
              alt="EWA Box Water"
              className="mb-4 h-12 w-auto object-contain"
            />
            <p className="text-gray-200 leading-relaxed">
              Servicio de entrega de agua sustentable para un planeta mejor.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4 text-white">Enlaces Rápidos</h3>
            <ul className="space-y-3">
              <li><a href="/" className="text-gray-200 hover:text-blue-300 transition-colors duration-200">Inicio</a></li>
              <li><a href="/plans" className="text-gray-200 hover:text-blue-300 transition-colors duration-200">Planes</a></li>
              <li><a href="/about" className="text-gray-200 hover:text-blue-300 transition-colors duration-200">Sobre Nosotros</a></li>
              <li><a href="mailto:hola@ewa.com" className="text-gray-200 hover:text-blue-300 transition-colors duration-200">Contacto</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4 text-white">Contáctanos</h3>
            <p className="text-gray-200 leading-relaxed">
              Puerto Rico<br />
              team@ewaboxwater.com<br />
              (787) 936-7992
            </p>
          </div>
        </div>
        {children}
        <div className="mt-12 border-t border-gray-700 pt-8 text-center text-gray-300">
          &copy; {currentYear} EWA Box Water. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
