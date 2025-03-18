"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Navbar } from "@/app/components/Navbar"
import { Footer } from "@/app/components/Footer"
import { AuthService } from "@/lib/auth"
import Link from "next/link"

export default function VerifyEmail() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const [status, setStatus] = useState<"loading" | "success" | "error" | "manual">("loading")
    const [message, setMessage] = useState("")
    const [email, setEmail] = useState("")
    const [code, setCode] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)

    useEffect(() => {
        const token = searchParams.get("token")
        const emailParam = searchParams.get("email")
        const codeParam = searchParams.get("code")

        if (emailParam) {
            setEmail(emailParam)
        }

        if (codeParam) {
            setCode(codeParam)
        }

        if (token) {
            verifyWithToken(token)
        } else if (emailParam && codeParam) {
            // Automatisch verifizieren, wenn E-Mail und Code in der URL sind
            handleManualVerification(new Event("submit") as any)
        } else {
            setStatus("manual")
        }
    }, [searchParams])

    const verifyWithToken = async (token: string) => {
        try {
            const response = await AuthService.verifyEmail(token)
            setStatus("success")
            setMessage(response.message || "Email verified successfully!")
        } catch (error: any) {
            setStatus("error")
            setMessage(error.message || "Failed to verify email. The link may be expired or invalid.")
        }
    }

    const handleManualVerification = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            const response = await AuthService.verifyEmailWithCode(email, code)
            setStatus("success")
            setMessage(response.message || "Email verified successfully!")
        } catch (error: any) {
            setStatus("error")
            setMessage(error.message || "Failed to verify email. The code may be expired or invalid.")
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleResendVerification = async () => {
        if (!email) {
            setMessage("Please enter your email address")
            return
        }

        try {
            const response = await AuthService.resendVerificationEmail(email)
            setMessage("Verification email has been resent. Please check your inbox.")
        } catch (error: any) {
            setMessage(error.message || "Failed to resend verification email.")
        }
    }

    return (
        <>
            <Navbar />
            <main className="max-w-7xl mx-auto min-h-screen flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="w-full max-w-md">
                    <div className="bg-gray-900 p-8 rounded-lg shadow-md text-center">
                        {status === "loading" && (
                            <div className="flex flex-col items-center">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mb-4"></div>
                                <h3 className="text-xl font-medium text-white mb-2">Verifying your email...</h3>
                                <p className="text-gray-300">Please wait while we verify your email address.</p>
                            </div>
                        )}

                        {status === "success" && (
                            <div>
                                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                                    <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-medium text-white mb-2">Email Verified!</h3>
                                <p className="text-gray-300 mb-6">{message}</p>
                                <Link
                                    href="/login/company"
                                    className="inline-block mr-4 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-[#DDB40C] to-[#D18B0A] hover:from-[#C9A40B] hover:to-[#BD7D09] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                                >
                                    Login as Company
                                </Link>
                                <Link
                                    href="/login/content-creator"
                                    className="inline-block py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-[#DB134C] to-[#A31113] hover:from-[#C41145] hover:to-[#910F11] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                >
                                    Login as Content Creator
                                </Link>
                            </div>
                        )}

                        {status === "manual" && (
                            <div>
                                <h3 className="text-xl font-medium text-white mb-4">Verify Your Email</h3>
                                <p className="text-gray-300 mb-6">
                                    Please enter the verification code that was sent to your email address.
                                </p>

                                {message && (
                                    <div
                                        className={`mb-4 p-3 rounded ${message.includes("success") ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                                    >
                                        {message}
                                    </div>
                                )}

                                <form onSubmit={handleManualVerification} className="space-y-4">
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium text-white text-left">
                                            Email Address
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="code" className="block text-sm font-medium text-white text-left">
                                            Verification Code
                                        </label>
                                        <input
                                            type="text"
                                            id="code"
                                            value={code}
                                            onChange={(e) => setCode(e.target.value)}
                                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                            required
                                            maxLength={6}
                                            minLength={6}
                                            placeholder="Enter 6-digit code"
                                        />
                                    </div>

                                    <div className="flex flex-col space-y-3">
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                        >
                                            {isSubmitting ? "Verifying..." : "Verify Email"}
                                        </button>

                                        <button
                                            type="button"
                                            onClick={handleResendVerification}
                                            className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                        >
                                            Resend Verification Email
                                        </button>
                                    </div>
                                </form>

                                <div className="mt-6">
                                    <Link href="/select-role" className="text-sm font-medium text-indigo-400 hover:text-indigo-300">
                                        Back to selection
                                    </Link>
                                </div>
                            </div>
                        )}

                        {status === "error" && (
                            <div>
                                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                                    <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-medium text-white mb-2">Verification Failed</h3>
                                <p className="text-gray-300 mb-6">{message}</p>

                                <div className="space-y-4">
                                    <div>
                                        <h4 className="text-md font-medium text-white mb-2">Enter Verification Code</h4>
                                        <form onSubmit={handleManualVerification} className="space-y-4">
                                            <div>
                                                <label htmlFor="email" className="block text-sm font-medium text-white text-left">
                                                    Email Address
                                                </label>
                                                <input
                                                    type="email"
                                                    id="email"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                    required
                                                />
                                            </div>

                                            <div>
                                                <label htmlFor="code" className="block text-sm font-medium text-white text-left">
                                                    Verification Code
                                                </label>
                                                <input
                                                    type="text"
                                                    id="code"
                                                    value={code}
                                                    onChange={(e) => setCode(e.target.value)}
                                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                                    required
                                                    maxLength={6}
                                                    minLength={6}
                                                    placeholder="Enter 6-digit code"
                                                />
                                            </div>

                                            <button
                                                type="submit"
                                                disabled={isSubmitting}
                                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                            >
                                                {isSubmitting ? "Verifying..." : "Verify Email"}
                                            </button>
                                        </form>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={handleResendVerification}
                                        className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    >
                                        Resend Verification Email
                                    </button>

                                    <Link
                                        href="/select-role"
                                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                                    >
                                        Back to Home
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
            <Footer />
        </>
    )
}

