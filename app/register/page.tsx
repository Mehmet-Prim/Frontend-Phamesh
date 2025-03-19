import RegisterForm from "@/components/auth/register-form"
import Link from "next/link"
import {Navbar} from "@/app/components/Navbar";
import {Footer} from "@/app/components/Footer";

export default function RegisterPage() {
    return (
        <>
            <Navbar />
            <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-b from-gray-50 to-gray-100">
                <div className="w-full max-w-4xl space-y-8 py-8">
                    <div className="text-center">
                        <h1 className="text-3xl font-bold">Join Phamesh</h1>
                        <p className="mt-2 text-gray-600">Create your account to get started</p>
                    </div>

                    <RegisterForm />

                    <div className="text-center">
                        <p className="text-sm text-gray-600">
                            Already have an account?{" "}
                            <Link href="/" className="text-primary hover:underline">
                                Login
                            </Link>
                        </p>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    )
}

