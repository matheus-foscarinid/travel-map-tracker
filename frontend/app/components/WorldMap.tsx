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

  // * AI GENERATED FUNCTION
  const getCountryStatus = (countryName: string) => {
    const seed = countryName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const random = Math.sin(seed) * 10000;
    const normalized = (random - Math.floor(random));

    if (normalized < 0.3) return 'visited';
    if (normalized < 0.5) return 'wishlist';
    return 'default';
  };

  const getCountryStyle = (status: string, isHover: boolean = false) => {
    switch (status) {
      case 'visited':
        return isHover ? mapColors.visitedHover : mapColors.visited;
      case 'wishlist':
        return isHover ? mapColors.wishlistHover : mapColors.wishlist;
      default:
        return isHover ? mapColors.hover : mapColors.default;
    }
  };

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
          style: (feature) => {
            if (!feature || !feature.properties) return mapColors.default;
            const countryName = getCountryName(feature.properties);
            const status = getCountryStatus(countryName);
            return getCountryStyle(status);
          },
          onEachFeature: (feature, layer) => {
            const countryName = getCountryName(feature.properties);
            const status = getCountryStatus(countryName);

            layer.on({
              mouseover: (e) => {
                const layer = e.target;
                layer.setStyle(getCountryStyle(status, true));
                layer.bringToFront();
              },
              mouseout: (e) => {
                const layer = e.target;
                layer.setStyle(getCountryStyle(status, false));
              },
              click: (e) => {
                if (onCountryClick) {
                  onCountryClick(feature as CountryData);
                }
                const countryCode = feature.properties.ISO_A2 || feature.properties.ADMIN;
                console.log('Country clicked:', countryName, 'Status:', status);

                onCountrySelect({
                  name: countryName,
                  code: countryCode
                });
              }
            });

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
        zoom={3}
        minZoom={2}
        maxBounds={[[-90, -180], [90, 180]]}
        maxBoundsViscosity={1.0}
        style={{ height: '100%', width: '100%', backgroundColor: mapColors.background.fillColor }}
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
