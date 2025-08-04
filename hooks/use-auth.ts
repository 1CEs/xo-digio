"use client"

import { useAuthStore } from "@/stores/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function useAuth() {
  const { 
    user, 
    role, 
    isAuthenticated, 
    isLoading, 
    signIn, 
    signUp, 
    signOut, 
    setGuestMode, 
    checkAuth 
  } = useAuthStore();
  
  const router = useRouter();

  // Auto-check authentication on mount
  useEffect(() => {
    if (!isAuthenticated && role !== 'guest') {
      checkAuth();
    }
  }, []);

  const handleGuestPlay = () => {
    setGuestMode();
    router.push('/play');
  };

  const handleSignInRedirect = () => {
    router.push('/member/sign-in');
  };

  const handleSignUpRedirect = () => {
    router.push('/member/sign-up');
  };

  const handlePlayRedirect = () => {
    router.push('/play');
  };

  return {
    // State
    user,
    role,
    isAuthenticated,
    isLoading,
    
    // Actions
    signIn,
    signUp,
    signOut,
    setGuestMode,
    checkAuth,
    
    // Navigation helpers
    handleGuestPlay,
    handleSignInRedirect,
    handleSignUpRedirect,
    handlePlayRedirect,
  };
}
