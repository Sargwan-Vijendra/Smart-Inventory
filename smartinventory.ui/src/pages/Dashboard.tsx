import { useEffect, useState } from 'react';
import { reportService } from '../api/reportService';
import { Package, AlertTriangle, TrendingUp, DollarSign } from 'lucide-react';

// 1. Define an Interface to replace 'any'
interface DashboardStats {
    totalProducts: number;
    lowStockCount: number;
    totalCategories: number;
    totalValue: number;
}

const Dashboard = () => {
    // 2. Use the interface here instead of <any>
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await reportService.getDashboardStats();
                setStats(data);
            } catch {
                // 3. Removed (err) to fix the unused-vars error
                console.error("Failed to load dashboard data");
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return <div className="p-10 text-center text-gray-500">Loading Dashboard...</div>;

    const cards = [
        { title: 'Total Products', value: stats?.totalProducts || 0, icon: Package, color: 'bg-blue-500' },
        { title: 'Low Stock Items', value: stats?.lowStockCount || 0, icon: AlertTriangle, color: 'bg-red-500' },
        { title: 'Total Categories', value: stats?.totalCategories || 0, icon: TrendingUp, color: 'bg-green-500' },
        { title: 'Inventory Value', value: `$${stats?.totalValue?.toLocaleString() || 0}`, icon: DollarSign, color: 'bg-purple-500' },
    ];

    return (
        <div className="animate-in fade-in duration-500">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Inventory Overview</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {cards.map((card, index) => (
                    <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500">{card.title}</p>
                                <p className="text-2xl font-bold text-gray-900 mt-1">{card.value}</p>
                            </div>
                            <div className={`${card.color} p-3 rounded-lg text-white`}>
                                <card.icon size={24} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-10 bg-white p-8 rounded-xl shadow-sm border border-gray-100 h-64 flex flex-col items-center justify-center text-gray-400 border-dashed border-2">
                <TrendingUp size={48} className="mb-2 opacity-20" />
                <p>Real-time Stock Activity Chart (Coming Soon)</p>
            </div>
        </div>
    );
};

export default Dashboard;