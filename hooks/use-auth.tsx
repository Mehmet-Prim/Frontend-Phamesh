"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { AuthService } from "@/lib/auth"
import type { LoginRequest, RegistrationRequest, PasswordResetRequest, User } from "@/types/auth"
import type { UserRole } from "@/types/auth"
import api from "@/lib/api"

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

    const login = async (data: LoginRequest) => {
        setLoading(true)
        try {
            console.log("Attempting login with:", data.email)
            const response = await AuthService.login(data)
            console.log("Login response:", response)

            if (response.success && response.data) {
                // Get the user from the response
                const user = response.data.user
                console.log("User data received:", user)
                setUser(user)
                setIsAuthenticated(true)
                setUserRole(user?.role || null)

                console.log("User role set to:", user?.role)

                // Determine redirect path based on role
                const isContentCreator = api.isContentCreator()
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
            const response = await AuthService.registerCompany(data)

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
                role: "CONTENT_CREATOR",
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

    const forgotPassword = async (email: string, role: UserRole) => {
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

