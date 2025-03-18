/**
 * Debug-Hilfsfunktionen für Authentifizierungsprobleme
 */

export function debugAuthState() {
    if (typeof window === "undefined") return null

    console.group("🔍 Auth Debug Information")

    // Cookies auslesen
    console.log("📋 Cookies:")
    document.cookie.split(";").forEach((cookie) => {
        const [name, value] = cookie.trim().split("=")
        console.log(`   ${name}: ${value}`)
    })

    // LocalStorage auslesen
    console.log("💾 LocalStorage:")
    const authKeys = [
        "token",
        "userRole",
        "userRoleRaw",
        "userType",
        "userIsContentCreator",
        "userIsCompany",
        "contentCreatorEmails",
    ]

    authKeys.forEach((key) => {
        console.log(`   ${key}: ${localStorage.getItem(key)}`)
    })

    // SessionStorage auslesen
    console.log("🔒 SessionStorage:")
    authKeys.forEach((key) => {
        console.log(`   ${key}: ${sessionStorage.getItem(key)}`)
    })

    console.groupEnd()

    return "Auth debug information logged to console"
}

/**
 * Prüft, ob ein Benutzer ein Content Creator ist, basierend auf allen verfügbaren Informationen
 */
export function debugIsContentCreator() {
    if (typeof window === "undefined") return false

    const results = {
        fromCookies: {
            userType:
                document.cookie
                    .split(";")
                    .find((c) => c.trim().startsWith("user_type="))
                    ?.split("=")[1] === "CONTENT_CREATOR",
            isContentCreator:
                document.cookie
                    .split(";")
                    .find((c) => c.trim().startsWith("user_is_content_creator="))
                    ?.split("=")[1] === "true",
            isCompany:
                document.cookie
                    .split(";")
                    .find((c) => c.trim().startsWith("user_is_company="))
                    ?.split("=")[1] === "true",
            role: document.cookie
                .split(";")
                .find((c) => c.trim().startsWith("user_role="))
                ?.split("=")[1],
            rawRole: document.cookie
                .split(";")
                .find((c) => c.trim().startsWith("user_role_raw="))
                ?.split("=")[1],
        },
        fromLocalStorage: {
            userType: localStorage.getItem("userType") === "CONTENT_CREATOR",
            isContentCreator: localStorage.getItem("userIsContentCreator") === "true",
            isCompany: localStorage.getItem("userIsCompany") === "true",
            role: localStorage.getItem("userRole"),
            rawRole: localStorage.getItem("userRoleRaw"),
        },
        fromSessionStorage: {
            userType: sessionStorage.getItem("userType") === "CONTENT_CREATOR",
            isContentCreator: sessionStorage.getItem("userIsContentCreator") === "true",
            isCompany: sessionStorage.getItem("userIsCompany") === "true",
            role: sessionStorage.getItem("userRole"),
            rawRole: sessionStorage.getItem("userRoleRaw"),
        },
    }

    console.group("🔍 Content Creator Check Debug")
    console.log(results)

    // Gesamtergebnis
    const isContentCreator =
        results.fromCookies.userType ||
        results.fromCookies.isContentCreator ||
        (results.fromCookies.role &&
            (results.fromCookies.role.includes("CONTENT") || results.fromCookies.role.includes("CREATOR"))) ||
        results.fromLocalStorage.userType ||
        results.fromLocalStorage.isContentCreator ||
        (results.fromLocalStorage.role &&
            (results.fromLocalStorage.role.includes("CONTENT") || results.fromLocalStorage.role.includes("CREATOR"))) ||
        results.fromSessionStorage.userType ||
        results.fromSessionStorage.isContentCreator ||
        (results.fromSessionStorage.role &&
            (results.fromSessionStorage.role.includes("CONTENT") || results.fromSessionStorage.role.includes("CREATOR")))

    console.log("Final result:", isContentCreator)
    console.groupEnd()

    return isContentCreator
}

