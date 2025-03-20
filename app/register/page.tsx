"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"

export default function RegisterRedirect() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const role = searchParams.get("role")

    useEffect(() => {
        // Redirect based on role parameter
        if (role === "CONTENT_CREATOR") {
            router.push("/register/content-creator")
        } else if (role === "COMPANY") {
            router.push("/register/company")
        } else {
            // Default to select-role page if no role is specified
            router.push("/select-role")
        }
    }, [role, router])

    // Show a loading state while redirecting
    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
    )
}

