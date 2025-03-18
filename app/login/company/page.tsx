"use client"

import type React from "react"
import { Navbar } from "@/app/components/Navbar"
import { Footer } from "@/app/components/Footer"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import CompanyIcon from "@/public/icons/companyIcon.png"
import Image from "next/image"
import { useAuth } from "@/hooks/useAuth"
import type { LoginRequest } from "@/types/auth"
import { AuthService } from "@/services/auth.service"
// Fügen Sie den Import für forceCompanyRole hinzu
import { forceCompanyRole } from "@/lib/auth-debug"

export default function CompanyLogin() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const { login, loading } = useAuth()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [rememberMe, setRememberMe] = useState(false)
    const [error, setError] = useState("")
    const [successMessage, setSuccessMessage] = useState("")

    useEffect(() => {
        // Check for query parameters that might indicate a successful action
        const registered = searchParams.get("registered")
        if (registered === "true") {
            setSuccessMessage("Registration successful! Please check your email to verify your account.")
        }

        const passwordReset = searchParams.get("passwordReset")
        if (passwordReset === "true") {
            setSuccessMessage("Password has been reset successfully! Please log in with your new password.")
        }

        const verified = searchParams.get("verified")
        if (verified === "true") {
            setSuccessMessage("Email verified successfully! You can now log in.")
        }
    }, [searchParams])

    // Ändern Sie die handleSubmit-Funktion, um die Rolle zu erzwingen
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setSuccessMessage("")

        // Validate form
        if (!email || !password) {
            setError("Please fill in all fields")
            return
        }

        try {
            // Normalisieren der E-Mail-Adresse
            const normalizedEmail = email.trim().toLowerCase()
            console.log("Submitting login with normalized email:", normalizedEmail)

            // Erzwingen Sie die COMPANY-Rolle für diese Anmeldung
            forceCompanyRole()

            const loginRequest: LoginRequest = {
                email: normalizedEmail,
                password,
                rememberMe,
                // Explizit als COMPANY markieren
                role: "COMPANY",
                isCompany: true,
            }

            await login(loginRequest)
            // Die Weiterleitung erfolgt jetzt automatisch im useAuth-Hook
        } catch (err: any) {
            console.error("Login error in component:", err)
            if (err.message && err.message.includes("not verified")) {
                setError("Your account is not verified. Please check your email for verification instructions.")
            } else {
                setError(err.message || "Invalid login credentials")
            }
        }
    }

    const handleResendVerification = async () => {
        if (!email) {
            setError("Please enter your email address")
            return
        }

        try {
            await AuthService.resendVerificationEmail(email)
            setSuccessMessage("Verification email has been resent. Please check your inbox.")
            setError("")
        } catch (err: any) {
            setError(err.message || "Failed to resend verification email")
        }
    }

    return (
        <>
            <Navbar />
            <main className="max-w-7xl mx-auto min-h-screen flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="w-full max-w-md">
                    <div className="flex justify-center mb-8">
                        <Image src={CompanyIcon || "/placeholder.svg"} alt="Company Icon" className="w-24 h-24" />
                    </div>
                    <h2 className="mt-6 text-center text-5xl font-extrabold text-white">Company Login</h2>
                    <div className="mt-8">
                        {successMessage && (
                            <div
                                className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4"
                                role="alert"
                            >
                                <span className="block sm:inline">{successMessage}</span>
                            </div>
                        )}

                        {error && (
                            <div
                                className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
                                role="alert"
                            >
                                <span className="block sm:inline">{error}</span>
                                {error.includes("not verified") && (
                                    <button
                                        onClick={handleResendVerification}
                                        className="mt-2 text-sm font-medium text-red-700 underline"
                                    >
                                        Resend verification email
                                    </button>
                                )}
                            </div>
                        )}

                        <form className="space-y-6" onSubmit={handleSubmit}>
                            <div>
                                <label htmlFor="email" className="block text-2xl font-medium text-white">
                                    Email address
                                </label>
                                <div className="mt-1">
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-600 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-2xl"
                                        placeholder="company@example.com"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-2xl font-medium text-white">
                                    Password
                                </label>
                                <div className="mt-1">
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        autoComplete="current-password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-2xl"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <input
                                        id="remember-me"
                                        name="remember-me"
                                        type="checkbox"
                                        checked={rememberMe}
                                        onChange={(e) => setRememberMe(e.target.checked)}
                                        className="size-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                    <label htmlFor="remember-me" className="ml-2 block text-2xl text-white">
                                        Remember me
                                    </label>
                                </div>

                                <div className="text-sm">
                                    <Link href="/forgot-password/company" className="text-2xl font-medium text-white hover:underline">
                                        Forgot your password?
                                    </Link>
                                </div>
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-2xl font-medium text-white bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    {loading ? "Signing in..." : "Sign in"}
                                </button>
                            </div>
                        </form>

                        <div className="mt-6">
                            <div className="relative flex items-center justify-center">
                                <div className="w-full flex items-center">
                                    <div className="flex-1 border-t border-gray-600"></div>
                                    <span className="px-4 text-white text-2xl whitespace-nowrap">Don&#39;t have an account?</span>
                                    <div className="flex-1 border-t border-gray-600"></div>
                                </div>
                            </div>

                            <div className="mt-6">
                                <Link
                                    href="/register/company"
                                    className="w-full flex justify-center text-2xl py-2 px-4 border border-transparent rounded-md shadow-sm font-medium text-white bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    Register as a Company
                                </Link>
                            </div>

                            <div className="mt-4 text-center">
                                <Link href="/select-role" className="font-medium text-2xl text-white hover:underline">
                                    Back to selection
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    )
}

