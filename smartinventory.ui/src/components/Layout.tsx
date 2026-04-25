import React, { useEffect, useState } from 'react';
import { authService } from '../api/authService';
import { type UserProfile } from '../api/types';
import { UserCircle, LogOut } from 'lucide-react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import Sidebar from './Sidebar'; // IMPORT your existing Sidebar component

const UserProfileHeader: React.FC = () => {
    const [user, setUser] = useState<UserProfile | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const data = await authService.getMe();
                setUser(data);
            } catch {
                console.error("Session expired");
            }
        };
        fetchUser();
    }, []);

    if (!user) return <div className="h-10 w-32 bg-gray-100 animate-pulse rounded-lg"></div>;

    return (
        <div className="flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-xl border border-gray-100">
            <UserCircle className="text-gray-400" size={28} />
            <div className="flex flex-col text-left">
                <span className="text-xs font-bold text-gray-800 leading-none">{user.userName}</span>
                <span className="text-[10px] uppercase tracking-wider font-bold text-indigo-600 mt-1">{user.role}</span>
            </div>
        </div>
    );
};

const Layout: React.FC = () => {
    const logout = useAuthStore((state) => state.logout);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* SIDEBAR FIXED: We are now calling your Sidebar component here */}
            <aside className="w-64 bg-white border-r border-gray-100 hidden md:block sticky top-0 h-screen">
                <Sidebar />
            </aside>

            <div className="flex-1 flex flex-col">
                {/* Top Navbar */}
                <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-30">
                    <div className="font-bold text-indigo-600 text-xl tracking-tight">
                        SMART<span className="text-gray-800 font-extrabold">STOCK</span>
                    </div>

                    <div className="flex items-center gap-4">
                        <UserProfileHeader />
                        {/*<button*/}
                        {/*    onClick={handleLogout}*/}
                        {/*    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"*/}
                        {/*    title="Logout"*/}
                        {/*>*/}
                        {/*    <LogOut size={20} />*/}
                        {/*</button>*/}
                    </div>
                </header>

                {/* Main Content Area */}
                <main className="p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default Layout;