"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { AuthService } from "@/lib/auth"
import type { LoginRequest, RegistrationRequest, PasswordResetRequest, User } from "@/types/auth"
import { UserRole } from "@/types/auth"
import api from "@/lib/api"
import { debugAuthState } from "@/lib/debug-auth"
import { syncUserRoleWithBackend, forceCompanyRole } from "@/lib/auth-debug"

interface AuthContextType {
    user: User | null
    loading: boolean
    login: (data: LoginRequest) => Promise<void>
    registerCompany: (data: RegistrationRequest) => Promise<void>
    registerContentCreator: (data: RegistrationRequest) => Promise<void>
    forgotPassword: (email: string, role: string) => Promise<void>
    resetPassword: (data: PasswordResetRequest) => Promise<void>
    logout: () => void
    isAuthenticated: boolean
    userRole: string | null
    syncRole: () => Promise<string | null>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [userRole, setUserRole] = useState<string | null>(null)
    const router = useRouter()

    useEffect(() => {
        // Check if user is logged in
        const checkAuth = async () => {
            const isAuth = AuthService.isAuthenticated()
            setIsAuthenticated(isAuth)

            if (isAuth) {
                try {
                    // Try to load current user
                    const currentUser = await AuthService.getCurrentUser()
                    if (currentUser) {
                        setUser(currentUser)
                        setUserRole(currentUser.role || null)
                    }
                } catch (error) {
                    console.error("Error loading current user:", error)
                    // Log out on error
                    AuthService.logout()
                    setIsAuthenticated(false)
                }
            }

            setLoading(false)
        }

        checkAuth()
    }, [])

    // Neue Funktion zur Synchronisierung der Rolle
    const syncRole = async () => {
        return await syncUserRoleWithBackend()
    }

    const login = async (data: LoginRequest) => {
        setLoading(true)
        try {
            console.log("Attempting login with:", data.email)

            // Wenn wir uns auf der Company-Login-Seite befinden, erzwingen wir die COMPANY-Rolle
            const isFromCompanyLogin = typeof window !== "undefined" && window.location.pathname.includes("/login/company")
            if (isFromCompanyLogin) {
                console.log("Login from company page, will force COMPANY role after login")
            }

            const response = await AuthService.login(data)
            console.log("Login response:", response)

            if (response.success && response.data) {
                // Get the user from the response
                const user = response.data.user
                console.log("User data received:", user)

                // Wenn wir uns auf der Company-Login-Seite befinden, erzwingen wir die COMPANY-Rolle
                if (isFromCompanyLogin) {
                    console.log("Forcing COMPANY role based on login page")
                    forceCompanyRole()

                    // Aktualisieren Sie auch die Benutzerrolle im Zustand
                    user.role = "COMPANY"
                } else {
                    // Synchronisiere die Rolle mit dem Backend
                    console.log("Synchronizing role with backend")
                    await syncUserRoleWithBackend()
                }

                setUser(user)
                setIsAuthenticated(true)
                setUserRole(user?.role || null)

                console.log("User role set to:", user?.role)

                // Debug the auth state
                debugAuthState()

                // Bestimmen Sie das Ziel basierend auf dem aktuellen Pfad
                if (isFromCompanyLogin) {
                    console.log("User logged in from company login page, redirecting to company dashboard")
                    window.location.href = "/dashboard/company"
                    return
                }

                // Wenn wir von der Content-Creator-Login-Seite kommen, leiten wir zum Content-Creator-Dashboard weiter
                const isFromContentCreatorLogin =
                    typeof window !== "undefined" && window.location.pathname.includes("/login/content-creator")

                if (isFromContentCreatorLogin) {
                    console.log("User logged in from content creator login page, redirecting to content creator dashboard")
                    window.location.href = "/dashboard/content-creator"
                    return
                }

                // Fallback zur normalen Rollenüberprüfung
                const isCompanyUser =
                    user?.role && (user.role.toUpperCase() === "COMPANY" || user.role.toUpperCase().includes("COMPANY"))

                console.log("Is company user based on role check:", isCompanyUser)

                if (isCompanyUser) {
                    console.log("Redirecting to company dashboard based on role")
                    window.location.href = "/dashboard/company"
                } else {
                    const isContentCreator = api.isContentCreator()
                    console.log("Is content creator check:", isContentCreator)

                    if (isContentCreator) {
                        console.log("Redirecting to content creator dashboard based on role check")
                        window.location.href = "/dashboard/content-creator"
                    } else {
                        console.log("No clear role determined, defaulting to company dashboard")
                        window.location.href = "/dashboard/company"
                    }
                }
            } else {
                console.log("Login unsuccessful or missing data:", response)
            }
        } catch (error: any) {
            console.error("Login error in hook:", error)
            throw error
        } finally {
            setLoading(false)
        }
    }

    // Rest of the code remains the same...
    const registerCompany = async (data: RegistrationRequest) => {
        setLoading(true)
        try {
            console.log("Registering company in hook:", data)

            // Ensure the role is set to COMPANY
            const companyData = {
                ...data,
                role: UserRole.COMPANY,
                userType: "COMPANY",
                isCompany: true,
            }

            const response = await AuthService.registerCompany(companyData)

            if (response && response.success) {
                console.log("Company registration successful:", response)
                router.push("/login/company?registered=true")
            } else {
                console.error("Company registration failed:", response)
                throw new Error(response?.message || "Registration failed")
            }
        } catch (error: any) {
            console.error("Company registration error in hook:", error)
            throw error
        } finally {
            setLoading(false)
        }
    }

    const registerContentCreator = async (data: RegistrationRequest) => {
        setLoading(true)
        try {
            console.log("Registering content creator in hook:", data)

            // Use the same approach as for company registration
            const enhancedData = {
                ...data,
                // Ensure all required fields are present
                companyName: data.companyName || `Creator Studio - ${data.firstName} ${data.lastName}`,
                companySize: data.companySize || "1-10",
                contactName: data.contactName || `${data.firstName} ${data.lastName}`,
                industry: data.industry || "Content Creation",
                website:
                    data.website || `https://creator.example.com/${data.firstName.toLowerCase()}-${data.lastName.toLowerCase()}`,
                // Add the role
                role: UserRole.CONTENT_CREATOR,
                userType: "CONTENT_CREATOR",
                isContentCreator: true,
            }

            console.log("Enhanced registration data for content creator:", enhancedData)

            const response = await AuthService.registerContentCreator(enhancedData)

            // Explicitly check if registration was successful
            if (response && response.success) {
                console.log("Content creator registration successful:", response)
                router.push("/login/content-creator?registered=true")
            } else {
                console.error("Content creator registration failed:", response)
                throw new Error(response?.message || "Registration failed")
            }
        } catch (error: any) {
            console.error("Content creator registration error in hook:", error)
            throw error
        } finally {
            setLoading(false)
        }
    }

    const forgotPassword = async (email: string, role: string) => {
        setLoading(true)
        try {
            await AuthService.forgotPassword(email, role)
        } catch (error: any) {
            console.error("Forgot password error in hook:", error)
            throw error
        } finally {
            setLoading(false)
        }
    }

    const resetPassword = async (data: PasswordResetRequest) => {
        setLoading(true)
        try {
            await AuthService.resetPassword(data)
            // Don't redirect here, let the component handle success state
        } catch (error: any) {
            console.error("Reset password error in hook:", error)
            throw error
        } finally {
            setLoading(false)
        }
    }

    const logout = () => {
        AuthService.logout()
        setUser(null)
        setIsAuthenticated(false)
        setUserRole(null)
        router.push("/")
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                login,
                registerCompany,
                registerContentCreator,
                forgotPassword,
                resetPassword,
                logout,
                isAuthenticated,
                userRole,
                syncRole,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider")
    }
    return context
}

