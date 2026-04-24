import { create } from 'zustand';

interface AuthState {
    token: string | null;
    role: string | null;
    // setAuth will be called when login is successful
    setAuth: (token: string, role: string) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    // Check localStorage so the user stays logged in even after refreshing the page
    token: localStorage.getItem('token'),
    role: localStorage.getItem('role'),

    setAuth: (token, role) => {
        localStorage.setItem('token', token);
        localStorage.setItem('role', role);
        set({ token, role });
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        set({ token: null, role: null });
    }
}));