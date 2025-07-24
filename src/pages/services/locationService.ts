import { 
  districtCoordinates, 
  divisionalSecretariatCoordinates, 
  getDistrictCoordinates,
  getDivisionalSecretariatCoordinates,
  type Coordinates 
} from '../../data/coordinates';
import districtDivisionalSecretariats from '../../data/districtDivisionalSecretariats';

interface LocationBounds {
  minLat: number;
  maxLat: number;
  minLng: number;
  maxLng: number;
}

interface LocationMapping {
  bounds: LocationBounds;
  district: string;
  ds_division: string;
}

interface LocationResult {
  district: string;
  ds_division: string;
}

interface GeolocationError {
  code: number;
  message: string;
}

// Generate location mappings from coordinates with boundaries
const generateLocationMappings = (): LocationMapping[] => {
  const mappings: LocationMapping[] = [];
  
  Object.keys(districtDivisionalSecretariats).forEach(district => {
    const dsList = districtDivisionalSecretariats[district];
    
    dsList.forEach(ds => {
      const coords = getDivisionalSecretariatCoordinates(ds);
      if (coords) {
        // Create a small boundary around each DS coordinate (approximately 0.1 degrees)
        const boundary = 0.05; // Adjust this value as needed
        mappings.push({
          bounds: {
            minLat: coords.lat - boundary,
            maxLat: coords.lat + boundary,
            minLng: coords.lng - boundary,
            maxLng: coords.lng + boundary
          },
          district: district,
          ds_division: ds
        });
      }
    });
  });
  
  return mappings;
};

// Generate the location mappings
const LOCATION_MAPPINGS = generateLocationMappings();

/**
 * Maps GPS coordinates to the corresponding district and divisional secretariat
 * @param latitude - Latitude coordinate
 * @param longitude - Longitude coordinate
 * @returns Object containing district and divisionalSecretariat
 */
export const getLocationFromCoordinates = (latitude: number, longitude: number): LocationResult => {
  // Find the first matching location mapping
  for (const mapping of LOCATION_MAPPINGS) {
    const { bounds, district, ds_division } = mapping;
    if (
      latitude >= bounds.minLat &&
      latitude <= bounds.maxLat &&
      longitude >= bounds.minLng &&
      longitude <= bounds.maxLng
    ) {
      return { district, ds_division };
    }
  }

  // Default fallback if no mapping found (Colombo center)
  return { district: "Colombo", ds_division: "Colombo" };
};

/**
 * Gets the current GPS location and returns the corresponding district and divisional secretariat
 * @returns Promise that resolves to LocationResult or rejects with error
 */
export const getCurrentLocation = (): Promise<LocationResult> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by this browser"));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const location = getLocationFromCoordinates(latitude, longitude);
        resolve(location);
      },
      (error) => {
        let errorMessage = "Unable to retrieve location";
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Location access denied by user";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information unavailable";
            break;
          case error.TIMEOUT:
            errorMessage = "Location request timed out";
            break;
        }
        reject(new Error(errorMessage));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 600000 // 10 minutes
      }
    );
  });
};

/**
 * Utility function to check if GPS is available
 * @returns boolean indicating GPS availability
 */
export const isGeolocationAvailable = (): boolean => {
  return 'geolocation' in navigator;
};

/**
 * Get coordinates for a specific district
 * @param district - District name
 * @returns Coordinates or null if not found
 */
export const getDistrictCoordinatesByName = (district: string): Coordinates | null => {
  return getDistrictCoordinates(district);
};

/**
 * Get coordinates for a specific divisional secretariat
 * @param dsName - Divisional secretariat name
 * @returns Coordinates or null if not found
 */
export const getDSCoordinatesByName = (dsName: string): Coordinates | null => {
  return getDivisionalSecretariatCoordinates(dsName);
};

/**
 * Get all available districts
 * @returns Array of district names
 */
export const getAllDistricts = (): string[] => {
  return Object.keys(districtDivisionalSecretariats);
};

/**
 * Get all divisional secretariats for a district
 * @param district - District name
 * @returns Array of DS names or empty array if district not found
 */
export const getDivisionalSecretariats = (district: string): string[] => {
  return districtDivisionalSecretariats[district] || [];
};

export default {
  getLocationFromCoordinates,
  getCurrentLocation,
  isGeolocationAvailable,
  getDistrictCoordinatesByName,
  getDSCoordinatesByName,
  getAllDistricts,
  getDivisionalSecretariats
};