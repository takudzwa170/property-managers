'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchWithAuth } from '@/lib/api';
import { useToast } from './ToastContext';

interface User {
  id: number;
  username: string;
  email: string;
  role: 'MANAGER' | 'STAFF' | 'RESIDENT';
  first_name: string;
  last_name: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (data: any) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const checkAuth = async () => {
    try {
      const res = await fetchWithAuth('/user/');
      if (res.ok) {
          const data = await res.json();
          setUser(data);
      } else {
          setUser(null);
      }
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials: any) => {
    // Ensure CSRF cookie is set before login
    await fetchWithAuth('/csrf/');
    
    const res = await fetchWithAuth('/login/', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    if (res.ok) {
      const data = await res.json();
      setUser(data);
      showToast(`Welcome back, ${data.first_name}!`, 'success');
    } else {
      showToast('Login failed. Please check your credentials.', 'error');
      throw new Error('Login failed');
    }
  };

  const logout = async () => {
    await fetchWithAuth('/logout/', { method: 'POST' });
    setUser(null);
    showToast('Logged out successfully', 'info');
    window.location.href = '/login';
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
