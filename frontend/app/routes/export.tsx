import type { Route } from "./+types/export";
import WorldMap from "../components/WorldMap";
import CaptureButton from "../components/CaptureButton";
import { useTheme } from "../hooks/useTheme";
import { useCountryData } from "../hooks/useCountryData";
import { getCountryFlag, getCountryContinent, TOTAL_COUNTRIES } from "../config/countries";
import { Globe, Bookmark, MapPin, Trophy } from 'lucide-react';

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Export - Travel Map Tracker" },
    { name: "description", content: "Export your travel map and statistics" },
  ];
}

interface StatCardProps {
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  title: string;
  value: string | number;
  color: string;
  theme: any;
}

function StatCard({ icon: Icon, title, value, color, theme }: StatCardProps) {
  return (
    <div
      className="rounded-lg shadow-sm p-3 border"
      style={{
        backgroundColor: theme.colors.surface,
        borderColor: theme.colors.border
      }}
    >
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <div
            className="w-5 h-5 rounded-full flex items-center justify-center"
            style={{ backgroundColor: `${color}20` }}
          >
            <Icon className="w-3 h-3" style={{ color: color }} />
          </div>
        </div>
        <div className="ml-2">
          <h3 className="text-xs font-semibold" style={{ color: theme.colors.textSecondary }}>{title}</h3>
          <p className="text-base font-bold" style={{ color: color }}>{value}</p>
        </div>
      </div>
    </div>
  );
}

export default function Export() {
  const { currentTheme } = useTheme();
  const { visitedCountries, wishlistCountries } = useCountryData();

  const handleCountryClick = (country: any) => {
    console.log('Country clicked:', country.properties.NAME || country.properties.ADMIN);
  };

  const totalCountries = TOTAL_COUNTRIES;
  const visitedCount = visitedCountries.length;
  const wishlistCount = wishlistCountries.length;
  const worldPercentage = ((visitedCount / totalCountries) * 100).toFixed(1);

  const visitedCountryObjects = visitedCountries.map(name => ({
    name,
    flag: getCountryFlag(name),
    continent: getCountryContinent(name)
  }));

  const wishlistCountryObjects = wishlistCountries.map(name => ({
    name,
    flag: getCountryFlag(name),
    continent: getCountryContinent(name)
  }));

  // Get last 10 countries from each list (assuming last added are at the end)
  const MAX_DISPLAYED = 10;
  const displayedVisited = visitedCountryObjects.slice(-MAX_DISPLAYED).reverse();
  const displayedWishlist = wishlistCountryObjects.slice(-MAX_DISPLAYED).reverse();
  const remainingVisited = visitedCount > MAX_DISPLAYED ? visitedCount - MAX_DISPLAYED : 0;
  const remainingWishlist = wishlistCount > MAX_DISPLAYED ? wishlistCount - MAX_DISPLAYED : 0;

  const continents = [...new Set(visitedCountryObjects.map(country => country.continent))];
  const continentCount = continents.length;

  return (
    <div
      className="min-h-screen relative"
      style={{
        backgroundColor: currentTheme.colors.background,
        color: currentTheme.colors.textPrimary
      }}
    >
      {/* Botão de captura posicionado fora do conteúdo capturado */}
      <div className="absolute top-4 right-4 z-50">
        <CaptureButton
          targetId="export-content"
          filename={`travel-statistics-${new Date().toISOString().split('T')[0]}`}
          label="Download PNG"
          showIcon={true}
        />
      </div>

      <div id="export-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* Header */}
        <div className="mb-3">
          <h1
            className="text-xl font-bold mb-1"
            style={{ color: currentTheme.colors.textPrimary }}
          >
            Travel Statistics
          </h1>
          <p
            className="text-sm"
            style={{ color: currentTheme.colors.textSecondary }}
          >
            Your travel progress summary
          </p>
        </div>

        {/* Map Section - Increased height to show full world */}
        <div className="map-container-export h-[60vh] mb-4 rounded-lg overflow-hidden border" style={{ borderColor: currentTheme.colors.border }}>
          <WorldMap onCountryClick={handleCountryClick} showLabels={false} showControls={false} />
        </div>

        {/* Main Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          <StatCard
            icon={Globe}
            title="Countries Visited"
            value={visitedCount}
            color={currentTheme.colors.success}
            theme={currentTheme}
          />
          <StatCard
            icon={MapPin}
            title="Continents"
            value={continentCount}
            color={currentTheme.colors.primary}
            theme={currentTheme}
          />
          <StatCard
            icon={Trophy}
            title="World Coverage"
            value={`${worldPercentage}%`}
            color={currentTheme.colors.secondary}
            theme={currentTheme}
          />
          <StatCard
            icon={Bookmark}
            title="Wishlist"
            value={wishlistCount}
            color={currentTheme.colors.warning}
            theme={currentTheme}
          />
        </div>

        {/* Progress Bar */}
        <div
          className="rounded-lg shadow-sm p-4 mb-4 border"
          style={{
            backgroundColor: currentTheme.colors.surface,
            borderColor: currentTheme.colors.border
          }}
        >
          <h3
            className="text-sm font-semibold mb-3"
            style={{ color: currentTheme.colors.textPrimary }}
          >
            Travel Progress
          </h3>
          <div>
            <div
              className="flex justify-between text-xs mb-1.5"
              style={{ color: currentTheme.colors.textSecondary }}
            >
              <span>World Coverage</span>
              <span>{visitedCount} / {totalCountries} countries</span>
            </div>
            <div
              className="w-full rounded-full h-2"
              style={{ backgroundColor: currentTheme.colors.surfaceSecondary }}
            >
              <div
                className="h-2 rounded-full"
                style={{
                  width: `${worldPercentage}%`,
                  backgroundColor: currentTheme.colors.success
                }}
              ></div>
            </div>
            <div
              className="text-xs mt-2"
              style={{ color: currentTheme.colors.textMuted }}
            >
              You've visited {visitedCount} out of {totalCountries} UN member countries, covering {worldPercentage}% of the world!
            </div>
          </div>
        </div>

        {/* Country Lists */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Visited Countries */}
          <div
            className="rounded-lg shadow-sm p-4 border"
            style={{
              backgroundColor: currentTheme.colors.surface,
              borderColor: currentTheme.colors.border
            }}
          >
            <div className="flex items-center mb-3">
              <Globe className="w-4 h-4 mr-2" style={{ color: currentTheme.colors.success }} />
              <h3
                className="text-sm font-semibold"
                style={{ color: currentTheme.colors.textPrimary }}
              >
                Countries Visited ({visitedCount})
              </h3>
            </div>
            <div className="space-y-1">
              {displayedVisited.length > 0 ? (
                <>
                  {displayedVisited.map((country, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between py-1.5 px-2 rounded"
                      style={{ backgroundColor: `${currentTheme.colors.success}10` }}
                    >
                      <div className="flex items-center">
                        <span className="text-base mr-2">{country.flag}</span>
                        <span
                          className="font-medium text-sm"
                          style={{ color: currentTheme.colors.textPrimary }}
                        >
                          {country.name}
                        </span>
                      </div>
                      <span
                        className="text-xs px-1.5 py-0.5 rounded-full"
                        style={{
                          backgroundColor: `${currentTheme.colors.success}20`,
                          color: currentTheme.colors.success
                        }}
                      >
                        {country.continent}
                      </span>
                    </div>
                  ))}
                  {remainingVisited > 0 && (
                    <div
                      className="py-1.5 px-2 rounded text-xs text-center mt-1"
                      style={{
                        backgroundColor: `${currentTheme.colors.success}10`,
                        color: currentTheme.colors.textSecondary
                      }}
                    >
                      More {remainingVisited} visited...
                    </div>
                  )}
                </>
              ) : (
                <div
                  className="text-center py-6 text-xs"
                  style={{ color: currentTheme.colors.textMuted }}
                >
                  <Globe className="w-8 h-8 mx-auto mb-2" />
                  <p>No countries visited yet</p>
                </div>
              )}
            </div>
          </div>

          {/* Wishlist Countries */}
          <div
            className="rounded-lg shadow-sm p-4 border"
            style={{
              backgroundColor: currentTheme.colors.surface,
              borderColor: currentTheme.colors.border
            }}
          >
            <div className="flex items-center mb-3">
              <Bookmark className="w-4 h-4 mr-2" style={{ color: currentTheme.colors.warning }} />
              <h3
                className="text-sm font-semibold"
                style={{ color: currentTheme.colors.textPrimary }}
              >
                Wishlist ({wishlistCount})
              </h3>
            </div>
            <div className="space-y-1">
              {displayedWishlist.length > 0 ? (
                <>
                  {displayedWishlist.map((country, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between py-1.5 px-2 rounded"
                      style={{ backgroundColor: `${currentTheme.colors.warning}10` }}
                    >
                      <div className="flex items-center">
                        <span className="text-base mr-2">{country.flag}</span>
                        <span
                          className="font-medium text-sm"
                          style={{ color: currentTheme.colors.textPrimary }}
                        >
                          {country.name}
                        </span>
                      </div>
                      <span
                        className="text-xs px-1.5 py-0.5 rounded-full"
                        style={{
                          backgroundColor: `${currentTheme.colors.warning}20`,
                          color: currentTheme.colors.warning
                        }}
                      >
                        {country.continent}
                      </span>
                    </div>
                  ))}
                  {remainingWishlist > 0 && (
                    <div
                      className="py-1.5 px-2 rounded text-xs text-center mt-1"
                      style={{
                        backgroundColor: `${currentTheme.colors.warning}10`,
                        color: currentTheme.colors.textSecondary
                      }}
                    >
                      More {remainingWishlist} in wishlist...
                    </div>
                  )}
                </>
              ) : (
                <div
                  className="text-center py-6 text-xs"
                  style={{ color: currentTheme.colors.textMuted }}
                >
                  <Bookmark className="w-8 h-8 mx-auto mb-2" />
                  <p>No countries in wishlist</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
