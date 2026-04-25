import api from './axiosInstance';
import {
    type LowStockDto,
    type StockAdjustmentRequest,
    type AdjustmentResponse,
    type StockLogViewDto,
    type PagedResponse
} from './types';

export const inventoryService = {
    // 1. Get Low Stock Report (Paginated)
    getLowStockReport: async (params: { pageNumber: number, pageSize: number }) => {
        const response = await api.get<PagedResponse<LowStockDto>>('/Inventory', { params });
        return response.data;
    },

    // 2. Adjust Stock (Patch)
    adjustStock: async (data: StockAdjustmentRequest) => {
        const response = await api.patch<AdjustmentResponse>('/Inventory/adjust', data);
        return response.data;
    },

    // 3. Get Logs for a specific product
    getStockLogs: async (productId: number) => {
        const response = await api.get<StockLogViewDto[]>(`/Inventory/logs/${productId}`);
        return response.data;
    }
};