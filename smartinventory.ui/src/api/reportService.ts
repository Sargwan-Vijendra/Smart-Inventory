import api from './axiosInstance';
import { type DashboardData } from './types'; // FIXED: Added 'type' keyword

export const reportService = {
    // Matches [HttpGet("dashboard")] in ReportsController
    getDashboardStats: async (): Promise<DashboardData> => {
        const response = await api.get<DashboardData>('/reports/dashboard');
        return response.data;
    }
};