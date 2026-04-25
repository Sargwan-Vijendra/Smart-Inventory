import api from './axiosInstance';
import { type AuthResponse, type RegisterRequest, type UserProfile } from './types';

export const authService = {
    login: async (username: string, password: string): Promise<AuthResponse> => {
        const response = await api.post<AuthResponse>('/auth/login', { username, password });
        return response.data;
    },

    // Matches [HttpPost("register")]
    register: async (data: RegisterRequest): Promise<string> => {
        const response = await api.post('/auth/register', data);
        return response.data; // Returns "User registered successfully"
    },

    // Matches [HttpGet("me")]
    getMe: async (): Promise<UserProfile> => {
        const response = await api.get<UserProfile>('/auth/me');
        return response.data;
    }
};