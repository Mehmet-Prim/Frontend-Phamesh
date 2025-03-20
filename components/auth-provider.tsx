"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import api from "@/lib/api"

// Benutzertyp definieren
interface User {
    id: string
    email: string
    name: string
    role: string
    [key: string]: any // Für zusätzliche Felder
}

// Auth-Kontext-Typ definieren
interface AuthContextType {
    user: User | null
    loading: boolean
    login: (email: string, password: string) => Promise<void>
    logout: () => void
    isAuthenticated: boolean
}

// Auth-Kontext erstellen
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Auth-Provider-Komponente
export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    // Beim ersten Laden prüfen, ob der Benutzer angemeldet ist
    useEffect(() => {
        const checkAuth = async () => {
            try {
                // Token aus dem localStorage holen
                const token = localStorage.getItem("token")

                if (!token) {
                    setLoading(false)
                    return
                }

                // Benutzerdaten abrufen
                const userData = await api.users.getCurrent()

                if (userData) {
                    setUser(userData)
                }
            } catch (error) {
                console.error("Fehler beim Abrufen der Benutzerdaten:", error)
                // Bei Fehler Token entfernen
                localStorage.removeItem("token")
            } finally {
                setLoading(false)
            }
        }

        checkAuth()
    }, [])

    // Login-Funktion
    const login = async (email: string, password: string) => {
        setLoading(true)
        try {
            const response = await api.auth.login(email, password)

            if (response && response.token) {
                localStorage.setItem("token", response.token)

                if (response.user) {
                    setUser(response.user)
                    localStorage.setItem("user", JSON.stringify(response.user))
                }

                router.push("/dashboard")
            }
        } finally {
            setLoading(false)
        }
    }

    // Logout-Funktion
    const logout = () => {
        api.auth.logout()
        setUser(null)
        router.push("/login")
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                login,
                logout,
                isAuthenticated: !!user,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

// Hook für den einfachen Zugriff auf den Auth-Kontext
export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error("useAuth muss innerhalb eines AuthProviders verwendet werden")
    }
    return context
}

