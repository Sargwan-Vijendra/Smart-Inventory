import api from './axiosInstance';
import { type Supplier, type SupplierRequestDto, type PagedResponse } from './types';

export const supplierService = {
    getSuppliers: async (params: { pageNumber: number, pageSize: number }) => {
        const response = await api.get<PagedResponse<Supplier>>('/Suppliers', { params });
        return response.data;
    },

    createSupplier: async (data: SupplierRequestDto) => {
        const response = await api.post('/Suppliers', data);
        return response.data;
    },

    updateSupplier: async (id: number, data: SupplierRequestDto) => {
        const response = await api.put(`/Suppliers/${id}`, data);
        return response.data;
    },

    deleteSupplier: async (id: number) => {
        const response = await api.delete(`/Suppliers/${id}`);
        return response.data;
    }
};