import React from 'react';
import { useRouter } from 'next/router';
import { 
  Home, 
  Package, 
  User, 
  MessageCircle, 
  MapPin 
} from 'lucide-react';

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  isActive: boolean;
  onClick: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, href, isActive, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center w-full py-2 transition-all duration-200 ${
        isActive 
          ? 'text-ewa-blue bg-ewa-light-blue/20' 
          : 'text-gray-600 hover:text-ewa-blue'
      }`}
    >
      <div className={`w-6 h-6 mb-1 transition-transform duration-200 ${
        isActive ? 'scale-110' : 'scale-100'
      }`}>
        {icon}
      </div>
      <span className={`text-xs font-medium transition-all duration-200 ${
        isActive ? 'text-ewa-blue' : 'text-gray-600'
      }`}>
        {label}
      </span>
      {isActive && (
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-ewa-blue rounded-full"></div>
      )}
    </button>
  );
};

const MobileBottomNav: React.FC = () => {
  const router = useRouter();
  
  const navItems = [
    {
      href: '/customer',
      label: 'Inicio',
      icon: <Home className="w-6 h-6" />
    },
    {
      href: '/customer/subscriptions',
      label: 'Suscripciones',
      icon: <Package className="w-6 h-6" />
    },
    {
      href: '/customer/locations',
      label: 'Ubicaciones',
      icon: <MapPin className="w-6 h-6" />
    },
    {
      href: '/customer/profile',
      label: 'Perfil',
      icon: <User className="w-6 h-6" />
    },
    {
      href: '/customer/support',
      label: 'Soporte',
      icon: <MessageCircle className="w-6 h-6" />
    }
  ];

  const handleNavigation = (href: string) => {
    router.push(href);
  };

  const isActive = (href: string) => {
    if (href === '/customer') {
      return router.pathname === '/customer';
    }
    return router.pathname.startsWith(href);
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
      <div className="flex items-center justify-around px-2 py-1">
        {navItems.map((item) => (
          <div key={item.href} className="relative flex-1">
            <NavItem
              icon={item.icon}
              label={item.label}
              href={item.href}
              isActive={isActive(item.href)}
              onClick={() => handleNavigation(item.href)}
            />
          </div>
        ))}
      </div>
      
      {/* Safe area para dispositivos con notch */}
      <div className="h-safe-area-inset-bottom bg-white"></div>
    </nav>
  );
};

export default MobileBottomNav;
