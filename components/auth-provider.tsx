"use client"

import { useEffect } from 'react';
import { useAuthStore } from '@/stores/auth';

interface AuthProviderProps {
  children: React.ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const { checkAuth, isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated || !user) {
      checkAuth();
    }
  }, [checkAuth, isAuthenticated, user]);

  return <>{children}</>;
}
