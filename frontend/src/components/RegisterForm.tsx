import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../api/auth";
import type { UserRole } from "../types/auth";
import {extractErrorMessage} from "../utils/ErrorHandler";

const ROLES: {value: UserRole; label: string; description: string}[] = [
    {
        value: "personal",
        label: "Personal",
        description: "For individual use with your own tasks",
    },
    {
        value: "worker",
        label: "Worker",
        description: "Receive tasks assigned by your manager",
    },
    {
        value: "manager",
        label: "Manager",
        description: "Assign and track tasks across your team",
    }
];

function RegisterForm() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState<UserRole>("personal");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const isOrgRole = role === "manager" || role === "worker";

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
        await registerUser({ 
            username, 
            email, 
            password,
            role,
            phone_number: phoneNumber.trim() || undefined, 
        });
        navigate("/login");
        } catch(err: unknown) {
            setError(extractErrorMessage(err, "Registration failed. Please check your details and try again."));
        }   
        finally {
        setLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            {/* Role selector */}
            <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">
                    Account type
                </label>
                <div className="grid grid-cols-3 gap-2">
                    {ROLES.map((r) => (
                        <button
                            key={r.value}
                            type="button"
                            onClick={() => setRole(r.value)}
                            className={`
                                flex flex-col items-center gap-1 rounded-xl border-2 px-2 py-3 text-center
                                transition-all duration-200 cursor-pointer
                                ${role === r.value
                                    ? "border-indigo-400 bg-indigo-50 text-indigo-700"
                                    : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                                }
                            `}
                        >
                            <span className="text-xs font-semibold">{r.label}</span>
                            <span className="text-[10px] leading-tight text-slate-400">
                                {r.description}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Username */}
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

            {/* Email */}
            <div className="space-y-1">
                <label className="block text-sm font-medium text-slate-700">Email</label>
                <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={isOrgRole ? "Enter your company email" : "Enter your email"}
                required
                className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 shadow-sm outline-none transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:scale-[1.01] focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200"
                />
                {isOrgRole && (
                    <p className="text-[11px] text-amber-600 mt-1">
                        Manager and worker accounts require a company email.
                    </p>
                )}
            </div>

            {/* Password */}
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

            {/* WhatsApp number — optional for all roles */}
            <div className="space-y-1">
                <label className="block text-sm font-medium text-slate-700">
                    WhatsApp number{" "}
                    <span className="font-normal text-slate-400">(optional)</span>
                </label>
                <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 shadow-sm outline-none transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:scale-[1.01] focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200"
                />
                <p className="text-[11px] text-slate-400">
                    Used to send reminder messages. Include country code.
                </p>
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