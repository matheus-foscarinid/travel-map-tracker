import type { Route } from "./+types/statistics";
import { Globe, Bookmark, Calendar, MapPin, Info, Trophy } from 'lucide-react';

const PROGRESS_DESCRIPTION = "You've visited {visitedCount} out of {totalCountries} UN member countries, covering {worldPercentage}% of the world!";

interface StatCardProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  value: string | number;
  iconBg: string;
  iconColor: string;
  valueColor: string;
  tooltip?: string;
}

function StatCard({ icon: Icon, title, value, iconBg, iconColor, valueColor, tooltip }: StatCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <div className={`w-8 h-8 ${iconBg} rounded-full flex items-center justify-center`}>
            <Icon className={`w-5 h-5 ${iconColor}`} />
          </div>
        </div>
        <div className="ml-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            {title}
            {tooltip && (
              <div className="group relative ml-2">
                <Info className="w-4 h-4 text-gray-400 cursor-help" />
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                  {tooltip}
                </div>
              </div>
            )}
          </h3>
          <p className={`text-2xl font-bold ${valueColor}`}>{value}</p>
        </div>
      </div>
    </div>
  );
}

interface Country {
  name: string;
  flag: string;
  continent: string;
}

interface CountryListProps {
  countries: Country[];
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
  bgColor: string;
  badgeColor: string;
  emptyMessage: string;
}

function CountryList({ countries, title, icon: Icon, iconColor, bgColor, badgeColor, emptyMessage }: CountryListProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center mb-4">
        <Icon className={`w-5 h-5 ${iconColor} mr-2`} />
        <h3 className="text-lg font-semibold text-gray-900">{title} ({countries.length})</h3>
      </div>
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {countries.length > 0 ? (
          countries.map((country, index) => (
            <div key={index} className={`flex items-center justify-between py-2 px-3 ${bgColor} rounded-lg`}>
              <div className="flex items-center">
                <span className="text-2xl mr-3">{country.flag}</span>
                <span className="font-medium text-gray-900">{country.name}</span>
              </div>
              <span className={`text-sm text-gray-500 ${badgeColor} px-2 py-1 rounded-full`}>
                {country.continent}
              </span>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Icon className="w-12 h-12 mx-auto mb-2 text-gray-300" />
            <p>{emptyMessage}</p>
          </div>
        )}
      </div>
    </div>
  );
}

interface ProgressSectionProps {
  visitedCount: number;
  totalCountries: number;
  worldPercentage: string;
}

function ProgressSection({ visitedCount, totalCountries, worldPercentage }: ProgressSectionProps) {
  const description = PROGRESS_DESCRIPTION
    .replace('{visitedCount}', visitedCount.toString())
    .replace('{totalCountries}', totalCountries.toString())
    .replace('{worldPercentage}', worldPercentage);

  return (
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
          {description}
        </div>
      </div>
    </div>
  );
}

export default function Statistics() {
  const visitedCountries = [
    { name: 'Brasil', flag: '🇧🇷', continent: 'South America' },
    { name: 'France', flag: '🇫🇷', continent: 'Europe' },
    { name: 'Germany', flag: '🇩🇪', continent: 'Europe' },
    { name: 'Portugal', flag: '🇵🇹', continent: 'Europe' },
    { name: 'Spain', flag: '🇪🇸', continent: 'Europe' },
    { name: 'Italy', flag: '🇮🇹', continent: 'Europe' },
    { name: 'United Kingdom', flag: '🇬🇧', continent: 'Europe' },
    { name: 'Argentina', flag: '🇦🇷', continent: 'South America' },
    { name: 'Italy', flag: '🇮🇹', continent: 'Europe' },
    { name: 'Paraguay', flag: '🇵🇾', continent: 'South America' },
    { name: 'Uruguay', flag: '🇺🇾', continent: 'South America' },
  ];

  const wishlistCountries = [
    { name: 'Thailand', flag: '🇹🇭', continent: 'Asia' },
    { name: 'New Zealand', flag: '🇳🇿', continent: 'Oceania' }
  ];

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
          <StatCard
            icon={Globe}
            title="Countries Visited"
            value={visitedCount}
            iconBg="bg-green-100"
            iconColor="text-green-600"
            valueColor="text-green-600"
          />
          <StatCard
            icon={MapPin}
            title="Continents"
            value={continentCount}
            iconBg="bg-purple-100"
            iconColor="text-purple-600"
            valueColor="text-purple-600"
          />
          <StatCard
            icon={Trophy}
            title="World Coverage"
            value={`${worldPercentage}%`}
            iconBg="bg-blue-100"
            iconColor="text-blue-600"
            valueColor="text-blue-600"
            tooltip="Based on 195 UN member countries"
          />
          <StatCard
            icon={Bookmark}
            title="Wishlist"
            value={wishlistCount}
            iconBg="bg-yellow-100"
            iconColor="text-yellow-600"
            valueColor="text-yellow-600"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CountryList
            countries={visitedCountries}
            title="Countries Visited"
            icon={Globe}
            iconColor="text-green-600"
            bgColor="bg-green-50"
            badgeColor="bg-green-100"
            emptyMessage="No countries visited yet"
          />
          <CountryList
            countries={wishlistCountries}
            title="Wishlist"
            icon={Bookmark}
            iconColor="text-yellow-600"
            bgColor="bg-yellow-50"
            badgeColor="bg-yellow-100"
            emptyMessage="No countries in wishlist"
          />
        </div>

        <ProgressSection
          visitedCount={visitedCount}
          totalCountries={totalCountries}
          worldPercentage={worldPercentage}
        />
      </div>
    </div>
  );
}

