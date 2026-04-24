import { useEffect, useState, useCallback, useRef } from 'react';
import { productService } from '../api/productService';
import { type Product } from '../api/types';
import ProductModal from '../components/ProductModal';
import { Search, Plus, Trash2, Edit } from 'lucide-react';
import toast from 'react-hot-toast';

const Products = () => {
    // --- State Management ---
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [pageSize, setPageSize] = useState(10); // Changed from 'const' to 'useState'

    const [products, setProducts] = useState<Product[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    const isInitialMount = useRef(true);

    // --- Logic: Load Products ---
    const loadProducts = useCallback(async () => {
        setLoading(true);
        try {
            const data = await productService.getProducts({
                pageNumber: currentPage,
                pageSize: pageSize,
                search: searchTerm
            });

            setProducts(data.items);
            setTotalPages(data.totalPages);
            setTotalItems(data.totalCount);
        } catch {
            console.error("Error loading products");
        } finally {
            setLoading(false);
        }
    }, [searchTerm, currentPage, pageSize]);

    // Trigger load on component mount and whenever loadProducts changes
    useEffect(() => {
        if (isInitialMount.current) {
            loadProducts();
            isInitialMount.current = false;
        } else {
            loadProducts();
        }
    }, [loadProducts]);

    // --- Logic: Create/Update Handler ---
    const handleSave = async (formData: {
        sku: string;
        name: string;
        categoryId: number;
        supplyId: number;
        price: number;
        minimumQty: number;
        id?: number
    }) => {
        try {
            if (selectedProduct) {
                await productService.updateProduct({
                    id: formData.id!,
                    sku: formData.sku,
                    name: formData.name,
                    price: formData.price,
                    minimumQty: formData.minimumQty
                });
                toast.success("Product updated successfully!");
            } else {
                await productService.createProduct(formData);
                toast.success("Product added successfully!");
            }

            setIsModalOpen(false);
            setSelectedProduct(null);
            loadProducts();
        } catch {
            toast.error("Operation failed. Please check your data.");
        }
    };

    // --- Logic: Delete Handler ---
    const handleDelete = async (id: number) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            try {
                await productService.deleteProduct(id);
                loadProducts();
            } catch {
                alert("Could not delete product. It may be linked to existing inventory logs.");
            }
        }
    };

    return (
        <div className="animate-in fade-in duration-500">
            {/* Header Section */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Product Management</h1>
                    <p className="text-sm text-gray-500">Manage your inventory items and stock levels.</p>
                </div>
                <button
                    onClick={() => { setSelectedProduct(null); setIsModalOpen(true); }}
                    className="flex items-center bg-blue-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-95"
                >
                    <Plus size={18} className="mr-2" /> Add Product
                </button>
            </div>

            {/* Search Bar */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-6 flex items-center">
                <div className="flex flex-1 items-center bg-gray-50 px-4 py-2 rounded-lg border border-gray-100">
                    <Search className="text-gray-400 mr-2" size={20} />
                    <input
                        type="text"
                        placeholder="Search by SKU or Name (Press Enter)..."
                        className="bg-transparent flex-1 outline-none text-gray-600 placeholder:text-gray-400"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && loadProducts()}
                    />
                </div>
                <button
                    onClick={() => { setCurrentPage(1); loadProducts(); }}
                    className="ml-4 bg-gray-900 text-white px-6 py-2 rounded-lg hover:bg-black transition-all font-medium"
                >
                    Search
                </button>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50/50 border-b border-gray-100">
                        <tr>
                            <th className="p-4 font-semibold text-gray-600">SKU</th>
                            <th className="p-4 font-semibold text-gray-600">Product Name</th>
                            <th className="p-4 font-semibold text-gray-600">Category</th>
                            <th className="p-4 font-semibold text-gray-600 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {loading ? (
                            <tr><td colSpan={4} className="p-12 text-center text-gray-400 animate-pulse">Loading products...</td></tr>
                        ) : products.length === 0 ? (
                            <tr><td colSpan={4} className="p-12 text-center text-gray-400">No products found.</td></tr>
                        ) : (
                            products.map((p) => (
                                <tr key={p.id} className="hover:bg-blue-50/30 transition-colors group">
                                    <td className="p-4">
                                        <span className="font-mono text-xs font-bold bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                            {p.sku}
                                        </span>
                                    </td>
                                    <td className="p-4 font-medium text-gray-800">{p.name}</td>
                                    <td className="p-4">
                                        <span className="text-sm text-gray-500">{p.category}</span>
                                    </td>
                                    <td className="p-4 flex justify-center gap-3">
                                        <button
                                            onClick={() => { setSelectedProduct(p); setIsModalOpen(true); }}
                                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-100 rounded-lg transition-all"
                                        >
                                            <Edit size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(p.id)}
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
                <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-100 sm:px-6 rounded-b-2xl shadow-sm">
                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">

                        {/* Left Side: Page Size Selector & Results Info */}
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-500">Rows per page:</span>
                                <select
                                    className="border border-gray-300 rounded px-2 py-1 text-sm bg-white outline-none focus:ring-2 focus:ring-blue-500"
                                    value={pageSize}
                                    onChange={(e) => {
                                        setPageSize(Number(e.target.value));
                                        setCurrentPage(1); // Reset to page 1 when size changes
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

                        {/* Right Side: Page Navigation Buttons */}
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

            {isModalOpen && (
                <ProductModal
                    isOpen={isModalOpen}
                    onClose={() => {
                        setIsModalOpen(false);
                        setSelectedProduct(null);
                    }}
                    onSave={handleSave}
                    initialData={selectedProduct}
                />
            )}
        </div>
    );
};

export default Products;