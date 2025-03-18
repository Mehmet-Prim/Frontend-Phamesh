"use client"

import type React from "react"

import { Navbar } from "@/app/components/Navbar"
import { Footer } from "@/app/components/Footer"
import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import Company from "@/public/icons/companyIcon.png"
import Image from "next/image"
import { useAuth } from "@/hooks/useAuth"
import type { PasswordResetRequest } from "@/types/auth"

export default function CompanyResetPassword() {
    const searchParams = useSearchParams()
    const { resetPassword, loading } = useAuth()
    const [token, setToken] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [error, setError] = useState("")
    const [isSuccess, setIsSuccess] = useState(false)
    const [isTokenValid, setIsTokenValid] = useState(true)

    useEffect(() => {
        const tokenParam = searchParams.get("token")

        if (tokenParam) {
            setToken(tokenParam)
            // Here you would validate the token with your backend
            // For now, we'll assume it's valid
            setIsTokenValid(true)
        } else {
            setIsTokenValid(false)
        }
    }, [searchParams])

    // Update the handleSubmit function to match the backend's expected format
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")

        // Validate passwords
        if (!password || !confirmPassword) {
            setError("Please fill in all fields")
            return
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match")
            return
        }

        if (password.length < 8) {
            setError("Password must be at least 8 characters long")
            return
        }

        try {
            const resetRequest: PasswordResetRequest = {
                token,
                password,
                confirmPassword,
            }

            await resetPassword(resetRequest)
            setIsSuccess(true)
        } catch (err: any) {
            setError(err.message || "Failed to reset password. Please try again.")
        }
    }

    if (!isTokenValid) {
        return (
            <>
                <Navbar />
                <main className="max-w-7xl mx-auto min-h-screen flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                    <div className="w-full max-w-md">
                        <div className="flex justify-center mb-8">
                            <Image src={Company || "/placeholder.svg"} alt="Company Icon" className="w-24 h-24" />
                        </div>
                        <div className="bg-gray-900 p-8 rounded-lg shadow-md text-center">
                            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                                <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-medium text-white mb-2">Invalid or Expired Link</h3>
                            <p className="text-gray-300 mb-6">
                                The password reset link is invalid or has expired. Please request a new password reset link.
                            </p>
                            <Link
                                href="/forgot-password/company"
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-[#DDB40C] to-[#D18B0A] hover:from-[#C9A40B] hover:to-[#BD7D09] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                            >
                                Request new link
                            </Link>
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
            <main className="max-w-7xl mx-auto min-h-screen flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="w-full max-w-md">
                    <div className="flex justify-center mb-8">
                        <Image src={Company || "/placeholder.svg"} alt="Company Icon" className="w-24 h-24" />
                    </div>

                    {!isSuccess ? (
                        <>
                            <h2 className="mt-6 text-center text-3xl font-extrabold text-white">Create new password</h2>
                            <p className="mt-2 text-center text-sm text-gray-300">Please enter your new password below.</p>

                            <div className="mt-8">
                                {error && (
                                    <div
                                        className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
                                        role="alert"
                                    >
                                        <span className="block sm:inline">{error}</span>
                                    </div>
                                )}

                                <form className="space-y-6" onSubmit={handleSubmit}>
                                    <div>
                                        <label htmlFor="password" className="block text-sm font-medium text-white">
                                            New Password
                                        </label>
                                        <div className="mt-1">
                                            <input
                                                id="password"
                                                name="password"
                                                type="password"
                                                autoComplete="new-password"
                                                required
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
                                            />
                                        </div>
                                        <p className="mt-1 text-xs text-gray-400">Password must be at least 8 characters long</p>
                                    </div>

                                    <div>
                                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-white">
                                            Confirm New Password
                                        </label>
                                        <div className="mt-1">
                                            <input
                                                id="confirmPassword"
                                                name="confirmPassword"
                                                type="password"
                                                autoComplete="new-password"
                                                required
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 sm:text-sm"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-[#DDB40C] to-[#D18B0A] hover:from-[#C9A40B] hover:to-[#BD7D09] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                                        >
                                            {loading ? "Resetting..." : "Reset Password"}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </>
                    ) : (
                        <div className="bg-gray-900 p-8 rounded-lg shadow-md text-center">
                            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                                <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-medium text-white mb-2">Password Reset Successful</h3>
                            <p className="text-gray-300 mb-6">
                                Your password has been successfully reset. You can now log in with your new password.
                            </p>
                            <Link
                                href="/login/company"
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-[#DDB40C] to-[#D18B0A] hover:from-[#C9A40B] hover:to-[#BD7D09] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                            >
                                Go to Login
                            </Link>
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </>
    )
}

