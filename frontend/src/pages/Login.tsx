import AuthLayout from "../components/AuthLayout";
import LoginForm from "../components/LoginForm";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

function LoginPage() {
    const { user, isLoading } = useAuth()

    if (isLoading) return null
    if (user) return <Navigate to="/dashboard" replace />

    return (
        <AuthLayout
            title="Welcome"
            subtitle="Login to continue managing your tasks"
        >
        <LoginForm />
        </AuthLayout>
    );
}

export default LoginPage;