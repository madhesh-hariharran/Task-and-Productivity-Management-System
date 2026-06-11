import { Navigate, Outlet } from "react-router-dom";
import { isLoggedIn } from "../utils/token";

function ProtectedRoute(){
    if (!isLoggedIn()){
        return <Navigate to = "/login" replace />
    }
    return <Outlet />
}

export default ProtectedRoute;