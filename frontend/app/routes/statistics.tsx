import type { Route } from "./+types/statistics";
import { Globe, Bookmark, Calendar, MapPin, Info, Trophy } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { useCountryData } from '../hooks/useCountryData';
import { getCountryFlag, getCountryContinent, TOTAL_COUNTRIES } from '../config/countries';

const PROGRESS_DESCRIPTION = "You've visited {visitedCount} out of {totalCountries} UN member countries, covering {worldPercentage}% of the world!";

interface StatCardProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  value: string | number;
  color: string;
  tooltip?: string;
}

function StatCard({ icon: Icon, title, value, color, tooltip }: StatCardProps) {
  const { currentTheme } = useTheme();

  return (
    <div className="theme-surface rounded-lg shadow-md p-6 theme-border border">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ backgroundColor: `${color}20` }}
          >
            <Icon
              className="w-5 h-5"
            />
          </div>
        </div>
        <div className="ml-4">
          <h3 className="text-lg font-semibold theme-text-primary flex items-center">
            {title}
            {tooltip && (
              <div className="group relative ml-2">
                <Info className="w-4 h-4 theme-text-muted cursor-help" />
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 theme-surface theme-border border text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10 theme-text-primary">
                  {tooltip}
                </div>
              </div>
            )}
          </h3>
          <p className="text-2xl font-bold" style={{ color: color }}>{value}</p>
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
  color: string;
  emptyMessage: string;
}

function CountryList({ countries, title, icon: Icon, color, emptyMessage }: CountryListProps) {
  return (
    <div className="theme-surface rounded-lg shadow-md p-6 theme-border border">
      <div className="flex items-center mb-4">
        <Icon className="w-5 h-5 mr-2" />
        <h3 className="text-lg font-semibold theme-text-primary">{title} ({countries.length})</h3>
      </div>
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {countries.length > 0 ? (
          countries.map((country, index) => (
            <div
              key={index}
              className="flex items-center justify-between py-2 px-3 rounded-lg"
              style={{ backgroundColor: `${color}10` }}
            >
              <div className="flex items-center">
                <span className="text-2xl mr-3">{country.flag}</span>
                <span className="font-medium theme-text-primary">{country.name}</span>
              </div>
              <span
                className="text-sm px-2 py-1 rounded-full"
                style={{
                  backgroundColor: `${color}20`,
                  color: color
                }}
              >
                {country.continent}
              </span>
            </div>
          ))
        ) : (
          <div className="text-center py-8 theme-text-muted">
            <Icon className="w-12 h-12 mx-auto mb-2 theme-text-muted" />
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
    <div className="mt-8 theme-surface rounded-lg shadow-md p-6 theme-border border">
      <h3 className="text-lg font-semibold theme-text-primary mb-4">Travel Progress</h3>
      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-sm theme-text-secondary mb-2">
            <span>World Coverage</span>
            <span>{visitedCount} / {totalCountries} countries</span>
          </div>
          <div className="w-full theme-surface-secondary rounded-full h-3">
            <div
              className="bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${worldPercentage}%` }}
            ></div>
          </div>
        </div>
        <div className="text-sm theme-text-muted">
          {description}
        </div>
      </div>
    </div>
  );
}

export default function Statistics() {
  const { currentTheme } = useTheme();
  const { visitedCountries, wishlistCountries } = useCountryData();

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

  const continents = [...new Set(visitedCountryObjects.map(country => country.continent))];
  const continentCount = continents.length;

  return (
    <div className="min-h-screen theme-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold theme-text-primary mb-2">Travel Statistics</h1>
          <p className="theme-text-secondary">Track your travel progress and discover insights about your journeys.</p>
        </div>

        {/* Main Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={Globe}
            title="Countries Visited"
            value={visitedCount}
            color={currentTheme.colors.success}
          />
          <StatCard
            icon={MapPin}
            title="Continents"
            value={continentCount}
            color={currentTheme.colors.primary}
          />
          <StatCard
            icon={Trophy}
            title="World Coverage"
            value={`${worldPercentage}%`}
            color={currentTheme.colors.secondary}
            tooltip={`Based on ${TOTAL_COUNTRIES} UN member countries`}
          />
          <StatCard
            icon={Bookmark}
            title="Wishlist"
            value={wishlistCount}
            color={currentTheme.colors.warning}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CountryList
            countries={visitedCountryObjects}
            title="Countries Visited"
            icon={Globe}
            color={currentTheme.colors.success}
            emptyMessage="No countries visited yet"
          />
          <CountryList
            countries={wishlistCountryObjects}
            title="Wishlist"
            icon={Bookmark}
            color={currentTheme.colors.warning}
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

