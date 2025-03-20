"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { apiService, type LoginRequest } from "@/lib/api-service"
import { websocketService } from "@/lib/websocket-service"

interface User {
    id: number
    email: string
    role: string
    enabled: boolean
    [key: string]: any
}

interface AuthContextType {
    user: User | null
    loading: boolean
    error: string | null
    isAuthenticated: boolean
    login: (credentials: LoginRequest) => Promise<void>
    logout: () => void
    clearError: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

    const clearError = () => setError(null)

    useEffect(() => {
        const initAuth = async () => {
            const token = localStorage.getItem("token")
            if (token) {
                try {
                    const response = await apiService.getCurrentUser()
                    if (response.success && response.data) {
                        setUser(response.data)
                        // Verbinde WebSocket mit aktuellem Token
                        websocketService.connect()
                    } else {
                        localStorage.removeItem("token")
                    }
                } catch (err) {
                    console.error("Error initializing auth:", err)
                    localStorage.removeItem("token")
                }
            }
            setLoading(false)
        }

        initAuth()
    }, [])

    const login = async (credentials: LoginRequest) => {
        setLoading(true)
        setError(null)
        try {
            const response = await apiService.login(credentials)
            if (response.success && response.data) {
                const { token, user } = response.data
                localStorage.setItem("token", token)
                setUser(user)

                // Verbinde WebSocket mit neuem Token
                websocketService.updateToken(token)
                websocketService.connect()

                // Weiterleitung basierend auf Rolle
                if (user.role === "COMPANY") {
                    router.push("/company/dashboard")
                } else if (user.role === "CONTENT_CREATOR") {
                    router.push("/creator/dashboard")
                }
            }
        } catch (err: any) {
            setError(err.message || "Login fehlgeschlagen")
        } finally {
            setLoading(false)
        }
    }

    const logout = () => {
        localStorage.removeItem("token")
        setUser(null)
        websocketService.disconnect()
        router.push("/login")
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                error,
                isAuthenticated: !!user,
                login,
                logout,
                clearError,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider")
    }
    return context
}

