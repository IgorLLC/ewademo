import React from 'react';
import { useRouter } from 'next/router';

const CustomerNav: React.FC = () => {
  const router = useRouter();
  const links = [
    { href: '/customer/subscriptions', label: 'Suscripciones' },
    { href: '/customer/oneoffs', label: 'Pedidos Únicos' },
    { href: '/customer/profile', label: 'Perfil' },
    { href: '/customer/locations', label: 'Puntos de entrega' },
    { href: '/customer/billing', label: 'Billing' },
  ];

  const baseClasses = 'relative border-b-2 border-transparent hover:border-blue-300 text-gray-600 hover:text-blue-600 font-medium py-2 transition-all duration-200 group';
  const activeClasses = 'relative border-b-2 border-blue-600 text-blue-600 font-semibold py-2 transition-all duration-200 group';

  return (
    <nav className="hidden md:flex space-x-8">
      {links.map(link => {
        const isActive = router.pathname === link.href;
        return (
          <a key={link.href} href={link.href} className={isActive ? activeClasses : baseClasses}>
            {link.label}
            <div className={`absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 transform ${isActive ? 'scale-x-100' : 'scale-x-0'} group-hover:scale-x-100 transition-transform duration-200`}></div>
          </a>
        );
      })}
    </nav>
  );
};

export default CustomerNav;


