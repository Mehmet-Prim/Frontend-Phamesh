import type { ApiResponseWrapper } from "./types"
import { AuthService } from "./services/auth-service"

// Verbessere die API-Client-Konfiguration für Produktionsumgebung
export const API_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    (process.env.NODE_ENV === "production" ? window.location.origin : "http://localhost:8080")

/**
 * Utility-Funktion für authentifizierte API-Anfragen
 */
export async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_URL}${endpoint}`

    // Hole das JWT-Token
    const token = AuthService.getToken()

    // Richte Header mit Authentifizierung ein, wenn Token existiert
    const headers = new Headers(options.headers)

    if (!headers.has("Content-Type")) {
        headers.set("Content-Type", "application/json")
    }

    if (token) {
        headers.set("Authorization", `Bearer ${token}`)
    }

    // Füge CSRF-Token hinzu, wenn verfügbar (für Produktionsumgebung)
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute("content")
    if (csrfToken) {
        headers.set("X-CSRF-TOKEN", csrfToken)
    }

    // Merge Optionen mit Headers
    const requestOptions: RequestInit = {
        ...options,
        headers,
        credentials: "include", // Cookies in Anfragen einbeziehen
    }

    try {
        const response = await fetch(url, requestOptions)

        // Behandle 401 Unauthorized - Weiterleitung zur Anmeldeseite
        if (response.status === 401) {
            AuthService.logout()
            window.location.href = "/auth/login"
            throw new Error("Unauthorized")
        }

        // Behandle 403 Forbidden
        if (response.status === 403) {
            throw new Error("Forbidden: Sie haben keine Berechtigung für diese Aktion")
        }

        // Behandle 404 Not Found
        if (response.status === 404) {
            throw new Error("Resource not found")
        }

        // Behandle 500 Server Error
        if (response.status === 500) {
            throw new Error("Serverfehler: Bitte versuchen Sie es später erneut")
        }

        // Parse die JSON-Antwort
        const data: ApiResponseWrapper<T> = await response.json()

        // Prüfe, ob die API einen Fehler zurückgegeben hat
        if (!data.success) {
            throw new Error(data.message || "Ein Fehler ist aufgetreten")
        }

        // Gib die Daten aus der API-Antwort zurück
        return data.data
    } catch (error) {
        console.error(`API-Anfrage fehlgeschlagen: ${url}`, error)
        throw error
    }
}

/**
 * Utility function to make API requests without authentication
 */
export async function publicApiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_URL}${endpoint}`

    // Set up headers
    const headers = new Headers(options.headers)

    if (!headers.has("Content-Type")) {
        headers.set("Content-Type", "application/json")
    }

    // Merge options with headers
    const requestOptions: RequestInit = {
        ...options,
        headers,
        credentials: "include", // Include cookies in requests
    }

    try {
        const response = await fetch(url, requestOptions)

        // Parse the JSON response
        const data: ApiResponseWrapper<T> = await response.json()

        // Check if the API returned an error
        if (!data.success) {
            throw new Error(data.message || "An error occurred")
        }

        // Return the data from the API response
        return data.data
    } catch (error) {
        console.error(`API request failed: ${url}`, error)
        throw error
    }
}

