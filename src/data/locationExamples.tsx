// Example usage of coordinates and location services
// This file shows how to use the coordinate system in your React components

import React, { useState, useEffect } from 'react';
import { 
  getCurrentLocation, 
  getDistrictCoordinatesByName, 
  getDSCoordinatesByName,
  getAllDistricts,
  getDivisionalSecretariats 
} from '../pages/services/locationService';
import { 
  districtCoordinates, 
  divisionalSecretariatCoordinates,
  type Coordinates 
} from './coordinates';

// Example component showing how to use the coordinate system
export const LocationExample: React.FC = () => {
  const [currentLocation, setCurrentLocation] = useState<{district: string, ds_division: string} | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<string>('');
  const [districtCoords, setDistrictCoords] = useState<Coordinates | null>(null);
  const [availableDS, setAvailableDS] = useState<string[]>([]);

  // Get current GPS location
  const handleGetCurrentLocation = async () => {
    try {
      const location = await getCurrentLocation();
      setCurrentLocation(location);
    } catch (error) {
      console.error('Error getting location:', error);
    }
  };

  // Handle district selection
  const handleDistrictChange = (district: string) => {
    setSelectedDistrict(district);
    const coords = getDistrictCoordinatesByName(district);
    setDistrictCoords(coords);
    const dsList = getDivisionalSecretariats(district);
    setAvailableDS(dsList);
  };

  // Get all districts for dropdown
  const allDistricts = getAllDistricts();

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Location Services Example</h2>
      
      {/* Current Location Section */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Current Location</h3>
        <button 
          onClick={handleGetCurrentLocation}
          className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
        >
          Get Current Location
        </button>
        {currentLocation && (
          <div className="mt-2">
            <p><strong>District:</strong> {currentLocation.district}</p>
            <p><strong>DS Division:</strong> {currentLocation.ds_division}</p>
          </div>
        )}
      </div>

      {/* District Selection Section */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Select District</h3>
        <select 
          value={selectedDistrict} 
          onChange={(e) => handleDistrictChange(e.target.value)}
          className="border rounded px-3 py-2 w-full max-w-md"
        >
          <option value="">Select a district...</option>
          {allDistricts.map(district => (
            <option key={district} value={district}>{district}</option>
          ))}
        </select>
        
        {districtCoords && (
          <div className="mt-2">
            <p><strong>Coordinates:</strong> {districtCoords.lat}, {districtCoords.lng}</p>
          </div>
        )}
      </div>

      {/* Divisional Secretariats Section */}
      {availableDS.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Divisional Secretariats in {selectedDistrict}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {availableDS.map(ds => {
              const coords = getDSCoordinatesByName(ds);
              return (
                <div key={ds} className="border rounded p-2">
                  <p className="font-medium">{ds}</p>
                  {coords && (
                    <p className="text-sm text-gray-600">
                      {coords.lat.toFixed(4)}, {coords.lng.toFixed(4)}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Direct Coordinate Access Examples */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Direct Coordinate Access Examples</h3>
        <div className="space-y-2">
          <p><strong>Colombo District:</strong> {JSON.stringify(districtCoordinates.Colombo)}</p>
          <p><strong>Kandy City:</strong> {JSON.stringify(divisionalSecretariatCoordinates.Kandy)}</p>
          <p><strong>Galle City:</strong> {JSON.stringify(divisionalSecretariatCoordinates.Galle)}</p>
        </div>
      </div>
    </div>
  );
};

// Example of using coordinates in a map component (with Leaflet)
export const MapExample: React.FC = () => {
  const [selectedLocation, setSelectedLocation] = useState<{name: string, coords: Coordinates} | null>(null);

  const handleLocationSelect = (name: string, coords: Coordinates) => {
    setSelectedLocation({name, coords});
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Map Integration Example</h2>
      
      {/* Location Selector */}
      <div className="mb-4">
        <button 
          onClick={() => handleLocationSelect('Colombo', districtCoordinates.Colombo)}
          className="bg-green-500 text-white px-3 py-1 rounded mr-2"
        >
          Go to Colombo
        </button>
        <button 
          onClick={() => handleLocationSelect('Kandy', districtCoordinates.Kandy)}
          className="bg-green-500 text-white px-3 py-1 rounded mr-2"
        >
          Go to Kandy
        </button>
        <button 
          onClick={() => handleLocationSelect('Galle', divisionalSecretariatCoordinates.Galle)}
          className="bg-green-500 text-white px-3 py-1 rounded mr-2"
        >
          Go to Galle
        </button>
      </div>

      {selectedLocation && (
        <div className="border rounded p-4">
          <h3 className="font-semibold">{selectedLocation.name}</h3>
          <p>Latitude: {selectedLocation.coords.lat}</p>
          <p>Longitude: {selectedLocation.coords.lng}</p>
          <p className="text-sm text-gray-600 mt-2">
            Use these coordinates with your map component (Leaflet, Google Maps, etc.)
          </p>
        </div>
      )}
    </div>
  );
};

export default {
  LocationExample,
  MapExample
};