import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import { useEffect, useState, useRef } from 'react';
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
  showLabels?: boolean;
  showControls?: boolean;
}

interface SelectedCountry {
  name: string;
  code?: string;
}

function getCountryName(properties: { name: string }): string {
  return properties.name || 'Unknown Country';
}

let worldDataCache: any = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

function MapContent({ onCountryClick, onCountrySelect, getCountryStatus, visitedCountries, wishlistCountries, showLabels = true, showControls = true }: {
  onCountryClick?: (country: CountryData) => void;
  onCountrySelect: (country: SelectedCountry) => void;
  getCountryStatus: (countryName: string) => 'visited' | 'wishlist' | 'default';
  visitedCountries: string[];
  wishlistCountries: string[];
  showLabels?: boolean;
  showControls?: boolean;
}) {
  const map = useMap();
  const { currentTheme } = useTheme();
  const [currentZoom, setCurrentZoom] = useState(2);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const geoJsonLayerRef = useRef<L.GeoJSON | null>(null);

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

  const fetchWorldData = async (retryCount = 0): Promise<any> => {
    const maxRetries = 1;
    const retryDelay = 1000;

    try {
      // Check cache first
      const now = Date.now();
      if (worldDataCache && (now - cacheTimestamp) < CACHE_DURATION) {
        console.log('Using cached world data');
        return worldDataCache;
      }

      console.log(`Fetching world data (attempt ${retryCount + 1})`);

      const urls = [
        'https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson',
        '/world.geojson' // Local fallback
      ];

      const urlToTry = urls[retryCount % urls.length];
      console.log(`Trying URL: ${urlToTry}`);

      const response = await fetch(urlToTry);

      if (!response.ok) {
        if (response.status === 429 && retryCount < maxRetries) {
          console.log(`Rate limited, retrying in ${retryDelay}ms...`);
          await new Promise(resolve => setTimeout(resolve, retryDelay));
          return fetchWorldData(retryCount + 1);
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Cache the data
      worldDataCache = data;
      cacheTimestamp = now;

      return data;
    } catch (error) {
      console.error('Error fetching world data:', error);

      if (retryCount < maxRetries) {
        console.log(`Retrying in ${retryDelay}ms...`);
        await new Promise(resolve => setTimeout(resolve, retryDelay));
        return fetchWorldData(retryCount + 1);
      }

      throw error;
    }
  };

  const createGeoJsonLayer = (data: any) => {
    // Remove existing layer if it exists
    if (geoJsonLayerRef.current) {
      map.removeLayer(geoJsonLayerRef.current);
    }

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
        const shouldShowLabel = showLabels && (!isSmallCountry || currentZoom >= 4);

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

    geoJsonLayerRef.current = geoJsonLayer;
    geoJsonLayer.addTo(map);

    if (!showControls) {
      setTimeout(() => {
        if (geoJsonLayer.getBounds().isValid()) {
          map.fitBounds(geoJsonLayer.getBounds().pad(0.05), {
            maxZoom: 2,
            animate: false
          });

          map.zoomIn();
        }
      }, 50);
    }
  };

  useEffect(() => {
    const loadWorldData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await fetchWorldData();
        createGeoJsonLayer(data);
      } catch (error) {
        console.error('Failed to load world data after all retries:', error);
        setError('Failed to load world map data. Please try refreshing the page.');
      } finally {
        setIsLoading(false);
      }
    };

    loadWorldData();
  }, [map, onCountryClick, onCountrySelect, getCountryStatus, showControls]);

  useEffect(() => {
    if (geoJsonLayerRef.current && !isLoading) {
      geoJsonLayerRef.current.eachLayer((layer: any) => {
        const feature = layer.feature;
        if (feature && feature.properties) {
          const countryName = getCountryName(feature.properties);
          const status = getCountryStatus(countryName);
          layer.setStyle(getCountryStyle(status));
        }
      });
    }
  }, [currentTheme.id, getCountryStatus, visitedCountries, wishlistCountries, isLoading]);

  if (error) {
    return (
      <div className="absolute inset-0 flex items-center justify-center z-20" style={{ backgroundColor: themeMapColors.background.fillColor + 'CC' }}>
        <div className="theme-surface p-6 rounded-lg shadow-lg max-w-md mx-4 theme-border border">
          <h3 className="text-lg font-semibold mb-2 theme-text-primary">Map Loading Error</h3>
          <p className="theme-text-secondary mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 rounded transition-colors text-white hover:opacity-90"
            style={{ backgroundColor: themeMapColors.visited.fillColor }}
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="absolute inset-0 flex items-center justify-center z-20" style={{ backgroundColor: themeMapColors.background.fillColor + '80' }}>
        <div className="theme-surface p-6 rounded-lg shadow-lg theme-border border">
          <div className="flex items-center space-x-3">
            <div
              className="animate-spin rounded-full h-6 w-6 border-2 border-gray-300"
              style={{ borderTopColor: themeMapColors.visited.fillColor }}
            ></div>
            <span className="theme-text-primary">Loading world map...</span>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

export default function WorldMap({ onCountryClick, showLabels = true, showControls = true }: WorldMapProps) {
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
    <div className="w-full h-full relative">
      <MapContainer
        center={[20, 0]}
        zoom={showControls ? 3 : 2}
        minZoom={1}
        maxZoom={showControls ? 10 : 4}
        zoomControl={showControls}
        scrollWheelZoom={showControls}
        doubleClickZoom={showControls}
        maxBounds={[[-90, -180], [90, 180]]}
        maxBoundsViscosity={1.0}
        style={{ height: '100%', width: '100%', backgroundColor: themeMapColors.background.fillColor }}
        className="z-0"
      >
        <MapContent
          onCountryClick={onCountryClick}
          onCountrySelect={handleCountrySelect}
          getCountryStatus={getCountryStatus}
          visitedCountries={visitedCountries}
          wishlistCountries={wishlistCountries}
          showLabels={showLabels}
          showControls={showControls}
        />
      </MapContainer>

      {showControls && (
        <button
          onClick={handleOpenManagementModal}
          className="absolute bottom-16 right-8 theme-surface rounded-full p-3 shadow-lg hover:shadow-xl transition-all theme-border border z-10"
          style={{ color: currentTheme.colors.primary }}
        >
          <Plus className="w-6 h-6" />
        </button>
      )}

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
