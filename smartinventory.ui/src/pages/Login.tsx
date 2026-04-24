import React, { useState } from 'react';
import { authService } from '../api/authService';
import { useAuthStore } from '../store/authStore';
import { LogIn, ShieldCheck, AlertCircle } from 'lucide-react';

const Login = () => {
    // "useState" is how React remembers what you type in a textbox
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const setAuth = useAuthStore((state) => state.setAuth);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); // Prevents the page from refreshing
        setLoading(true);
        setError('');

        try {
            const data = await authService.login(username, password);
            if (data.success) {
                setAuth(data.token, data.role);
            } else {
                setError(data.message);
            }
        } catch {
            // No parentheses here!
            setError("Connection failed. Make sure your .NET API is running.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-10">
                <div className="flex justify-center mb-6">
                    <div className="bg-blue-100 p-4 rounded-full text-blue-600">
                        <ShieldCheck size={48} />
                    </div>
                </div>

                <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-2">Welcome Back</h2>
                <p className="text-center text-gray-500 mb-8">Sign in to Smart Inventory</p>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {error && (
                        <div className="flex items-center gap-2 bg-red-50 text-red-700 p-4 rounded-lg border border-red-100 text-sm">
                            <AlertCircle size={18} />
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Username</label>
                        <input
                            type="text"
                            required
                            placeholder="Enter your username"
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
                        <input
                            type="password"
                            required
                            placeholder="••••••••"
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex justify-center items-center py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-200 transition-all active:scale-[0.98] disabled:bg-blue-300"
                    >
                        {loading ? "Verifying..." : (
                            <><LogIn size={20} className="mr-2" /> Sign In</>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;