export interface Product {
    id: number;
    sku: string;
    name: string;
    category: string;
    supplier: string;
    price: number;
    quantity: number;
}

export interface PagedResponse<T> {
    items: T[];
    totalCount: number;
    pageNumber: number;
    pageSize: number;
}

// ADD THESE TWO INTERFACES BELOW
export interface Category {
    id: number;
    name: string;
}

export interface Supplier {
    id: number;
    name: string;
}

export interface PagedResponse<T> {
    items: T[];
    totalCount: number;
    pageNumber: number;
    pageSize: number;
    totalPages: number; // Ensure this is here
}