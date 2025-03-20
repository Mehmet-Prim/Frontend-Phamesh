// Hilfsfunktionen für die Authentifizierung

/**
 * Holt das JWT-Token aus dem localStorage oder sessionStorage
 */
export function getToken(): string | null {
    if (typeof window === "undefined") return null

    return localStorage.getItem("token") || sessionStorage.getItem("token")
}

/**
 * Speichert das JWT-Token im localStorage oder sessionStorage
 */
export function setToken(token: string, rememberMe = false): void {
    if (typeof window === "undefined") return

    if (rememberMe) {
        localStorage.setItem("token", token)
    } else {
        sessionStorage.setItem("token", token)
    }
}

/**
 * Entfernt das JWT-Token aus dem localStorage und sessionStorage
 */
export function removeToken(): void {
    if (typeof window === "undefined") return

    localStorage.removeItem("token")
    sessionStorage.removeItem("token")
}

/**
 * Speichert die Benutzerrolle im localStorage
 */
export function setUserRole(role: string): void {
    if (typeof window === "undefined") return

    localStorage.setItem("userRole", role)
}

/**
 * Holt die Benutzerrolle aus dem localStorage
 */
export function getUserRole(): string | null {
    if (typeof window === "undefined") return null

    return localStorage.getItem("userRole")
}

/**
 * Entfernt die Benutzerrolle aus dem localStorage
 */
export function removeUserRole(): void {
    if (typeof window === "undefined") return

    localStorage.removeItem("userRole")
}

/**
 * Prüft, ob der Benutzer authentifiziert ist
 */
export function isAuthenticated(): boolean {
    return !!getToken()
}

