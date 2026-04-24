import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const Layout = () => {
    return (
        <div className="flex bg-gray-50 min-h-screen">
            <Sidebar />
            {/* Main Content Area */}
            <main className="ml-64 flex-1 p-8">
                <Outlet /> {/* This is where the specific page content will load */}
            </main>
        </div>
    );
};

export default Layout;