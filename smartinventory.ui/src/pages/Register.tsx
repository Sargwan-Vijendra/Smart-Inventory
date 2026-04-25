import React, { useState } from 'react';
import { authService } from '../api/authService';
import { type RegisterRequest } from '../api/types';
import { UserPlus, Loader2, ShieldCheck, AlertCircle } from 'lucide-react'; // These are all used now
import { useNavigate, Link } from 'react-router-dom'; // Link is used at the bottom
import toast from 'react-hot-toast';
import axios from 'axios';

const Register: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('User');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const data: RegisterRequest = { username, password, role };
            await authService.register(data);
            toast.success("Registration successful! Please login.");
            navigate('/login');
        } catch (err: unknown) {
            let errMsg = "Registration failed.";
            if (axios.isAxiosError(err) && err.response) {
                errMsg = err.response.data || errMsg;
            }
            setError(errMsg);
            toast.error(errMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-10 border border-gray-100">
                <div className="flex justify-center mb-6">
                    <div className="bg-indigo-100 p-4 rounded-full text-indigo-600">
                        {/* FIXED: UserPlus is now used */}
                        <UserPlus size={40} />
                    </div>
                </div>

                <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-2">Create Account</h2>
                <p className="text-center text-gray-500 mb-8">Join Smart Inventory System</p>

                <form onSubmit={handleRegister} className="space-y-5">
                    {/* Security Protocol Header - Uses ShieldCheck */}
                    <div className="flex items-center gap-2 bg-blue-50/50 p-3 rounded-lg border border-blue-100 text-blue-700 font-bold text-xs">
                        <ShieldCheck size={14} /> SECURITY PROTOCOL ENABLED
                    </div>

                    {error && (
                        <div className="flex items-center gap-2 bg-red-50 text-red-700 p-4 rounded-lg border border-red-100 text-sm">
                            <AlertCircle size={18} />
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Username</label>
                        <input
                            type="text" required
                            placeholder="Choose a username"
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)} // FIXED: setUsername used
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
                        <input
                            type="password" required
                            placeholder="••••••••"
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)} // FIXED: setPassword used
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Role</label>
                        <select
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all bg-white font-medium text-gray-700"
                            value={role}
                            onChange={(e) => setRole(e.target.value)} // FIXED: setRole used
                        >
                            <option value="User">Standard User</option>
                            <option value="Admin">Administrator</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        disabled={loading} // FIXED: loading state used
                        className="w-full flex justify-center items-center py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-100 transition-all active:scale-95 disabled:bg-indigo-300"
                    >
                        {/* FIXED: Loader2 used during loading state */}
                        {loading ? <Loader2 className="animate-spin" size={20} /> : "Register Now"}
                    </button>

                    <p className="text-center text-sm text-gray-500 mt-4">
                        {/* FIXED: Link used for navigation */}
                        Already have an account? <Link to="/login" className="text-indigo-600 font-bold hover:underline">Sign In</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Register;