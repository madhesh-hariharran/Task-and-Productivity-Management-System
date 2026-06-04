import AuthLayout from "../components/AuthLayout";
import LoginForm from "../components/LoginForm";

function LoginPage() {
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