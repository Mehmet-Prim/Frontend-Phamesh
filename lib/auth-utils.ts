import { jwtDecode } from "jwt-decode"

interface DecodedToken {
    role?: string
    exp?: number
    [key: string]: any
}

export function getTokenFromStorage(): string | null {
    if (typeof window === "undefined") return null

    return localStorage.getItem("token") || sessionStorage.getItem("token")
}

export function getUserRoleFromToken(): string | null {
    const token = getTokenFromStorage()

    if (!token) return null

    try {
        const decoded = jwtDecode<DecodedToken>(token)
        return decoded.role || null
    } catch (error) {
        console.error("Error decoding token:", error)
        return null
    }
}

export function isTokenExpired(): boolean {
    const token = getTokenFromStorage()

    if (!token) return true

    try {
        const decoded = jwtDecode<DecodedToken>(token)
        const currentTime = Date.now() / 1000

        return decoded.exp ? decoded.exp < currentTime : true
    } catch (error) {
        console.error("Error checking token expiration:", error)
        return true
    }
}

export function redirectBasedOnRole(role: string | null): string {
    if (!role) return "/select-role"

    // Normalize the role to uppercase for consistent comparison
    const normalizedRole = role.toUpperCase()

    // First, check for explicit company role
    if (normalizedRole.includes("COMPANY")) {
        console.log("Redirecting to company dashboard based on COMPANY role")
        return "/dashboard/company"
    }

    // Then check for content creator role
    if (normalizedRole.includes("CONTENT") || normalizedRole.includes("CREATOR")) {
        console.log("Redirecting to content creator dashboard based on CONTENT/CREATOR role")
        return "/dashboard/content-creator"
    }

    // If no specific role is detected, default to company dashboard
    console.log("No specific role detected, defaulting to company dashboard")
    return "/dashboard/company"
}

// Additional helper functions for role checking
export function isContentCreatorRole(role: string | null): boolean {
    if (!role) return false

    const normalizedRole = role.toUpperCase()
    return normalizedRole.includes("CONTENT") || normalizedRole.includes("CREATOR")
}

export function isCompanyRole(role: string | null): boolean {
    if (!role) return false

    const normalizedRole = role.toUpperCase()
    return normalizedRole.includes("COMPANY") || (!isContentCreatorRole(role) && normalizedRole.includes("ROLE"))
}

