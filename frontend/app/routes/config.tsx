import type { Route } from "./+types/config";
import { useState } from 'react';
import { User, Mail, Palette, LogOut, Save, MapPin, Eye } from 'lucide-react';

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Config - Travel Map Tracker" },
    { name: "description", content: "Configuration page for Travel Map Tracker" },
  ];
}

export default function Config() {
  const [userName, setUserName] = useState('John Doe');
  const [userEmail, setUserEmail] = useState('john.doe@example.com');
  const [selectedTheme, setSelectedTheme] = useState('light');
  const [showCountryLabels, setShowCountryLabels] = useState(true);
  const [defaultMapView, setDefaultMapView] = useState('world');

  // TODO: add better themes
  const themes = [
    { id: 'light', name: 'Light', description: 'Clean and bright interface' },
    { id: 'dark', name: 'Dark', description: 'Easy on the eyes in low light' },
    { id: 'auto', name: 'Auto', description: 'Follows system preference' }
  ];

  const handleSaveSettings = () => {
    console.log('Saving settings:', { userName, userEmail, selectedTheme, showCountryLabels, defaultMapView });
    alert('Settings saved successfully!');
  };

  const handleSignOut = () => {
    console.log('Signing out...');
    alert('Signed out successfully!');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
          <p className="text-gray-600">Configure your travel tracking preferences and account settings.</p>
        </div>

        <div className="space-y-8">
          {/* User Profile Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-6">
              <User className="w-6 h-6 text-indigo-600 mr-3" />
              <h2 className="text-xl font-semibold text-gray-900">User Profile</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="w-4 h-4 inline mr-2" />
                  Display Name
                </label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter your display name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Mail className="w-4 h-4 inline mr-2" />
                  Email Address
                </label>
                <input
                  type="email"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter your email"
                />
              </div>
            </div>
          </div>

          {/* Theme Selection */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-6">
              <Palette className="w-6 h-6 text-indigo-600 mr-3" />
              <h2 className="text-xl font-semibold text-gray-900">Theme</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {themes.map((theme) => (
                <div
                  key={theme.id}
                  className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                    selectedTheme === theme.id
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedTheme(theme.id)}
                >
                  <div className="flex items-center mb-2">
                    <input
                      type="radio"
                      name="theme"
                      value={theme.id}
                      checked={selectedTheme === theme.id}
                      onChange={() => setSelectedTheme(theme.id)}
                      className="mr-3"
                    />
                    <span className="font-medium text-gray-900">{theme.name}</span>
                  </div>
                  <p className="text-sm text-gray-600">{theme.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Map Preferences */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-6">
              <MapPin className="w-6 h-6 text-indigo-600 mr-3" />
              <h2 className="text-xl font-semibold text-gray-900">Map Preferences</h2>
            </div>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Default Map View
                </label>
                <select
                  value={defaultMapView}
                  onChange={(e) => setDefaultMapView(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="world">World View</option>
                  <option value="europe">Europe</option>
                  <option value="north-america">North America</option>
                  <option value="asia">Asia</option>
                  <option value="africa">Africa</option>
                  <option value="south-america">South America</option>
                </select>
              </div>
              <div>
                <label className="flex items-center">
                  <Eye className="w-4 h-4 mr-2" />
                  <input
                    type="checkbox"
                    checked={showCountryLabels}
                    onChange={(e) => setShowCountryLabels(e.target.checked)}
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 mr-3"
                  />
                  <span className="text-sm text-gray-700">Show country labels by default</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <button
            onClick={handleSignOut}
            className="flex items-center px-6 py-2 text-red-600 border border-red-300 rounded-md hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </button>

          <button
            onClick={handleSaveSettings}
            className="flex items-center px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}
