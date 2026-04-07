"use client"

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { api } from '@/lib/api/auth';

interface User {
  email: string;
  full_name?: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string, fullName?: string) => Promise<void>;
  tokenExpiryTime: number | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [tokenExpiryTime, setTokenExpiryTime] = useState<number | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (tokenExpiryTime) {
      const timeUntilExpiry = tokenExpiryTime - Date.now();
      if (timeUntilExpiry > 0) {
        const timer = setTimeout(() => {
          // Token expired, show session expired message and redirect to login
          handleSessionExpired();
        }, timeUntilExpiry);
        
        return () => clearTimeout(timer);
      }
    }
  }, [tokenExpiryTime]);

  const handleSessionExpired = async () => {
    setUser(null);
    setTokenExpiryTime(null);
    await api.logout().catch(() => {}); // Clear cookie on server
    if (pathname !== '/login' && pathname !== '/register') {
      router.replace('/login?session=expired');
    }
  };

  const checkAuth = async () => {
    try {
      // First verify if token is valid
      const verifyResult = await api.verifyToken();
      
      if (verifyResult.valid) {
        // Token is valid, get user data
        const userData = await api.getCurrentUser();
        setUser(userData);
        
        // Set token expiry time (30 minutes from now)
        setTokenExpiryTime(Date.now() + 30 * 60 * 1000);
      } else {
        // Token is invalid or expired
        setUser(null);
        setTokenExpiryTime(null);
      }
    } catch (error) {
      setUser(null);
      setTokenExpiryTime(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await api.login({ username: email, password });
      const userData = await api.getCurrentUser();
      setUser(userData);
      
      // Set token expiry time based on server response (30 minutes from now)
      setTokenExpiryTime(Date.now() + response.expires_in * 1000);
      
      const roleRoutes: Record<string, string> = {
          student: "/dashboard/student",
          admin: "/dashboard/admin",
        }

        const dashboardRoute = roleRoutes[userData.role] || "/dashboard"
        router.push(dashboardRoute);

    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await api.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setTokenExpiryTime(null);
      router.push('/login');
    }
  };

  const register = async (email: string, password: string, fullName?: string) => {
    await api.register({ email, password, full_name: fullName });
    await login(email, password);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, register, tokenExpiryTime }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}