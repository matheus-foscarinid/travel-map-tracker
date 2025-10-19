import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import { useEffect, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import mapColors from '../config/mapColors.json';
import CountryModal from './CountryModal';
import './WorldMap.css';

interface CountryData {
  type: string;
  geometry: any;
}

interface WorldMapProps {
  onCountryClick?: (country: CountryData) => void;
}

interface SelectedCountry {
  name: string;
  code?: string;
}

function getCountryName(properties: { name: string }): string {
  return properties.name || 'Unknown Country';
}

function MapContent({ onCountryClick, onCountrySelect }: { onCountryClick?: (country: CountryData) => void; onCountrySelect: (country: SelectedCountry) => void }) {
  const map = useMap();
  const [currentZoom, setCurrentZoom] = useState(2);

  useEffect(() => {
    const handleZoomChange = () => {
      setCurrentZoom(map.getZoom());
    };

    map.on('zoomend', handleZoomChange);

    return () => {
      map.off('zoomend', handleZoomChange);
    };
  }, [map]);

  useEffect(() => {
    fetch('https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson')
      .then(response => response.json())
      .then(data => {
        const geoJsonLayer = L.geoJSON(data, {
          style: mapColors.default,
          onEachFeature: (feature, layer) => {
            layer.on({
              mouseover: (e) => {
                const layer = e.target;
                layer.setStyle(mapColors.hover);
                layer.bringToFront();
              },
              mouseout: (e) => {
                const layer = e.target;
                layer.setStyle(mapColors.default);
              },
              click: (e) => {
                if (onCountryClick) {
                  onCountryClick(feature as CountryData);
                }
                const countryName = getCountryName(feature.properties);
                const countryCode = feature.properties.ISO_A2 || feature.properties.ADMIN;
                console.log('Country clicked:', countryName);

                onCountrySelect({
                  name: countryName,
                  code: countryCode
                });
              }
            });

            const countryName = getCountryName(feature.properties);
            layer.unbindPopup();

            // there's a getBounds method :)
            const countryBounds = (layer as any).getBounds();
            const countryCenter = countryBounds.getCenter();
            const countryArea = countryBounds.getNorthEast().distanceTo(countryBounds.getSouthWest());

            const isSmallCountry = countryArea < 1000000;
            const shouldShowLabel = !isSmallCountry || currentZoom >= 4;

            if (shouldShowLabel) {
              const textLabel = L.marker(countryCenter, {
                icon: L.divIcon({
                  className: 'country-label',
                  html: `<div class="${isSmallCountry ? 'country-text-small' : 'country-text'}">${countryName}</div>`,
                  iconSize: [0, 0],
                  iconAnchor: [0, 0]
                })
              });

              textLabel.addTo(map);
            }
          }
        });

        geoJsonLayer.addTo(map);
      })
      .catch(error => {
        console.error('Error loading world data:', error);
      });
  }, [map, onCountryClick, onCountrySelect, currentZoom]);

  return null;
}

export default function WorldMap({ onCountryClick }: WorldMapProps) {
  const [selectedCountry, setSelectedCountry] = useState<SelectedCountry | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCountrySelect = (country: SelectedCountry) => {
    setSelectedCountry(country);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCountry(null);
  };

  return (
    <div className="w-full h-full">
      <MapContainer
        center={[20, 0]}
        zoom={2}
        minZoom={2}
        maxBounds={[[-90, -180], [90, 180]]}
        maxBoundsViscosity={1.0}
        style={{ height: '100%', width: '100%', backgroundColor: '#F3F4F6' }}
        className="z-0"
      >
        <MapContent onCountryClick={onCountryClick} onCountrySelect={handleCountrySelect} />
      </MapContainer>

      <CountryModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        countryName={selectedCountry?.name || ''}
        countryCode={selectedCountry?.code}
      />
    </div>
  );
}
