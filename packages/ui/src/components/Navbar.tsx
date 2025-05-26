import React from 'react';

export interface NavbarProps {
  logo?: React.ReactNode;
  children?: React.ReactNode;
  transparent?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ logo, children, transparent = false }) => {
  return (
    <nav className={`px-4 py-3 ${transparent ? 'bg-transparent' : 'bg-white shadow-sm'}`}>
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex-shrink-0">
          {logo || <span className="text-xl font-bold text-blue-600">EWA Box Water</span>}
        </div>
        <div className="flex items-center space-x-4">
          {children}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
