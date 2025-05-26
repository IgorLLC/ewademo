import React from 'react';

export interface FooterProps {
  children?: React.ReactNode;
}

const Footer: React.FC<FooterProps> = ({ children }) => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">EWA Box Water</h3>
            <p className="text-gray-300">
              Sustainable water delivery service for a better planet.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-300 hover:text-white">Home</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white">Plans</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white">About Us</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white">Contact</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Contact Us</h3>
            <p className="text-gray-300">
              123 Water Street<br />
              Boston, MA 02110<br />
              info@ewaboxwater.com<br />
              (555) 123-4567
            </p>
          </div>
        </div>
        {children}
        <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-400">
          &copy; {currentYear} EWA Box Water. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
