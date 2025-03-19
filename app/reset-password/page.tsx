"use client"

import { useSearchParams } from "next/navigation"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {Navbar} from "@/app/components/Navbar";
import {Footer} from "@/app/components/Footer";
import ResetPasswordForm from "@/components/auth/reset-password-form";

export default function ResetPasswordPage() {
    const searchParams = useSearchParams()
    const token = searchParams.get("token")
    const email = searchParams.get("email")

    if (!token || !email) {
        return (
            <>
                <Navbar />
                <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-b from-gray-50 to-gray-100">
                    <div className="w-full max-w-md">
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>
                                Invalid or missing reset token. Please request a new password reset link.
                            </AlertDescription>
                        </Alert>
                        <div className="mt-4 text-center">
                            <Button asChild>
                                <Link href="/forgot-password">Go to Forgot Password</Link>
                            </Button>
                        </div>
                    </div>
                </main>
                <Footer />
            </>
        )
    }

    return (
        <>
            <Navbar />
            <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-b from-gray-50 to-gray-100">
                <div className="w-full max-w-md">
                    <ResetPasswordForm token={token} email={email} />
                </div>
            </main>
            <Footer />
        </>
    )
}

