"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { AuthService } from "@/lib/services/auth-service"
import { Navbar } from "@/app/components/Navbar"
import { Footer } from "@/app/components/Footer"

export default function CompanyRegisterPage() {
    const [email, setEmail] = useState("")
    const [companyName, setCompanyName] = useState("")
    const [phone, setPhone] = useState("")
    const [location, setLocation] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [contactPerson, setContactPerson] = useState("")
    const [contactEmail, setContactEmail] = useState("")
    const [niche, setNiche] = useState("technology")
    const [termsAgreed, setTermsAgreed] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [socialMedia, setSocialMedia] = useState({
        tiktok: false,
        youtube: false,
        twitch: false,
        instagram: false,
        facebook: false,
        twitter: false,
        snapchat: false,
        whatsapp: false,
    })
    const router = useRouter()

    const handleSocialMediaChange = (platform: string) => {
        setSocialMedia({
            ...socialMedia,
            [platform]: !socialMedia[platform as keyof typeof socialMedia],
        })
    }

    const validateForm = () => {
        if (!email || !companyName || !password || !confirmPassword) {
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

            await AuthService.registerCompany(
                email,
                password,
                companyName,
                contactPerson || companyName,
                undefined, // companySize
                niche, // industry
                undefined, // website
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
                    <h1 className="font-extrabold text-5xl">Company</h1>
                    <p className="text-xl">Sign in with the company information</p>
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
                                Mail-address<span className="text-red-500">*</span>
                            </label>
                            <input
                                type="email"
                                placeholder="phamesh@company.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="block font-medium">
                                Company name<span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                placeholder="Phamesh"
                                value={companyName}
                                onChange={(e) => setCompanyName(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="block font-medium">Telefon</label>
                            <input
                                type="tel"
                                placeholder="+49xxxxxxxx"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="block font-medium">Location</label>
                            <input
                                type="text"
                                placeholder="Pham Str. 99 in Eshtown"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                        <h6 className="font-medium mb-3">Select in which niche the company works in</h6>
                        <div className="flex items-center justify-center">
                            <select
                                value={niche}
                                onChange={(e) => setNiche(e.target.value)}
                                className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="technology">Technology</option>
                                <option value="fashion">Fashion</option>
                                <option value="food">Food & Beverage</option>
                                <option value="health">Health & Wellness</option>
                                <option value="beauty">Beauty</option>
                                <option value="travel">Travel</option>
                                <option value="gaming">Gaming</option>
                                <option value="finance">Finance</option>
                                <option value="education">Education</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-4 mb-8">
                        <h2 className="font-bold text-2xl">Contacts</h2>
                        <p className="text-gray-500">All given info is shown in company profile</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                        <div className="space-y-2">
                            <label className="block font-medium">Contact person</label>
                            <input
                                type="text"
                                placeholder="Pham Esh"
                                value={contactPerson}
                                onChange={(e) => setContactPerson(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <p className="text-gray-500 text-sm">Person that interacts via email with the content creators</p>
                        </div>
                        <div className="space-y-2">
                            <label className="block font-medium">Contact-mail-address</label>
                            <input
                                type="email"
                                placeholder="pham.contact@company.com"
                                value={contactEmail}
                                onChange={(e) => setContactEmail(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <p className="text-gray-500 text-sm">
                                The mail-address that you want to interact with the content creators
                            </p>
                        </div>
                    </div>

                    <div className="mb-12">
                        <div className="mb-4">
                            <h2 className="font-bold text-2xl">Where you want to be promoted</h2>
                            <p className="text-gray-500">Select social media platforms where your ads should be uploaded</p>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            <div className="flex flex-col items-center">
                                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                                    <span className="text-2xl">TT</span>
                                </div>
                                <label className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        checked={socialMedia.tiktok}
                                        onChange={() => handleSocialMediaChange("tiktok")}
                                        className="h-4 w-4"
                                    />
                                    <span>TikTok</span>
                                </label>
                            </div>
                            <div className="flex flex-col items-center">
                                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-2">
                                    <span className="text-2xl">YT</span>
                                </div>
                                <label className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        checked={socialMedia.youtube}
                                        onChange={() => handleSocialMediaChange("youtube")}
                                        className="h-4 w-4"
                                    />
                                    <span>YouTube</span>
                                </label>
                            </div>
                            <div className="flex flex-col items-center">
                                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-2">
                                    <span className="text-2xl">TW</span>
                                </div>
                                <label className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        checked={socialMedia.twitch}
                                        onChange={() => handleSocialMediaChange("twitch")}
                                        className="h-4 w-4"
                                    />
                                    <span>Twitch</span>
                                </label>
                            </div>
                            <div className="flex flex-col items-center">
                                <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mb-2">
                                    <span className="text-2xl">IG</span>
                                </div>
                                <label className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        checked={socialMedia.instagram}
                                        onChange={() => handleSocialMediaChange("instagram")}
                                        className="h-4 w-4"
                                    />
                                    <span>Instagram</span>
                                </label>
                            </div>
                            <div className="flex flex-col items-center">
                                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                                    <span className="text-2xl">FB</span>
                                </div>
                                <label className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        checked={socialMedia.facebook}
                                        onChange={() => handleSocialMediaChange("facebook")}
                                        className="h-4 w-4"
                                    />
                                    <span>Facebook</span>
                                </label>
                            </div>
                            <div className="flex flex-col items-center">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-2">
                                    <span className="text-2xl">X</span>
                                </div>
                                <label className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        checked={socialMedia.twitter}
                                        onChange={() => handleSocialMediaChange("twitter")}
                                        className="h-4 w-4"
                                    />
                                    <span>X/Twitter</span>
                                </label>
                            </div>
                            <div className="flex flex-col items-center">
                                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-2">
                                    <span className="text-2xl">SC</span>
                                </div>
                                <label className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        checked={socialMedia.snapchat}
                                        onChange={() => handleSocialMediaChange("snapchat")}
                                        className="h-4 w-4"
                                    />
                                    <span>Snapchat</span>
                                </label>
                            </div>
                            <div className="flex flex-col items-center">
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-2">
                                    <span className="text-2xl">WA</span>
                                </div>
                                <label className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        checked={socialMedia.whatsapp}
                                        onChange={() => handleSocialMediaChange("whatsapp")}
                                        className="h-4 w-4"
                                    />
                                    <span>WhatsApp</span>
                                </label>
                            </div>
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
                            className="bg-blue-600 text-white py-3 px-8 rounded-md font-medium hover:bg-blue-700 transition-colors w-full md:w-auto"
                            disabled={loading}
                        >
                            {loading ? "Processing..." : "Sign Up"}
                        </button>
                        <p className="mt-4">
                            Already got an account?{" "}
                            <Link href="/login" className="underline text-blue-600">
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

