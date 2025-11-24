import type { Route } from "./+types/home";
import WorldMap from "../components/WorldMap";
import { useTheme } from "../hooks/useTheme";
import { useCountryData } from "../hooks/useCountryData";
import { ProtectedRoute } from "../components/ProtectedRoute";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Travel Map Tracker" },
    { name: "description", content: "Interactive world map for tracking your travels" },
  ];
}

function HomePage() {
  const { currentTheme } = useTheme();
  const { visitedCountries, wishlistCountries } = useCountryData();

  return (
    <div className="w-full mx-auto h-screen flex flex-col">
      <div className="theme-surface shadow-lg overflow-hidden flex-1 flex flex-col relative">
        <div className="flex-1">
          <WorldMap />
        </div>

        <div className="absolute top-4 right-4 theme-surface rounded-lg shadow-lg p-4 z-10 theme-border border">
          <h3 className="text-sm font-semibold theme-text-primary mb-2">Legend</h3>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: currentTheme.colors.mapVisited }}></div>
              <span className="text-xs theme-text-secondary">Visited ({visitedCountries.length})</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: currentTheme.colors.mapWishlist }}></div>
              <span className="text-xs theme-text-secondary">Wishlist ({wishlistCountries.length})</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: currentTheme.colors.mapDefault }}></div>
              <span className="text-xs theme-text-secondary">Not visited</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <ProtectedRoute>
      <HomePage />
    </ProtectedRoute>
  );
}
