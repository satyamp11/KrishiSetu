import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiService, AuthUser } from '../services/apiService';

export type AuthModalMode = 'login' | 'register' | null;

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  authModalMode: AuthModalMode;
  openAuthModal: (mode: 'login' | 'register') => void;
  closeAuthModal: () => void;
  login: (credentials: { emailOrPhone: string; password: string }) => Promise<{ success: boolean; message?: string }>;
  register: (data: {
    name: string;
    emailOrPhone: string;
    password: string;
    state: string;
    district: string;
    village?: string;
    primaryCrop?: string;
  }) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  setOnAuthSuccessCallback: (cb: () => void) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_STORAGE_KEY = 'krishi_shield_auth_token';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem(TOKEN_STORAGE_KEY));
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [authModalMode, setAuthModalMode] = useState<AuthModalMode>(null);
  const [onAuthSuccessCb, setOnAuthSuccessCb] = useState<(() => void) | null>(null);

  // Validate and restore user session on initial load or token change
  useEffect(() => {
    async function restoreSession() {
      const storedToken = localStorage.getItem(TOKEN_STORAGE_KEY);
      if (!storedToken) {
        setUser(null);
        setToken(null);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const response = await apiService.getCurrentUser(storedToken);
        if (response.success && response.user) {
          setUser(response.user);
          setToken(storedToken);
        } else {
          localStorage.removeItem(TOKEN_STORAGE_KEY);
          setUser(null);
          setToken(null);
        }
      } catch (err) {
        console.error('Session restoration failed:', err);
        localStorage.removeItem(TOKEN_STORAGE_KEY);
        setUser(null);
        setToken(null);
      } finally {
        setIsLoading(false);
      }
    }

    restoreSession();
  }, []);

  const openAuthModal = (mode: 'login' | 'register') => {
    setAuthModalMode(mode);
  };

  const closeAuthModal = () => {
    setAuthModalMode(null);
  };

  const setOnAuthSuccessCallback = (cb: () => void) => {
    setOnAuthSuccessCb(() => cb);
  };

  const login = async (credentials: { emailOrPhone: string; password: string }) => {
    const res = await apiService.loginUser(credentials);
    if (res.success && res.token && res.user) {
      localStorage.setItem(TOKEN_STORAGE_KEY, res.token);
      setToken(res.token);
      setUser(res.user);
      closeAuthModal();
      if (onAuthSuccessCb) {
        onAuthSuccessCb();
      }
      return { success: true };
    }
    return { success: false, message: res.message || 'Login failed. Invalid credentials.' };
  };

  const register = async (data: {
    name: string;
    emailOrPhone: string;
    password: string;
    state: string;
    district: string;
    village?: string;
    primaryCrop?: string;
  }) => {
    const res = await apiService.registerUser(data);
    if (res.success && res.token && res.user) {
      localStorage.setItem(TOKEN_STORAGE_KEY, res.token);
      setToken(res.token);
      setUser(res.user);
      closeAuthModal();
      if (onAuthSuccessCb) {
        onAuthSuccessCb();
      }
      return { success: true };
    }
    return { success: false, message: res.message || 'Registration failed.' };
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    setToken(null);
    setUser(null);
    apiService.logoutUser();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        authModalMode,
        openAuthModal,
        closeAuthModal,
        login,
        register,
        logout,
        setOnAuthSuccessCallback
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
