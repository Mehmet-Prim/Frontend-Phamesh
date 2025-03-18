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

export default function RegisterCompanyForm() {
    const router = useRouter()

    const [formData, setFormData] = useState<RegistrationRequest>({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        companyName: "",
        contactName: "",
        industry: "",
        website: "",
        companySize: "",
        termsAgreed: false,
    })

    const [confirmPassword, setConfirmPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [debugInfo, setDebugInfo] = useState<string | null>(null)
    const [connectionStatus, setConnectionStatus] = useState<"untested" | "testing" | "success" | "failed">("untested")

    const handleChange = (e: React.ChangeEvent<HTMLInputElement> | { target: { name: string; value: string } }) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleCheckboxChange = (checked: boolean) => {
        setFormData((prev) => ({
            ...prev,
            termsAgreed: checked,
        }))
    }

    const handleSelectChange = (field: string, value: string) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
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

    // Updated registration function for Spring Boot
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setDebugInfo(null)

        // Validation
        if (!formData.companyName || !formData.email || !formData.password) {
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
            setDebugInfo(`Attempting registration with API URL: ${API_URL}/api/auth/register/company`)

            // Use the AuthService for registration
            const response = await AuthService.registerCompany(formData)

            if (response.success) {
                router.push("/login/company?registered=true")
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
                <CardTitle>Als Unternehmen registrieren</CardTitle>
                <CardDescription>Erstelle ein Konto, um mit Content Creators zusammenzuarbeiten</CardDescription>
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

                    <div className="space-y-2">
                        <Label htmlFor="companyName">Unternehmensname</Label>
                        <Input id="companyName" name="companyName" value={formData.companyName} onChange={handleChange} required />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="contactName">Ansprechpartner</Label>
                        <Input id="contactName" name="contactName" value={formData.contactName} onChange={handleChange} />
                    </div>

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
                        <Label htmlFor="email">E-Mail</Label>
                        <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="industry">Branche</Label>
                        <Select value={formData.industry} onValueChange={(value) => handleSelectChange("industry", value)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Wähle deine Branche" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="technology">Technologie</SelectItem>
                                <SelectItem value="finance">Finanzen</SelectItem>
                                <SelectItem value="healthcare">Gesundheit</SelectItem>
                                <SelectItem value="education">Bildung</SelectItem>
                                <SelectItem value="retail">Einzelhandel</SelectItem>
                                <SelectItem value="manufacturing">Produktion</SelectItem>
                                <SelectItem value="entertainment">Unterhaltung</SelectItem>
                                <SelectItem value="other">Andere</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="companySize">Unternehmensgröße</Label>
                        <Select value={formData.companySize} onValueChange={(value) => handleSelectChange("companySize", value)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Wähle deine Unternehmensgröße" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="1-10">1-10 Mitarbeiter</SelectItem>
                                <SelectItem value="11-50">11-50 Mitarbeiter</SelectItem>
                                <SelectItem value="51-200">51-200 Mitarbeiter</SelectItem>
                                <SelectItem value="201-500">201-500 Mitarbeiter</SelectItem>
                                <SelectItem value="501+">501+ Mitarbeiter</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="website">Website</Label>
                        <Input
                            id="website"
                            name="website"
                            type="url"
                            value={formData.website}
                            onChange={handleChange}
                            placeholder="https://example.com"
                        />
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
                    <Link href="/login/company" className="text-primary hover:underline">
                        Anmelden
                    </Link>
                </p>
            </CardFooter>
        </Card>
    )
}

