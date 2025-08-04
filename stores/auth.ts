import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { AuthClient, User } from "@/lib/auth-client";

export type UserRole = 'guest' | 'user';

interface AuthStore {
    user: User | null;
    role: UserRole;
    isLoading: boolean;
    isAuthenticated: boolean;
    
    signIn: (usernameOrEmail: string, password: string) => Promise<{ success: boolean; message: string }>;
    signUp: (username: string, email: string, password: string, confirmPassword: string) => Promise<{ success: boolean; message: string }>;
    signOut: () => Promise<void>;
    setGuestMode: () => void;
    checkAuth: () => Promise<void>;
    clearAuth: () => void;
}

export const useAuthStore = create<AuthStore>()(persist(
    (set, get) => ({
        user: null,
        role: 'guest',
        isLoading: false,
        isAuthenticated: false,

        signIn: async (usernameOrEmail: string, password: string) => {
            set({ isLoading: true });
            
            try {
                const response = await AuthClient.signIn(usernameOrEmail, password);
                
                if (response.success && response.data) {
                    set({ 
                        user: response.data, 
                        role: 'user',
                        isAuthenticated: true,
                        isLoading: false 
                    });
                    return { success: true, message: response.message };
                } else {
                    set({ isLoading: false });
                    return { 
                        success: false, 
                        message: response.message || 'Sign in failed' 
                    };
                }
            } catch (error) {
                set({ isLoading: false });
                return { 
                    success: false, 
                    message: 'Network error occurred' 
                };
            }
        },

        signUp: async (username: string, email: string, password: string, confirmPassword: string) => {
            set({ isLoading: true });
            
            try {
                const response = await AuthClient.signUp(username, email, password, confirmPassword);
                
                if (response.success && response.data) {
                    set({ 
                        user: response.data, 
                        role: 'user',
                        isAuthenticated: true,
                        isLoading: false 
                    });
                    return { success: true, message: response.message };
                } else {
                    set({ isLoading: false });
                    return { 
                        success: false, 
                        message: response.message || 'Sign up failed' 
                    };
                }
            } catch (error) {
                set({ isLoading: false });
                return { 
                    success: false, 
                    message: 'Network error occurred' 
                };
            }
        },

        signOut: async () => {
            set({ isLoading: true });
            
            try {
                await AuthClient.signOut();
                set({ 
                    user: null, 
                    role: 'guest',
                    isAuthenticated: false,
                    isLoading: false 
                });
            } catch (error) {
                set({ 
                    user: null, 
                    role: 'guest',
                    isAuthenticated: false,
                    isLoading: false 
                });
            }
        },

        setGuestMode: () => {
            set({ 
                user: null, 
                role: 'guest',
                isAuthenticated: false,
                isLoading: false 
            });
        },

        checkAuth: async () => {
            set({ isLoading: true });
            
            try {
                const response = await AuthClient.getCurrentUser();
                
                if (response.success && response.data) {
                    set({ 
                        user: response.data, 
                        role: 'user',
                        isAuthenticated: true,
                        isLoading: false 
                    });
                } else {
                    set({ 
                        user: null, 
                        role: 'guest',
                        isAuthenticated: false,
                        isLoading: false 
                    });
                }
            } catch (error) {
                set({ 
                    user: null, 
                    role: 'guest',
                    isAuthenticated: false,
                    isLoading: false 
                });
            }
        },

        clearAuth: () => {
            set({ 
                user: null, 
                role: 'guest',
                isAuthenticated: false,
                isLoading: false 
            });
        }
    }),
    {
        name: "auth-storage",
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({ 
            user: state.user, 
            role: state.role,
            // Don't persist isAuthenticated - always verify on load
        }),
        onRehydrateStorage: () => (state) => {
            // When the store is hydrated, verify authentication status
            if (state) {
                // Always check auth on rehydration to ensure token is still valid
                // The checkAuth function will handle setting the correct state
                state.checkAuth();
            }
        },
    }
));
