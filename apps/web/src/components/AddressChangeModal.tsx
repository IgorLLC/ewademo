import React, { useState } from 'react';
import { Button } from '@ewa/ui';
import SimpleMapBox from './SimpleMapBox';
import 'mapbox-gl/dist/mapbox-gl.css';

interface AddressChangeModalProps {
  currentAddress: string;
  onClose: () => void;
  onSave: (address: string, lat: number, lng: number) => void;
}

const AddressChangeModal: React.FC<AddressChangeModalProps> = ({
  currentAddress,
  onClose,
  onSave
}) => {
  const [newAddress, setNewAddress] = useState(currentAddress);
  const [coordinates, setCoordinates] = useState<{lat: number, lng: number} | null>(null);

  // Función para geocodificar una dirección (convertir dirección a coordenadas)
  const geocodeAddress = async (address: string) => {
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=pk.eyJ1IjoiaWdvcmxscyIsImEiOiJjbTNuZ2tpaXoxOHYwMnFvbno3MzVzNHRjIn0.w6cTofWhNf4SfUMAW3-ImA`
      );
      const data = await response.json();
      
      if (data.features && data.features.length > 0) {
        const [lng, lat] = data.features[0].center;
        return { lat, lng, formattedAddress: data.features[0].place_name };
      }
      return null;
    } catch (error) {
      console.error('Error geocoding address:', error);
      return null;
    }
  };

  const handleAddressChange = async () => {
    const result = await geocodeAddress(newAddress);
    if (result) {
      setNewAddress(result.formattedAddress);
      setCoordinates({ lat: result.lat, lng: result.lng });
    }
  };

  const handleSave = () => {
    if (coordinates) {
      onSave(newAddress, coordinates.lat, coordinates.lng);
    } else {
      // Si no hay coordenadas nuevas, intentamos geocodificar la dirección
      geocodeAddress(newAddress).then(result => {
        if (result) {
          onSave(result.formattedAddress, result.lat, result.lng);
        } else {
          // Si no podemos geocodificar, usamos la dirección actual
          onSave(newAddress, 0, 0);
        }
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Cambiar dirección de entrega</h2>
          
          <div className="mb-4">
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
              Dirección
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                id="address"
                value={newAddress}
                onChange={(e) => setNewAddress(e.target.value)}
                className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-ewa-blue focus:border-ewa-blue sm:text-sm"
                placeholder="Ingresa tu dirección"
              />
              <Button 
                onClick={handleAddressChange}
                variant="secondary"
                size="sm"
              >
                Buscar
              </Button>
            </div>
          </div>
          
          <div className="mb-4">
            <p className="block text-sm font-medium text-gray-700 mb-1">
              Ubicación en el mapa
            </p>
            <SimpleMapBox 
              address={newAddress}
              latitude={coordinates?.lat}
              longitude={coordinates?.lng}
              height="300px"
              className="w-full border border-gray-300 rounded-md"
              interactive={true}
            />
            <p className="text-xs text-gray-500 mt-1">
              Nota: Usa el botón "Buscar" para actualizar la ubicación en el mapa según la dirección ingresada.
            </p>
          </div>
          
          <div className="flex justify-end space-x-3">
            <Button 
              onClick={onClose}
              variant="secondary"
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleSave}
              variant="primary"
            >
              Guardar dirección
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddressChangeModal;
