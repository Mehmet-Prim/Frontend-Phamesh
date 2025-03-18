"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"
import api from "@/lib/api"

export default function DashboardPage() {
    const { isAuthenticated, loading } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (loading) return

        if (!isAuthenticated) {
            router.push("/select-role")
            return
        }

        // Redirect based on role
        const isContentCreator = api.isContentCreator()

        if (isContentCreator) {
            router.push("/dashboard/content-creator")
        } else {
            router.push("/dashboard/company")
        }
    }, [isAuthenticated, loading, router])

    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
                <p className="mt-4">Redirecting to your dashboard...</p>
            </div>
        </div>
    )
}

