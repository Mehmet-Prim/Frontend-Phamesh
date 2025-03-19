"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function VerifyEmailPage() {
    const [error, setError] = useState("")
    const [success, setSuccess] = useState(false)
    const [loading, setLoading] = useState(false)
    const [userRole, setUserRole] = useState<string | null>(null)
    const [otpCode, setOtpCode] = useState("")
    const [otpLoading, setOtpLoading] = useState(false)
    const router = useRouter()
    const searchParams = useSearchParams()
    const token = searchParams.get("token")
    const role = searchParams.get("role")

    // Bestimme den aktiven Tab basierend auf dem Vorhandensein eines Tokens
    const defaultTab = token ? "link" : "otp"

    useEffect(() => {
        if (role) {
            setUserRole(role)
        }

        // Nur automatisch verifizieren, wenn ein Token vorhanden ist
        if (token) {
            verifyWithToken(token)
        }
    }, [token, role])

    // Funktion zur Verifizierung mit Token
    const verifyWithToken = async (token: string) => {
        setLoading(true)
        setError("")

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/verify-email?token=${token}`, {
                method: "GET",
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.message || "Failed to verify email")
            }

            if (data.success) {
                setSuccess(true)

                // Wenn die Rolle in der Antwort enthalten ist, speichere sie
                if (data.user && data.user.role) {
                    setUserRole(data.user.role)
                }
            } else {
                setError(data.message || "Failed to verify email")
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred")
        } finally {
            setLoading(false)
        }
    }

    // Funktion zur Verifizierung mit OTP-Code
    const verifyWithOTP = async () => {
        if (!otpCode.trim()) {
            setError("Please enter the verification code")
            return
        }

        setOtpLoading(true)
        setError("")

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/verify-otp`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ code: otpCode }),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.message || "Failed to verify email")
            }

            if (data.success) {
                setSuccess(true)

                // Wenn die Rolle in der Antwort enthalten ist, speichere sie
                if (data.user && data.user.role) {
                    setUserRole(data.user.role)
                }
            } else {
                setError(data.message || "Invalid verification code")
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred")
        } finally {
            setOtpLoading(false)
        }
    }

    // Funktion zur Weiterleitung basierend auf der Rolle
    const redirectToLogin = () => {
        if (userRole === "COMPANY") {
            router.push("/login/company")
        } else if (userRole === "CONTENT_CREATOR") {
            router.push("/login/content-creator")
        } else {
            // Fallback zur allgemeinen Login-Seite, wenn keine Rolle erkannt wurde
            router.push("/login")
        }
    }

    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-b from-gray-50 to-gray-100">
            <div className="w-full max-w-md">
                <Card>
                    <CardHeader>
                        <CardTitle>Email Verification</CardTitle>
                        <CardDescription>Verify your email address to activate your account</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {success ? (
                            // Erfolgsanzeige
                            <div className="space-y-4">
                                <Alert className="mb-4 bg-green-50 border-green-200">
                                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                                    <AlertDescription className="text-green-600">
                                        Your email has been successfully verified!
                                    </AlertDescription>
                                </Alert>

                                <Button onClick={redirectToLogin} className="w-full">
                                    Continue to Login
                                </Button>

                                <div className="mt-4 text-sm text-gray-500">
                                    <p>Or go to specific login page:</p>
                                    <div className="flex justify-center gap-4 mt-2">
                                        <Link href="/login/company" className="text-primary hover:underline">
                                            Company Login
                                        </Link>
                                        <Link href="/login/content-creator" className="text-primary hover:underline">
                                            Content Creator Login
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            // Verifizierungsoptionen
                            <Tabs defaultValue={defaultTab} className="w-full">
                                <TabsList className="grid w-full grid-cols-2">
                                    <TabsTrigger value="link">Verification Link</TabsTrigger>
                                    <TabsTrigger value="otp">Verification Code</TabsTrigger>
                                </TabsList>

                                <TabsContent value="link" className="space-y-4">
                                    {loading ? (
                                        <div className="flex justify-center items-center py-8">
                                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                                        </div>
                                    ) : token ? (
                                        <div className="py-4">
                                            {error ? (
                                                <Alert variant="destructive" className="mb-4">
                                                    <AlertCircle className="h-4 w-4" />
                                                    <AlertDescription>{error}</AlertDescription>
                                                </Alert>
                                            ) : (
                                                <Alert className="mb-4">
                                                    <AlertCircle className="h-4 w-4" />
                                                    <AlertDescription>
                                                        The verification link is invalid or has expired. Please try using the verification code
                                                        instead.
                                                    </AlertDescription>
                                                </Alert>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="py-4">
                                            <p className="text-center text-gray-600">
                                                Please click on the verification link in your email to verify your account.
                                            </p>
                                            <p className="text-center text-gray-600 mt-2">
                                                If you didn&#39;t receive the email or the link doesn&#39;t work, you can use the verification code
                                                instead.
                                            </p>
                                        </div>
                                    )}
                                </TabsContent>

                                <TabsContent value="otp" className="space-y-4">
                                    <div className="space-y-4 py-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="otp">Enter the verification code from your email</Label>
                                            <Input
                                                id="otp"
                                                placeholder="Enter 6-digit code"
                                                value={otpCode}
                                                onChange={(e) => setOtpCode(e.target.value)}
                                                maxLength={6}
                                                className="text-center text-lg tracking-widest"
                                            />
                                        </div>

                                        {error && (
                                            <Alert variant="destructive">
                                                <AlertCircle className="h-4 w-4" />
                                                <AlertDescription>{error}</AlertDescription>
                                            </Alert>
                                        )}

                                        <Button onClick={verifyWithOTP} className="w-full" disabled={otpLoading || !otpCode.trim()}>
                                            {otpLoading ? (
                                                <span className="flex items-center">
                          <span className="animate-spin mr-2 h-4 w-4 border-t-2 border-b-2 border-white rounded-full"></span>
                          Verifying...
                        </span>
                                            ) : (
                                                "Verify Email"
                                            )}
                                        </Button>
                                    </div>
                                </TabsContent>
                            </Tabs>
                        )}
                    </CardContent>
                </Card>
            </div>
        </main>
    )
}

