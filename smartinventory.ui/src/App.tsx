import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Layout from './components/Layout';
import { useAuthStore } from './store/authStore';
import Products from './pages/Products';
import CategoryManagement from './pages/CategoryManagement';
import SupplierManagement from './pages/SupplierManagement'; // 1. Import the new component
import InventoryManagement from './pages/InventoryManagement';
import { Toaster } from 'react-hot-toast';
import Register from './pages/Register';

//function App() {
//    const token = useAuthStore((state) => state.token);

//    return (
//        <Router>
//            <Toaster position="top-right" />
//            <Routes>
//                {/* Public Route */}
//                <Route path="/login" element={!token ? <Login /> : <Navigate to="/dashboard" />} />

//                {/* Protected Routes */}
//                {token ? (
//                    <Route element={<Layout />}>
//                        <Route path="/dashboard" element={<Dashboard />} />
//                        <Route path="/products" element={<Products />} />
//                        <Route path="/categories" element={<CategoryManagement />} />

//                        {/* 2. Replace the "Coming Soon" div with the actual SupplierManagement component */}
//                        <Route path="/suppliers" element={<SupplierManagement />} />

//                        {/* Remaining Placeholders */}
//                        <Route path="/inventory" element={<InventoryManagement />} />
//                        <Route path="/" element={<Navigate to="/dashboard" />} />

//                        <Route path="/register" element={<Register />} />
//                    </Route>
//                ) : (
//                    <Route path="*" element={<Navigate to="/login" />} />
//                )}
//            </Routes>
//        </Router>
//    );
//}

// src/App.tsx
function App() {
    const token = useAuthStore((state) => state.token);

    return (
        <Router>
            <Toaster position="top-right" />
            <Routes>
                {/* --- PUBLIC ROUTES --- */}
                {/* Login and Register must be accessible without a token */}
                <Route path="/login" element={!token ? <Login /> : <Navigate to="/dashboard" />} />
                <Route path="/register" element={!token ? <Register /> : <Navigate to="/dashboard" />} />

                {/* --- PROTECTED ROUTES --- */}
                {token ? (
                    <Route element={<Layout />}>
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/products" element={<Products />} />
                        <Route path="/categories" element={<CategoryManagement />} />
                        <Route path="/suppliers" element={<SupplierManagement />} />
                        <Route path="/inventory" element={<InventoryManagement />} />
                        <Route path="/" element={<Navigate to="/dashboard" />} />
                    </Route>
                ) : (
                    /* Redirect any unknown route to login if not authenticated */
                    <Route path="*" element={<Navigate to="/login" />} />
                )}
            </Routes>
        </Router>
    );
}

export default App;