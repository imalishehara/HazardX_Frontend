// Coordinates for Sri Lankan Districts and Divisional Secretariats
// Format: { lat: number, lng: number }

export interface Coordinates {
  lat: number;
  lng: number;
}

// District coordinates (main city/town coordinates)
export const districtCoordinates: Record<string, Coordinates> = {
  // Western Province
  "Colombo": { lat: 6.9271, lng: 79.8612 },
  "Gampaha": { lat: 7.0873, lng: 80.0142 },
  "Kalutara": { lat: 6.5854, lng: 79.9607 },

  // Central Province
  "Kandy": { lat: 7.2906, lng: 80.6337 },
  "Matale": { lat: 7.4675, lng: 80.6234 },
  "Nuwara Eliya": { lat: 6.9497, lng: 80.7891 },

  // Southern Province
  "Galle": { lat: 6.0535, lng: 80.2210 },
  "Matara": { lat: 5.9549, lng: 80.5550 },
  "Hambantota": { lat: 6.1241, lng: 81.1185 },

  // Northern Province
  "Jaffna": { lat: 9.6615, lng: 80.0255 },
  "Kilinochchi": { lat: 9.3900, lng: 80.4036 },
  "Mannar": { lat: 8.9814, lng: 79.9072 },
  "Vavuniya": { lat: 8.7514, lng: 80.4971 },
  "Mullaitivu": { lat: 9.2667, lng: 80.8142 },

  // Eastern Province
  "Batticaloa": { lat: 7.7102, lng: 81.7088 },
  "Ampara": { lat: 7.2906, lng: 81.6656 },
  "Trincomalee": { lat: 8.5874, lng: 81.2152 },

  // North Western Province
  "Kurunegala": { lat: 7.4818, lng: 80.3609 },
  "Puttalam": { lat: 8.0362, lng: 79.8283 },

  // North Central Province
  "Anuradhapura": { lat: 8.3114, lng: 80.4037 },
  "Polonnaruwa": { lat: 7.9403, lng: 81.0188 },

  // Uva Province
  "Badulla": { lat: 6.9934, lng: 81.0550 },
  "Monaragala": { lat: 6.8731, lng: 81.3506 },

  // Sabaragamuwa Province
  "Ratnapura": { lat: 6.6828, lng: 80.3992 },
  "Kegalle": { lat: 7.2513, lng: 80.3464 }
};

// Divisional Secretariat coordinates
export const divisionalSecretariatCoordinates: Record<string, Coordinates> = {
  // Western Province - Colombo
  "Colombo": { lat: 6.9271, lng: 79.8612 },
  "Dehiwala-Mount Lavinia": { lat: 6.8435, lng: 79.8730 },
  "Moratuwa": { lat: 6.7730, lng: 79.8816 },
  "Sri Jayawardenepura Kotte": { lat: 6.8893, lng: 79.9195 },
  "Kaduwela": { lat: 6.9330, lng: 79.9845 },
  "Kolonnawa": { lat: 6.9330, lng: 79.8847 },
  "Maharagama": { lat: 6.8480, lng: 79.9265 },
  "Kesbewa": { lat: 6.8118, lng: 79.9265 },
  "Homagama": { lat: 6.8444, lng: 80.0022 },
  "Padukka": { lat: 6.8500, lng: 80.0900 },
  "Hanwella": { lat: 6.9080, lng: 80.0870 },
  "Seethawaka": { lat: 6.8250, lng: 80.1500 },
  "Avissawella": { lat: 6.9515, lng: 80.2097 },

  // Western Province - Gampaha
  "Gampaha": { lat: 7.0873, lng: 80.0142 },
  "Negombo": { lat: 7.2084, lng: 79.8358 },
  "Katana": { lat: 7.1167, lng: 79.8500 },
  "Divulapitiya": { lat: 7.2167, lng: 80.0000 },
  "Mirigama": { lat: 7.2417, lng: 80.1167 },
  "Minuwangoda": { lat: 7.1667, lng: 79.9833 },
  "Attanagalla": { lat: 7.1083, lng: 80.1500 },
  "Ja-Ela": { lat: 7.0750, lng: 79.8917 },
  "Mahara": { lat: 7.0000, lng: 79.9333 },
  "Dompe": { lat: 7.1000, lng: 80.0833 },
  "Biyagama": { lat: 6.9500, lng: 79.9667 },
  "Kelaniya": { lat: 6.9556, lng: 79.9219 },

  // Western Province - Kalutara
  "Kalutara": { lat: 6.5854, lng: 79.9607 },
  "Beruwala": { lat: 6.4790, lng: 79.9830 },
  "Panadura": { lat: 6.7133, lng: 79.9026 },
  "Horana": { lat: 6.7158, lng: 80.0628 },
  "Ingiriya": { lat: 6.7833, lng: 80.1000 },
  "Bulathsinhala": { lat: 6.7167, lng: 80.1833 },
  "Mathugama": { lat: 6.5250, lng: 80.1250 },
  "Agalawatta": { lat: 6.6333, lng: 80.0833 },
  "Palindanuwara": { lat: 6.5500, lng: 80.2500 },
  "Madurawela": { lat: 6.6000, lng: 80.2000 },
  "Millaniya": { lat: 6.4500, lng: 80.2000 },
  "Bandaragama": { lat: 6.7333, lng: 79.9833 },
  "Dodangoda": { lat: 6.6167, lng: 79.9500 },
  "Walallawita": { lat: 6.5833, lng: 80.0667 },

  // Central Province - Kandy
  "Kandy": { lat: 7.2906, lng: 80.6337 },
  "Gampola": { lat: 7.1644, lng: 80.5742 },
  "Nawalapitiya": { lat: 7.0553, lng: 80.5328 },
  "Doluwa": { lat: 7.1833, lng: 80.7833 },
  "Yatinuwara": { lat: 7.2500, lng: 80.7500 },
  "Udunuwara": { lat: 7.3167, lng: 80.6833 },
  "Ganga Ihala Korale": { lat: 7.2167, lng: 80.5667 },
  "Hewaheta": { lat: 7.0833, lng: 80.6333 },
  "Medadumbara": { lat: 7.3833, lng: 80.7333 },
  "Pasbage Korale": { lat: 7.2000, lng: 80.7000 },
  "Harispattuwa": { lat: 7.0500, lng: 80.6000 },
  "Pathadumbara": { lat: 7.4000, lng: 80.6500 },
  "Panwila": { lat: 7.3500, lng: 80.6000 },
  "Udapalatha": { lat: 7.3000, lng: 80.5500 },
  "Akurana": { lat: 7.3667, lng: 80.5500 },
  "Poojapitiya": { lat: 7.1167, lng: 80.4667 },
  "Tumpane": { lat: 7.2333, lng: 80.4500 },
  "Udadumbara": { lat: 7.4167, lng: 80.7000 },
  "Kundasale": { lat: 7.2833, lng: 80.6167 },
  "Thumpane": { lat: 7.2500, lng: 80.4667 },

  // Central Province - Matale
  "Matale": { lat: 7.4675, lng: 80.6234 },
  "Dambulla": { lat: 7.8731, lng: 80.6519 },
  "Naula": { lat: 7.4167, lng: 80.7167 },
  "Pallepola": { lat: 7.3167, lng: 80.5833 },
  "Ukuwela": { lat: 7.3833, lng: 80.6333 },
  "Rattota": { lat: 7.4500, lng: 80.5500 },
  "Yatawatta": { lat: 7.3500, lng: 80.5167 },
  "Galewela": { lat: 7.7500, lng: 80.5500 },
  "Sigiriya": { lat: 7.9569, lng: 80.7603 },
  "Laggala-Pallegama": { lat: 7.8000, lng: 80.8000 },
  "Ambanganga Korale": { lat: 7.6000, lng: 80.6500 },
  "Korale Pataha": { lat: 7.5500, lng: 80.6000 },

  // Central Province - Nuwara Eliya
  "Nuwara Eliya": { lat: 6.9497, lng: 80.7891 },
  "Hatton": { lat: 6.8914, lng: 80.5953 },
  "Kotmale": { lat: 7.0167, lng: 80.6833 },
  "Hanguranketha": { lat: 7.1667, lng: 80.7833 },
  "Walapane": { lat: 6.9333, lng: 80.9333 },
  "Ambagamuwa": { lat: 6.8833, lng: 80.7167 },

  // Southern Province - Galle
  "Galle": { lat: 6.0535, lng: 80.2210 },
  "Ambalangoda": { lat: 6.2354, lng: 80.0540 },
  "Elpitiya": { lat: 6.2919, lng: 80.1651 },
  "Bentara-Elpitiya": { lat: 6.2500, lng: 80.2000 },
  "Nagoda": { lat: 6.0833, lng: 80.1833 },
  "Baddegama": { lat: 6.1833, lng: 80.3000 },
  "Rathgama": { lat: 6.0667, lng: 80.1333 },
  "Balapitiya": { lat: 6.2667, lng: 80.0333 },
  "Karandeniya": { lat: 6.2167, lng: 80.2833 },
  "Benthota": { lat: 6.4167, lng: 79.9667 },
  "Hikkaduwa": { lat: 6.1378, lng: 80.1031 },
  "Imaduwa": { lat: 6.1333, lng: 80.3667 },
  "Wanduraba": { lat: 6.1167, lng: 80.4167 },
  "Neluwa": { lat: 6.3333, lng: 80.4333 },
  "Yakkalamulla": { lat: 6.0833, lng: 80.0500 },
  "Gonapinuwala": { lat: 6.1500, lng: 80.0167 },
  "Udugama": { lat: 6.4167, lng: 80.3833 },

  // Southern Province - Matara
  "Matara": { lat: 5.9549, lng: 80.5550 },
  "Weligama": { lat: 5.9750, lng: 80.4297 },
  "Hakmana": { lat: 6.1167, lng: 80.9167 },
  "Akuressa": { lat: 6.0500, lng: 80.7833 },
  "Malimbada": { lat: 6.1833, lng: 80.6833 },
  "Thihagoda": { lat: 5.9333, lng: 80.6000 },
  "Dickwella": { lat: 5.9333, lng: 80.3833 },
  "Devinuwara": { lat: 5.9333, lng: 80.5833 },
  "Pitabeddara": { lat: 6.0167, lng: 80.6833 },
  "Pasgoda": { lat: 6.0833, lng: 80.6167 },
  "Kotapola": { lat: 6.1500, lng: 80.8500 },
  "Kirinda-Puhulwella": { lat: 6.1000, lng: 81.1833 },
  "Welipitiya": { lat: 6.0167, lng: 80.8167 },
  "Athuraliya": { lat: 6.1333, lng: 80.7500 },
  "Kamburupitiya": { lat: 6.0667, lng: 80.5167 },

  // Southern Province - Hambantota
  "Hambantota": { lat: 6.1241, lng: 81.1185 },
  "Tangalle": { lat: 6.0240, lng: 80.7953 },
  "Tissamaharama": { lat: 6.2833, lng: 81.2833 },
  "Ambalantota": { lat: 6.1167, lng: 81.0333 },
  "Beliatta": { lat: 6.0500, lng: 80.7167 },
  "Weeraketiya": { lat: 6.1833, lng: 80.9500 },
  "Suriyawewa": { lat: 6.2833, lng: 81.0500 },
  "Lunugamvehera": { lat: 6.3167, lng: 81.1833 },
  "Kataragama": { lat: 6.4133, lng: 81.3344 },
  "Okewela": { lat: 6.2000, lng: 81.2167 },
  "Sooriyawewa": { lat: 6.2833, lng: 81.0500 },

  // Northern Province - Jaffna
  "Jaffna": { lat: 9.6615, lng: 80.0255 },
  "Nallur": { lat: 9.6667, lng: 80.0167 },
  "Chavakachcheri": { lat: 9.6167, lng: 80.1667 },
  "Point Pedro": { lat: 9.8167, lng: 80.2333 },
  "Karainagar": { lat: 9.7500, lng: 79.9500 },
  "Velanai": { lat: 9.7833, lng: 79.8167 },
  "Sandilipay": { lat: 9.7167, lng: 80.1000 },
  "Delft": { lat: 9.5167, lng: 79.6833 },
  "Kayts": { lat: 9.6667, lng: 79.8500 },
  "Vadamarachchi East": { lat: 9.7000, lng: 80.2500 },
  "Vadamarachchi South West": { lat: 9.6333, lng: 80.1333 },
  "Thenmarachchi": { lat: 9.5833, lng: 80.1000 },
  "Valikamam North": { lat: 9.7500, lng: 80.0833 },
  "Valikamam East": { lat: 9.7167, lng: 80.1500 },
  "Valikamam West": { lat: 9.7000, lng: 80.0000 },
  "Valikamam South": { lat: 9.6500, lng: 80.0833 },
  "Valikamam South West": { lat: 9.6167, lng: 80.0333 },
  "Islands North": { lat: 9.8000, lng: 79.8000 },
  "Islands South": { lat: 9.5000, lng: 79.7000 },

  // Northern Province - Kilinochchi
  "Kilinochchi": { lat: 9.3900, lng: 80.4036 },
  "Pachchilaipalli": { lat: 9.3333, lng: 80.5000 },
  "Poonakary": { lat: 9.4500, lng: 80.5500 },
  "Kandavalai": { lat: 9.2833, lng: 80.3167 },

  // Northern Province - Mannar
  "Mannar": { lat: 8.9814, lng: 79.9072 },
  "Madhu": { lat: 8.9500, lng: 79.8500 },
  "Nanaddan": { lat: 9.0167, lng: 79.9833 },
  "Musali": { lat: 8.9833, lng: 80.0167 },
  "Manthai West": { lat: 8.8167, lng: 79.8667 },

  // Northern Province - Vavuniya
  "Vavuniya": { lat: 8.7514, lng: 80.4971 },
  "Vavuniya South": { lat: 8.6833, lng: 80.4667 },
  "Vengalacheddikulam": { lat: 8.8167, lng: 80.5833 },

  // Northern Province - Mullaitivu
  "Mullaitivu": { lat: 9.2667, lng: 80.8142 },
  "Manthai East": { lat: 8.8833, lng: 80.8167 },
  "Thunukkai": { lat: 9.1833, lng: 80.8833 },
  "Welioya": { lat: 8.5833, lng: 80.8333 },
  "Oddusuddan": { lat: 9.0833, lng: 80.7500 },
  "Puthukudiyiruppu": { lat: 9.2500, lng: 80.7833 },
  "Maritimepattu": { lat: 9.3333, lng: 80.9000 },

  // Eastern Province - Batticaloa
  "Batticaloa": { lat: 7.7102, lng: 81.7088 },
  "Eravur Pattu": { lat: 7.7833, lng: 81.6000 },
  "Eravur Town": { lat: 7.7833, lng: 81.6167 },
  "Koralai Pattu North": { lat: 7.7167, lng: 81.7833 },
  "Koralai Pattu": { lat: 7.6833, lng: 81.7500 },
  "Manmunai North": { lat: 7.6833, lng: 81.6833 },
  "Manmunai Pattu": { lat: 7.6500, lng: 81.6167 },
  "Manmunai South and Eruvil Pattu": { lat: 7.6167, lng: 81.5833 },
  "Manmunai South West": { lat: 7.5833, lng: 81.5167 },
  "Manmunai West": { lat: 7.6167, lng: 81.4833 },
  "Porativu Pattu": { lat: 7.9000, lng: 81.8333 },
  "Kattankudy": { lat: 7.6833, lng: 81.7333 },

  // Eastern Province - Ampara
  "Ampara": { lat: 7.2906, lng: 81.6656 },
  "Kalmunai": { lat: 7.4167, lng: 81.8167 },
  "Sainthamaruthu": { lat: 7.3667, lng: 81.8333 },
  "Akkaraipattu": { lat: 7.2167, lng: 81.8500 },
  "Alayadivembu": { lat: 7.2833, lng: 81.7833 },
  "Addalachchenai": { lat: 7.4500, lng: 81.7000 },
  "Chenkalady": { lat: 7.8000, lng: 81.5833 },
  "Karaitivu": { lat: 7.7167, lng: 81.6833 },
  "Kiran": { lat: 7.4833, lng: 81.6167 },
  "Lahugala": { lat: 7.1333, lng: 81.8167 },
  "Mahaoya": { lat: 7.3500, lng: 81.5167 },
  "Navithanveli": { lat: 7.1833, lng: 81.8833 },
  "Padiyathalawa": { lat: 7.4167, lng: 81.4333 },
  "Pothuvil": { lat: 6.8833, lng: 81.8333 },
  "Sammanthurai": { lat: 7.3667, lng: 81.8167 },
  "Thirukkovil": { lat: 7.0333, lng: 81.8833 },
  "Uhana": { lat: 7.3000, lng: 81.3833 },
  "Damana": { lat: 7.1167, lng: 81.6833 },
  "Dehiattakandiya": { lat: 7.8167, lng: 80.9333 },

  // Eastern Province - Trincomalee
  "Trincomalee": { lat: 8.5874, lng: 81.2152 },
  "Kinniya": { lat: 8.4833, lng: 81.1833 },
  "Mutur": { lat: 8.4667, lng: 81.2833 },
  "Kuchchaveli": { lat: 8.7000, lng: 81.4167 },
  "Gomarankadawala": { lat: 8.1833, lng: 80.9167 },
  "Kantale": { lat: 8.3167, lng: 81.1000 },
  "Thambalagamuwa": { lat: 8.2167, lng: 81.1167 },
  "Seruvila": { lat: 8.7833, lng: 81.3167 },
  "Verugal": { lat: 8.6667, lng: 81.5167 },
  "Padavi Sri Pura": { lat: 8.0833, lng: 81.0167 },
  "Town and Gravets": { lat: 8.5833, lng: 81.2000 }
};

// Helper function to get coordinates for a district
export const getDistrictCoordinates = (district: string): Coordinates | null => {
  return districtCoordinates[district] || null;
};

// Helper function to get coordinates for a divisional secretariat
export const getDivisionalSecretariatCoordinates = (dsName: string): Coordinates | null => {
  return divisionalSecretariatCoordinates[dsName] || null;
};

// Helper function to get all coordinates for a district's divisional secretariats
export const getDistrictDSCoordinates = (district: string, dsList: string[]): Record<string, Coordinates> => {
  const coordinates: Record<string, Coordinates> = {};
  dsList.forEach(ds => {
    const coords = getDivisionalSecretariatCoordinates(ds);
    if (coords) {
      coordinates[ds] = coords;
    }
  });
  return coordinates;
};

export default {
  districtCoordinates,
  divisionalSecretariatCoordinates,
  getDistrictCoordinates,
  getDivisionalSecretariatCoordinates,
  getDistrictDSCoordinates
};