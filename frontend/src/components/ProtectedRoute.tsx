import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/useAuth"

function ProtectedRoute(){
    const { user, isLoading } = useAuth()

    // still hydrating from token so dont redirect yet
    if (isLoading) return null

    if (!user){
        return <Navigate to = "/login" replace />
    }
    return <Outlet />
}

export default ProtectedRoute;