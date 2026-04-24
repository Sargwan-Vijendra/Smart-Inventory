import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Layout from './components/Layout';
import { useAuthStore } from './store/authStore';
import Products from './pages/Products';
import { Toaster } from 'react-hot-toast';

function App() {
    const token = useAuthStore((state) => state.token);

    return (
        <Router>
            <Toaster position="top-right" />
            <Routes>
                <Route path="/login" element={!token ? <Login /> : <Navigate to="/dashboard" />} />

                {token ? (
                    <Route element={<Layout />}>
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/products" element={<Products />} />
                        <Route path="/categories" element={<div className="p-10 text-gray-400">Categories (Coming Soon)</div>} />
                        <Route path="/inventory" element={<div className="p-10 text-gray-400">Inventory (Coming Soon)</div>} />
                        <Route path="/suppliers" element={<div className="p-10 text-gray-400">Suppliers (Coming Soon)</div>} />
                        <Route path="/" element={<Navigate to="/dashboard" />} />
                    </Route>
                ) : (
                    <Route path="*" element={<Navigate to="/login" />} />
                )}
            </Routes>
        </Router>
    );
}

export default App;