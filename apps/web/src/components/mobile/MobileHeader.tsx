import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { 
  Menu, 
  Bell, 
  Search, 
  ArrowLeft,
  User,
  Settings,
  LogOut
} from 'lucide-react';

interface MobileHeaderProps {
  title: string;
  showBack?: boolean;
  onBack?: () => void;
  showMenu?: boolean;
  showNotifications?: boolean;
  showSearch?: boolean;
  onSearch?: (query: string) => void;
  user?: {
    name: string;
    email: string;
    avatar?: string;
  };
}

const MobileHeader: React.FC<MobileHeaderProps> = ({
  title,
  showBack = false,
  onBack,
  showMenu = true,
  showNotifications = true,
  showSearch = false,
  onSearch,
  user
}) => {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  const handleSearch = () => {
    if (onSearch && searchQuery.trim()) {
      onSearch(searchQuery.trim());
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('ewa_user');
    router.push('/auth');
  };

  const menuItems = [
    {
      label: 'Perfil',
      icon: <User className="w-5 h-5" />,
      onClick: () => router.push('/customer/profile')
    },
    {
      label: 'Configuración',
      icon: <Settings className="w-5 h-5" />,
      onClick: () => router.push('/customer/settings')
    },
    {
      label: 'Cerrar Sesión',
      icon: <LogOut className="w-5 h-5" />,
      onClick: handleLogout
    }
  ];

  return (
    <>
      {/* Header Principal */}
      <header className="md:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200 shadow-sm z-40">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Botón de regreso o título */}
          <div className="flex items-center flex-1">
            {showBack && (
              <button
                onClick={handleBack}
                className="mr-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
            )}
            <h1 className="text-lg font-semibold text-gray-900 truncate">
              {title}
            </h1>
          </div>

          {/* Acciones del header */}
          <div className="flex items-center space-x-2">
            {showSearch && (
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Search className="w-5 h-5 text-gray-600" />
              </button>
            )}
            
            {showNotifications && (
              <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors relative">
                <Bell className="w-5 h-5 text-gray-600" />
                {/* Badge de notificaciones */}
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </button>
            )}
            
            {showMenu && (
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Menu className="w-5 h-5 text-gray-600" />
              </button>
            )}
          </div>
        </div>

        {/* Barra de búsqueda expandible */}
        {isSearchOpen && (
          <div className="px-4 pb-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ewa-blue focus:border-ewa-blue"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <button
                onClick={handleSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-ewa-blue font-medium"
              >
                Buscar
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Menú lateral */}
      {isMenuOpen && (
        <>
          {/* Overlay */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-50"
            onClick={() => setIsMenuOpen(false)}
          />
          
          {/* Menú */}
          <div className="fixed top-0 right-0 h-full w-80 bg-white shadow-xl z-50 transform transition-transform duration-300">
            <div className="flex flex-col h-full">
              {/* Header del menú */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Menú</h2>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <span className="text-2xl text-gray-600">&times;</span>
                </button>
              </div>

              {/* Información del usuario */}
              {user && (
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-ewa-blue rounded-full flex items-center justify-center">
                      {user.avatar ? (
                        <img 
                          src={user.avatar} 
                          alt={user.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <User className="w-6 h-6 text-white" />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{user.name}</p>
                      <p className="text-sm text-gray-600">{user.email}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Opciones del menú */}
              <div className="flex-1 p-4">
                <nav className="space-y-2">
                  {menuItems.map((item, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        item.onClick();
                        setIsMenuOpen(false);
                      }}
                      className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition-colors text-left"
                    >
                      <span className="text-gray-600">{item.icon}</span>
                      <span className="text-gray-900">{item.label}</span>
                    </button>
                  ))}
                </nav>
              </div>

              {/* Footer del menú */}
              <div className="p-4 border-t border-gray-200">
                <p className="text-xs text-gray-500 text-center">
                  EWA Box Water v1.0.0
                </p>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Safe area para dispositivos con notch */}
      <div className="h-safe-area-inset-top bg-white"></div>
      
      {/* Espacio para el header fijo */}
      <div className="h-16 md:hidden"></div>
    </>
  );
};

export default MobileHeader;
