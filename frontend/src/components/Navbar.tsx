import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { hasAssignedTasksAccess } from "../utils/roleGuard";

function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const { role, clearAuth } = useAuth();

    function handleLogout() {
        clearAuth()     // clears context + removes token from local storage
        navigate("/login");
        // no window.location.reload() needed - clearAuth triggers re-render
        // App sees user=null, Navbar unmounts, ProtectedRoute redirects
    }

    const navItems = [
        { label: "Dashboard", path: "/dashboard" },
        { label: "Tasks", path: "/tasks" },
        // Only manager and worker see Assigned Tasks
        ...(hasAssignedTasksAccess(role)
            ? [{  label: "Assigned Tasks", path: "/assigned-tasks"}]
            : [])
        // add reminders later which would be seen by all roles
        // {label: "Reminders", path: "/reminders" },
    ];

    return (
        <nav className="w-full bg-slate-900 shadow-md border-b border-slate-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">

            <div className="text-2xl font-bold bg-gradient-to-r from-indigo-400 via-sky-400 to-orange-400 bg-clip-text text-transparent">
            Do It
            </div>

            <div className="flex items-center gap-6">
            {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                <Link
                    key={item.path}
                    to={item.path}
                    className="relative flex flex-col items-center px-4 py-2 rounded-lg cursor-pointer transition-all duration-300"
                >
                    <span className={`text-sm font-semibold transition-colors duration-300 ${isActive ? "text-indigo-400" : "text-slate-400"}`}>
                    {item.label}
                    </span>
                    
                    <span
                    className={`
                        mt-1 h-1 w-8 rounded-full transition-all duration-500
                        ${isActive
                        ? "bg-gradient-to-r from-indigo-400 via-sky-400 to-orange-400 shadow-[0_0_8px_rgba(0,200,255,0.7)]"
                        : "bg-slate-700"
                        }
                    `}
                    />
                </Link>
                );
            })}

            <button
                onClick={handleLogout}
                className="
                ml-4 px-4 py-2 rounded-lg
                bg-gradient-to-r from-pink-500 via-red-500 to-red-600
                text-white font-semibold text-sm
                shadow-md transition-all duration-300
                hover:shadow-lg hover:-translate-y-0.5 active:scale-95
                "
            >
                Logout
            </button>
            </div>
        </div>
        </nav>
    );
}

export default Navbar;