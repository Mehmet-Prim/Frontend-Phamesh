import { CardFooter } from "@/components/ui/card"
import Link from "next/link"
import { MessageSquare, ArrowLeft, Mail, AlertTriangle, HelpCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function VerifyEmailGuidePage() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-4">
            <Card className="mx-auto w-full max-w-3xl">
                <CardHeader>
                    <div className="flex justify-center mb-4">
                        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
                            <MessageSquare className="h-8 w-8" />
                            <span>Phamesh</span>
                        </Link>
                    </div>
                    <CardTitle className="text-center text-2xl">Anleitung zur E-Mail-Verifizierung</CardTitle>
                    <CardDescription className="text-center">Hilfe bei der Verifizierung Ihrer E-Mail-Adresse</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <h2 className="text-xl font-semibold flex items-center gap-2">
                            <Mail className="h-5 w-5" />
                            Überprüfen Sie Ihren Posteingang
                        </h2>
                        <p>
                            Nach der Registrierung haben wir eine E-Mail an die von Ihnen angegebene Adresse gesendet. Diese E-Mail
                            enthält einen 6-stelligen Verifizierungscode und einen Bestätigungslink.
                        </p>
                        <p>
                            Bitte überprüfen Sie auch Ihren Spam- oder Junk-Ordner, falls Sie die E-Mail nicht in Ihrem Posteingang
                            finden können.
                        </p>
                    </div>

                    <div className="space-y-2">
                        <h2 className="text-xl font-semibold flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5" />
                            Häufige Probleme
                        </h2>
                        <div className="space-y-4">
                            <div>
                                <h3 className="font-medium">Keine E-Mail erhalten?</h3>
                                <p>
                                    Es kann einige Minuten dauern, bis die E-Mail zugestellt wird. Wenn Sie nach 15 Minuten immer noch
                                    keine E-Mail erhalten haben, klicken Sie auf der Verifizierungsseite auf &#34;Code erneut senden&#34;.
                                </p>
                            </div>
                            <div>
                                <h3 className="font-medium">Link funktioniert nicht?</h3>
                                <p>
                                    Wenn der Bestätigungslink nicht funktioniert, verwenden Sie stattdessen den 6-stelligen
                                    Verifizierungscode. Geben Sie diesen auf der Verifizierungsseite ein.
                                </p>
                            </div>
                            <div>
                                <h3 className="font-medium">Code abgelaufen?</h3>
                                <p>
                                    Verifizierungscodes sind 24 Stunden gültig. Wenn Ihr Code abgelaufen ist, können Sie auf der
                                    Verifizierungsseite einen neuen Code anfordern.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <h2 className="text-xl font-semibold flex items-center gap-2">
                            <HelpCircle className="h-5 w-5" />
                            Weitere Hilfe
                        </h2>
                        <p>
                            Wenn Sie weiterhin Probleme bei der Verifizierung Ihrer E-Mail-Adresse haben, kontaktieren Sie bitte
                            unseren Kundensupport unter support@phamesh.com. Wir helfen Ihnen gerne weiter.
                        </p>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-center">
                    <Button asChild variant="outline" className="mr-2">
                        <Link href="/auth/verify-email">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Zurück zur Verifizierungsseite
                        </Link>
                    </Button>
                    <Button asChild>
                        <Link href="/auth/login">Zur Anmeldeseite</Link>
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}

