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
    totalPages: number; // Ensure this is here
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

export interface CategoryCreateDto {
    name: string;
}


export interface Supplier {
    id: number;
    name: string;
    email: string;
    phone: string;
}

export interface SupplierRequestDto {
    name: string;
    email: string;
    phone: string;
}


export interface LowStockDto {
    productId: number;
    sku: string;
    productName: string;
    currentQuantity: number;
    minThreshold: number;
    categoryName: string;
}

export interface StockAdjustmentRequest {
    productId: number;
    quantityChange: number;
    type: 'Add' | 'Remove' | 'Damage' | 'Return';
    remarks: string;
}

export interface AdjustmentResponse {
    success: boolean;
    newQuantity: number;
    isLowStock: boolean;
    message: string;
}

export interface StockLogViewDto {
    logId: number;
    changeAmount: number;
    reason: string;
    createdAt: string;
}


export interface TopMovingItem {
    name: string;
    totalMoved: number;
}

export interface CategoryStock {
    categoryName: string;
    itemCount: number;
}

export interface DashboardData {
    totalStockValue: number;
    lowStockCount: number;
    topMovingItems: TopMovingItem[];
    stockByCategory: CategoryStock[];
}

export interface AuthResponse {
    success: boolean;
    token: string;
    message: string;
    role: string;
}

export interface RegisterRequest {
    username: string;
    password: string;
    role: string;
}

export interface UserProfile {
    userId: string;
    userName: string;
    role: string;
}