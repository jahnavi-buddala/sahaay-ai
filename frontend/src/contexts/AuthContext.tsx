import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { loginUser, signupUser } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoggedIn: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<User>;
  signup: (payload: { email: string; password: string; full_name: string; role?: string }) => Promise<User>;
  logout: () => void;
  switchDemoUser: (role: 'admin' | 'commuter') => Promise<User>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('sahaay_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('sahaay_token');
  });

  useEffect(() => {
    if (user && token) {
      localStorage.setItem('sahaay_user', JSON.stringify(user));
      localStorage.setItem('sahaay_token', token);
    } else {
      localStorage.removeItem('sahaay_user');
      localStorage.removeItem('sahaay_token');
    }
  }, [user, token]);

  const login = async (email: string, password: string): Promise<User> => {
    const res = await loginUser(email.trim(), password.trim());
    setUser(res.user);
    setToken(res.token);
    return res.user;
  };

  const signup = async (payload: { email: string; password: string; full_name: string; role?: string }): Promise<User> => {
    const res = await signupUser(payload);
    setUser(res.user);
    setToken(res.token);
    return res.user;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
  };

  const switchDemoUser = async (role: 'admin' | 'commuter'): Promise<User> => {
    if (role === 'admin') {
      return await login('admin@sahaay.org', 'SahaayAdmin@2026');
    } else {
      return await login('commuter@sahaay.org', 'Commuter@2026');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoggedIn: !!user,
        isAdmin: user?.role === 'admin',
        login,
        signup,
        logout,
        switchDemoUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
