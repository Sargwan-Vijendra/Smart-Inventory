import api from './axiosInstance';

export const authService = {
    // This function sends the username and password to your AuthController
    login: async (username: string, password: string) => {
        // Matches [HttpPost("login")] in your AuthController
        const response = await api.post('/auth/login', { username, password });
        return response.data; // This returns your AuthResponse DTO
    }
};