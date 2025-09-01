import React, { useState } from 'react';
import { Plus, Package, MapPin, Settings, X } from 'lucide-react';

interface MobileFABProps {
  onNewSubscription: () => void;
  onNewLocation: () => void;
  onSettings: () => void;
}

const MobileFAB: React.FC<MobileFABProps> = ({
  onNewSubscription,
  onNewLocation,
  onSettings
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleAction = (action: () => void) => {
    action();
    setIsOpen(false);
  };

  return (
    <>
      {/* Botones de acción */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 z-40 space-y-3">
          {/* Botón Nueva Suscripción */}
          <button
            onClick={() => handleAction(onNewSubscription)}
            className="flex items-center space-x-3 bg-ewa-blue hover:bg-ewa-dark-blue text-white px-4 py-3 rounded-full shadow-lg transition-all duration-200 transform hover:scale-105"
          >
            <Package className="w-5 h-5" />
            <span className="text-sm font-medium">Nueva Suscripción</span>
          </button>

          {/* Botón Nueva Ubicación */}
          <button
            onClick={() => handleAction(onNewLocation)}
            className="flex items-center space-x-3 bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-full shadow-lg transition-all duration-200 transform hover:scale-105"
          >
            <MapPin className="w-5 h-5" />
            <span className="text-sm font-medium">Nueva Ubicación</span>
          </button>

          {/* Botón Configuración */}
          <button
            onClick={() => handleAction(onSettings)}
            className="flex items-center space-x-3 bg-gray-600 hover:bg-gray-700 text-white px-4 py-3 rounded-full shadow-lg transition-all duration-200 transform hover:scale-105"
          >
            <Settings className="w-5 h-5" />
            <span className="text-sm font-medium">Configuración</span>
          </button>
        </div>
      )}

      {/* Botón principal FAB */}
      <button
        onClick={toggleMenu}
        className={`fixed bottom-20 right-4 z-50 w-14 h-14 rounded-full shadow-lg transition-all duration-200 transform hover:scale-110 ${
          isOpen 
            ? 'bg-red-500 hover:bg-red-600' 
            : 'bg-ewa-blue hover:bg-ewa-dark-blue'
        }`}
      >
        <div className="flex items-center justify-center w-full h-full">
          {isOpen ? (
            <X className="w-6 h-6 text-white" />
          ) : (
            <Plus className="w-6 h-6 text-white" />
          )}
        </div>
      </button>

      {/* Overlay para cerrar el menú */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default MobileFAB;
