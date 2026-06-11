import React from "react";

type AuthLayoutProps = {
    title: string;
    subtitle: string;
    children: React.ReactNode;
};

function AuthLayout({ title, subtitle, children }: AuthLayoutProps) {
    return (
        <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-indigo-50 via-sky-50 to-orange-50 animate-[fadeUp_0.6s_ease-in-out]">
        <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-[0_4px_8px_rgba(0,0,0,0.08),0_12px_24px_rgba(0,0,0,0.08)] transition-all duration-300 hover:shadow-[0_6px_12px_rgba(0,0,0,0.12),0_16px_32px_rgba(0,0,0,0.12)]">
            <div className="mb-6 text-center">
            <h1 className="text-3xl font-bold text-slate-800">{title}</h1>
            <p className="mt-2 text-sm text-slate-500">{subtitle}</p>
            </div>
            <div>{children}</div>
        </div>
        </div>
    );
}

export default AuthLayout;