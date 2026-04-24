import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { productService } from '../api/productService';
import { type Product, type Category, type Supplier } from '../api/types';

interface ProductFormData {
    sku: string;
    name: string;
    categoryId: number;
    supplyId: number;
    price: number;
    minimumQty: number;
    id?: number;
}

interface ProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: ProductFormData) => void;
    initialData?: Product | null;
}

const ProductModal = ({ isOpen, onClose, onSave, initialData }: ProductModalProps) => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);

    // NO EFFECT NEEDED: Because the component is remounted by the parent,
    // this state initialization runs fresh every time you click Add or Edit.
    const [formData, setFormData] = useState<ProductFormData>({
        sku: initialData?.sku || '',
        name: initialData?.name || '',
        price: initialData?.price || 0,
        minimumQty: 5,
        categoryId: 1,
        supplyId: 1,
        id: initialData?.id
    });

    // We only use useEffect for external API calls, which is allowed.
    useEffect(() => {
        if (!initialData) {
            const fetchData = async () => {
                try {
                    const [catData, supData] = await Promise.all([
                        productService.getCategories(),
                        productService.getSuppliers()
                    ]);
                    setCategories(catData);
                    setSuppliers(supData);
                } catch {
                    console.error("Failed to load dropdown data");
                }
            };
            fetchData();
        }
    }, [initialData]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in duration-200">
                <div className="p-6 border-b flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-800">
                        {initialData ? 'Update Product' : 'Add New Product'}
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X size={24} />
                    </button>
                </div>

                <form className="p-6 space-y-4" onSubmit={(e) => { e.preventDefault(); onSave(formData); }}>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
                        <input required className="w-full border rounded-lg px-3 py-2 outline-none" value={formData.sku} onChange={(e) => setFormData({ ...formData, sku: e.target.value })} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                        <input required className="w-full border rounded-lg px-3 py-2 outline-none" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                    </div>

                    {!initialData && (
                        <div className="grid grid-cols-1 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                <select className="w-full border rounded-lg px-3 py-2 bg-white" value={formData.categoryId} onChange={(e) => setFormData({ ...formData, categoryId: Number(e.target.value) })}>
                                    <option value="">Select Category</option>
                                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Supplier</label>
                                <select className="w-full border rounded-lg px-3 py-2 bg-white" value={formData.supplyId} onChange={(e) => setFormData({ ...formData, supplyId: Number(e.target.value) })}>
                                    <option value="">Select Supplier</option>
                                    {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                </select>
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                        <input type="number" placeholder="Price" className="border rounded-lg px-3 py-2" value={formData.price} onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })} />
                        <input type="number" placeholder="Min Qty" className="border rounded-lg px-3 py-2" value={formData.minimumQty} onChange={(e) => setFormData({ ...formData, minimumQty: Number(e.target.value) })} />
                    </div>

                    <button className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-all">
                        {initialData ? 'Update Product' : 'Create Product'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ProductModal;