import type { Route } from "./+types/login";
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router';
import { api } from '../utils/api';
import { useTheme } from '../hooks/useTheme';
import { useToast } from '../hooks/useToast';

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Login - Travel Map Tracker" },
    { name: "description", content: "Login to your Travel Map Tracker account" },
  ];
}

export default function Login() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { currentTheme } = useTheme();
  const { showError } = useToast();
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

  if (isAuthenticated) {
    navigate('/');
    return null;
  }

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      const idToken = credentialResponse.credential;

      const response = await api.post<{ token: string; user: any }>('/auth/google/verify', {
        id_token: idToken,
      });

      login(response.token, response.user);

      navigate('/');
    } catch (error: any) {
      console.error('Login failed:', error);
      showError(error.message || 'Login failed. Please try again.');
    }
  };

  const handleGoogleError = () => {
    console.error('Google login failed');
    showError('Google login failed. Please try again.');
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{
        backgroundColor: currentTheme.colors.background,
        color: currentTheme.colors.textPrimary
      }}
    >
      <div
        className="max-w-md w-full mx-4 p-8 rounded-lg shadow-lg border"
        style={{
          backgroundColor: currentTheme.colors.surface,
          borderColor: currentTheme.colors.border
        }}
      >
        <div className="text-center mb-8">
          <div className="flex flex-col items-center mb-6">
            <img
              src={currentTheme.type === 'dark' ? '/logo-dark.png' : '/logo-light.png'}
              alt="Travel Map Tracker Logo"
              className="h-24 mb-4"
            />
          </div>
          <p
            className="text-sm"
            style={{ color: currentTheme.colors.textSecondary }}
          >
            Sign in to track your travels around the world
          </p>
        </div>

        <div className="space-y-4">
          {googleClientId ? (
            <div className="flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                useOneTap
                theme={currentTheme.type === 'dark' ? 'filled_black' : 'outline'}
              />
            </div>
          ) : (
            <div
              className="p-4 rounded border text-center"
              style={{
                backgroundColor: currentTheme.colors.surfaceSecondary,
                borderColor: currentTheme.colors.border,
                color: currentTheme.colors.textSecondary
              }}
            >
              <p>Google Client ID not configured. Please set VITE_GOOGLE_CLIENT_ID in your environment.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

