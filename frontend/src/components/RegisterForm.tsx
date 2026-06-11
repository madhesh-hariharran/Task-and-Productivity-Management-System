import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../api/auth";

function RegisterForm() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
        await registerUser({ username, email, password });
        navigate("/login");
        } catch {
        setError("Registration failed. Try again.");
        } finally {
        setLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
        
            <div className="space-y-1">
                <label className="block text-sm font-medium text-slate-700">Username</label>
                <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                required
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 shadow-sm outline-none transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:scale-[1.01] focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200"
                />
            </div>

            
            <div className="space-y-1">
                <label className="block text-sm font-medium text-slate-700">Email</label>
                <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 shadow-sm outline-none transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:scale-[1.01] focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200"
                />
            </div>

            
            <div className="space-y-1">
                <label className="block text-sm font-medium text-slate-700">Password</label>
                <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 shadow-sm outline-none transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:scale-[1.01] focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200"
                />
            </div>

            
            {error && (
                <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600 border border-red-100 animate-[fadeUp_0.3s_ease-in-out]">
                {error}
                </p>
            )}

            
            <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-gradient-to-r from-indigo-600 via-sky-500 to-orange-400 px-4 py-2.5 text-sm font-medium text-white shadow-md shadow-indigo-200/40 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.96] disabled:cursor-not-allowed disabled:opacity-60"
            >
                {loading ? "Creating account..." : "Register"}
            </button>

            
            <p className="text-center text-sm text-slate-600">
                Already have an account?{" "}
                <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                    Login
                </Link>
            </p>
        </form>
    );
}

export default RegisterForm;