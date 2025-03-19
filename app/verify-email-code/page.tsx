"use client"

import { useSearchParams } from "next/navigation"
import EmailVerification from "@/components/auth/email-verification"
import Link from "next/link"
import Navbar from "@/components/layout/navbar"
import { Button } from "@/components/ui/button"

export default function VerifyEmailCodePage() {
    const searchParams = useSearchParams()
    const email = searchParams.get("email") || ""

    return (
        <>
            <Navbar />
            <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-b from-gray-50 to-gray-100">
                <div className="w-full max-w-md space-y-8">
                    {email ? (
                        <EmailVerification email={email} />
                    ) : (
                        <div className="text-center space-y-4">
                            <h1 className="text-2xl font-bold">Email Parameter Missing</h1>
                            <p className="text-gray-600">Please use the link sent to your email or go back to the login page.</p>
                            <Button asChild>
                                <Link href="/">Go to Login</Link>
                            </Button>
                        </div>
                    )}
                </div>
            </main>
        </>
    )
}

