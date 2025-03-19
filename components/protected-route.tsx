"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { isAuthenticated, getUserRole } from "@/lib/auth"

interface ProtectedRouteProps {
    children: React.ReactNode
    allowedRoles?: string[]
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
    const router = useRouter()

    useEffect(() => {
        // Check if user is authenticated
        if (!isAuthenticated()) {
            router.push("/")
            return
        }

        // If roles are specified, check if user has the required role
        if (allowedRoles && allowedRoles.length > 0) {
            const userRole = getUserRole()
            if (!userRole || !allowedRoles.includes(userRole)) {
                router.push("/unauthorized")
            }
        }
    }, [router, allowedRoles])

    return <>{children}</>
}

