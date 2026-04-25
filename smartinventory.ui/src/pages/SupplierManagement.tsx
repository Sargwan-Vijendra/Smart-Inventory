import React, { useEffect, useState, useCallback, useRef } from 'react';
import { supplierService } from '../api/supplierService';
import { type Supplier, type SupplierRequestDto } from '../api/types';
import { Plus, Trash2, Edit, Loader2, Mail, Phone, X } from 'lucide-react'; // Removed 'Users'
import toast from 'react-hot-toast';
import axios from 'axios';

const SupplierManagement: React.FC = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [pageSize, setPageSize] = useState(10);

    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [formData, setFormData] = useState<SupplierRequestDto>({ name: '', email: '', phone: '' });

    const isInitialMount = useRef(true);

    const loadSuppliers = useCallback(async () => {
        setLoading(true);
        try {
            const data = await supplierService.getSuppliers({
                pageNumber: currentPage,
                pageSize: pageSize
            });
            setSuppliers(data.items);
            setTotalItems(data.totalCount);
            setTotalPages(data.totalPages); // Using property from Generic PagedResponse
        } catch (error: unknown) {
            console.error(error);
            toast.error("Failed to load suppliers.");
        } finally {
            setLoading(false);
        }
    }, [currentPage, pageSize]);

    useEffect(() => {
        if (isInitialMount.current) {
            loadSuppliers();
            isInitialMount.current = false;
        } else {
            loadSuppliers();
        }
    }, [loadSuppliers]);

    const openModal = (supplier?: Supplier) => {
        if (supplier) {
            setSelectedId(supplier.id);
            setFormData({ name: supplier.name, email: supplier.email, phone: supplier.phone });
        } else {
            setSelectedId(null);
            setFormData({ name: '', email: '', phone: '' });
        }
        setIsModalOpen(true);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            if (selectedId) {
                await supplierService.updateSupplier(selectedId, formData);
                toast.success("Supplier updated successfully!");
            } else {
                await supplierService.createSupplier(formData);
                toast.success("Supplier added successfully!");
            }
            setIsModalOpen(false);
            loadSuppliers();
        } catch (error: unknown) {
            let errMsg = "Operation failed.";
            if (axios.isAxiosError(error) && error.response) {
                errMsg = error.response.data || errMsg;
            }
            toast.error(errMsg);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm("Are you sure you want to delete this supplier?")) {
            try {
                await supplierService.deleteSupplier(id);
                toast.success("Supplier deleted successfully!");
                loadSuppliers();
            } catch (error: unknown) {
                let errMsg = "Delete failed.";
                if (axios.isAxiosError(error) && error.response) {
                    errMsg = error.response.data || errMsg;
                }
                toast.error(errMsg);
            }
        }
    };

    return (
        <div className="animate-in fade-in duration-500">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Supplier Management</h1>
                    <p className="text-sm text-gray-500">Manage your product vendors and contact details.</p>
                </div>
                <button
                    onClick={() => openModal()}
                    className="flex items-center bg-blue-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-95"
                >
                    <Plus size={18} className="mr-2" /> Add Supplier
                </button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50/50 border-b border-gray-100">
                        <tr>
                            <th className="p-4 font-semibold text-gray-600">Supplier Name</th>
                            <th className="p-4 font-semibold text-gray-600">Contact Info</th>
                            <th className="p-4 font-semibold text-gray-600 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {loading ? (
                            <tr><td colSpan={3} className="p-12 text-center text-gray-400 animate-pulse">Loading suppliers...</td></tr>
                        ) : suppliers.length === 0 ? (
                            <tr><td colSpan={3} className="p-12 text-center text-gray-400">No suppliers found.</td></tr>
                        ) : (
                            suppliers.map((s) => (
                                <tr key={s.id} className="hover:bg-blue-50/30 transition-colors group">
                                    <td className="p-4">
                                        <div className="font-medium text-gray-800">{s.name}</div>
                                        <div className="text-xs text-gray-400 font-mono">ID: #{s.id}</div>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center text-sm text-gray-600 mb-1">
                                            <Mail size={14} className="mr-2 text-gray-400" /> {s.email}
                                        </div>
                                        <div className="flex items-center text-sm text-gray-600">
                                            <Phone size={14} className="mr-2 text-gray-400" /> {s.phone}
                                        </div>
                                    </td>
                                    <td className="p-4 flex justify-center gap-2">
                                        <button onClick={() => openModal(s)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-100 rounded-lg transition-all">
                                            <Edit size={18} />
                                        </button>
                                        <button onClick={() => handleDelete(s.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-100 rounded-lg transition-all">
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>

                <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-100 sm:px-6 rounded-b-2xl shadow-sm">
                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-500">Rows per page:</span>
                                <select
                                    className="border border-gray-300 rounded px-2 py-1 text-sm bg-white outline-none focus:ring-2 focus:ring-blue-500"
                                    value={pageSize}
                                    onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
                                >
                                    {[5, 10, 20, 50].map(size => <option key={size} value={size}>{size}</option>)}
                                </select>
                            </div>
                            <p className="text-sm text-gray-700">
                                Showing <span className="font-medium">{totalItems === 0 ? 0 : ((currentPage - 1) * pageSize) + 1}</span> to{' '}
                                <span className="font-medium">{Math.min(currentPage * pageSize, totalItems)}</span> of <span className="font-medium">{totalItems}</span> results
                            </p>
                        </div>
                        <div>
                            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50">
                                    &lt;
                                </button>
                                {[...Array(totalPages)].map((_, i) => (
                                    <button key={i + 1} onClick={() => setCurrentPage(i + 1)} className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${currentPage === i + 1 ? 'z-10 bg-blue-50 border-blue-500 text-blue-600' : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'}`}>{i + 1}</button>
                                ))}
                                <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages || totalPages === 0} className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50">
                                    &gt;
                                </button>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-gray-100">
                        <div className="flex justify-between items-center p-6 border-b border-gray-50 bg-gray-50/50">
                            <h2 className="text-xl font-bold text-gray-800">{selectedId ? 'Edit Supplier' : 'Add New Supplier'}</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors"><X size={20} /></button>
                        </div>
                        <form onSubmit={handleSave} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Company Name</label>
                                <input required type="text" className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="e.g. Acme Corp" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
                                <input required type="email" className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="supplier@example.com" />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Phone Number</label>
                                <input required type="text" className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="+1 234 567 890" />
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl font-semibold text-gray-600 hover:bg-gray-50 transition-all">Cancel</button>
                                <button type="submit" disabled={submitting} className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 flex justify-center items-center">
                                    {submitting ? <Loader2 size={18} className="animate-spin" /> : 'Save Supplier'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SupplierManagement;
