"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2 } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { authService } from "@/services/auth-service"
import EnhancedApiDebugger from "@/components/enhanced-api-debugger"

export default function RegistrationFormWithDebug() {
    const [activeTab, setActiveTab] = useState("company")
    const [formData, setFormData] = useState({
        // Common fields
        email: "",
        password: "",
        confirmPassword: "",
        termsAgreed: false,

        // Company fields
        companyName: "",
        contactName: "",
        companySize: "",
        industry: "",
        website: "",

        // Content Creator fields
        firstName: "",
        lastName: "",
        username: "",
        contentType: "",
        bio: "",

        // Social Media
        instagram: "",
        youtube: "",
        tiktok: "",
        twitter: "",
    })
    const [error, setError] = useState("")
    const [success, setSuccess] = useState(false)
    const [loading, setLoading] = useState(false)
    const [showDebugger, setShowDebugger] = useState(false)
    const router = useRouter()

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleCheckboxChange = (name: string, checked: boolean) => {
        setFormData((prev) => ({ ...prev, [name]: checked }))
    }

    const validateForm = () => {
        // Check required fields
        if (!formData.email || !formData.password || !formData.confirmPassword) {
            setError("Please fill in all required fields")
            return false
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(formData.email)) {
            setError("Please enter a valid email address")
            return false
        }

        // Check password length
        if (formData.password.length < 8) {
            setError("Password must be at least 8 characters long")
            return false
        }

        // Check if passwords match
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match")
            return false
        }

        // Check terms agreement
        if (!formData.termsAgreed) {
            setError("You must agree to the terms and conditions")
            return false
        }

        // Validate company-specific fields
        if (activeTab === "company" && !formData.companyName) {
            setError("Company name is required")
            return false
        }

        // Validate content creator-specific fields
        if (activeTab === "creator" && (!formData.firstName || !formData.lastName)) {
            setError("First name and last name are required")
            return false
        }

        return true
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validateForm()) {
            return
        }

        setLoading(true)
        setError("")
        setSuccess(false)

        try {
            console.log("Registration type:", activeTab)

            if (activeTab === "company") {
                const companyData = {
                    email: formData.email.trim().toLowerCase(),
                    password: formData.password,
                    companyName: formData.companyName,
                    contactName: formData.contactName,
                    companySize: formData.companySize,
                    industry: formData.industry,
                    website: formData.website,
                    termsAgreed: formData.termsAgreed,
                }
                console.log("Sending company data:", companyData)
                await authService.registerCompany(companyData)
            } else {
                const creatorData = {
                    email: formData.email.trim().toLowerCase(),
                    password: formData.password,
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    username: formData.username,
                    contentType: formData.contentType,
                    bio: formData.bio,
                    instagram: formData.instagram,
                    youtube: formData.youtube,
                    tiktok: formData.tiktok,
                    twitter: formData.twitter,
                    termsAgreed: formData.termsAgreed,
                }
                console.log("Sending creator data:", creatorData)
                await authService.registerContentCreator(creatorData)
            }

            setSuccess(true)
            // Reset form
            setFormData({
                email: "",
                password: "",
                confirmPassword: "",
                termsAgreed: false,
                companyName: "",
                contactName: "",
                companySize: "",
                industry: "",
                website: "",
                firstName: "",
                lastName: "",
                username: "",
                contentType: "",
                bio: "",
                instagram: "",
                youtube: "",
                tiktok: "",
                twitter: "",
            })

            // Redirect to verification page after 3 seconds
            setTimeout(() => {
                router.push(`/verify-email-code?email=${encodeURIComponent(formData.email)}`)
            }, 3000)
        } catch (err) {
            console.error("Registration error:", err)
            setError(err instanceof Error ? err.message : "An error occurred during registration")
            setShowDebugger(true)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Card className="w-full max-w-4xl mx-auto">
            <CardHeader>
                <CardTitle>Create an Account</CardTitle>
                <CardDescription>Choose your account type and fill in your details</CardDescription>
            </CardHeader>
            <CardContent>
                {error && (
                    <Alert variant="destructive" className="mb-4">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                {success && (
                    <Alert className="mb-4 bg-green-50 border-green-200">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        <AlertDescription className="text-green-600">
                            Registration successful! Please check your email to verify your account.
                        </AlertDescription>
                    </Alert>
                )}

                <div className="mb-4 flex justify-end">
                    <Button variant="outline" size="sm" onClick={() => setShowDebugger(!showDebugger)}>
                        {showDebugger ? "Hide API Debugger" : "Show API Debugger"}
                    </Button>
                </div>

                {showDebugger && (
                    <div className="mb-6">
                        <EnhancedApiDebugger />
                    </div>
                )}

                <Tabs defaultValue="company" value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="grid w-full grid-cols-2 mb-6">
                        <TabsTrigger value="company">Company</TabsTrigger>
                        <TabsTrigger value="creator">Content Creator</TabsTrigger>
                    </TabsList>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium">Account Information</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email *</Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="your@email.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="space-y-2 md:col-span-2">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="password">Password *</Label>
                                            <Input
                                                id="password"
                                                name="password"
                                                type="password"
                                                placeholder="Min. 8 characters"
                                                value={formData.password}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="confirmPassword">Confirm Password *</Label>
                                            <Input
                                                id="confirmPassword"
                                                name="confirmPassword"
                                                type="password"
                                                placeholder="Confirm your password"
                                                value={formData.confirmPassword}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <TabsContent value="company" className="space-y-4 mt-0">
                            <div className="space-y-4">
                                <h3 className="text-lg font-medium">Company Information</h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="companyName">Company Name *</Label>
                                        <Input
                                            id="companyName"
                                            name="companyName"
                                            placeholder="Your company name"
                                            value={formData.companyName}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="contactName">Contact Person</Label>
                                        <Input
                                            id="contactName"
                                            name="contactName"
                                            placeholder="Full name of contact person"
                                            value={formData.contactName}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="industry">Industry *</Label>
                                        <Input
                                            id="industry"
                                            name="industry"
                                            placeholder="e.g. Technology, Fashion, Food"
                                            value={formData.industry}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="companySize">Company Size</Label>
                                        <Input
                                            id="companySize"
                                            name="companySize"
                                            placeholder="e.g. 1-10, 11-50, 51-200"
                                            value={formData.companySize}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div className="space-y-2 md:col-span-2">
                                        <Label htmlFor="website">Website</Label>
                                        <Input
                                            id="website"
                                            name="website"
                                            type="url"
                                            placeholder="https://yourcompany.com"
                                            value={formData.website}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="creator" className="space-y-4 mt-0">
                            <div className="space-y-4">
                                <h3 className="text-lg font-medium">Personal Information</h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="firstName">First Name *</Label>
                                        <Input
                                            id="firstName"
                                            name="firstName"
                                            placeholder="Your first name"
                                            value={formData.firstName}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="lastName">Last Name *</Label>
                                        <Input
                                            id="lastName"
                                            name="lastName"
                                            placeholder="Your last name"
                                            value={formData.lastName}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="username">Username</Label>
                                        <Input
                                            id="username"
                                            name="username"
                                            placeholder="Your preferred username"
                                            value={formData.username}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="contentType">Content Type *</Label>
                                        <Input
                                            id="contentType"
                                            name="contentType"
                                            placeholder="e.g. Video, Blog, Photography"
                                            value={formData.contentType}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2 md:col-span-2">
                                        <Label htmlFor="bio">Bio</Label>
                                        <Textarea
                                            id="bio"
                                            name="bio"
                                            placeholder="Tell us about yourself and your content"
                                            value={formData.bio}
                                            onChange={handleChange}
                                            rows={3}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-lg font-medium">Social Media</h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="instagram">Instagram</Label>
                                        <Input
                                            id="instagram"
                                            name="instagram"
                                            placeholder="@username"
                                            value={formData.instagram}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="youtube">YouTube</Label>
                                        <Input
                                            id="youtube"
                                            name="youtube"
                                            placeholder="Channel name or URL"
                                            value={formData.youtube}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="tiktok">TikTok</Label>
                                        <Input
                                            id="tiktok"
                                            name="tiktok"
                                            placeholder="@username"
                                            value={formData.tiktok}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="twitter">Twitter</Label>
                                        <Input
                                            id="twitter"
                                            name="twitter"
                                            placeholder="@username"
                                            value={formData.twitter}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                            </div>
                        </TabsContent>

                        <div className="space-y-4">
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="termsAgreed"
                                    checked={formData.termsAgreed}
                                    onCheckedChange={(checked) => handleCheckboxChange("termsAgreed", checked as boolean)}
                                    required
                                />
                                <Label htmlFor="termsAgreed" className="text-sm">
                                    I agree to the Terms of Service and Privacy Policy *
                                </Label>
                            </div>

                            <Button type="submit" className="w-full" disabled={loading || success}>
                                {loading ? "Registering..." : "Create Account"}
                            </Button>
                        </div>
                    </form>
                </Tabs>
            </CardContent>
        </Card>
    )
}

