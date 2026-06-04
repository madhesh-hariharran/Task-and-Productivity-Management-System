import AuthLayout from "../components/AuthLayout";
import RegisterForm from "../components/RegisterForm";

function RegisterPage() {
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