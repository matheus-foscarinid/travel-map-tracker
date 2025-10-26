import type { Route } from "./+types/home";
import WorldMap from "../components/WorldMap";
import { useTheme } from "../hooks/useTheme";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Travel Map Tracker" },
    { name: "description", content: "Interactive world map for tracking your travels" },
  ];
}

export default function Home() {
  const { currentTheme } = useTheme();

  const handleCountryClick = (country: any) => {
    console.log('Country clicked:', country.properties.NAME || country.properties.ADMIN);
    // You can add more functionality here, like opening a modal or navigating to country details
  };

  return (
    <div className="w-full mx-auto h-screen flex flex-col">
      <div className="theme-surface shadow-lg overflow-hidden flex-1 flex flex-col relative">
        <div className="flex-1">
          <WorldMap onCountryClick={handleCountryClick} />
        </div>

        {/* Legend */}
        <div className="absolute top-4 right-4 theme-surface rounded-lg shadow-lg p-4 z-10 theme-border border">
          <h3 className="text-sm font-semibold theme-text-primary mb-2">Legend</h3>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: currentTheme.colors.mapVisited }}></div>
              <span className="text-xs theme-text-secondary">Visited</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: currentTheme.colors.mapWishlist }}></div>
              <span className="text-xs theme-text-secondary">Wishlist</span>
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
