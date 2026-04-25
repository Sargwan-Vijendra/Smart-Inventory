import React, { useEffect, useState, useCallback, useRef } from 'react';
import { categoryService } from '../api/categoryService';
import { type Category } from '../api/types';
import { LayoutGrid, Plus, Trash2, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios'; // Import axios for type checking

const CategoryManagement: React.FC = () => {
    // --- State Management ---
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [pageSize, setPageSize] = useState(10);

    const [categories, setCategories] = useState<Category[]>([]);
    const [categoryName, setCategoryName] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const isInitialMount = useRef(true);

    // --- Logic: Load Categories ---
    const loadCategories = useCallback(async () => {
        setLoading(true);
        try {
            const data = await categoryService.getCategories({
                pageNumber: currentPage,
                pageSize: pageSize
            });

            setCategories(data.items);
            setTotalPages(data.totalPages);
            setTotalItems(data.totalCount);
        } catch (error: unknown) {
            console.error("Error loading categories", error);
            toast.error("Failed to load categories.");
        } finally {
            setLoading(false);
        }
    }, [currentPage, pageSize]);

    useEffect(() => {
        if (isInitialMount.current) {
            loadCategories();
            isInitialMount.current = false;
        } else {
            loadCategories();
        }
    }, [loadCategories]);

    // --- Logic: Create Handler ---
    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!categoryName.trim()) return;

        setSubmitting(true);
        try {
            await categoryService.createCategory({ name: categoryName });
            toast.success("Category added successfully!");
            setCategoryName('');
            setCurrentPage(1);
            loadCategories();
        } catch (error: unknown) {
            // FIXED: Type-safe error handling replaces 'any'
            let errorMsg = "Operation failed.";
            if (axios.isAxiosError(error) && error.response) {
                errorMsg = error.response.data || errorMsg;
            }
            toast.error(errorMsg);
        } finally {
            setSubmitting(false);
        }
    };

    // --- Logic: Delete Handler ---
    const handleDelete = async (id: number) => {
        if (window.confirm("Are you sure you want to delete this category?")) {
            try {
                await categoryService.deleteCategory(id);
                toast.success("Category deleted successfully!");
                loadCategories();
            } catch (error: unknown) {
                // FIXED: Type-safe error handling replaces 'any'
                let errorMsg = "Could not delete category. It may be linked to products.";
                if (axios.isAxiosError(error) && error.response) {
                    errorMsg = error.response.data || errorMsg;
                }
                toast.error(errorMsg);
            }
        }
    };

    return (
        <div className="animate-in fade-in duration-500">
            {/* Header Section */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Category Management</h1>
                    <p className="text-sm text-gray-500">Manage your product categories and organization.</p>
                </div>
            </div>

            {/* Inline Add Category Section */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 mb-6">
                <form onSubmit={handleCreate} className="flex gap-3">
                    <div className="flex flex-1 items-center bg-gray-50 px-4 py-2 rounded-lg border border-gray-100 focus-within:ring-2 focus-within:ring-blue-500 transition-all">
                        <LayoutGrid className="text-gray-400 mr-2" size={20} />
                        <input
                            type="text"
                            placeholder="Enter new category name..."
                            className="bg-transparent flex-1 outline-none text-gray-600 placeholder:text-gray-400"
                            value={categoryName}
                            onChange={(e) => setCategoryName(e.target.value)}
                            disabled={submitting}
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={submitting || !categoryName.trim()}
                        className="flex items-center bg-blue-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-95">

                        {submitting ? (
                            <Loader2 size={18} className="animate-spin mr-2" />
                        ) : (
                            <Plus size={18} className="mr-2" />
                        )}
                        Add Category
                    </button>
                </form>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50/50 border-b border-gray-100">
                        <tr>
                            <th className="p-4 font-semibold text-gray-600">ID</th>
                            <th className="p-4 font-semibold text-gray-600">Category Name</th>
                            <th className="p-4 font-semibold text-gray-600 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {loading ? (
                            <tr><td colSpan={3} className="p-12 text-center text-gray-400 animate-pulse">Loading categories...</td></tr>
                        ) : categories.length === 0 ? (
                            <tr><td colSpan={3} className="p-12 text-center text-gray-400">No categories found.</td></tr>
                        ) : (
                            categories.map((cat) => (
                                <tr key={cat.id} className="hover:bg-blue-50/30 transition-colors group">
                                    <td className="p-4">
                                        <span className="font-mono text-xs font-bold bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                            #{cat.id}
                                        </span>
                                    </td>
                                    <td className="p-4 font-medium text-gray-800">{cat.name}</td>
                                    <td className="p-4 flex justify-center">
                                        <button
                                            onClick={() => handleDelete(cat.id)}
                                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-100 rounded-lg transition-all"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>

                {/* Pagination Controls */}
                <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-100 sm:px-6 rounded-b-2xl">
                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
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

                        <div>
                            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
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
        </div>
    );
};

export default CategoryManagement;