import {Navbar} from "@/app/components/Navbar";
import ForgotPasswordForm from "@/components/auth/forgot-password-form";

export default function ForgotPasswordPage() {
    return (
        <>
            <Navbar />
            <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-b from-gray-50 to-gray-100">
                <div className="w-full max-w-md">
                    <ForgotPasswordForm />
                </div>
            </main>
        </>
    )
}

