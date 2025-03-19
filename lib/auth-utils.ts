import { UserRole } from "@/types/auth"

/**
 * Redirects the user based on their role
 * @param role The user's role
 * @returns The path to redirect to
 */
export function redirectBasedOnRole(role: string | undefined): string {
    if (!role) return "/select-role"

    switch (role.toUpperCase()) {
        case UserRole.COMPANY:
            return "/dashboard/company"
        case UserRole.CONTENT_CREATOR:
            return "/dashboard/content-creator"
        default:
            return "/dashboard"
    }
}

/**
 * Checks if the user has the required role
 * @param userRole The user's role
 * @param requiredRole The required role
 * @returns True if the user has the required role
 */
export function hasRequiredRole(userRole: string | undefined, requiredRole: string): boolean {
    if (!userRole) return false
    return userRole.toUpperCase() === requiredRole.toUpperCase()
}

/**
 * Gets the user's role from localStorage
 * @returns The user's role or null if not found
 */
export function getUserRoleFromStorage(): string | null {
    if (typeof window === "undefined") return null

    // Try to get the role from localStorage
    const userRole = localStorage.getItem("userRole")
    if (userRole) return userRole

    // Try to get the role from the user object
    const userStr = localStorage.getItem("user")
    if (!userStr) return null

    try {
        const user = JSON.parse(userStr)
        return user.role || null
    } catch (error) {
        console.error("Error parsing user data:", error)
        return null
    }
}

/**
 * Stores the user's role in localStorage
 * @param role The user's role
 */
export function storeUserRole(role: string): void {
    if (typeof window === "undefined") return
    localStorage.setItem("userRole", role)
}

