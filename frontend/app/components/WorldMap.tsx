import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import { useEffect, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import mapColors from '../config/mapColors.json';
import CountryModal from './CountryModal';
import CountryManagementModal from './CountryManagementModal';
import { useTheme } from '../hooks/useTheme';
import { useCountryData } from '../hooks/useCountryData';
import { Plus } from 'lucide-react';
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

function MapContent({ onCountryClick, onCountrySelect, getCountryStatus }: {
  onCountryClick?: (country: CountryData) => void;
  onCountrySelect: (country: SelectedCountry) => void;
  getCountryStatus: (countryName: string) => 'visited' | 'wishlist' | 'default';
}) {
  const map = useMap();
  const { currentTheme } = useTheme();
  const [currentZoom, setCurrentZoom] = useState(2);

  const themeKey = currentTheme.id as keyof typeof mapColors;
  const themeMapColors = mapColors[themeKey] || mapColors.light;

  const getCountryStyle = (status: string, isHover: boolean = false) => {
    switch (status) {
      case 'visited':
        return isHover ? themeMapColors.visitedHover : themeMapColors.visited;
      case 'wishlist':
        return isHover ? themeMapColors.wishlistHover : themeMapColors.wishlist;
      default:
        return isHover ? themeMapColors.hover : themeMapColors.default;
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
            if (!feature || !feature.properties) return themeMapColors.default;
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
  }, [map, onCountryClick, onCountrySelect, currentZoom, currentTheme.id, getCountryStatus]);

  return null;
}

export default function WorldMap({ onCountryClick }: WorldMapProps) {
  const { currentTheme } = useTheme();
  const { visitedCountries, wishlistCountries, updateCountries, getCountryStatus } = useCountryData();
  const [selectedCountry, setSelectedCountry] = useState<SelectedCountry | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isManagementModalOpen, setIsManagementModalOpen] = useState(false);

  const themeKey = currentTheme.id as keyof typeof mapColors;
  const themeMapColors = mapColors[themeKey] || mapColors.light;

  const handleCountrySelect = (country: SelectedCountry) => {
    setSelectedCountry(country);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCountry(null);
  };

  const handleOpenManagementModal = () => {
    setIsManagementModalOpen(true);
  };

  const handleCloseManagementModal = () => {
    setIsManagementModalOpen(false);
  };

  const handleUpdateCountries = (visited: string[], wishlist: string[]) => {
    updateCountries(visited, wishlist);
  };

  return (
    <div className="w-full h-full">
      <MapContainer
        center={[20, 0]}
        zoom={3}
        minZoom={2}
        maxBounds={[[-90, -180], [90, 180]]}
        maxBoundsViscosity={1.0}
        style={{ height: '100%', width: '100%', backgroundColor: themeMapColors.background.fillColor }}
        className="z-0"
      >
        <MapContent
          onCountryClick={onCountryClick}
          onCountrySelect={handleCountrySelect}
          getCountryStatus={getCountryStatus}
        />
      </MapContainer>

      {/* Management Button */}
      <button
        onClick={handleOpenManagementModal}
        className="absolute bottom-16 right-8 theme-surface rounded-full p-3 shadow-lg hover:shadow-xl transition-all theme-border border z-10"
        style={{ color: currentTheme.colors.primary }}
      >
        <Plus className="w-6 h-6" />
      </button>

      <CountryModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        countryName={selectedCountry?.name || ''}
        countryCode={selectedCountry?.code}
      />

      <CountryManagementModal
        isOpen={isManagementModalOpen}
        onClose={handleCloseManagementModal}
        visitedCountries={visitedCountries}
        wishlistCountries={wishlistCountries}
        onUpdateCountries={handleUpdateCountries}
      />
    </div>
  );
}
