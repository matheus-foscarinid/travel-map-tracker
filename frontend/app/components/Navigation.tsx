import { Link, useLocation } from 'react-router';
import { Home, Settings, BarChart3 } from 'lucide-react';

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navigation: NavItem[] = [
  {
    name: 'Home',
    href: '/',
    icon: Home
  },
  {
    name: 'Settings',
    href: '/config',
    icon: Settings
  },
  {
    name: 'Statistics',
    href: '/statistics',
    icon: BarChart3
  }
];

export default function Navigation() {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-gray-900 px-4 sm:px-6 lg:px-8">
                Travel Map Tracker
              </h1>
            </div>
          </div>

          <div className="flex space-x-2">
            {navigation.map((item) => {
              const isActive = currentPath === item.href;
              const IconComponent = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center space-x-2 px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                    isActive
                      ? 'bg-indigo-100 text-indigo-700 border-b-2 border-indigo-500'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <IconComponent className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}

