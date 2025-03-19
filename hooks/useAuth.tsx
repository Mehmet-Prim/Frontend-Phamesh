"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { authService } from "@/services/auth-service"
import type { LoginRequest, RegistrationRequest, PasswordResetRequest } from "@/types/auth"
import type { UserRole } from "@/types/auth"
import { debugAuthState } from "@/lib/auth-debug"
import {User} from "@/types/models";

interface AuthContextType {
    user: User | null
    loading: boolean
    login: (data: LoginRequest) => Promise<void>
    registerCompany: (data: RegistrationRequest) => Promise<void>
    registerContentCreator: (data: RegistrationRequest) => Promise<void>
    forgotPassword: (email: string, role: UserRole) => Promise<void>
    resetPassword: (data: PasswordResetRequest) => Promise<void>
    logout: () => void
    isAuthenticated: boolean
    userRole: UserRole | null
    syncRole: () => Promise<string | null>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [userRole, setUserRole] = useState<UserRole | null>(null)
    const router = useRouter()

    useEffect(() => {
        // Check if user is logged in
        const checkAuth = async () => {
            const isAuth = authService.isAuthenticated()
            setIsAuthenticated(isAuth)

            if (isAuth) {
                try {
                    // Try to load current user
                    const currentUser = authService.getCurrentUser()
                    if (currentUser) {
                        setUser(currentUser)
                        setUserRole(currentUser.role || null)
                    }
                } catch (error) {
                    console.error("Error loading current user:", error)
                    // Log out on error
                    authService.logout()
                    setIsAuthenticated(false)
                }
            }

            setLoading(false)
        }

        checkAuth()
    }, [])

    const login = async (data: LoginRequest) => {
        setLoading(true)
        try {
            console.log("Attempting login with:", data.email)
            const response = await authService.login(data)
            console.log("Login response:", response)

            if (response) {
                // Get the user from the response
                const user = response.user
                console.log("User data received:", user)
                setUser(user)
                setIsAuthenticated(true)
                setUserRole(user?.role || null)

                console.log("User role set to:", user?.role)

                // Determine redirect path based on role
                const isContentCreator = user?.role === "CONTENT_CREATOR"
                const redirectPath = isContentCreator ? "/dashboard/content-creator" : "/dashboard/company"

                console.log(`Redirecting to ${redirectPath}`)

                // Use router.push for client-side navigation
                router.push(redirectPath)
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

    const registerCompany = async (data: RegistrationRequest) => {
        setLoading(true)
        try {
            console.log("Registering company in hook:", data)
            const response = await authService.registerCompany(data)

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

            // Ensure all required fields are present
            const enhancedData = {
                ...data,
                // Add the role
                role: "CONTENT_CREATOR",
                userType: "CONTENT_CREATOR",
                isContentCreator: true,
            }

            console.log("Enhanced registration data for content creator:", enhancedData)

            const response = await authService.registerContentCreator(enhancedData)

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

    const forgotPassword = async (email: string, role: UserRole) => {
        setLoading(true)
        try {
            await authService.forgotPassword(email, role)
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
            await authService.resetPassword(data)
            // Don't redirect here, let the component handle success state
        } catch (error: any) {
            console.error("Reset password error in hook:", error)
            throw error
        } finally {
            setLoading(false)
        }
    }

    const logout = () => {
        authService.logout()
        setUser(null)
        setIsAuthenticated(false)
        setUserRole(null)
        router.push("/")
    }

    // Funktion zum Synchronisieren der Rolle mit dem Backend
    const syncRole = async (): Promise<string | null> => {
        try {
            // Hier würde normalerweise ein API-Aufruf erfolgen, um die Rolle vom Backend zu holen
            // Da wir keinen direkten Zugriff auf das Backend haben, verwenden wir die lokale Rolle
            const role = authService.getUserRole()
            console.log("Synchronized role:", role)

            if (role) {
                setUserRole(role as UserRole)
            }

            // Debug-Informationen anzeigen
            debugAuthState()

            return role
        } catch (error) {
            console.error("Error synchronizing role:", error)
            return null
        }
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

