import Link from "next/link"
import { CheckCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/app/components/Navbar"
import { Footer } from "@/app/components/Footer"

export default function RegistrationSuccessPage() {
    return (
        <>
            <Navbar />
            <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
                <Card className="w-full max-w-md border-none shadow-lg">
                    <CardHeader>
                        <div className="flex justify-center mb-4">
                            <CheckCircle className="h-16 w-16 text-green-500" />
                        </div>
                        <CardTitle className="text-center text-2xl">Registrierung erfolgreich</CardTitle>
                        <CardDescription className="text-center">
                            Wir haben Ihnen eine E-Mail mit einem Bestätigungslink gesendet.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="text-center">
                        <p className="mb-4">
                            Bitte überprüfen Sie Ihren E-Mail-Posteingang und klicken Sie auf den Bestätigungslink, um Ihre
                            E-Mail-Adresse zu verifizieren.
                        </p>
                        <p className="text-sm text-muted-foreground">
                            Falls Sie keine E-Mail erhalten haben, überprüfen Sie bitte auch Ihren Spam-Ordner oder fordern Sie einen
                            neuen Bestätigungslink an.
                        </p>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-2">
                        <Button asChild className="w-full">
                            <Link href="/auth/login">Zur Anmeldeseite</Link>
                        </Button>
                        <Button asChild variant="outline" className="w-full">
                            <Link href="/auth/verify-email">Zur Verifizierungsseite</Link>
                        </Button>
                    </CardFooter>
                </Card>
            </div>
            <Footer />
        </>
    )
}

