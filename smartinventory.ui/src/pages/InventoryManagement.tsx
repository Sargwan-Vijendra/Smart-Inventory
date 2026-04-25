import React, { useEffect, useState, useCallback, useRef } from 'react';
import { inventoryService } from '../api/inventoryService';
import { type LowStockDto, type StockAdjustmentRequest } from '../api/types';
import { Boxes, AlertTriangle, Loader2, X } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';

const InventoryManagement: React.FC = () => {
    // --- State Management (Standardized) ---
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [pageSize, setPageSize] = useState(10);

    const [lowStockItems, setLowStockItems] = useState<LowStockDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // Adjustment Form State
    const [selectedProduct, setSelectedProduct] = useState<LowStockDto | null>(null);
    const [adjustment, setAdjustment] = useState<StockAdjustmentRequest>({
        productId: 0,
        quantityChange: 1,
        type: 'Add',
        remarks: ''
    });

    const isInitialMount = useRef(true);

    // --- Logic: Load Low Stock Report ---
    const loadLowStock = useCallback(async () => {
        setLoading(true);
        try {
            const data = await inventoryService.getLowStockReport({
                pageNumber: currentPage,
                pageSize: pageSize
            });

            setLowStockItems(data.items);
            setTotalPages(data.totalPages);
            setTotalItems(data.totalCount);
        } catch (error: unknown) {
            console.error("Error loading inventory", error);
            toast.error("Failed to load inventory report.");
        } finally {
            setLoading(false);
        }
    }, [currentPage, pageSize]);

    useEffect(() => {
        if (isInitialMount.current) {
            loadLowStock();
            isInitialMount.current = false;
        } else {
            loadLowStock();
        }
    }, [loadLowStock]);

    // --- Logic: Modal & Adjustment Handlers ---
    const openAdjustmentModal = (item: LowStockDto) => {
        setSelectedProduct(item);
        setAdjustment({
            productId: item.productId,
            quantityChange: 1,
            type: 'Add',
            remarks: ''
        });
        setIsModalOpen(true);
    };

    const handleAdjust = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const response = await inventoryService.adjustStock(adjustment);
            if (response.success) {
                toast.success(response.message);
                if (response.isLowStock) {
                    toast("Item is still below threshold!", { icon: '⚠️' });
                }
                setIsModalOpen(false);
                loadLowStock();
            }
        } catch (error: unknown) {
            let errorMsg = "Adjustment failed.";
            if (axios.isAxiosError(error) && error.response) {
                errorMsg = (error.response.data as { message?: string })?.message || errorMsg;
            }
            toast.error(errorMsg);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="animate-in fade-in duration-500">
            {/* Header Section */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Inventory Management</h1>
                    <p className="text-sm text-gray-500">Monitor stock levels and process adjustments.</p>
                </div>
                <div className="bg-amber-100 text-amber-700 px-4 py-2 rounded-xl flex items-center font-semibold border border-amber-200">
                    <AlertTriangle size={18} className="mr-2" />
                    {totalItems} Low Stock Alerts
                </div>
            </div>

            {/* Table Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50/50 border-b border-gray-100">
                        <tr>
                            <th className="p-4 font-semibold text-gray-600">Product Info</th>
                            <th className="p-4 font-semibold text-gray-600">Current Stock</th>
                            <th className="p-4 font-semibold text-gray-600">Threshold</th>
                            <th className="p-4 font-semibold text-gray-600 text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {loading ? (
                            <tr><td colSpan={4} className="p-12 text-center text-gray-400 animate-pulse">Loading reports...</td></tr>
                        ) : lowStockItems.length === 0 ? (
                            <tr><td colSpan={4} className="p-12 text-center text-gray-400">All stock levels are healthy!</td></tr>
                        ) : (
                            lowStockItems.map((item) => (
                                <tr key={item.productId} className="hover:bg-amber-50/30 transition-colors">
                                    <td className="p-4">
                                        <div className="font-medium text-gray-800">{item.productName}</div>
                                        <div className="text-xs text-gray-400 font-mono">{item.sku} • {item.categoryName}</div>
                                    </td>
                                    <td className="p-4">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-700">
                                            {item.currentQuantity} units
                                        </span>
                                    </td>
                                    <td className="p-4 text-sm text-gray-500">
                                        Min: {item.minThreshold}
                                    </td>
                                    <td className="p-4 text-center">
                                        <button
                                            onClick={() => openAdjustmentModal(item)}
                                            className="inline-flex items-center bg-gray-900 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-black transition-all active:scale-95"
                                        >
                                            <Boxes size={16} className="mr-2" /> Adjust
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>

                {/* Pagination Controls - Standardized */}
                <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-100 sm:px-6 rounded-b-2xl shadow-sm">
                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">

                        {/* Left Side: Page Size & Results Info */}
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-500">Rows per page:</span>
                                <select
                                    className="border border-gray-300 rounded px-2 py-1 text-sm bg-white outline-none focus:ring-2 focus:ring-blue-500"
                                    value={pageSize}
                                    onChange={(e) => {
                                        setPageSize(Number(e.target.value));
                                        setCurrentPage(1);
                                    }}
                                >
                                    <option value={5}>5</option>
                                    <option value={10}>10</option>
                                    <option value={20}>20</option>
                                    <option value={50}>50</option>
                                </select>
                            </div>

                            <p className="text-sm text-gray-700">
                                Showing <span className="font-medium">{totalItems === 0 ? 0 : ((currentPage - 1) * pageSize) + 1}</span> to{' '}
                                <span className="font-medium">
                                    {Math.min(currentPage * pageSize, totalItems)}
                                </span>{' '}
                                of <span className="font-medium">{totalItems}</span> results
                            </p>
                        </div>

                        {/* Right Side: Navigation Buttons */}
                        <div>
                            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                                >
                                    &lt;
                                </button>
                                {[...Array(totalPages)].map((_, i) => (
                                    <button
                                        key={i + 1}
                                        onClick={() => setCurrentPage(i + 1)}
                                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${currentPage === i + 1
                                                ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                                : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                            }`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages || totalPages === 0}
                                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                                >
                                    &gt;
                                </button>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>

            {/* Adjustment Modal - Maintained from Inventory Logic */}
            {isModalOpen && selectedProduct && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md border border-gray-100">
                        <div className="flex justify-between items-center p-6 border-b border-gray-50 bg-gray-50/50">
                            <h2 className="text-xl font-bold text-gray-800">Stock Adjustment</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
                        </div>
                        <form onSubmit={handleAdjust} className="p-6 space-y-4">
                            <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 mb-4">
                                <p className="text-xs text-blue-600 font-bold uppercase tracking-wider">Product</p>
                                <p className="text-sm font-semibold text-blue-900">{selectedProduct.productName}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Type</label>
                                    <select
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                                        value={adjustment.type}
                                        onChange={e => setAdjustment({ ...adjustment, type: e.target.value as StockAdjustmentRequest['type'] })}
                                    >
                                        <option value="Add">Add Stock (+)</option>
                                        <option value="Remove">Remove Stock (-)</option>
                                        <option value="Damage">Damage (-)</option>
                                        <option value="Return">Return (+)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Quantity</label>
                                    <input
                                        required type="number" min="1"
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                                        value={adjustment.quantityChange}
                                        onChange={e => setAdjustment({ ...adjustment, quantityChange: Number(e.target.value) })}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Remarks</label>
                                <textarea
                                    required rows={3}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                    placeholder="Reason for adjustment..."
                                    value={adjustment.remarks}
                                    onChange={e => setAdjustment({ ...adjustment, remarks: e.target.value })}
                                />
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-2 border border-gray-200 rounded-xl font-semibold text-gray-600 hover:bg-gray-50 transition-all">Cancel</button>
                                <button type="submit" disabled={submitting} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all flex justify-center items-center">
                                    {submitting ? <Loader2 size={18} className="animate-spin" /> : 'Confirm Update'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InventoryManagement;