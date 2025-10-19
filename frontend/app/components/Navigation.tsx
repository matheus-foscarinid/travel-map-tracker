import { Link, useLocation } from 'react-router';

interface NavItem {
  name: string;
  href: string;
  icon: string;
}

const navigation: NavItem[] = [
  {
    name: 'Home',
    href: '/',
    icon: '🏠'
  },
  {
    name: 'Settings',
    href: '/config',
    icon: '⚙️'
  },
  {
    name: 'Statistics',
    href: '/statistics',
    icon: '📊'
  }
];

export default function Navigation() {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-gray-900">
                Travel Map Tracker
              </h1>
            </div>
          </div>

          <div className="flex space-x-2">
            {navigation.map((item) => {
              const isActive = currentPath === item.href;
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
                  <span className="text-lg">{item.icon}</span>
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
