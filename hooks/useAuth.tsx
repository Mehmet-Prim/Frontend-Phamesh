"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { AuthService } from "@/lib/services/auth-service"
import type { User } from "@/lib/types"

// Define the LoginResponse type
interface LoginResponse {
    token: string
    user: User | null
}

// Update the AuthContextType interface to match the login function implementation
interface AuthContextType {
    user: User | null
    isLoading: boolean
    isAuthenticated: boolean
    login: (email: string, password: string, rememberMe?: boolean) => Promise<LoginResponse>
    logout: () => Promise<void>
    refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
    login: async () => {
        return {
            token: "",
            user: null as any,
        }
    },
    logout: async () => {},
    refreshUser: async () => {},
})

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    const refreshUser = async () => {
        if (!AuthService.isAuthenticated()) {
            setUser(null)
            setIsLoading(false)
            return
        }

        try {
            const userData = await AuthService.getCurrentUser()
            setUser(userData)
        } catch (error) {
            console.error("Failed to fetch user data:", error)
            // Wenn wir Benutzerdaten nicht abrufen können, ist das Token möglicherweise ungültig
            await logout()
        } finally {
            setIsLoading(false)
        }
    }

    // Automatische Token-Aktualisierung alle 15 Minuten
    useEffect(() => {
        if (user) {
            const refreshInterval = setInterval(
                () => {
                    refreshUser()
                },
                15 * 60 * 1000,
            ) // 15 Minuten

            return () => clearInterval(refreshInterval)
        }
    }, [user])

    useEffect(() => {
        refreshUser()
    }, [])

    const login = async (email: string, password: string, rememberMe = false) => {
        try {
            const response = await AuthService.login(email, password, rememberMe)
            setUser(response.user)

            // Return the response instead of redirecting
            return response
        } catch (error) {
            console.error("Login failed:", error)
            throw error
        }
    }

    const logout = async () => {
        await AuthService.logout()
        setUser(null)
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoading,
                isAuthenticated: !!user,
                login,
                logout,
                refreshUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

