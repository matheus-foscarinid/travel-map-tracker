import type { Route } from "./+types/config";
import { useState, useEffect } from 'react';
import { User as UserIcon, Mail, Palette, LogOut, Save, Trash2 } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import { useAuth, type User } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { api } from '../utils/api';
import { ProtectedRoute } from '../components/ProtectedRoute';
import ConfirmationDialog from '../components/ConfirmationDialog';

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Config - Travel Map Tracker" },
    { name: "description", content: "Configuration page for Travel Map Tracker" },
  ];
}

function ConfigPage() {
  const { currentTheme, setTheme, availableThemes } = useTheme();
  const { user, updateUser, logout } = useAuth();
  const { showSuccess, showError } = useToast();
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [saving, setSaving] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (user) {
      setUserName(user.name || '');
      setUserEmail(user.email || '');
    }
  }, [user]);

  const handleSaveSettings = async () => {
    if (!user) return;

    setSaving(true);
    try {
      const updatedUser = await api.put<User>('/auth/users/me', {
        name: userName,
        email: userEmail,
      });
      updateUser(updatedUser);
      showSuccess('Settings saved successfully!');
    } catch (error: any) {
      console.error('Failed to save settings:', error);
      showError(error.message || 'Failed to save settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleSignOut = () => {
    logout();
  };

  const handleDeleteAccount = async () => {
    if (!user) return;

    setDeleting(true);
    try {
      await api.delete('/auth/users/me');
      showSuccess('Account deleted successfully');
      logout();
    } catch (error: any) {
      console.error('Failed to delete account:', error);
      showError(error.message || 'Failed to delete account. Please try again.');
      setDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  return (
    <div className="min-h-screen theme-bg">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold theme-text-primary mb-2">Settings</h1>
          <p className="theme-text-secondary">Configure your travel tracking preferences and account settings.</p>
        </div>

        <div className="space-y-8">
          <div className="theme-surface rounded-lg shadow-md p-6 theme-border border">
            <div className="flex items-center mb-6">
              <UserIcon className="w-6 h-6 theme-primary-text mr-3" />
              <h2 className="text-xl font-semibold theme-text-primary">User Profile</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium theme-text-secondary mb-2">
                  <UserIcon className="w-4 h-4 inline mr-2" />
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

        <div className="mt-8 space-y-6">
          <div className="theme-surface rounded-lg shadow-md p-6 theme-border border border-red-200">
            <div className="flex items-center mb-4">
              <Trash2 className="w-6 h-6 text-red-600 mr-3" />
              <h2 className="text-xl font-semibold theme-text-primary">Danger Zone</h2>
            </div>
            <p className="theme-text-secondary mb-4 text-sm">
              Once you delete your account, there is no going back. This will permanently delete your account and all associated data.
            </p>
            <button
              onClick={() => setShowDeleteDialog(true)}
              className="flex items-center px-6 py-2 text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Account
            </button>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <button
              onClick={handleSignOut}
              className="flex items-center px-6 py-2 text-red-600 border border-red-300 rounded-md hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </button>

            <button
              onClick={handleSaveSettings}
              disabled={saving}
              className="flex items-center px-6 py-2 theme-primary text-white rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4 mr-2" />
              {saving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </div>

        <ConfirmationDialog
          isOpen={showDeleteDialog}
          onClose={() => !deleting && setShowDeleteDialog(false)}
          onConfirm={handleDeleteAccount}
          title="Delete Account"
          message="Are you sure you want to delete your account? This action cannot be undone. All your data, including marked countries and visit history, will be permanently deleted."
          confirmText="Delete Account"
          cancelText="Cancel"
          isLoading={deleting}
        />
      </div>
    </div>
  );
}

export default function Config() {
  return (
    <ProtectedRoute>
      <ConfigPage />
    </ProtectedRoute>
  );
}
