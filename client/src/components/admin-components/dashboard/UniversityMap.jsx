import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '../../../styles/leaflet-custom.css';
import { FaMapMarkerAlt, FaExternalLinkAlt } from 'react-icons/fa';

// Fix for default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const UniversityMap = () => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  // University coordinates (Pamantasan ng Cabuyao)
  const universityLocation = {
    lat: 14.259234649751656,
    lng: 121.12896777913332,
    name: 'Pamantasan ng Cabuyao',
    address: '745M+MG Cabuyao City, Laguna'
  };

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Initialize map
    const map = L.map(mapRef.current).setView(
      [universityLocation.lat, universityLocation.lng],
      17
    );

    // Multiple tile layer options - all free and regularly updated
    
    // 1. Esri World Imagery (Satellite) - Updated regularly, good for Philippines
    const satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
      maxZoom: 19,
    });

    // 2. Esri World Street Map - Most up-to-date street data
    const streetLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
      attribution: 'Tiles &copy; Esri',
      maxZoom: 19,
    });

    // 3. CartoDB Voyager - Clean, modern street map with recent updates
    const cartoDBLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 20,
    });

    // 4. OpenStreetMap - Community updated, good for recent changes
    const osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    });

    // 5. Esri World Topo Map - Topographic with recent updates
    const topoLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
      attribution: 'Tiles &copy; Esri',
      maxZoom: 19,
    });

    // Add default layer (satellite view for best detail)
    satelliteLayer.addTo(map);

    // Add layer control to switch between views
    const baseMaps = {
      "🛰️ Satellite (Esri)": satelliteLayer,
      "🗺️ Street Map (Esri)": streetLayer,
      "🎨 Modern (CartoDB)": cartoDBLayer,
      "🌍 OpenStreetMap": osmLayer,
      "⛰️ Topographic": topoLayer
    };
    L.control.layers(baseMaps).addTo(map);

    // Custom marker icon
    const customIcon = L.divIcon({
      className: 'custom-marker',
      html: `
        <div class="relative">
          <div class="absolute -top-10 -left-5 w-10 h-10 bg-orange-600 rounded-full flex items-center justify-center shadow-lg animate-bounce">
            <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
            </svg>
          </div>
        </div>
      `,
      iconSize: [40, 40],
      iconAnchor: [20, 40],
    });

    // Add marker
    const marker = L.marker(
      [universityLocation.lat, universityLocation.lng],
      { icon: customIcon }
    ).addTo(map);

    // Add popup
    marker.bindPopup(`
      <div class="p-2">
        <h3 class="font-bold text-orange-600 mb-1">${universityLocation.name}</h3>
        <p class="text-sm text-gray-600">${universityLocation.address}</p>
      </div>
    `);

    mapInstanceRef.current = map;

    // Cleanup
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  const handleOpenInMaps = () => {
    // Open in Google Maps
    const url = `https://www.google.com/maps/search/?api=1&query=${universityLocation.lat},${universityLocation.lng}`;
    window.open(url, '_blank');
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
            <FaMapMarkerAlt className="text-orange-600 text-xl" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">University Location</h3>
            <p className="text-sm text-gray-600">Pamantasan ng Cabuyao</p>
          </div>
        </div>
        <button
          onClick={handleOpenInMaps}
          className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors duration-200 text-sm font-medium"
        >
          <span>Open in Maps</span>
          <FaExternalLinkAlt className="text-xs" />
        </button>
      </div>

      <div className="relative rounded-xl overflow-hidden border border-gray-200">
        <div 
          ref={mapRef} 
          className="w-full h-[400px] z-0"
        />
      </div>

      <div className="mt-4 p-4 bg-orange-50 rounded-lg">
        <p className="text-sm text-gray-700">
          <span className="font-semibold text-orange-600">Address:</span> {universityLocation.address}
        </p>
      </div>
    </div>
  );
};

export default UniversityMap;
