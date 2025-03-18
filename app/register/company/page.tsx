"use client"

import type React from "react"
import { Navbar } from "@/app/components/Navbar"
import { Footer } from "@/app/components/Footer"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Company from "@/public/icons/companyIcon.png"
import Image from "next/image"
import { AuthService } from "@/lib/auth"
import type { RegistrationRequest } from "@/types/auth"
import { testApiConnection } from "@/lib/api-connection-helper"

export default function CompanyRegister() {
    const router = useRouter()
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        confirmPassword: "",
        companyName: "",
        contactName: "",
        companySize: "",
        industry: "",
        website: "",
        termsAgreed: false,
    })
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const [debugInfo, setDebugInfo] = useState<string | null>(null)
    const [connectionStatus, setConnectionStatus] = useState<"untested" | "testing" | "success" | "failed">("untested")

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target as HTMLInputElement
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
        }))
    }

    const testConnection = async () => {
        setConnectionStatus("testing")
        setDebugInfo("Testing API connection...")

        try {
            const results = await testApiConnection()
            setDebugInfo(JSON.stringify(results, null, 2))
            setConnectionStatus(results.overallSuccess ? "success" : "failed")
        } catch (err) {
            setDebugInfo("Error testing connection: " + JSON.stringify(err))
            setConnectionStatus("failed")
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setDebugInfo(null)

        // Validate form
        if (!formData.companyName || !formData.email || !formData.password || !formData.confirmPassword) {
            setError("Please fill in all required fields")
            return
        }

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match")
            return
        }

        if (formData.password.length < 8) {
            setError("Password must be at least 8 characters long")
            return
        }

        if (!formData.termsAgreed) {
            setError("You must agree to the Terms of Service and Privacy Policy")
            return
        }

        setLoading(true)

        try {
            // Log the API URL for debugging
            const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"
            setDebugInfo(`Attempting registration with API URL: ${API_URL}/api/auth/register/company`)

            const registrationRequest: RegistrationRequest = {
                email: formData.email,
                password: formData.password,
                companyName: formData.companyName,
                contactName: formData.contactName,
                companySize: formData.companySize,
                industry: formData.industry,
                website: formData.website,
                termsAgreed: formData.termsAgreed,
            }

            // Use the AuthService directly for registration
            const response = await AuthService.registerCompany(registrationRequest)

            if (response.success) {
                router.push("/login/company?registered=true")
                return
            }

            // If registration failed, show the error message
            setError(response.message || "Registration failed. Please try again.")

            // If there's a connection issue, test the API connection
            if (response.message?.includes("failed") || response.message?.includes("Failed to fetch")) {
                await testConnection()
            }
        } catch (err: any) {
            console.error("Registration error:", err)
            setError(
                err.message || "An error occurred during registration. Please check your internet connection and try again.",
            )

            // Test connection on error
            await testConnection()
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <Navbar />
            <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto">
                    <div className="flex justify-center mb-8">
                        <Image src={Company || "/placeholder.svg"} alt="Company Icon" className="w-24 h-24" />
                    </div>
                    <h2 className="mt-6 text-center text-5xl font-extrabold text-white">Register Your Company</h2>
                    <p className="mt-2 text-center text-2xl text-gray-300">
                        Or{" "}
                        <Link href="/login/company" className="font-medium text-2xl text-yellow-300 hover:text-yellow-200">
                            sign in if you already have an account
                        </Link>
                    </p>

                    <div className="mt-8">
                        {error && (
                            <div
                                className="bg-red-100 border border-red-400 text-red-700 px-4 text-2xl py-3 rounded relative mb-4"
                                role="alert"
                            >
                                <span className="block sm:inline">{error}</span>
                            </div>
                        )}

                        {debugInfo && (
                            <div
                                className="bg-blue-50 border border-blue-400 text-blue-700 px-4 py-3 rounded relative mb-4"
                                role="alert"
                            >
                                <span className="block sm:inline font-mono text-xs whitespace-pre-wrap">{debugInfo}</span>
                            </div>
                        )}

                        {connectionStatus === "testing" && (
                            <div className="bg-yellow-50 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative mb-4">
                                <span className="block sm:inline">Testing API connection...</span>
                            </div>
                        )}

                        {connectionStatus === "failed" && (
                            <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                <span className="block sm:inline">
                  API connection test failed. Check the debug information for details.
                </span>
                                <button
                                    onClick={testConnection}
                                    className="mt-2 px-3 py-1 bg-red-200 text-red-800 rounded hover:bg-red-300"
                                >
                                    Test Again
                                </button>
                            </div>
                        )}

                        <form className="space-y-6" onSubmit={handleSubmit}>
                            <div className="bg-gray-900 p-6 rounded-lg shadow-md">
                                <h3 className="text-3xl font-medium text-white mb-4">Company Information</h3>
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                    <div>
                                        <label htmlFor="companyName" className="block text-2xl font-medium text-white">
                                            Company Name <span className="text-red-500">*</span>
                                        </label>
                                        <div className="mt-1">
                                            <input
                                                id="companyName"
                                                name="companyName"
                                                type="text"
                                                required
                                                value={formData.companyName}
                                                onChange={handleChange}
                                                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 text-2xl text-white"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="contactName" className="block text-2xl font-medium text-white">
                                            Contact Person Name
                                        </label>
                                        <div className="mt-1">
                                            <input
                                                id="contactName"
                                                name="contactName"
                                                type="text"
                                                value={formData.contactName}
                                                onChange={handleChange}
                                                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 text-2xl text-white"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="industry" className="block text-2xl font-medium text-white">
                                            Industry
                                        </label>
                                        <div className="mt-1">
                                            <select
                                                id="industry"
                                                name="industry"
                                                value={formData.industry}
                                                onChange={handleChange}
                                                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 text-2xl text-white"
                                            >
                                                <option value="">Select Industry</option>
                                                <option value="technology">Technology</option>
                                                <option value="finance">Finance</option>
                                                <option value="healthcare">Healthcare</option>
                                                <option value="education">Education</option>
                                                <option value="retail">Retail</option>
                                                <option value="manufacturing">Manufacturing</option>
                                                <option value="entertainment">Entertainment</option>
                                                <option value="beauty">Beauty</option>
                                                <option value="other">Other</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="companySize" className="block text-2xl font-medium text-white">
                                            Company Size
                                        </label>
                                        <div className="mt-1">
                                            <select
                                                id="companySize"
                                                name="companySize"
                                                value={formData.companySize}
                                                onChange={handleChange}
                                                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 text-2xl text-white"
                                            >
                                                <option value="">Select Company Size</option>
                                                <option value="1-10">1-10 employees</option>
                                                <option value="11-50">11-50 employees</option>
                                                <option value="51-200">51-200 employees</option>
                                                <option value="201-500">201-500 employees</option>
                                                <option value="501-1000">501-1000 employees</option>
                                                <option value="1000+">1000+ employees</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="website" className="block text-2xl font-medium text-white">
                                            Website
                                        </label>
                                        <div className="mt-1">
                                            <input
                                                id="website"
                                                name="website"
                                                type="url"
                                                value={formData.website}
                                                onChange={handleChange}
                                                placeholder="https://example.com"
                                                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 text-2xl text-white"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-900 p-6 rounded-lg shadow-md">
                                <h3 className="text-3xl font-medium text-white mb-4">Account Information</h3>
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                    <div className="sm:col-span-2">
                                        <label htmlFor="email" className="block text-2xl font-medium text-white">
                                            Email Address <span className="text-red-500">*</span>
                                        </label>
                                        <div className="mt-1">
                                            <input
                                                id="email"
                                                name="email"
                                                type="email"
                                                autoComplete="email"
                                                required
                                                value={formData.email}
                                                onChange={handleChange}
                                                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 text-2xl text-white"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="password" className="block text-2xl font-medium text-white">
                                            Password <span className="text-red-500">*</span>
                                        </label>
                                        <div className="mt-1">
                                            <input
                                                id="password"
                                                name="password"
                                                type="password"
                                                autoComplete="new-password"
                                                required
                                                value={formData.password}
                                                onChange={handleChange}
                                                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 text-2xl text-white"
                                            />
                                        </div>
                                        <p className="mt-1 text-xl text-gray-400">Password must be at least 8 characters long</p>
                                    </div>

                                    <div>
                                        <label htmlFor="confirmPassword" className="block text-2xl font-medium text-white">
                                            Confirm Password <span className="text-red-500">*</span>
                                        </label>
                                        <div className="mt-1">
                                            <input
                                                id="confirmPassword"
                                                name="confirmPassword"
                                                type="password"
                                                autoComplete="new-password"
                                                required
                                                value={formData.confirmPassword}
                                                onChange={handleChange}
                                                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 text-2xl text-white"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center">
                                <input
                                    id="termsAgreed"
                                    name="termsAgreed"
                                    type="checkbox"
                                    required
                                    checked={formData.termsAgreed}
                                    onChange={handleChange}
                                    className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded"
                                />
                                <label htmlFor="termsAgreed" className="ml-2 block text-xl text-white">
                                    I agree to the{" "}
                                    <Link href="#" className="text-yellow-300 hover:text-yellow-200">
                                        Terms of Service
                                    </Link>{" "}
                                    and{" "}
                                    <Link href="#" className="text-yellow-300 hover:text-yellow-200">
                                        Privacy Policy
                                    </Link>
                                </label>
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-2xl font-medium text-white bg-gradient-to-r from-[#DDB40C] to-[#D18B0A] hover:from-[#C9A40B] hover:to-[#BD7D09] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                                >
                                    {loading ? "Creating account..." : "Create account"}
                                </button>
                            </div>
                        </form>

                        <div className="mt-6 text-center">
                            <Link href="/select-role" className="font-medium text-2xl text-yellow-300 hover:text-yellow-200">
                                Back to selection
                            </Link>
                        </div>

                        <div className="mt-6 text-center">
                            <button onClick={testConnection} className="text-sm text-gray-400 hover:text-gray-300 underline">
                                Test API Connection
                            </button>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    )
}

