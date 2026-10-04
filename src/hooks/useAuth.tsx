import React, { createContext, useContext, useState, useEffect } from 'react';
import { Profile, UserRole } from '../types/database';
import { dataService, DEMO_ACCOUNTS } from '../lib/supabase';

interface AuthContextType {
  user: Profile | null;
  loading: boolean;
  isAdmin: boolean;
  signIn: (email: string, password?: string) => Promise<{ error?: string }>;
  signUp: (fullName: string, email: string, password?: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<void>;
  loginAsDemoUser: () => Promise<void>;
  loginAsDemoAdmin: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    try {
      const current = await dataService.getCurrentUser();
      setUser(current);
    } catch (e) {
      console.error('Error refreshing user:', e);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const signIn = async (email: string, password?: string) => {
    setLoading(true);
    try {
      const res = await dataService.signIn(email, password);
      if (res.error) return { error: res.error };
      setUser(res.profile);
      return {};
    } catch (e: any) {
      return { error: e.message || 'Failed to sign in' };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (fullName: string, email: string, password?: string) => {
    setLoading(true);
    try {
      const res = await dataService.signUp(fullName, email, password);
      if (res.error) return { error: res.error };
      setUser(res.profile);
      return {};
    } catch (e: any) {
      return { error: e.message || 'Failed to sign up' };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    await dataService.signOut();
    setUser(null);
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return;
    const updated = await dataService.updateProfile(user.id, updates);
    setUser(updated);
  };

  const loginAsDemoUser = async () => {
    setLoading(true);
    const res = await dataService.signIn(DEMO_ACCOUNTS.USER.email);
    setUser(res.profile);
    setLoading(false);
  };

  const loginAsDemoAdmin = async () => {
    setLoading(true);
    const res = await dataService.signIn(DEMO_ACCOUNTS.ADMIN.email);
    setUser(res.profile);
    setLoading(false);
  };

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAdmin,
        signIn,
        signUp,
        signOut,
        updateProfile,
        loginAsDemoUser,
        loginAsDemoAdmin,
        refreshUser,
      }}
    >
      {children}
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
