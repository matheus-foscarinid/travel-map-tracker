import type { Route } from "./+types/config";
import { useState } from 'react';
import { User, Mail, Palette, LogOut, Save } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Config - Travel Map Tracker" },
    { name: "description", content: "Configuration page for Travel Map Tracker" },
  ];
}

export default function Config() {
  const { currentTheme, setTheme, availableThemes } = useTheme();
  const [userName, setUserName] = useState('John Doe');
  const [userEmail, setUserEmail] = useState('john.doe@example.com');

  const handleSaveSettings = () => {
    console.log('Saving settings:', { userName, userEmail, currentTheme: currentTheme.id });
    alert('Settings saved successfully!');
  };

  const handleSignOut = () => {
    console.log('Signing out...');
    alert('Signed out successfully!');
  };

  return (
    <div className="min-h-screen theme-bg">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold theme-text-primary mb-2">Settings</h1>
          <p className="theme-text-secondary">Configure your travel tracking preferences and account settings.</p>
        </div>

        <div className="space-y-8">
          {/* User Profile Section */}
          <div className="theme-surface rounded-lg shadow-md p-6 theme-border border">
            <div className="flex items-center mb-6">
              <User className="w-6 h-6 theme-primary-text mr-3" />
              <h2 className="text-xl font-semibold theme-text-primary">User Profile</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium theme-text-secondary mb-2">
                  <User className="w-4 h-4 inline mr-2" />
                  Display Name
                </label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full px-3 py-2 theme-border border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 theme-surface theme-text-primary"
                  placeholder="Enter your display name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium theme-text-secondary mb-2">
                  <Mail className="w-4 h-4 inline mr-2" />
                  Email Address
                </label>
                <input
                  type="email"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  className="w-full px-3 py-2 theme-border border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 theme-surface theme-text-primary"
                  placeholder="Enter your email"
                />
              </div>
            </div>
          </div>

          {/* Theme Selection */}
          <div className="theme-surface rounded-lg shadow-md p-6 theme-border border">
            <div className="flex items-center mb-6">
              <Palette className="w-6 h-6 theme-primary-text mr-3" />
              <h2 className="text-xl font-semibold theme-text-primary">Theme</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {availableThemes.map((theme) => (
                <div
                  key={theme.id}
                  className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                    currentTheme.id === theme.id
                      ? 'border-primary bg-primary'
                      : 'theme-border hover:border-gray-300'
                  }`}
                  onClick={() => setTheme(theme.id)}
                >
                  <div className="flex items-center mb-2">
                    <input
                      type="radio"
                      name="theme"
                      value={theme.id}
                      checked={currentTheme.id === theme.id}
                      onChange={() => setTheme(theme.id)}
                      className="mr-3"
                    />
                    <span className="font-medium theme-text-primary">{theme.name}</span>
                  </div>
                  <p className="text-sm theme-text-secondary">{theme.description}</p>
                  <div className="mt-2 flex space-x-1">
                    <div className={`w-3 h-3 rounded-full ${theme.type === 'light' ? 'bg-gray-200' : 'bg-gray-800'}`}></div>
                    <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: theme.colors.primary }}></div>
                    <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: theme.colors.success }}></div>
                    <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: theme.colors.warning }}></div>
                  </div>
                </div>
              ))}
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
            className="flex items-center px-6 py-2 theme-primary text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}
