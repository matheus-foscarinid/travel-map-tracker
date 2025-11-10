import { Link, useLocation } from 'react-router';
import { Home, Settings, BarChart3, Menu, X } from 'lucide-react';
import { useTheme }  from '../hooks/useTheme';
import { useState } from 'react';


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
  const { currentTheme } = useTheme();
  const isDark = currentTheme.type === 'dark';
  const logo = isDark ? '/logo-dark.png' : '/logo-light.png';
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <nav className="theme-surface shadow-lg theme-border border-b">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 px-4 sm:px-6 lg:px-8">
              <Link to="/" onClick={closeMobileMenu}>
                <img src={logo} alt="Logo" className="h-8 sm:h-10" />
              </Link>
            </div>
          </div>

          <div className="hidden md:flex space-x-2 px-4">
            {navigation.map((item) => {
              const isActive = currentPath === item.href;
              const IconComponent = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    isActive
                      ? 'theme-primary text-white'
                      : 'theme-text-secondary hover:theme-text-primary hover:theme-surface-secondary'
                  }`}
                >
                  <IconComponent className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>

          <div className="md:hidden px-4">
            <button
              onClick={toggleMobileMenu}
              className="theme-text-primary hover:theme-text-secondary transition-colors p-2"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t theme-border">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item) => {
                const isActive = currentPath === item.href;
                const IconComponent = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={closeMobileMenu}
                    className={`flex items-center space-x-3 px-3 py-3 rounded-md text-base font-medium transition-colors duration-200 ${
                      isActive
                        ? 'theme-primary text-white'
                        : 'theme-text-secondary hover:theme-text-primary hover:theme-surface-secondary'
                    }`}
                  >
                    <IconComponent className="w-5 h-5" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

