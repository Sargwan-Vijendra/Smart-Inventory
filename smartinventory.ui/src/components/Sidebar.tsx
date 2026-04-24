import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import {
    LayoutDashboard,
    Package,
    Tags,
    Truck,
    ClipboardList,
    LogOut
} from 'lucide-react';

const Sidebar = () => {
    const role = useAuthStore((state) => state.role);
    const logout = useAuthStore((state) => state.logout);
    const location = useLocation();

    // Define Menu Items
    const menuItems = [
        { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, visible: true },
        { name: 'Products', path: '/products', icon: Package, visible: true },
        { name: 'Categories', path: '/categories', icon: Tags, visible: true },
        { name: 'Inventory', path: '/inventory', icon: ClipboardList, visible: true },
        // Hidden if user is not Admin
        { name: 'Suppliers', path: '/suppliers', icon: Truck, visible: role === 'Admin' },
    ];

    return (
        <div className="h-screen w-64 bg-gray-900 text-white flex flex-col fixed left-0 top-0">
            <div className="p-6 text-2xl font-bold border-b border-gray-800 text-blue-400">
                SmartStock
            </div>

            <nav className="flex-1 mt-6 px-4 space-y-2">
                {menuItems.filter(item => item.visible).map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`flex items-center p-3 rounded-lg transition-colors ${location.pathname === item.path
                                ? 'bg-blue-600 text-white'
                                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                            }`}
                    >
                        <item.icon size={20} className="mr-3" />
                        {item.name}
                    </Link>
                ))}
            </nav>

            <button
                onClick={logout}
                className="p-6 flex items-center text-gray-400 hover:text-red-400 border-t border-gray-800 transition-colors"
            >
                <LogOut size={20} className="mr-3" />
                Logout
            </button>
        </div>
    );
};

export default Sidebar;