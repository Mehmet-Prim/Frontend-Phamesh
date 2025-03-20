/**
 * API-Client für die Kommunikation mit dem Backend
 */

// Basis-URL aus der Umgebungsvariable
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL

// Hilfsfunktion für API-Anfragen
async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
    // Token aus dem localStorage holen
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null

    // Headers mit Authorization-Token
    const headers = {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
    }

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers,
        })

        // Wenn der Token abgelaufen ist (401), zur Login-Seite weiterleiten
        if (response.status === 401 && typeof window !== "undefined") {
            localStorage.removeItem("token")
            window.location.href = "/login"
            return null
        }

        // Wenn die Anfrage nicht erfolgreich war, einen Fehler werfen
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}))
            throw new Error(errorData.message || `API-Fehler: ${response.status}`)
        }

        // Wenn die Antwort leer ist, null zurückgeben
        const contentType = response.headers.get("content-type")
        if (!contentType || !contentType.includes("application/json")) {
            return null
        }

        return await response.json()
    } catch (error) {
        console.error("API-Fehler:", error)
        throw error
    }
}

/**
 * Holt die Benutzerrolle aus dem lokalen Speicher oder vom Server
 * @returns Die Benutzerrolle als String oder null, wenn nicht authentifiziert
 */
export async function getUserRole(): Promise<string | null> {
    // Prüfen, ob wir im Browser sind
    if (typeof window === "undefined") return null

    // Versuchen, die Benutzerrolle aus dem lokalen Speicher zu holen
    const userStr = localStorage.getItem("user")
    if (userStr) {
        try {
            const user = JSON.parse(userStr)
            if (user && user.role) return user.role
        } catch (e) {
            console.error("Fehler beim Parsen der Benutzerdaten:", e)
        }
    }

    // Wenn keine Rolle im lokalen Speicher gefunden wurde, vom Server holen
    try {
        const user = await api.users.getCurrent()
        if (user && user.role) {
            // Benutzer im lokalen Speicher aktualisieren
            localStorage.setItem("user", JSON.stringify(user))
            return user.role
        }
    } catch (e) {
        console.error("Fehler beim Abrufen der Benutzerrolle:", e)
    }

    return null
}

// API-Funktionen
export const api = {
    // Auth-Endpunkte
    auth: {
        login: async (email: string, password: string) => {
            return fetchWithAuth("/api/auth/login", {
                method: "POST",
                body: JSON.stringify({ email, password }),
            })
        },
        register: async (userData: any) => {
            return fetchWithAuth("/api/auth/register", {
                method: "POST",
                body: JSON.stringify(userData),
            })
        },
        forgotPassword: async (email: string) => {
            return fetchWithAuth("/api/auth/forgot-password", {
                method: "POST",
                body: JSON.stringify({ email }),
            })
        },
        resetPassword: async (token: string, password: string) => {
            return fetchWithAuth("/api/auth/reset-password", {
                method: "POST",
                body: JSON.stringify({ token, password }),
            })
        },
        logout: async () => {
            if (typeof window !== "undefined") {
                localStorage.removeItem("token")
                localStorage.removeItem("user")
            }
        },
    },

    // Dashboard-Endpunkte
    dashboard: {
        getData: async () => {
            return fetchWithAuth("/api/dashboard")
        },
    },

    // Benutzer-Endpunkte
    users: {
        getCurrent: async () => {
            return fetchWithAuth("/api/users/me")
        },
        update: async (userData: any) => {
            return fetchWithAuth("/api/users/me", {
                method: "PUT",
                body: JSON.stringify(userData),
            })
        },
        changePassword: async (oldPassword: string, newPassword: string) => {
            return fetchWithAuth("/api/users/change-password", {
                method: "POST",
                body: JSON.stringify({ oldPassword, newPassword }),
            })
        },
    },

    // Weitere Endpunkte können hier hinzugefügt werden
}

export default api

