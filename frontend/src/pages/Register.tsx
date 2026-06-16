import AuthLayout from "../components/AuthLayout";
import RegisterForm from "../components/RegisterForm";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

function RegisterPage() {
    const { user, isLoading } = useAuth()

    if (isLoading) return null
    if (user) return <Navigate to="/dashboard" replace />

    return (
        <AuthLayout
            title="Create an account"
            subtitle="Start managing your tasks"
        >
        <RegisterForm />
        </AuthLayout>
    );
}

export default RegisterPage;