// Zustand Store for Application State
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, Language } from '@/types';

interface AuthState {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    setUser: (user: User | null) => void;
    setLoading: (loading: boolean) => void;
    logout: () => void;
}

interface AppState {
    language: Language;
    sidebarOpen: boolean;
    setLanguage: (lang: Language) => void;
    toggleSidebar: () => void;
    setSidebarOpen: (open: boolean) => void;
}

// Auth Store
export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            isLoading: true,
            isAuthenticated: false,
            setUser: (user) => set({
                user,
                isAuthenticated: !!user,
                isLoading: false
            }),
            setLoading: (isLoading) => set({ isLoading }),
            logout: () => set({
                user: null,
                isAuthenticated: false
            }),
        }),
        {
            name: 'noble-auth',
            partialize: (state) => ({ user: state.user }),
        }
    )
);

// App State Store
export const useAppStore = create<AppState>()(
    persist(
        (set) => ({
            language: 'mn',
            sidebarOpen: true,
            setLanguage: (language) => set({ language }),
            toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
            setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
        }),
        {
            name: 'noble-app',
        }
    )
);
