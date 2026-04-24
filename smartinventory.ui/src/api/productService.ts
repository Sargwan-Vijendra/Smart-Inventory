import api from './axiosInstance';
import { type Product, type PagedResponse, type Category, type Supplier } from './types';
interface ProductCreateRequest {
    sku: string;
    name: string;
    categoryId: number;
    supplyId: number;
    price: number;
    minimumQty: number;
}

// Add this interface to the top of productService.ts
interface ProductUpdateRequest {
    id: number;
    sku: string;
    name: string;
    price: number;
    minimumQty: number;
}

export const productService = {
    getProducts: async (params: {
        search?: string,
        categoryId?: number,
        supplierId?: number,
        pageNumber: number,
        pageSize: number
    }) => {
        const response = await api.get<PagedResponse<Product>>('/product/list', { params });
        return response.data;
    },

    createProduct: async (productData: ProductCreateRequest) => {
        const response = await api.post('/product/create', productData);
        return response.data;
    }, // <--- Fixed: Added missing brace and comma here

    // Matches [HttpPut("Update")]
    updateProduct: async (productData: ProductUpdateRequest) => {
        const response = await api.put('/product/update', productData);
        return response.data;
    },

    deleteProduct: async (id: number) => {
        const response = await api.put(`/product/delete/${id}`);
        return response.data;
    },

    getCategories: async () => {
        const response = await api.get<Category[]>('/categories');
        return response.data;
    },

    getSuppliers: async () => {
        const response = await api.get<Supplier[]>('/suppliers');
        return response.data;
    }
};