import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User, UserRole } from '../types.ts';
import { api, getStoredToken, setStoredToken, removeStoredToken } from '../services/api.ts';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  demoLogin: (role: UserRole) => Promise<void>;
  register: (data: { name: string; email: string; password: string; role: 'patient' | 'doctor'; phone?: string }) => Promise<void>;
  logout: () => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(getStoredToken());
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  useEffect(() => {
    async function initAuth() {
      const stored = getStoredToken();
      if (!stored) {
        setIsLoading(false);
        return;
      }
      try {
        const res = await api.getMe();
        setUser(res.user);
      } catch (err) {
        console.warn('Session expired or invalid, clearing token');
        removeStoredToken();
        setToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    }
    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const res = await api.login({ email, password });
    setStoredToken(res.token);
    setToken(res.token);
    setUser(res.user);
    showToast(`Welcome back, ${res.user.name}`);
  };

  const demoLogin = async (role: UserRole) => {
    const res = await api.login({ demoRole: role });
    setStoredToken(res.token);
    setToken(res.token);
    setUser(res.user);
    showToast(`Logged in as ${role.toUpperCase()}: ${res.user.name}`);
  };

  const register = async (data: {
    name: string;
    email: string;
    password: string;
    role: 'patient' | 'doctor';
    phone?: string;
  }) => {
    const res = await api.register(data);
    setStoredToken(res.token);
    setToken(res.token);
    setUser(res.user);
    showToast(`Account created successfully! Welcome to MediConnect.`);
  };

  const logout = () => {
    removeStoredToken();
    setToken(null);
    setUser(null);
    showToast('You have been signed out safely', 'info');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        demoLogin,
        register,
        logout,
        showToast,
      }}
    >
      {children}
      {/* Toast Notification Container */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto px-4 py-3 rounded-xl border shadow-lg text-sm flex items-center gap-3 transition-all transform animate-in slide-in-from-bottom-5 ${
              toast.type === 'success'
                ? 'bg-white border-teal-500/30 text-teal-950'
                : toast.type === 'error'
                ? 'bg-white border-rose-500/30 text-rose-950'
                : 'bg-white border-slate-300 text-slate-800'
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full shrink-0 ${
                toast.type === 'success'
                  ? 'bg-teal-600'
                  : toast.type === 'error'
                  ? 'bg-rose-600'
                  : 'bg-blue-600'
              }`}
            />
            <span className="font-medium">{toast.message}</span>
          </div>
        ))}
      </div>
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
