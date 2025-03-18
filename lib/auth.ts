import api, { API_PREFIX, type ApiResponse } from "./api"
import type { LoginRequest, RegistrationRequest, PasswordResetRequest, User } from "@/types/auth"

// Definieren Sie einen Typ für die verschachtelte Datenstruktur
interface LoginResponseData {
    token: string
    user: User
}

// Definieren Sie einen Typ für die API-Antwort
interface LoginApiResponse {
    success: boolean
    message?: string
    data?: {
        token?: string
        user?: User
        data?: LoginResponseData
    }
    timestamp?: string
}

// Definieren Sie die UserRole-Konstanten hier, damit sie in der Datei verfügbar sind
const USER_ROLES = {
    CONTENT_CREATOR: "CONTENT_CREATOR",
    COMPANY: "COMPANY",
    ADMIN: "ADMIN",
}

export const AuthService = {
    // Login
    login: async (loginRequest: LoginRequest) => {
        try {
            // Normalisiere die E-Mail-Adresse
            const normalizedEmail = loginRequest.email.trim().toLowerCase()
            console.log("Login attempt with normalized email:", normalizedEmail)

            // Verwenden Sie den korrekten Typ für die API-Antwort
            const response = await api.post<LoginApiResponse>(`${API_PREFIX}/auth/login`, {
                email: normalizedEmail,
                password: loginRequest.password,
                rememberMe: loginRequest.rememberMe,
            })

            console.log("Login API response:", response)
            console.log("FULL RESPONSE STRUCTURE:", JSON.stringify(response, null, 2))

            if (response.success && response.data) {
                // Überprüfen Sie die Struktur der Antwort
                const responseData = response.data

                // Wenn die Antwort eine verschachtelte data-Eigenschaft hat
                if (responseData.data && responseData.data.data) {
                    const actualData = responseData.data.data
                    console.log("Actual data from nested structure:", actualData)

                    // Prüfe, ob die Antwort die erwartete Struktur hat
                    if (!actualData.token || !actualData.user) {
                        console.error("Missing token or user in response data:", actualData)
                        return {
                            success: false,
                            message: "Unerwartete Antwortstruktur vom Server (fehlender Token oder Benutzer)",
                            data: null,
                            timestamp: new Date().toISOString(),
                        }
                    }

                    // Überprüfe, ob der Benutzer verifiziert ist (falls das Feld existiert)
                    if (actualData.user.enabled === false) {
                        return {
                            success: false,
                            message: "User not verified",
                            data: null,
                            timestamp: new Date().toISOString(),
                        }
                    }

                    // Speichere Token
                    const { token, user } = actualData
                    console.log("User data from API:", user)

                    // Überprüfen Sie die E-Mail-Adresse, um den Benutzertyp zu bestimmen
                    const isContentCreator =
                        loginRequest.isContentCreator ||
                        loginRequest.role === USER_ROLES.CONTENT_CREATOR ||
                        checkIfContentCreator(normalizedEmail)
                    console.log("Is content creator based on checks:", isContentCreator)

                    // Speichere Token
                    api.setAuthToken(token, loginRequest.rememberMe || false)

                    // Speichere Benutzerrolle
                    if (user.role) {
                        // Speichere die Rolle sowohl mit als auch ohne Präfix
                        const roleWithPrefix = `ROLE_${user.role.toUpperCase().replace("-", "_")}`
                        const roleWithoutPrefix = user.role

                        console.log("Storing user role with prefix:", roleWithPrefix)
                        console.log("Storing user role without prefix:", roleWithoutPrefix)

                        // Setze die Rolle in Cookies und Storage
                        api.setUserRole(roleWithPrefix, roleWithoutPrefix, loginRequest.rememberMe, isContentCreator)
                    } else {
                        // Wenn keine Rolle vorhanden ist, setzen Sie eine Standardrolle basierend auf dem Benutzertyp
                        const defaultRole = isContentCreator ? "ROLE_CONTENT_CREATOR" : "ROLE_COMPANY"
                        const defaultRoleRaw = isContentCreator ? USER_ROLES.CONTENT_CREATOR : USER_ROLES.COMPANY

                        console.log("No role found, setting default role:", defaultRole)
                        api.setUserRole(defaultRole, defaultRoleRaw, loginRequest.rememberMe, isContentCreator)

                        // Aktualisieren Sie die Benutzerrolle im Objekt
                        user.role = defaultRoleRaw
                    }

                    // Gib die erfolgreiche Antwort zurück, aber mit den korrekten Daten
                    return {
                        success: true,
                        message: responseData.message || "Login successful",
                        data: actualData,
                        timestamp: responseData.timestamp || new Date().toISOString(),
                    }
                }
                // Wenn die Antwort direkt token und user in data enthält
                else if (responseData.data && responseData.data.token && responseData.data.user) {
                    console.log("Direct data structure:", responseData.data)

                    // Überprüfe, ob der Benutzer verifiziert ist (falls das Feld existiert)
                    if (responseData.data.user.enabled === false) {
                        return {
                            success: false,
                            message: "User not verified",
                            data: null,
                            timestamp: new Date().toISOString(),
                        }
                    }

                    // Speichere Token
                    const { token, user } = responseData.data
                    console.log("User data from API:", user)

                    // Überprüfen Sie die E-Mail-Adresse, um den Benutzertyp zu bestimmen
                    const isContentCreator =
                        loginRequest.isContentCreator ||
                        loginRequest.role === USER_ROLES.CONTENT_CREATOR ||
                        checkIfContentCreator(normalizedEmail)
                    console.log("Is content creator based on checks:", isContentCreator)

                    // Speichere Token
                    api.setAuthToken(token, loginRequest.rememberMe || false)

                    // Speichere Benutzerrolle
                    if (user.role) {
                        // Speichere die Rolle sowohl mit als auch ohne Präfix
                        const roleWithPrefix = `ROLE_${user.role.toUpperCase().replace("-", "_")}`
                        const roleWithoutPrefix = user.role

                        console.log("Storing user role with prefix:", roleWithPrefix)
                        console.log("Storing user role without prefix:", roleWithoutPrefix)

                        // Setze die Rolle in Cookies und Storage
                        api.setUserRole(roleWithPrefix, roleWithoutPrefix, loginRequest.rememberMe, isContentCreator)
                    } else {
                        // Wenn keine Rolle vorhanden ist, setzen Sie eine Standardrolle basierend auf dem Benutzertyp
                        const defaultRole = isContentCreator ? "ROLE_CONTENT_CREATOR" : "ROLE_COMPANY"
                        const defaultRoleRaw = isContentCreator ? USER_ROLES.CONTENT_CREATOR : USER_ROLES.COMPANY

                        console.log("No role found, setting default role:", defaultRole)
                        api.setUserRole(defaultRole, defaultRoleRaw, loginRequest.rememberMe, isContentCreator)

                        // Aktualisieren Sie die Benutzerrolle im Objekt
                        user.role = defaultRoleRaw
                    }

                    return {
                        success: true,
                        message: "Login successful",
                        data: responseData.data,
                        timestamp: new Date().toISOString(),
                    }
                } else {
                    console.error("Unexpected response structure:", responseData)
                    return {
                        success: false,
                        message: "Unerwartete Antwortstruktur vom Server",
                        data: null,
                        timestamp: new Date().toISOString(),
                    }
                }
            }

            return response
        } catch (error: any) {
            console.error("Login error:", error)
            throw error.response?.data || { success: false, message: error.message || "Login failed" }
        }
    },

    // Check if user is authenticated
    isAuthenticated: () => {
        if (typeof window === "undefined") return false
        return !!api.getAuthToken()
    },

    // Get current user
    getCurrentUser: async (): Promise<User | null> => {
        try {
            if (!AuthService.isAuthenticated()) {
                return null
            }

            const response = await api.get<ApiResponse<User>>(`${API_PREFIX}/auth/me`)

            if (response.success && response.data) {
                // Prüfe, ob die Daten verschachtelt sind
                let user: User
                if (response.data.data) {
                    user = response.data.data
                } else {
                    user = response.data
                }

                // Überprüfen Sie, ob der Benutzer ein Content Creator ist, basierend auf den Cookies
                const isContentCreator = api.isContentCreator()
                if (isContentCreator) {
                    user.role = USER_ROLES.CONTENT_CREATOR
                    console.log("Overriding role to CONTENT_CREATOR based on stored flags")
                } else if (api.isCompany()) {
                    user.role = USER_ROLES.COMPANY
                    console.log("Setting role to COMPANY based on stored flags")
                }

                return user
            }
            return null
        } catch (error: any) {
            console.error("Error getting current user:", error)
            // Bei Authentifizierungsfehlern Token löschen
            if (error.status === 401 || error.status === 403) {
                AuthService.logout()
            }
            return null
        }
    },

    // Logout
    logout: () => {
        console.log("Logging out user")
        api.clearAuthToken()
    },

    // Register company
    registerCompany: async (registrationRequest: RegistrationRequest) => {
        try {
            console.log("Registering company with endpoint:", `${API_PREFIX}/auth/register/company`)

            // Stellen Sie sicher, dass die Rolle auf COMPANY gesetzt ist
            const companyRequest = {
                ...registrationRequest,
                role: USER_ROLES.COMPANY,
                userType: "COMPANY",
                isCompany: true,
            }

            const response = await api.post<void>(`${API_PREFIX}/auth/register/company`, companyRequest)

            // Überprüfen Sie, ob die Antwort erfolgreich war
            if (!response.success) {
                console.error("Company registration failed:", response)
                throw new Error(response.message || "Registration failed")
            }

            console.log("Company registration successful:", response)
            return response
        } catch (error: any) {
            console.error("Company registration error:", error)
            throw error.response?.data || { success: false, message: error.message || "Registration failed" }
        }
    },

    // Register content creator - Verwenden Sie den gleichen Ansatz wie für die Firmenregistrierung
    registerContentCreator: async (registrationRequest: RegistrationRequest) => {
        try {
            // Speichern Sie die E-Mail-Adresse in einer speziellen Liste von Content-Creator-E-Mails
            storeContentCreatorEmail(registrationRequest.email)

            // Erstellen Sie eine Anfrage, die der Firmenregistrierung ähnelt, aber mit Content-Creator-Rolle
            const contentCreatorRequest = {
                ...registrationRequest,
                // Stellen Sie sicher, dass alle erforderlichen Felder vorhanden sind
                companyName:
                    registrationRequest.companyName ||
                    `Creator Studio - ${registrationRequest.firstName} ${registrationRequest.lastName}`,
                companySize: registrationRequest.companySize || "1-10",
                contactName:
                    registrationRequest.contactName || `${registrationRequest.firstName} ${registrationRequest.lastName}`,
                industry: registrationRequest.industry || "Content Creation",
                website:
                    registrationRequest.website ||
                    `https://creator.example.com/${registrationRequest.firstName.toLowerCase()}-${registrationRequest.lastName.toLowerCase()}`,
                // Stellen Sie sicher, dass die Rolle eindeutig als CONTENT_CREATOR gesetzt ist
                role: USER_ROLES.CONTENT_CREATOR,
                userType: "CONTENT_CREATOR",
                // Fügen Sie ein explizites Flag hinzu, um den Benutzertyp zu kennzeichnen
                isContentCreator: true,
            }

            console.log("Using company registration endpoint with content creator data:", contentCreatorRequest)

            // Verwenden Sie den Firmenregistrierungsendpunkt, der funktioniert
            const response = await api.post<void>(`${API_PREFIX}/auth/register/company`, contentCreatorRequest)

            // Überprüfen Sie, ob die Antwort erfolgreich war
            if (!response.success) {
                console.error("Content creator registration failed:", response)
                throw new Error(response.message || "Registration failed")
            }

            console.log("Content creator registration successful:", response)
            return response
        } catch (error: any) {
            console.error("Content creator registration error:", error)
            throw (
                error.response?.data || {
                    success: false,
                    message: error.message || "Registration failed",
                }
            )
        }
    },

    // Forgot password
    forgotPassword: async (email: string, role: string) => {
        try {
            const response = await api.post<void>(`${API_PREFIX}/auth/forgot-password`, { email, role })
            return response
        } catch (error: any) {
            throw error.response?.data || { success: false, message: error.message || "Failed to process request" }
        }
    },

    // Reset password
    resetPassword: async (resetRequest: PasswordResetRequest) => {
        try {
            const response = await api.post<void>(`${API_PREFIX}/auth/reset-password`, resetRequest)
            return response
        } catch (error: any) {
            throw error.response?.data || { success: false, message: error.message || "Failed to reset password" }
        }
    },

    // Verify email
    verifyEmail: async (token: string) => {
        try {
            const response = await api.get<void>(`${API_PREFIX}/auth/verify-email`, { params: { token } })
            return response
        } catch (error: any) {
            throw error.response?.data || { success: false, message: error.message || "Failed to verify email" }
        }
    },

    // Verify email with code
    verifyEmailWithCode: async (email: string, code: string) => {
        try {
            const response = await api.post<void>(`${API_PREFIX}/auth/verify-email-code`, {
                email,
                code,
            })
            return response
        } catch (error: any) {
            throw error.response?.data || { success: false, message: "An error occurred" }
        }
    },

    // Resend verification email
    resendVerificationEmail: async (email: string) => {
        try {
            const response = await api.post<void>(`${API_PREFIX}/auth/resend-verification`, { email })
            return response
        } catch (error: any) {
            throw error.response?.data || { success: false, message: "An error occurred" }
        }
    },
}

// Hilfsfunktion zum Speichern von Content-Creator-E-Mails
function storeContentCreatorEmail(email: string): void {
    if (typeof window !== "undefined") {
        // Holen Sie die aktuelle Liste
        const storedEmails = localStorage.getItem("contentCreatorEmails") || "[]"
        const emailList = JSON.parse(storedEmails) as string[]

        // Fügen Sie die neue E-Mail hinzu, wenn sie noch nicht in der Liste ist
        if (!emailList.includes(email)) {
            emailList.push(email)
            localStorage.setItem("contentCreatorEmails", JSON.stringify(emailList))
            console.log("Stored content creator email:", email)
        }

        // Setzen Sie ein Cookie für diese E-Mail
        document.cookie = `email_${email.replace(/[^a-zA-Z0-9]/g, "_")}_role=CONTENT_CREATOR; path=/; max-age=${60 * 60 * 24 * 30}`
    }
}

// Hilfsfunktion zum Überprüfen, ob eine E-Mail zu einem Content Creator gehört
function checkIfContentCreator(email: string): boolean {
    if (typeof window !== "undefined") {
        // Überprüfen Sie die gespeicherte Liste
        const storedEmails = localStorage.getItem("contentCreatorEmails") || "[]"
        const emailList = JSON.parse(storedEmails) as string[]

        // Überprüfen Sie, ob die E-Mail in der Liste ist
        if (emailList.includes(email)) {
            console.log("Email found in content creator list:", email)
            return true
        }

        // Überprüfen Sie das Cookie für diese E-Mail
        const cookieName = `email_${email.replace(/[^a-zA-Z0-9]/g, "_")}_role`
        const cookies = document.cookie.split(";")
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim()
            if (cookie.startsWith(cookieName + "=")) {
                const value = cookie.substring(cookieName.length + 1)
                console.log("Found role cookie for email:", email, "value:", value)
                return value === "CONTENT_CREATOR"
            }
        }
    }

    return false
}

