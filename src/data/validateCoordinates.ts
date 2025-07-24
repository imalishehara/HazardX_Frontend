// Quick validation test for coordinate system
// Run this to verify everything is working correctly

import { 
  districtCoordinates, 
  divisionalSecretariatCoordinates,
  getDistrictCoordinates,
  getDivisionalSecretariatCoordinates
} from './coordinates';

import districtDivisionalSecretariats from './districtDivisionalSecretariats';

// Test function to validate the coordinate system
export const validateCoordinateSystem = () => {
  console.log('🧪 Starting Coordinate System Validation...');
  
  // Test 1: Check if all districts have coordinates
  const allDistricts = Object.keys(districtDivisionalSecretariats);
  console.log(`📍 Testing ${allDistricts.length} districts...`);
  
  let missingDistrictCoords = 0;
  allDistricts.forEach((district: string) => {
    const coords = getDistrictCoordinates(district);
    if (!coords) {
      console.error(`❌ Missing coordinates for district: ${district}`);
      missingDistrictCoords++;
    }
  });
  
  if (missingDistrictCoords === 0) {
    console.log('✅ All districts have coordinates!');
  } else {
    console.log(`⚠️ ${missingDistrictCoords} districts missing coordinates`);
  }
  
  // Test 2: Check sample divisional secretariats
  console.log('\n📍 Testing divisional secretariats...');
  
  const sampleDistricts = ['Colombo', 'Kandy', 'Galle', 'Anuradhapura'];
  let missingDSCoords = 0;
  let totalDSTested = 0;
  
  sampleDistricts.forEach((district: string) => {
    const dsList = districtDivisionalSecretariats[district] || [];
    console.log(`  ${district}: ${dsList.length} DS divisions`);
    
    dsList.forEach((ds: string) => {
      totalDSTested++;
      const coords = getDivisionalSecretariatCoordinates(ds);
      if (!coords) {
        console.error(`    ❌ Missing coordinates for DS: ${ds} in ${district}`);
        missingDSCoords++;
      }
    });
  });
  
  console.log(`✅ Tested ${totalDSTested} DS divisions`);
  if (missingDSCoords === 0) {
    console.log('✅ All tested DS divisions have coordinates!');
  } else {
    console.log(`⚠️ ${missingDSCoords} DS divisions missing coordinates`);
  }
  
  // Test 3: Sample coordinate access
  console.log('\n📍 Testing direct coordinate access...');
  console.log('Colombo District:', districtCoordinates.Colombo);
  console.log('Kandy DS:', divisionalSecretariatCoordinates.Kandy);
  console.log('Galle DS:', divisionalSecretariatCoordinates.Galle);
  
  // Test 4: Count total coordinates
  console.log('\n📊 Coordinate Statistics:');
  console.log(`Districts with coordinates: ${Object.keys(districtCoordinates).length}`);
  console.log(`DS divisions with coordinates: ${Object.keys(divisionalSecretariatCoordinates).length}`);
  
  console.log('\n🎉 Validation Complete!');
  return {
    districtCount: Object.keys(districtCoordinates).length,
    dsCount: Object.keys(divisionalSecretariatCoordinates).length,
    missingDistrictCoords,
    missingDSCoords
  };
};

// Export for use in components
export default validateCoordinateSystem;