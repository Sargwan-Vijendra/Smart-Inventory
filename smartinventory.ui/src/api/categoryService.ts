import api from './axiosInstance';
import { type Category, type CategoryCreateDto, type PagedResponse } from './types';

export const categoryService = {
    // 1. Get Paginated List (Matching your backend Controller)
    getCategories: async (params: { pageNumber: number, pageSize: number }) => {
        const response = await api.get<PagedResponse<Category>>('/Categories', { params });
        return response.data;
    },

    // 2. Create Category
    createCategory: async (categoryData: CategoryCreateDto) => {
        const response = await api.post('/Categories', categoryData);
        return response.data;
    },

    // 3. Delete Category
    deleteCategory: async (id: number) => {
        const response = await api.delete(`/Categories/${id}`);
        return response.data;
    }
};