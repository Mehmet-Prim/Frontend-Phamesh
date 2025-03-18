"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"
import api from "@/lib/api"
import { forceCompanyRole } from "@/lib/auth-debug"

interface RoleGuardProps {
    children: React.ReactNode
    allowedRole: "CONTENT_CREATOR" | "COMPANY" | "ANY"
    fallbackPath?: string
    forceRole?: boolean // Neuer Parameter, um die Rolle zu erzwingen
}

export function RoleGuard({ children, allowedRole, fallbackPath, forceRole = false }: RoleGuardProps) {
    const router = useRouter()
    const { isAuthenticated, loading, syncRole } = useAuth()
    const [hasAccess, setHasAccess] = useState(false)
    const [checking, setChecking] = useState(true)

    useEffect(() => {
        if (loading) return

        const checkAccess = async () => {
            if (!isAuthenticated) {
                router.push("/select-role")
                return
            }

            // If any role is allowed, grant access
            if (allowedRole === "ANY") {
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

            // Wenn wir auf der Company-Seite sind und der Pfad /dashboard/company enthält,
            // erlauben wir den Zugriff ohne weitere Überprüfung
            if (
                allowedRole === "COMPANY" &&
                typeof window !== "undefined" &&
                window.location.pathname.includes("/dashboard/company")
            ) {
                console.log("RoleGuard: Allowing access to company dashboard based on path")
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
                        setHasAccess(true)
                    } else if (allowedRole === "COMPANY" && !isContentCreator) {
                        setHasAccess(true)
                    } else {
                        // Redirect to appropriate dashboard if role doesn't match
                        const redirectPath =
                            fallbackPath || (isContentCreator ? "/dashboard/content-creator" : "/dashboard/company")
                        router.push(redirectPath)
                    }
                } else if (role === allowedRole) {
                    setHasAccess(true)
                } else {
                    // Redirect to appropriate dashboard if role doesn't match
                    const redirectPath =
                        fallbackPath || (role === "CONTENT_CREATOR" ? "/dashboard/content-creator" : "/dashboard/company")
                    router.push(redirectPath)
                }
            } catch (error) {
                console.error("RoleGuard: Error synchronizing role:", error)

                // Fallback zur lokalen Rollenüberprüfung
                const isContentCreator = api.isContentCreator()

                if (allowedRole === "CONTENT_CREATOR" && isContentCreator) {
                    setHasAccess(true)
                } else if (allowedRole === "COMPANY" && !isContentCreator) {
                    setHasAccess(true)
                } else {
                    // Redirect to appropriate dashboard if role doesn't match
                    const redirectPath = fallbackPath || (isContentCreator ? "/dashboard/content-creator" : "/dashboard/company")
                    router.push(redirectPath)
                }
            }

            setChecking(false)
        }

        checkAccess()
    }, [allowedRole, isAuthenticated, loading, router, fallbackPath, forceRole, syncRole])

    if (checking || loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-4">Laden...</p>
                </div>
            </div>
        )
    }

    return hasAccess ? <>{children}</> : null
}

