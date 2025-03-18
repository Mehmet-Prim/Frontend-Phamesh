"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { AuthService } from "@/lib/auth"
import { testApiConnection } from "@/lib/api-connection-helper"
import type { RegistrationRequest } from "@/types/auth"

export default function RegisterContentCreatorForm() {
    const router = useRouter()

    const [formData, setFormData] = useState<RegistrationRequest>({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        username: "",
        contentType: "",
        termsAgreed: false,
    })

    const [confirmPassword, setConfirmPassword] = useState("")
    const [socialMedia, setSocialMedia] = useState({
        instagram: "",
        youtube: "",
        tiktok: "",
        twitter: "",
    })
    const [bio, setBio] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [debugInfo, setDebugInfo] = useState<string | null>(null)
    const [connectionStatus, setConnectionStatus] = useState<"untested" | "testing" | "success" | "failed">("untested")

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | { target: { name: string; value: string } },
    ) => {
        const { name, value } = e.target

        if (name.startsWith("socialMedia.")) {
            const field = name.split(".")[1]
            setSocialMedia((prev) => ({
                ...prev,
                [field]: value,
            }))
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }))
        }
    }

    const handleBioChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setBio(e.target.value)
    }

    const handleCheckboxChange = (checked: boolean) => {
        setFormData((prev) => ({
            ...prev,
            termsAgreed: checked,
        }))
    }

    const handleSelectChange = (value: string) => {
        setFormData((prev) => ({
            ...prev,
            contentType: value,
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

    // Simplified registration function for Spring Boot
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setDebugInfo(null)

        // Validation
        if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
            setError("Bitte fülle alle Pflichtfelder aus.")
            return
        }

        if (!formData.termsAgreed) {
            setError("Du musst den Nutzungsbedingungen zustimmen, um fortzufahren.")
            return
        }

        if (formData.password !== confirmPassword) {
            setError("Die Passwörter stimmen nicht überein.")
            return
        }

        if (formData.password.length < 8) {
            setError("Das Passwort muss mindestens 8 Zeichen lang sein.")
            return
        }

        setLoading(true)

        try {
            // Log the API URL for debugging
            const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"
            setDebugInfo(`Attempting registration with API URL: ${API_URL}/api/auth/register/content-creator`)

            // Prepare the complete registration data
            const completeFormData: RegistrationRequest = {
                ...formData,
                // Only include socialMedia if at least one field is filled
                ...(Object.values(socialMedia).some((value) => value) ? { socialMedia } : {}),
                // Only include bio if it's not empty
                ...(bio ? { bio } : {}),
            }

            // Use the AuthService for registration
            const response = await AuthService.registerContentCreator(completeFormData)

            if (response.success) {
                router.push("/login/content-creator?registered=true")
                return
            }

            // If registration failed, show the error message
            setError(response.message || "Registrierung fehlgeschlagen. Bitte versuche es später erneut.")

            // If there's a connection issue, test the API connection
            if (response.message?.includes("fehlgeschlagen") || response.message?.includes("Failed to fetch")) {
                await testConnection()
            }
        } catch (err: any) {
            console.error("Registration error:", err)
            setError(
                err.message ||
                "Bei der Registrierung ist ein Fehler aufgetreten. Bitte überprüfe deine Internetverbindung und die API-URL.",
            )

            // Test connection on error
            await testConnection()
        } finally {
            setLoading(false)
        }
    }

    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader>
                <CardTitle>Als Content Creator registrieren</CardTitle>
                <CardDescription>Erstelle ein Konto, um mit Unternehmen zusammenzuarbeiten</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                        <Alert variant="destructive">
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    {debugInfo && (
                        <Alert variant="default" className="bg-blue-50 text-blue-800 border-blue-200">
                            <AlertDescription className="whitespace-pre-wrap font-mono text-xs">{debugInfo}</AlertDescription>
                        </Alert>
                    )}

                    {connectionStatus === "testing" && (
                        <Alert variant="default" className="bg-yellow-50 text-yellow-800 border-yellow-200">
                            <AlertDescription>Testing API connection...</AlertDescription>
                        </Alert>
                    )}

                    {connectionStatus === "success" && (
                        <Alert variant="default" className="bg-green-50 text-green-800 border-green-200">
                            <AlertDescription>API connection successful!</AlertDescription>
                        </Alert>
                    )}

                    {connectionStatus === "failed" && (
                        <Alert variant="destructive">
                            <AlertDescription>
                                API connection failed. Check the debug information for details.
                                <Button variant="outline" size="sm" onClick={testConnection} className="ml-2">
                                    Test Again
                                </Button>
                            </AlertDescription>
                        </Alert>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="firstName">Vorname</Label>
                            <Input id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="lastName">Nachname</Label>
                            <Input id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} required />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="username">Benutzername</Label>
                        <Input id="username" name="username" value={formData.username} onChange={handleChange} />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">E-Mail</Label>
                        <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="contentType">Content-Typ</Label>
                        <Select value={formData.contentType} onValueChange={handleSelectChange}>
                            <SelectTrigger>
                                <SelectValue placeholder="Wähle deinen Content-Typ" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="blogger">Blogger</SelectItem>
                                <SelectItem value="vlogger">Vlogger</SelectItem>
                                <SelectItem value="influencer">Influencer</SelectItem>
                                <SelectItem value="podcaster">Podcaster</SelectItem>
                                <SelectItem value="photographer">Fotograf</SelectItem>
                                <SelectItem value="designer">Designer</SelectItem>
                                <SelectItem value="other">Andere</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <textarea
                            id="bio"
                            name="bio"
                            value={bio}
                            onChange={handleBioChange}
                            className="w-full min-h-[100px] p-2 border rounded-md"
                            placeholder="Erzähle etwas über dich und deinen Content..."
                        />
                    </div>

                    <div className="space-y-4">
                        <Label>Social Media</Label>

                        <div className="space-y-2">
                            <Label htmlFor="instagram" className="text-sm">
                                Instagram
                            </Label>
                            <div className="flex">
                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                  @
                </span>
                                <Input
                                    id="instagram"
                                    name="socialMedia.instagram"
                                    value={socialMedia.instagram}
                                    onChange={handleChange}
                                    className="rounded-l-none"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="youtube" className="text-sm">
                                YouTube
                            </Label>
                            <Input
                                id="youtube"
                                name="socialMedia.youtube"
                                value={socialMedia.youtube}
                                onChange={handleChange}
                                placeholder="https://youtube.com/c/username"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="tiktok" className="text-sm">
                                TikTok
                            </Label>
                            <div className="flex">
                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                  @
                </span>
                                <Input
                                    id="tiktok"
                                    name="socialMedia.tiktok"
                                    value={socialMedia.tiktok}
                                    onChange={handleChange}
                                    className="rounded-l-none"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="twitter" className="text-sm">
                                Twitter/X
                            </Label>
                            <div className="flex">
                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                  @
                </span>
                                <Input
                                    id="twitter"
                                    name="socialMedia.twitter"
                                    value={socialMedia.twitter}
                                    onChange={handleChange}
                                    className="rounded-l-none"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password">Passwort</Label>
                        <Input
                            id="password"
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Passwort bestätigen</Label>
                        <Input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div className="flex items-center space-x-2">
                        <Checkbox id="termsAgreed" checked={formData.termsAgreed} onCheckedChange={handleCheckboxChange} />
                        <Label htmlFor="termsAgreed" className="text-sm">
                            Ich stimme den{" "}
                            <Link href="/terms" className="text-primary hover:underline">
                                Nutzungsbedingungen
                            </Link>{" "}
                            und der{" "}
                            <Link href="/privacy" className="text-primary hover:underline">
                                Datenschutzerklärung
                            </Link>{" "}
                            zu.
                        </Label>
                    </div>

                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? "Registrierung läuft..." : "Registrieren"}
                    </Button>
                </form>
            </CardContent>
            <CardFooter className="flex justify-center">
                <p className="text-sm text-gray-500">
                    Bereits registriert?{" "}
                    <Link href="/login/content-creator" className="text-primary hover:underline">
                        Anmelden
                    </Link>
                </p>
            </CardFooter>
        </Card>
    )
}

