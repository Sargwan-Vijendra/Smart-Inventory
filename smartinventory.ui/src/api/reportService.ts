import api from './axiosInstance';

export const reportService = {
    // Matches [HttpGet("dashboard")] in ReportsController
    getDashboardStats: async () => {
        const response = await api.get('/reports/dashboard');
        return response.data;
    }
};