import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import { useEffect, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in react-leaflet
if (typeof window !== 'undefined') {
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  });
}

interface CountryData {
  type: string;
  properties: {
    NAME: string;
    ISO_A2: string;
    [key: string]: any;
  };
  geometry: any;
}

interface WorldMapProps {
  onCountryClick?: (country: CountryData) => void;
}

function MapContent({ onCountryClick }: { onCountryClick?: (country: CountryData) => void }) {
  const map = useMap();

  useEffect(() => {
    // Load world countries GeoJSON data
    fetch('https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson')
      .then(response => response.json())
      .then(data => {
        // Create GeoJSON layer
        const geoJsonLayer = L.geoJSON(data, {
          style: {
            fillColor: '#4F46E5',
            weight: 1,
            opacity: 1,
            color: 'white',
            dashArray: '3',
            fillOpacity: 0.7
          },
          onEachFeature: (feature, layer) => {
            // Add hover effects
            layer.on({
              mouseover: (e) => {
                const layer = e.target;
                layer.setStyle({
                  fillColor: '#7C3AED',
                  fillOpacity: 0.9,
                  weight: 2
                });
                layer.bringToFront();
              },
              mouseout: (e) => {
                const layer = e.target;
                layer.setStyle({
                  fillColor: '#4F46E5',
                  fillOpacity: 0.7,
                  weight: 1
                });
              },
              click: (e) => {
                if (onCountryClick) {
                  onCountryClick(feature as CountryData);
                }
                console.log('Country clicked:', feature.properties.NAME || feature.properties.ADMIN);
              }
            });

            // Add tooltip
            layer.bindTooltip(feature.properties.NAME || feature.properties.ADMIN || 'Unknown Country', {
              permanent: false,
              direction: 'center',
              className: 'custom-tooltip'
            });
          }
        });

        geoJsonLayer.addTo(map);
      })
      .catch(error => {
        console.error('Error loading world data:', error);
      });
  }, [map, onCountryClick]);

  return null;
}

export default function WorldMap({ onCountryClick }: WorldMapProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <MapContainer
        center={[20, 0]}
        zoom={2}
        style={{ height: '100%', width: '100%' }}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapContent onCountryClick={onCountryClick} />
      </MapContainer>
    </div>
  );
}
