"use client"

import { useEffect, useState, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { getUserRole } from "@/lib/api"
import { Loader2 } from "lucide-react"

interface AuthGuardProps {
    children: ReactNode
    allowedRoles?: string[]
    redirectTo?: string
}

/**
 * Eine Komponente, die den Zugriff auf geschützte Routen basierend auf Benutzerrollen steuert
 */
export function AuthGuard({ children, allowedRoles = [], redirectTo = "/login" }: AuthGuardProps) {
    const router = useRouter()
    const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null)

    useEffect(() => {
        const checkAuth = async () => {
            try {
                // Token prüfen
                const token = localStorage.getItem("token")
                if (!token) {
                    setIsAuthorized(false)
                    router.push(redirectTo)
                    return
                }

                // Benutzerrolle abrufen
                const role = await getUserRole()

                // Wenn keine Rolle angegeben ist, ist jeder authentifizierte Benutzer erlaubt
                if (allowedRoles.length === 0) {
                    setIsAuthorized(true)
                    return
                }

                // Prüfen, ob die Benutzerrolle in den erlaubten Rollen enthalten ist
                const hasPermission = role && allowedRoles.includes(role)
                setIsAuthorized(hasPermission || false)

                if (!hasPermission) {
                    router.push(redirectTo)
                }
            } catch (error) {
                console.error("Fehler bei der Autorisierungsprüfung:", error)
                setIsAuthorized(false)
                router.push(redirectTo)
            }
        }

        checkAuth()
    }, [allowedRoles, redirectTo, router])

    // Zeige Ladeanimation während der Autorisierungsprüfung
    if (isAuthorized === null) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2 text-lg">Autorisierung wird überprüft...</span>
            </div>
        )
    }

    // Zeige Kinder nur, wenn autorisiert
    return isAuthorized ? <>{children}</> : null
}

export default AuthGuard

