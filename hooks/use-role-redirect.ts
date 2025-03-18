"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"
import { redirectBasedOnRole } from "@/lib/auth-utils"

export function useRoleRedirect() {
    const { user, isAuthenticated, loading } = useAuth()
    const router = useRouter()

    useEffect(() => {
        // Wait until auth state is loaded
        if (loading) return

        // If user is authenticated, redirect based on role
        if (isAuthenticated && user) {
            const redirectPath = redirectBasedOnRole(user.role)
            router.push(redirectPath)
        }
    }, [isAuthenticated, user, loading, router])

    return { loading }
}

