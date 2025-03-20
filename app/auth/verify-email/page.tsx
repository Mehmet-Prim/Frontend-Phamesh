"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { MessageSquare, ArrowLeft, CheckCircle, AlertCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import { AuthService } from "@/lib/services/auth-service"

const formSchema = z.object({
    code: z.string().length(6, { message: "Verifizierungscode muss 6 Ziffern haben" }),
})

export default function VerifyEmailPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const { toast } = useToast()
    const [isLoading, setIsLoading] = useState(false)
    const [email, setEmail] = useState("")
    const [token, setToken] = useState("")
    const [resendDisabled, setResendDisabled] = useState(false)
    const [countdown, setCountdown] = useState(0)
    const [verificationStatus, setVerificationStatus] = useState<"pending" | "success" | "error">("pending")
    const [autoVerifying, setAutoVerifying] = useState(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            code: "",
        },
    })

    // Extrahiere Parameter aus der URL
    useEffect(() => {
        const emailParam = searchParams.get("email")
        const tokenParam = searchParams.get("token")

        if (emailParam) {
            setEmail(emailParam)
        }

        if (tokenParam) {
            setToken(tokenParam)
            setAutoVerifying(true)
            // Automatische Verifizierung mit Token
            verifyWithToken(tokenParam)
        }
    }, [searchParams])

    // Countdown für Resend-Button
    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
            return () => clearTimeout(timer)
        } else {
            setResendDisabled(false)
        }
    }, [countdown])

    // Automatische Verifizierung mit Token
    async function verifyWithToken(token: string) {
        try {
            setIsLoading(true)
            await AuthService.verifyEmailWithToken(token)
            setVerificationStatus("success")
            toast({
                title: "E-Mail verifiziert",
                description: "Ihre E-Mail wurde erfolgreich verifiziert",
            })

            // Nach 3 Sekunden zur Login-Seite weiterleiten
            setTimeout(() => {
                router.push("/auth/login")
            }, 3000)
        } catch (error) {
            console.error("Token verification failed:", error)
            setVerificationStatus("error")
            toast({
                title: "Verifizierung fehlgeschlagen",
                description: "Der Verifizierungslink ist ungültig oder abgelaufen",
                variant: "destructive",
            })
            setAutoVerifying(false)
        } finally {
            setIsLoading(false)
        }
    }

    // Manuelle Verifizierung mit Code
    async function onSubmit(values: z.infer<typeof formSchema>) {
        if (!email) {
            toast({
                title: "E-Mail nicht gefunden",
                description: "Bitte gehen Sie zurück zur Registrierungsseite",
                variant: "destructive",
            })
            return
        }

        setIsLoading(true)
        try {
            await AuthService.verifyEmail(email, values.code)
            setVerificationStatus("success")
            toast({
                title: "E-Mail verifiziert",
                description: "Ihre E-Mail wurde erfolgreich verifiziert",
            })

            // Nach 3 Sekunden zur Login-Seite weiterleiten
            setTimeout(() => {
                router.push("/auth/login")
            }, 3000)
        } catch (error) {
            console.error("Code verification failed:", error)
            setVerificationStatus("error")
            toast({
                title: "Verifizierung fehlgeschlagen",
                description: "Ungültiger Verifizierungscode",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    async function handleResendCode() {
        if (!email) {
            toast({
                title: "E-Mail nicht gefunden",
                description: "Bitte gehen Sie zurück zur Registrierungsseite",
                variant: "destructive",
            })
            return
        }

        setResendDisabled(true)
        setCountdown(60)
        try {
            await AuthService.resendVerificationCode(email)
            toast({
                title: "Code erneut gesendet",
                description: "Ein neuer Verifizierungscode wurde an Ihre E-Mail gesendet",
            })
        } catch (error) {
            console.error("Failed to resend code:", error)
            toast({
                title: "Fehler beim erneuten Senden",
                description: "Beim erneuten Senden des Verifizierungscodes ist ein Fehler aufgetreten",
                variant: "destructive",
            })
            setResendDisabled(false)
            setCountdown(0)
        }
    }

    // Wenn die Verifizierung erfolgreich war
    if (verificationStatus === "success") {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center p-4">
                <Card className="mx-auto w-full max-w-md">
                    <CardHeader>
                        <div className="flex justify-center mb-4">
                            <CheckCircle className="h-16 w-16 text-green-500" />
                        </div>
                        <CardTitle className="text-center text-2xl">E-Mail verifiziert</CardTitle>
                        <CardDescription className="text-center">Ihre E-Mail-Adresse wurde erfolgreich verifiziert</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-center text-muted-foreground">
                            Sie werden in wenigen Sekunden zur Anmeldeseite weitergeleitet...
                        </p>
                    </CardContent>
                    <CardFooter className="flex justify-center">
                        <Button asChild>
                            <Link href="/auth/login">Zur Anmeldeseite</Link>
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        )
    }

    // Wenn die Verifizierung fehlgeschlagen ist
    if (verificationStatus === "error" && autoVerifying) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center p-4">
                <Card className="mx-auto w-full max-w-md">
                    <CardHeader>
                        <div className="flex justify-center mb-4">
                            <AlertCircle className="h-16 w-16 text-red-500" />
                        </div>
                        <CardTitle className="text-center text-2xl">Verifizierung fehlgeschlagen</CardTitle>
                        <CardDescription className="text-center">
                            Der Verifizierungslink ist ungültig oder abgelaufen
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-center text-muted-foreground mb-4">
                            Bitte verwenden Sie den Verifizierungscode, der an Ihre E-Mail gesendet wurde.
                        </p>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="code"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Verifizierungscode</FormLabel>
                                            <FormControl>
                                                <Input placeholder="123456" {...field} maxLength={6} inputMode="numeric" pattern="[0-9]*" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button type="submit" className="w-full" disabled={isLoading}>
                                    {isLoading ? "Verifiziere..." : "E-Mail verifizieren"}
                                </Button>
                            </form>
                        </Form>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-2">
                        <div className="text-center text-sm">
                            Keinen Code erhalten?{" "}
                            <Button variant="link" className="p-0 h-auto" onClick={handleResendCode} disabled={resendDisabled}>
                                {resendDisabled ? `Erneut senden in ${countdown}s` : "Code erneut senden"}
                            </Button>
                        </div>
                        <div className="text-center text-sm">
                            <Link
                                href="/auth/login"
                                className="flex items-center justify-center gap-1 text-primary underline-offset-4 hover:underline"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                Zurück zur Anmeldung
                            </Link>
                        </div>
                    </CardFooter>
                </Card>
            </div>
        )
    }

    // Standard-Verifizierungsansicht
    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-4">
            <Card className="mx-auto w-full max-w-md">
                <CardHeader>
                    <div className="flex justify-center mb-4">
                        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
                            <MessageSquare className="h-8 w-8" />
                            <span>Phamesh</span>
                        </Link>
                    </div>
                    <CardTitle className="text-center text-2xl">E-Mail verifizieren</CardTitle>
                    <CardDescription className="text-center">
                        {autoVerifying
                            ? "Verifizierung läuft..."
                            : `Wir haben einen 6-stelligen Verifizierungscode an ${email || "Ihre E-Mail"} gesendet`}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {autoVerifying ? (
                        <div className="flex justify-center items-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        </div>
                    ) : (
                        <>
                            <Alert className="mb-4">
                                <AlertTitle>Wichtig</AlertTitle>
                                <AlertDescription>
                                    Bitte überprüfen Sie Ihren Posteingang und Spam-Ordner nach einer E-Mail von uns.
                                </AlertDescription>
                            </Alert>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                    <FormField
                                        control={form.control}
                                        name="code"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Verifizierungscode</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="123456" {...field} maxLength={6} inputMode="numeric" pattern="[0-9]*" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <Button type="submit" className="w-full" disabled={isLoading}>
                                        {isLoading ? "Verifiziere..." : "E-Mail verifizieren"}
                                    </Button>
                                </form>
                            </Form>
                        </>
                    )}
                </CardContent>
                <CardFooter className="flex flex-col space-y-2">
                    <div className="text-center text-sm">
                        Keinen Code erhalten?{" "}
                        <Button
                            variant="link"
                            className="p-0 h-auto"
                            onClick={handleResendCode}
                            disabled={resendDisabled || autoVerifying}
                        >
                            {resendDisabled ? `Erneut senden in ${countdown}s` : "Code erneut senden"}
                        </Button>
                    </div>
                    <div className="text-center text-sm">
                        <Link
                            href="/auth/login"
                            className="flex items-center justify-center gap-1 text-primary underline-offset-4 hover:underline"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Zurück zur Anmeldung
                        </Link>
                    </div>
                </CardFooter>
            </Card>
        </div>
    )
}

