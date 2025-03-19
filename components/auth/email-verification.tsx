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
import { authService } from "@/services/auth-service"

interface EmailVerificationProps {
    email: string
}

export default function EmailVerification({ email }: EmailVerificationProps) {
    const [verificationCode, setVerificationCode] = useState("")
    const [error, setError] = useState("")
    const [success, setSuccess] = useState(false)
    const [loading, setLoading] = useState(false)
    const [resendLoading, setResendLoading] = useState(false)
    const [resendSuccess, setResendSuccess] = useState(false)
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError("")
        setSuccess(false)

        try {
            await authService.verifyEmailWithCode({
                email: email.trim().toLowerCase(),
                code: verificationCode,
            })

            setSuccess(true)
            // Redirect to login after 3 seconds
            setTimeout(() => {
                router.push("/")
            }, 3000)
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred during verification")
        } finally {
            setLoading(false)
        }
    }

    const handleResendCode = async () => {
        setResendLoading(true)
        setResendSuccess(false)
        setError("")

        try {
            await authService.resendVerificationEmail(email.trim().toLowerCase())
            setResendSuccess(true)
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred")
        } finally {
            setResendLoading(false)
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Verify Your Email</CardTitle>
                <CardDescription>Enter the verification code sent to {email}</CardDescription>
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
                            Email verified successfully! Redirecting to login page...
                        </AlertDescription>
                    </Alert>
                )}

                {resendSuccess && (
                    <Alert className="mb-4 bg-green-50 border-green-200">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        <AlertDescription className="text-green-600">
                            Verification code has been resent to your email.
                        </AlertDescription>
                    </Alert>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="verificationCode">Verification Code</Label>
                        <Input
                            id="verificationCode"
                            value={verificationCode}
                            onChange={(e) => setVerificationCode(e.target.value)}
                            placeholder="Enter your verification code"
                            required
                        />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2">
                        <Button type="submit" className="flex-1" disabled={loading || success}>
                            {loading ? "Verifying..." : "Verify Email"}
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleResendCode}
                            disabled={resendLoading || resendSuccess}
                            className="flex-1"
                        >
                            {resendLoading ? "Sending..." : resendSuccess ? "Code Resent" : "Resend Code"}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}

