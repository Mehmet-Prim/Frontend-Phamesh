// Diese Datei enthält Hilfsfunktionen, um die Rolle des Benutzers zu erzwingen
// und Debugging-Informationen anzuzeigen

/**
 * Erzwingt die Rolle "COMPANY" für den aktuellen Benutzer
 * Wird verwendet, um sicherzustellen, dass die richtige Rolle bei der Registrierung gesetzt wird
 */
export function forceCompanyRole() {
    if (typeof window === "undefined") return

    console.log("Setting role to COMPANY")

    // Setze Cookies
    document.cookie = "user_role=ROLE_COMPANY; path=/"
    document.cookie = "user_role_raw=COMPANY; path=/"
    document.cookie = "user_type=COMPANY; path=/"
    document.cookie = "user_is_content_creator=false; path=/"
    document.cookie = "user_is_company=true; path=/"

    // Setze localStorage
    localStorage.setItem("userRole", "COMPANY")
    localStorage.setItem("userType", "COMPANY")
    localStorage.setItem("isCompany", "true")
    localStorage.setItem("isContentCreator", "false")

    // Setze sessionStorage
    sessionStorage.setItem("userRole", "COMPANY")
    sessionStorage.setItem("userType", "COMPANY")
}

/**
 * Erzwingt die Rolle "CONTENT_CREATOR" für den aktuellen Benutzer
 * Wird verwendet, um sicherzustellen, dass die richtige Rolle bei der Registrierung gesetzt wird
 */
export function forceContentCreatorRole() {
    if (typeof window === "undefined") return

    console.log("Setting role to CONTENT_CREATOR")

    // Setze Cookies
    document.cookie = "user_role=ROLE_CONTENT_CREATOR; path=/"
    document.cookie = "user_role_raw=CONTENT_CREATOR; path=/"
    document.cookie = "user_type=CONTENT_CREATOR; path=/"
    document.cookie = "user_is_content_creator=true; path=/"
    document.cookie = "user_is_company=false; path=/"

    // Setze localStorage
    localStorage.setItem("userRole", "CONTENT_CREATOR")
    localStorage.setItem("userType", "CONTENT_CREATOR")
    localStorage.setItem("isCompany", "false")
    localStorage.setItem("isContentCreator", "true")

    // Setze sessionStorage
    sessionStorage.setItem("userRole", "CONTENT_CREATOR")
    sessionStorage.setItem("userType", "CONTENT_CREATOR")
}

/**
 * Zeigt den aktuellen Authentifizierungsstatus an
 */
export function debugAuthState() {
    if (typeof window === "undefined") return

    console.group("Auth Debug Info")

    // Cookies auslesen
    console.log("Cookies:")
    const cookies = document.cookie.split(";").reduce(
        (acc, cookie) => {
            const [key, value] = cookie.trim().split("=")
            acc[key] = value
            return acc
        },
        {} as Record<string, string>,
    )
    console.log(cookies)

    // localStorage auslesen
    console.log("localStorage:")
    const localStorageItems: Record<string, string> = {}
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key) {
            localStorageItems[key] = localStorage.getItem(key) || ""
        }
    }
    console.log(localStorageItems)

    // sessionStorage auslesen
    console.log("sessionStorage:")
    const sessionStorageItems: Record<string, string> = {}
    for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i)
        if (key) {
            sessionStorageItems[key] = sessionStorage.getItem(key) || ""
        }
    }
    console.log(sessionStorageItems)

    console.groupEnd()
}

