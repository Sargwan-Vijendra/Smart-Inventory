import { useEffect, useState } from 'react';
import { reportService } from '../api/reportService';
import { type DashboardData } from '../api/types';
import { Package, AlertTriangle, TrendingUp, DollarSign, PieChart, Activity } from 'lucide-react';

const Dashboard = () => {
    const [stats, setStats] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await reportService.getDashboardStats();
                setStats(data);
            } catch {
                console.error("Failed to load dashboard data");
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return <div className="p-10 text-center text-gray-400 animate-pulse">Loading Dashboard Stats...</div>;

    const cards = [
        {
            title: 'Inventory Value',
            value: `${stats?.totalStockValue?.toLocaleString(undefined, { minimumFractionDigits: 2 }) || 0} Rs`,
            icon: DollarSign,
            color: 'bg-emerald-500',
            subText: 'Total value of all stock'
        },
        {
            title: 'Low Stock Alerts',
            value: stats?.lowStockCount || 0,
            icon: AlertTriangle,
            color: 'bg-rose-500',
            subText: 'Items below threshold'
        },
        {
            title: 'Categories',
            value: stats?.stockByCategory.length || 0,
            icon: Package,
            color: 'bg-blue-500',
            subText: 'Active product groups'
        },
        {
            title: 'Monthly Activity',
            value: stats?.topMovingItems.reduce((acc, curr) => acc + curr.totalMoved, 0) || 0,
            icon: Activity,
            color: 'bg-amber-500',
            subText: 'Total stock movements'
        },
    ];

    return (
        <div className="animate-in fade-in duration-500 space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-gray-800">Inventory Dashboard</h1>
                <p className="text-sm text-gray-500">Real-time overview of your warehouse status.</p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {cards.map((card, index) => (
                    <div key={index} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500">{card.title}</p>
                                <p className="text-2xl font-bold text-gray-900 mt-1">{card.value}</p>
                                <p className="text-xs text-gray-400 mt-2">{card.subText}</p>
                            </div>
                            <div className={`${card.color} p-3 rounded-xl text-white shadow-lg shadow-opacity-20`}>
                                <card.icon size={20} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Top Moving Items List */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-2 mb-6 text-gray-800 font-bold border-b border-gray-50 pb-4">
                        <TrendingUp size={20} className="text-amber-500" />
                        <h2>Top Moving Items (Last 30 Days)</h2>
                    </div>
                    <div className="space-y-4">
                        {stats?.topMovingItems.map((item, i) => (
                            <div key={i} className="flex items-center justify-between group">
                                <div className="flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-xs font-bold text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
                                        {i + 1}
                                    </span>
                                    <span className="text-sm font-medium text-gray-700">{item.name}</span>
                                </div>
                                <span className="text-sm font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                                    {item.totalMoved} units
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Stock Distribution by Category */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex items-center gap-2 mb-6 text-gray-800 font-bold border-b border-gray-50 pb-4">
                        <PieChart size={20} className="text-blue-500" />
                        <h2>Stock Distribution by Category</h2>
                    </div>
                    <div className="space-y-4">
                        {stats?.stockByCategory.map((cat, i) => (
                            <div key={i} className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600 font-medium">{cat.categoryName}</span>
                                    <span className="text-gray-400">{cat.itemCount} Items</span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                                    <div
                                        className="bg-blue-500 h-full rounded-full"
                                        style={{ width: `${Math.min((cat.itemCount / 20) * 100, 100)}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;