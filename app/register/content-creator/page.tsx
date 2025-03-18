"use client"

import type React from "react"
import { Navbar } from "@/app/components/Navbar"
import { Footer } from "@/app/components/Footer"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import ContentCreator from "@/public/icons/contentCreatorIcon.png"
import Image from "next/image"
import { AuthService } from "@/lib/auth"
import type { RegistrationRequest } from "@/types/auth"
import { testApiConnection } from "@/lib/api-connection-helper"

export default function ContentCreatorRegister() {
    const router = useRouter()
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        contentType: "",
        socialMedia: {
            instagram: "",
            youtube: "",
            tiktok: "",
            twitter: "",
        },
        bio: "",
        termsAgreed: false,
    })
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const [debugInfo, setDebugInfo] = useState<string | null>(null)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target as HTMLInputElement & { type: string };

        if (name.includes(".")) {
            const [parent, child] = name.split(".");
            setFormData((prev) => ({
                ...prev,
                [parent]: {
                    ...(prev[parent as keyof typeof prev] as Record<string, string>),
                    [child]: value,
                },
            }));
        } else if (type === "checkbox") {
            setFormData((prev) => ({
                ...prev,
                [name]: (e.target as HTMLInputElement).checked,
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setDebugInfo(null);

        // Validate form
        if (
            !formData.firstName ||
            !formData.lastName ||
            !formData.email ||
            !formData.password ||
            !formData.confirmPassword
        ) {
            setError("Please fill in all required fields");
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        if (formData.password.length < 8) {
            setError("Password must be at least 8 characters long");
            return;
        }

        if (!formData.termsAgreed) {
            setError("You must agree to the Terms of Service and Privacy Policy");
            return;
        }

        setLoading(true);

        try {
            // Log the API URL for debugging
            const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
            setDebugInfo(`Attempting registration with API URL: ${API_URL}/api/auth/register/content-creator`);

            // Prepare registration data for Spring Boot
            const registrationRequest: RegistrationRequest = {
                email: formData.email,
                password: formData.password,
                firstName: formData.firstName,
                lastName: formData.lastName,
                username: formData.username || `${formData.firstName.toLowerCase()}.${formData.lastName.toLowerCase()}`,
                contentType: formData.contentType,
                bio: formData.bio,
                socialMedia: formData.socialMedia,
                termsAgreed: formData.termsAgreed,
            };

            // Use the AuthService for registration
            const response = await AuthService.registerContentCreator(registrationRequest);

            if (response.success) {
                router.push("/login/content-creator?registered=true");
                return;
            }

            // If registration failed, show the error message
            setError(response.message || "Registration failed. Please try again.");

            // If there's a connection issue, test the API connection
            if (response.message?.includes("failed") || response.message?.includes("Failed to fetch")) {
                const connectionTest = await testApiConnection();
                setDebugInfo(JSON.stringify(connectionTest, null, 2));
            }
        } catch (err: any) {
            console.error("Registration error:", err);
            setError(
                err.message || "An error occurred during registration. Please check your internet connection and try again.",
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Navbar />
            <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto">
                    <div className="flex justify-center mb-8">
                        <Image src={ContentCreator || "/placeholder.svg"} alt="Content Creator Icon" className="w-24 h-24" />
                    </div>
                    <h2 className="mt-6 text-center text-5xl font-extrabold text-white">Register as a Content Creator</h2>
                    <p className="mt-2 text-center text-2xl text-gray-300">
                        Or{" "}
                        <Link href="/login/content-creator" className="font-medium text-red-300 hover:text-red-200">
                            sign in if you already have an account
                        </Link>
                    </p>

                    <div className="mt-8">
                        {error && (
                            <div
                                className="bg-red-100 border text-2xl border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
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

                        <form className="space-y-6" onSubmit={handleSubmit}>
                            <div className="bg-gray-900 p-6 rounded-lg shadow-md">
                                <h3 className="text-3xl font-medium text-white mb-4">Personal Information</h3>
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                    <div>
                                        <label htmlFor="firstName" className="block text-2xl font-medium text-white">
                                            First Name <span className="text-red-500">*</span>
                                        </label>
                                        <div className="mt-1">
                                            <input
                                                id="firstName"
                                                name="firstName"
                                                type="text"
                                                required
                                                value={formData.firstName}
                                                onChange={handleChange}
                                                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 text-white text-2xl"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="lastName" className="block text-2xl font-medium text-white">
                                            Last Name <span className="text-red-500">*</span>
                                        </label>
                                        <div className="mt-1">
                                            <input
                                                id="lastName"
                                                name="lastName"
                                                type="text"
                                                required
                                                value={formData.lastName}
                                                onChange={handleChange}
                                                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 text-2xl text-white"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="username" className="block text-2xl font-medium text-white">
                                            Username
                                        </label>
                                        <div className="mt-1">
                                            <input
                                                id="username"
                                                name="username"
                                                type="text"
                                                value={formData.username}
                                                onChange={handleChange}
                                                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 text-2xl text-white"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="contentType" className="block text-2xl font-medium text-white">
                                            Content Type
                                        </label>
                                        <div className="mt-1">
                                            <select
                                                id="contentType"
                                                name="contentType"
                                                value={formData.contentType}
                                                onChange={handleChange}
                                                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 text-white text-2xl"
                                            >
                                                <option value="">Select Content Type</option>
                                                <option value="video">Video Creator</option>
                                                <option value="photo">Photographer</option>
                                                <option value="blog">Blogger</option>
                                                <option value="podcast">Podcaster</option>
                                                <option value="music">Musician</option>
                                                <option value="art">Artist</option>
                                                <option value="other">Other</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="sm:col-span-2">
                                        <label htmlFor="bio" className="block text-2xl font-medium text-white">
                                            Bio
                                        </label>
                                        <div className="mt-1">
                      <textarea
                          id="bio"
                          name="bio"
                          rows={3}
                          value={formData.bio}
                          onChange={handleChange}
                          className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 text-2xl text-white"
                          placeholder="Tell us about yourself and your content..."
                      />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-900 p-6 rounded-lg shadow-md">
                                <h3 className="text-3xl font-medium text-white mb-4">Social Media</h3>
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                    <div>
                                        <label htmlFor="instagram" className="block text-2xl font-medium text-white">
                                            Instagram
                                        </label>
                                        <div className="mt-1 relative rounded-md shadow-sm">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <span className="text-gray-500 text-2xl">@</span>
                                            </div>
                                            <input
                                                id="instagram"
                                                name="socialMedia.instagram"
                                                type="text"
                                                value={formData.socialMedia.instagram}
                                                onChange={handleChange}
                                                className="appearance-none block w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 text-2xl text-white"
                                                placeholder="username"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="youtube" className="block text-2xl font-medium text-white">
                                            YouTube
                                        </label>
                                        <div className="mt-1">
                                            <input
                                                id="youtube"
                                                name="socialMedia.youtube"
                                                type="text"
                                                value={formData.socialMedia.youtube}
                                                onChange={handleChange}
                                                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 text-2xl text-white"
                                                placeholder="Channel URL"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="tiktok" className="block text-2xl font-medium text-white">
                                            TikTok
                                        </label>
                                        <div className="mt-1 relative rounded-md shadow-sm">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <span className="text-gray-500 text-2xl">@</span>
                                            </div>
                                            <input
                                                id="tiktok"
                                                name="socialMedia.tiktok"
                                                type="text"
                                                value={formData.socialMedia.tiktok}
                                                onChange={handleChange}
                                                className="appearance-none block w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 text-2xl text-white"
                                                placeholder="username"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label htmlFor="twitter" className="block text-2xl font-medium text-white">
                                            Twitter/X
                                        </label>
                                        <div className="mt-1 relative rounded-md shadow-sm">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <span className="text-gray-500 text-2xl">@</span>
                                            </div>
                                            <input
                                                id="twitter"
                                                name="socialMedia.twitter"
                                                type="text"
                                                value={formData.socialMedia.twitter}
                                                onChange={handleChange}
                                                className="appearance-none block w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 text-2xl text-white"
                                                placeholder="username"
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
                                                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 text-2xl text-white"
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
                                                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 text-2xl text-white"
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
                                                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-red-500 focus:border-red-500 text-2xl text-white"
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
                                    className="size-5 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                                />
                                <label htmlFor="termsAgreed" className="ml-2 block text-2xl text-white">
                                    I agree to the{" "}
                                    <Link href="#" className="text-red-300 hover:text-red-200">
                                        Terms of Service
                                    </Link>{" "}
                                    and{" "}
                                    <Link href="#" className="text-red-300 hover:text-red-200">
                                        Privacy Policy
                                    </Link>
                                </label>
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-2xl font-medium text-white bg-gradient-to-r from-[#DB134C] to-[#A31113] hover:from-[#C41145] hover:to-[#910F11] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                >
                                    {loading ? "Creating account..." : "Create account"}
                                </button>
                            </div>
                        </form>

                        <div className="mt-6 text-center">
                            <Link href="/select-role" className="font-medium text-2xl text-red-300 hover:text-red-200">
                                Back to selection
                            </Link>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    )
}

