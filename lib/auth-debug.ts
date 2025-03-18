/**
 * Dieses Modul enthält Funktionen zur Diagnose und Behebung von Authentifizierungsproblemen
 */

import api, { API_PREFIX } from "./api"
import { debugAuthState } from "./debug-auth"

/**
 * Ruft die Benutzerinformationen direkt vom Backend ab und aktualisiert die lokalen Rollen-Flags
 * Dies ist nützlich, wenn die Rolleninformationen im Frontend und Backend nicht übereinstimmen
 */
export async function syncUserRoleWithBackend() {
    console.log("Synchronisiere Benutzerrolle mit dem Backend...")

    try {
        // Rufe die Benutzerinformationen vom Backend ab
        // Hier war der Fehler: Der API_PREFIX fehlte
        const response = await api.get(`${API_PREFIX}/auth/me`)

        if (response.success && response.data) {
            const user = response.data
            console.log("Benutzerinformationen vom Backend erhalten:", user)

            // Überprüfe die Rolle des Benutzers
            if (user.role) {
                const role = user.role.toUpperCase()
                console.log("Rolle vom Backend:", role)

                // Setze die Rolle basierend auf den Backend-Daten
                if (role === "COMPANY") {
                    console.log("Setze Rolle auf COMPANY basierend auf Backend-Daten")
                    forceCompanyRole()
                    return "COMPANY"
                } else if (role === "CONTENT_CREATOR") {
                    console.log("Setze Rolle auf CONTENT_CREATOR basierend auf Backend-Daten")
                    forceContentCreatorRole()
                    return "CONTENT_CREATOR"
                }
            }

            // Fallback: Überprüfe den Benutzertyp
            if (user.discriminator === "Company") {
                console.log("Benutzer ist ein Unternehmen basierend auf discriminator")
                forceCompanyRole()
                return "COMPANY"
            } else if (user.discriminator === "ContentCreator") {
                console.log("Benutzer ist ein Content Creator basierend auf discriminator")
                forceContentCreatorRole()
                return "CONTENT_CREATOR"
            }

            console.log("Keine eindeutige Rolle gefunden, verwende Standard: COMPANY")
            forceCompanyRole()
            return "COMPANY"
        } else {
            console.error("Fehler beim Abrufen der Benutzerinformationen:", response)
            return null
        }
    } catch (error) {
        console.error("Fehler bei der Synchronisierung der Benutzerrolle:", error)
        return null
    }
}

/**
 * Erzwingt die Rolle "COMPANY" für den aktuellen Benutzer
 */
export function forceCompanyRole(): void {
    console.log("Erzwinge COMPANY-Rolle für Benutzer")

    // Setze alle relevanten Cookies
    document.cookie = "user_role=ROLE_COMPANY; path=/"
    document.cookie = "user_role_raw=COMPANY; path=/"
    document.cookie = "user_type=COMPANY; path=/"
    document.cookie = "user_is_content_creator=false; path=/"
    document.cookie = "user_is_company=true; path=/"

    // Setze auch localStorage und sessionStorage
    if (typeof window !== "undefined") {
        localStorage.setItem("userRole", "ROLE_COMPANY")
        localStorage.setItem("userRoleRaw", "COMPANY")
        localStorage.setItem("userType", "COMPANY")
        localStorage.setItem("userIsContentCreator", "false")
        localStorage.setItem("userIsCompany", "true")

        sessionStorage.setItem("userRole", "ROLE_COMPANY")
        sessionStorage.setItem("userRoleRaw", "COMPANY")
        sessionStorage.setItem("userType", "COMPANY")
        sessionStorage.setItem("userIsContentCreator", "false")
        sessionStorage.setItem("userIsCompany", "true")
    }

    console.log("COMPANY-Rolle wurde erfolgreich erzwungen")
    debugAuthState()
}

/**
 * Erzwingt die Rolle "CONTENT_CREATOR" für den aktuellen Benutzer
 */
export function forceContentCreatorRole(): void {
    console.log("Erzwinge CONTENT_CREATOR-Rolle für Benutzer")

    // Setze alle relevanten Cookies
    document.cookie = "user_role=ROLE_CONTENT_CREATOR; path=/"
    document.cookie = "user_role_raw=CONTENT_CREATOR; path=/"
    document.cookie = "user_type=CONTENT_CREATOR; path=/"
    document.cookie = "user_is_content_creator=true; path=/"
    document.cookie = "user_is_company=false; path=/"

    // Setze auch localStorage und sessionStorage
    if (typeof window !== "undefined") {
        localStorage.setItem("userRole", "ROLE_CONTENT_CREATOR")
        localStorage.setItem("userRoleRaw", "CONTENT_CREATOR")
        localStorage.setItem("userType", "CONTENT_CREATOR")
        localStorage.setItem("userIsContentCreator", "true")
        localStorage.setItem("userIsCompany", "false")

        sessionStorage.setItem("userRole", "ROLE_CONTENT_CREATOR")
        sessionStorage.setItem("userRoleRaw", "CONTENT_CREATOR")
        sessionStorage.setItem("userType", "CONTENT_CREATOR")
        sessionStorage.setItem("userIsContentCreator", "true")
        sessionStorage.setItem("userIsCompany", "false")
    }

    console.log("CONTENT_CREATOR-Rolle wurde erfolgreich erzwungen")
    debugAuthState()
}

