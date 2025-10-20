import type { Route } from "./+types/statistics";
import { Globe, Bookmark, Calendar, MapPin, Info, Trophy } from 'lucide-react';

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Statistics - Travel Map Tracker" },
    { name: "description", content: "View your travel statistics and insights" },
  ];
}

export default function Statistics() {
  const visitedCountries = [
    { name: 'United States', flag: '🇺🇸', continent: 'North America' },
    { name: 'Canada', flag: '🇨🇦', continent: 'North America' },
    { name: 'France', flag: '🇫🇷', continent: 'Europe' },
    { name: 'Germany', flag: '🇩🇪', continent: 'Europe' },
    { name: 'Japan', flag: '🇯🇵', continent: 'Asia' },
    { name: 'Australia', flag: '🇦🇺', continent: 'Oceania' },
    { name: 'Brazil', flag: '🇧🇷', continent: 'South America' },
    { name: 'South Africa', flag: '🇿🇦', continent: 'Africa' }
  ];

  const wishlistCountries = [
    { name: 'Italy', flag: '🇮🇹', continent: 'Europe' },
    { name: 'Spain', flag: '🇪🇸', continent: 'Europe' },
    { name: 'Thailand', flag: '🇹🇭', continent: 'Asia' },
    { name: 'New Zealand', flag: '🇳🇿', continent: 'Oceania' }
  ];

  // TODO: mover pra uma constante
  const totalCountries = 195;
  const visitedCount = visitedCountries.length;
  const wishlistCount = wishlistCountries.length;
  const worldPercentage = ((visitedCount / totalCountries) * 100).toFixed(1);

  const continents = [...new Set(visitedCountries.map(country => country.continent))];
  const continentCount = continents.length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Travel Statistics</h1>
          <p className="text-gray-600">Track your travel progress and discover insights about your journeys.</p>
        </div>

        {/* Main Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <Globe className="w-5 h-5 text-green-600" />
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Countries Visited</h3>
                <p className="text-2xl font-bold text-green-600">{visitedCount}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-purple-600" />
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Continents</h3>
                <p className="text-2xl font-bold text-purple-600">{continentCount}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-blue-600" />
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  World Coverage
                  <div className="group relative ml-2">
                    <Info className="w-4 h-4 text-gray-400 cursor-help" />
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                      Based on 195 UN member countries
                    </div>
                  </div>
                </h3>
                <p className="text-2xl font-bold text-blue-600">{worldPercentage}%</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Bookmark className="w-5 h-5 text-yellow-600" />
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Wishlist</h3>
                <p className="text-2xl font-bold text-yellow-600">{wishlistCount}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <Globe className="w-5 h-5 text-green-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">Countries Visited ({visitedCount})</h3>
            </div>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {visitedCountries.length > 0 ? (
                visitedCountries.map((country, index) => (
                  <div key={index} className="flex items-center justify-between py-2 px-3 bg-green-50 rounded-lg">
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">{country.flag}</span>
                      <span className="font-medium text-gray-900">{country.name}</span>
                    </div>
                    <span className="text-sm text-gray-500 bg-green-100 px-2 py-1 rounded-full">
                      {country.continent}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Globe className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  <p>No countries visited yet</p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <Bookmark className="w-5 h-5 text-yellow-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900">Wishlist ({wishlistCount})</h3>
            </div>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {wishlistCountries.length > 0 ? (
                wishlistCountries.map((country, index) => (
                  <div key={index} className="flex items-center justify-between py-2 px-3 bg-yellow-50 rounded-lg">
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">{country.flag}</span>
                      <span className="font-medium text-gray-900">{country.name}</span>
                    </div>
                    <span className="text-sm text-gray-500 bg-yellow-100 px-2 py-1 rounded-full">
                      {country.continent}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Bookmark className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  <p>No countries in wishlist</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Travel Progress</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>World Coverage</span>
                <span>{visitedCount} / {totalCountries} countries</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${worldPercentage}%` }}
                ></div>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              You've visited <span className="font-semibold text-green-600">{visitedCount}</span> out of <span className="font-semibold">{totalCountries}</span> UN member countries, covering <span className="font-semibold text-blue-600">{worldPercentage}%</span> of the world!
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

