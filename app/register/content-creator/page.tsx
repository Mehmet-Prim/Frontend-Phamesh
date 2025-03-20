"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { AuthService } from "@/lib/services/auth-service"
import { Navbar } from "@/app/components/Navbar"
import { Footer } from "@/app/components/Footer"

export default function ContentCreatorRegisterPage() {
    const [email, setEmail] = useState("")
    const [username, setUsername] = useState("")
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [bio, setBio] = useState("")
    const [contentType, setContentType] = useState("lifestyle")
    const [termsAgreed, setTermsAgreed] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [socialMedia, setSocialMedia] = useState({
        instagram: "",
        youtube: "",
        tiktok: "",
        twitter: "",
        twitch: "",
        snapchat: "",
        facebook: "",
    })
    const router = useRouter()

    const handleSocialMediaChange = (platform: string, value: string) => {
        setSocialMedia({
            ...socialMedia,
            [platform]: value,
        })
    }

    const validateForm = () => {
        if (!email || !username || !firstName || !lastName || !password || !confirmPassword) {
            setError("Bitte füllen Sie alle Pflichtfelder aus")
            return false
        }

        if (password !== confirmPassword) {
            setError("Die Passwörter stimmen nicht überein")
            return false
        }

        if (password.length < 8) {
            setError("Das Passwort muss mindestens 8 Zeichen lang sein")
            return false
        }

        if (!termsAgreed) {
            setError("Bitte stimmen Sie den Nutzungsbedingungen zu")
            return false
        }

        return true
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validateForm()) {
            return
        }

        try {
            setLoading(true)
            setError(null)

            await AuthService.registerCreator(
                email,
                password,
                firstName,
                lastName,
                username,
                contentType,
                bio,
                socialMedia.instagram,
                socialMedia.youtube,
                socialMedia.tiktok,
                socialMedia.twitter,
            )

            // Weiterleitung zur Verifizierungsseite mit E-Mail-Parameter
            router.push(`/auth/verify-email?email=${encodeURIComponent(email)}`)
        } catch (err: any) {
            console.error("Registration error:", err)
            setError(err.message || "Registrierung fehlgeschlagen. Bitte versuchen Sie es später erneut.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <Navbar />
            <div className="min-h-screen max-w-7xl mx-auto flex flex-col items-center justify-center p-4 py-20">
                <div className="text-center space-y-4 mb-8">
                    <h1 className="font-extrabold text-5xl">Content Creator</h1>
                    <p className="text-xl">Sign up to connect with companies and grow your audience</p>
                </div>

                {error && (
                    <div className="w-full max-w-4xl bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="w-full max-w-4xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div className="space-y-2">
                            <label className="block font-medium">
                                Email<span className="text-red-500">*</span>
                            </label>
                            <input
                                type="email"
                                placeholder="creator@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="block font-medium">
                                Username<span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                placeholder="@creatorname"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="block font-medium">
                                First Name<span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                placeholder="Your first name"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="block font-medium">
                                Last Name<span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                placeholder="Your last name"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div className="space-y-2">
                            <label className="block font-medium">
                                Password<span className="text-red-500">*</span>
                            </label>
                            <input
                                type="password"
                                placeholder="Enter password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="block font-medium">
                                Repeat password<span className="text-red-500">*</span>
                            </label>
                            <input
                                type="password"
                                placeholder="Repeat password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                    </div>

                    <div className="mb-8">
                        <div className="space-y-2">
                            <label className="block font-medium">Content Type</label>
                            <select
                                value={contentType}
                                onChange={(e) => setContentType(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="lifestyle">Lifestyle</option>
                                <option value="fashion">Fashion</option>
                                <option value="beauty">Beauty</option>
                                <option value="fitness">Fitness</option>
                                <option value="travel">Travel</option>
                                <option value="food">Food</option>
                                <option value="gaming">Gaming</option>
                                <option value="tech">Technology</option>
                                <option value="education">Education</option>
                                <option value="entertainment">Entertainment</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                    </div>

                    <div className="mb-8">
                        <div className="space-y-2">
                            <label className="block font-medium">Bio</label>
                            <textarea
                                placeholder="Tell us about yourself and your content..."
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[120px]"
                            />
                            <p className="text-gray-500 text-sm">This will be displayed on your profile (max 500 characters)</p>
                        </div>
                    </div>

                    <div className="space-y-4 mb-8">
                        <h2 className="font-bold text-2xl">Social Media Profiles</h2>
                        <p className="text-gray-500">Add your social media handles to connect with companies</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                        <div className="space-y-2">
                            <label className="block font-medium">Instagram</label>
                            <div className="flex items-center">
                                <span className="bg-gray-100 p-3 rounded-l-md border border-r-0 border-gray-300">@</span>
                                <input
                                    type="text"
                                    placeholder="username"
                                    value={socialMedia.instagram}
                                    onChange={(e) => handleSocialMediaChange("instagram", e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="block font-medium">YouTube</label>
                            <input
                                type="text"
                                placeholder="Channel name or URL"
                                value={socialMedia.youtube}
                                onChange={(e) => handleSocialMediaChange("youtube", e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="block font-medium">TikTok</label>
                            <div className="flex items-center">
                                <span className="bg-gray-100 p-3 rounded-l-md border border-r-0 border-gray-300">@</span>
                                <input
                                    type="text"
                                    placeholder="username"
                                    value={socialMedia.tiktok}
                                    onChange={(e) => handleSocialMediaChange("tiktok", e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="block font-medium">X/Twitter</label>
                            <div className="flex items-center">
                                <span className="bg-gray-100 p-3 rounded-l-md border border-r-0 border-gray-300">@</span>
                                <input
                                    type="text"
                                    placeholder="username"
                                    value={socialMedia.twitter}
                                    onChange={(e) => handleSocialMediaChange("twitter", e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="block font-medium">Twitch</label>
                            <input
                                type="text"
                                placeholder="Channel name"
                                value={socialMedia.twitch}
                                onChange={(e) => handleSocialMediaChange("twitch", e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="block font-medium">Other Platforms</label>
                            <input
                                type="text"
                                placeholder="Other social media platforms"
                                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    <div className="mt-8 flex flex-col items-center">
                        <div className="flex items-center justify-center mb-4">
                            <label className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    checked={termsAgreed}
                                    onChange={() => setTermsAgreed(!termsAgreed)}
                                    className="h-4 w-4"
                                    required
                                />
                                <span className="text-gray-500">I agree with the EULA and terms</span>
                            </label>
                        </div>
                        <button
                            type="submit"
                            className="bg-pink-600 text-white py-3 px-8 rounded-md font-medium hover:bg-pink-700 transition-colors w-full md:w-auto"
                            disabled={loading}
                        >
                            {loading ? "Processing..." : "Sign Up"}
                        </button>
                        <p className="mt-4">
                            Already got an account?{" "}
                            <Link href="/login" className="underline text-pink-600">
                                Log In
                            </Link>
                        </p>
                    </div>
                </form>
            </div>
            <Footer />
        </>
    )
}

