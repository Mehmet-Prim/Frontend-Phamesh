"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"
import {api} from "@/lib/api"
import { forceCompanyRole } from "@/lib/auth-debug"
import { forceContentCreatorRole } from "@/lib/auth-debug"

interface RoleGuardProps {
    children: React.ReactNode
    allowedRole: "CONTENT_CREATOR" | "COMPANY" | "ANY"
    fallbackPath?: string
    forceRole?: boolean // Neuer Parameter, um die Rolle zu erzwingen
}

export function RoleGuard({ children, allowedRole, fallbackPath, forceRole = false }: RoleGuardProps) {
    console.log("RoleGuard rendering with allowedRole:", allowedRole, "forceRole:", forceRole)

    const router = useRouter()
    const { isAuthenticated, loading, syncRole } = useAuth()
    const [hasAccess, setHasAccess] = useState(false)
    const [checking, setChecking] = useState(true)

    useEffect(() => {
        console.log("RoleGuard useEffect running, loading:", loading)

        if (loading) return

        const checkAccess = async () => {
            console.log("RoleGuard checkAccess running, isAuthenticated:", isAuthenticated)

            if (!isAuthenticated) {
                console.log("RoleGuard: Not authenticated, redirecting to select-role")
                router.push("/select-role")
                return
            }

            // If any role is allowed, grant access
            if (allowedRole === "ANY") {
                console.log("RoleGuard: Any role allowed, granting access")
                setHasAccess(true)
                setChecking(false)
                return
            }

            // Wenn wir auf der Company-Seite sind und forceRole aktiviert ist, erzwingen wir die Rolle
            if (allowedRole === "COMPANY" && forceRole) {
                console.log("RoleGuard: Forcing COMPANY role")
                forceCompanyRole()
                setHasAccess(true)
                setChecking(false)
                return
            }

            // Wenn wir auf der Content-Creator-Seite sind und forceRole aktiviert ist, erzwingen wir die Rolle
            if (allowedRole === "CONTENT_CREATOR" && forceRole) {
                console.log("RoleGuard: Forcing CONTENT_CREATOR role")
                forceContentCreatorRole()
                setHasAccess(true)
                setChecking(false)
                return
            }

            // Wenn wir auf der Company-Seite sind und der Pfad /dashboard/company enthält,
            // erlauben wir den Zugriff ohne weitere Überprüfung
            if (
                allowedRole === "COMPANY" &&
                typeof window !== "undefined" &&
                window.location.pathname.includes("/dashboard/company")
            ) {
                console.log("RoleGuard: Allowing access to company dashboard based on path")
                forceCompanyRole() // Erzwinge die Rolle basierend auf dem Pfad
                setHasAccess(true)
                setChecking(false)
                return
            }

            // Wenn wir auf der Content-Creator-Seite sind und der Pfad /dashboard/content-creator enthält,
            // erlauben wir den Zugriff ohne weitere Überprüfung
            if (
                allowedRole === "CONTENT_CREATOR" &&
                typeof window !== "undefined" &&
                window.location.pathname.includes("/dashboard/content-creator")
            ) {
                console.log("RoleGuard: Allowing access to content creator dashboard based on path")
                forceContentCreatorRole() // Erzwinge die Rolle basierend auf dem Pfad
                setHasAccess(true)
                setChecking(false)
                return
            }

            // Versuche, die Rolle mit dem Backend zu synchronisieren
            try {
                const role = await syncRole()
                console.log("RoleGuard: Synchronized role with backend:", role)

                // Wenn die Synchronisierung fehlschlägt oder keine Rolle zurückgibt,
                // verwenden wir die lokale Rollenüberprüfung als Fallback
                if (!role) {
                    console.log("RoleGuard: No role returned from backend, using local role check")
                    const isContentCreator = api.isContentCreator()

                    if (allowedRole === "CONTENT_CREATOR" && isContentCreator) {
                        console.log("RoleGuard: Local check - User is content creator, granting access")
                        setHasAccess(true)
                    } else if (allowedRole === "COMPANY" && !isContentCreator) {
                        console.log("RoleGuard: Local check - User is company, granting access")
                        setHasAccess(true)
                    } else {
                        // Redirect to appropriate dashboard if role doesn't match
                        const redirectPath =
                            fallbackPath || (isContentCreator ? "/dashboard/content-creator" : "/dashboard/company")
                        console.log("RoleGuard: Local check - Role doesn't match, redirecting to", redirectPath)
                        router.push(redirectPath)
                    }
                } else if (role === allowedRole) {
                    console.log("RoleGuard: Role matches allowed role, granting access")
                    setHasAccess(true)
                } else {
                    // Redirect to appropriate dashboard if role doesn't match
                    const redirectPath =
                        fallbackPath || (role === "CONTENT_CREATOR" ? "/dashboard/content-creator" : "/dashboard/company")
                    console.log("RoleGuard: Role doesn't match, redirecting to", redirectPath)
                    router.push(redirectPath)
                }
            } catch (error) {
                console.error("RoleGuard: Error synchronizing role:", error)

                // Fallback zur lokalen Rollenüberprüfung
                const isContentCreator = api.isContentCreator()
                console.log("RoleGuard: Fallback check - isContentCreator:", isContentCreator)

                if (allowedRole === "CONTENT_CREATOR" && isContentCreator) {
                    console.log("RoleGuard: Fallback - User is content creator, granting access")
                    setHasAccess(true)
                } else if (allowedRole === "COMPANY" && !isContentCreator) {
                    console.log("RoleGuard: Fallback - User is company, granting access")
                    setHasAccess(true)
                } else {
                    // Redirect to appropriate dashboard if role doesn't match
                    const redirectPath = fallbackPath || (isContentCreator ? "/dashboard/content-creator" : "/dashboard/company")
                    console.log("RoleGuard: Fallback - Role doesn't match, redirecting to", redirectPath)
                    router.push(redirectPath)
                }
            }

            setChecking(false)
        }

        checkAccess()
    }, [allowedRole, isAuthenticated, loading, router, fallbackPath, forceRole, syncRole])

    console.log("RoleGuard render state - hasAccess:", hasAccess, "checking:", checking)

    if (checking || loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-4">Laden...</p>
                    <p className="mt-2 text-sm text-gray-500">
                        Status: {checking ? "Überprüfe Zugriff..." : "Lade Benutzerinformationen..."}
                    </p>
                </div>
            </div>
        )
    }

    if (!hasAccess) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center bg-red-100 p-4 rounded-lg">
                    <p className="text-red-600">Kein Zugriff auf diese Seite.</p>
                    <p className="mt-2">Sie werden weitergeleitet...</p>
                </div>
            </div>
        )
    }

    return (
        <>
            {/* Debug-Element */}
            <div className="bg-blue-200 p-2 text-center">RoleGuard - Zugriff gewährt für Rolle: {allowedRole}</div>
            {children}
        </>
    )
}

