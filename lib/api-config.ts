/**
 * API-Konfiguration
 * Stellt Funktionen bereit, um die API-Pfade zu konfigurieren und abzurufen
 */

// Standard-API-Präfixe
const DEFAULT_API_PREFIX = "" // Removed /api prefix since it's been removed from the backend
const DEFAULT_AUTH_PREFIX = "/auth" // This matches the backend's whitelist URLs

/**
 * Gibt den API-Präfix zurück
 * Prüft zuerst auf benutzerdefinierte Präfixe in localStorage
 */
export function getApiPrefix(): string {
    if (typeof window === "undefined") return DEFAULT_API_PREFIX

    const customPrefix = localStorage.getItem("customApiPrefix")
    return customPrefix || DEFAULT_API_PREFIX
}

/**
 * Gibt den Auth-Präfix zurück
 * Prüft zuerst auf benutzerdefinierte Präfixe in localStorage
 */
export function getAuthPrefix(): string {
    if (typeof window === "undefined") return DEFAULT_AUTH_PREFIX

    const customPrefix = localStorage.getItem("customAuthPrefix")
    return customPrefix || DEFAULT_AUTH_PREFIX
}

/**
 * Gibt die vollständige API-URL mit Präfix zurück
 */
export function getApiUrl(endpoint: string): string {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"
    const apiPrefix = getApiPrefix()

    // Stelle sicher, dass der Endpunkt mit einem Schrägstrich beginnt, wenn er nicht leer ist
    const formattedEndpoint = endpoint && !endpoint.startsWith("/") ? `/${endpoint}` : endpoint

    return `${API_URL}${apiPrefix}${formattedEndpoint}`
}

/**
 * Gibt die vollständige Auth-URL mit Präfix zurück
 */
export function getAuthUrl(endpoint: string): string {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"
    const authPrefix = getAuthPrefix()

    // Stelle sicher, dass der Endpunkt mit einem Schrägstrich beginnt, wenn er nicht leer ist
    const formattedEndpoint = endpoint && !endpoint.startsWith("/") ? `/${endpoint}` : endpoint

    return `${API_URL}${authPrefix}${formattedEndpoint}`
}

/**
 * Setzt benutzerdefinierte API-Präfixe
 */
export function setCustomApiPrefixes(apiPrefix: string, authPrefix: string): void {
    if (typeof window === "undefined") return

    localStorage.setItem("customApiPrefix", apiPrefix)
    localStorage.setItem("customAuthPrefix", authPrefix)
}

