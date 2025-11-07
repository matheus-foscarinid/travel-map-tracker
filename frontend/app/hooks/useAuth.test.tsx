import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router';
import { AuthProvider, useAuth } from './useAuth';
import { api } from '../utils/api';

vi.mock('../utils/api');
vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

describe('useAuth', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('should throw error when used outside provider', () => {
    expect(() => {
      renderHook(() => useAuth());
    }).toThrow('useAuth must be used within an AuthProvider');
  });

  it('should initialize with no user when no token', async () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: ({ children }) => (
        <BrowserRouter>
          <AuthProvider>{children}</AuthProvider>
        </BrowserRouter>
      ),
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('should load user from token', async () => {
    const mockUser = {
      id: 1,
      username: 'testuser',
      email: 'test@example.com',
      name: 'Test User',
      created_at: '2024-01-01',
      updated_at: '2024-01-01',
    };

    localStorage.setItem('auth_token', 'test-token');
    vi.mocked(api.get).mockResolvedValue(mockUser);

    const { result } = renderHook(() => useAuth(), {
      wrapper: ({ children }) => (
        <BrowserRouter>
          <AuthProvider>{children}</AuthProvider>
        </BrowserRouter>
      ),
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.user).toEqual(mockUser);
    expect(result.current.isAuthenticated).toBe(true);
  });

  it('should login user', () => {
    const mockUser = {
      id: 1,
      username: 'testuser',
      email: 'test@example.com',
      name: 'Test User',
      created_at: '2024-01-01',
      updated_at: '2024-01-01',
    };

    const { result } = renderHook(() => useAuth(), {
      wrapper: ({ children }) => (
        <BrowserRouter>
          <AuthProvider>{children}</AuthProvider>
        </BrowserRouter>
      ),
    });

    act(() => {
      result.current.login('test-token', mockUser);
    });

    expect(result.current.user).toEqual(mockUser);
    expect(localStorage.getItem('auth_token')).toBe('test-token');
  });

  it('should logout user', () => {
    localStorage.setItem('auth_token', 'test-token');

    const { result } = renderHook(() => useAuth(), {
      wrapper: ({ children }) => (
        <BrowserRouter>
          <AuthProvider>{children}</AuthProvider>
        </BrowserRouter>
      ),
    });

    act(() => {
      result.current.logout();
    });

    expect(result.current.user).toBeNull();
    expect(localStorage.getItem('auth_token')).toBeNull();
  });

  it('should update user', () => {
    const mockUser = {
      id: 1,
      username: 'testuser',
      email: 'test@example.com',
      name: 'Test User',
      created_at: '2024-01-01',
      updated_at: '2024-01-01',
    };

    const { result } = renderHook(() => useAuth(), {
      wrapper: ({ children }) => (
        <BrowserRouter>
          <AuthProvider>{children}</AuthProvider>
        </BrowserRouter>
      ),
    });

    act(() => {
      result.current.updateUser(mockUser);
    });

    expect(result.current.user).toEqual(mockUser);
  });
});


