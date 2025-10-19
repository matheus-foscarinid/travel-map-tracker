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
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-gray-900">Travel Map Tracker</h1>
            <nav className="flex space-x-4">
              <a
                href="/"
                className="text-indigo-600 hover:text-indigo-500 font-medium"
              >
                Home
              </a>
              <a
                href="/config"
                className="text-gray-600 hover:text-gray-500 font-medium"
              >
                Config
              </a>
            </nav>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-4 border-b">
            <h2 className="text-xl font-semibold text-gray-800">Interactive World Map</h2>
            <p className="text-gray-600 mt-1">Click on any country to interact with it</p>
          </div>
          <div style={{ height: '600px' }}>
            <WorldMap onCountryClick={handleCountryClick} />
          </div>
        </div>
      </div>
    </div>
  );
}
