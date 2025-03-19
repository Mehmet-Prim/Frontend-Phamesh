"use client"

import type React from "react"
import { useState } from "react"

import { Navbar } from "@/app/components/Navbar"
import { Footer } from "@/app/components/Footer"
import Link from "next/link"
import Company from "@/public/icons/companyIcon.png"
import Image from "next/image"
import { useAuth } from "@/hooks/useAuth"
import { UserRole } from "@/types/auth"

export default function CompanyForgotPassword() {
    const { forgotPassword, loading } = useAuth()
    const [email, setEmail] = useState("")
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [error, setError] = useState("")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")

        // Validate email
        if (!email) {
            setError("Please enter your email address")
            return
        }

        try {
            await forgotPassword(email, UserRole.COMPANY)
            // Show success message
            setIsSubmitted(true)
        } catch (err: any) {
            setError(err.message || "Failed to send password reset email. Please try again.")
        }
    }

    return (
        <>
            <Navbar />
            <main className="max-w-7xl mx-auto min-h-screen flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="w-full max-w-md">
                    <div className="flex justify-center mb-8">
                        <Image src={Company || "/placeholder.svg"} alt="Company Icon" className="w-24 h-24" />
                    </div>

                    {!isSubmitted ? (
                        <>
                            <h2 className="mt-6 text-center text-5xl font-extrabold text-white">Reset your password</h2>
                            <p className="mt-2 text-center text-xl text-gray-300">
                                Enter your company email address and we&#39;ll send you a link to reset your password.
                            </p>

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
                                                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-600 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 text-2xl"
                                                placeholder="company@example.com"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-2xl font-medium text-white bg-gradient-to-r from-[#DDB40C] to-[#D18B0A] hover:from-[#C9A40B] hover:to-[#BD7D09] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                                        >
                                            {loading ? "Sending..." : "Send reset link"}
                                        </button>
                                    </div>
                                </form>

                                <div className="mt-6 text-center">
                                    <Link href="/login/company" className="font-medium text-2xl text-yellow-300 hover:text-yellow-200">
                                        Back to login
                                    </Link>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="bg-gray-900 p-8 rounded-lg shadow-md text-center">
                            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                                <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h3 className="text-3xl font-medium text-white mb-2">Check your email</h3>
                            <p className="text-gray-300 mb-6 text-2xl">
                                We&#39;ve sent a password reset link to <span className="font-medium">{email}</span>. Please check your
                                inbox and follow the instructions to reset your password.
                            </p>
                            <p className="text-gray-400 text-2xl mb-6">
                                If you don&#39;t see the email, check your spam folder or make sure you entered the correct email
                                address.
                            </p>
                            <div className="flex flex-col space-y-4">
                                <button
                                    onClick={() => setIsSubmitted(false)}
                                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-2xl font-medium text-white bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                                >
                                    Try another email
                                </button>
                                <Link
                                    href="/login/company"
                                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-2xl font-medium text-white bg-gradient-to-r from-[#DDB40C] to-[#D18B0A] hover:from-[#C9A40B] hover:to-[#BD7D09] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                                >
                                    Return to login
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </>
    )
}

