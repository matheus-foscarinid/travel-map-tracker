import type { Route } from "./+types/home";
import WorldMap from "../components/WorldMap";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Travel Map Tracker" },
    { name: "description", content: "Interactive world map for tracking your travels" },
  ];
}

export default function Home() {
  const handleCountryClick = (country: any) => {
    console.log('Country clicked:', country.properties.NAME || country.properties.ADMIN);
    // You can add more functionality here, like opening a modal or navigating to country details
  };

  return (
    <div className="w-full mx-auto h-screen flex flex-col">
      <div className="bg-white shadow-lg overflow-hidden flex-1 flex flex-col relative">
        <div className="flex-1">
          <WorldMap onCountryClick={handleCountryClick} />
        </div>

        {/* Legend */}
        <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-4 z-10">
          <h3 className="text-sm font-semibold text-gray-800 mb-2">Legend</h3>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: '#10B981' }}></div>
              <span className="text-xs text-gray-600">Visited</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: '#F59E0B' }}></div>
              <span className="text-xs text-gray-600">Wishlist</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: '#9CA3AF' }}></div>
              <span className="text-xs text-gray-600">Not visited</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
