import type {LoginRequest, PasswordResetRequest, RegistrationRequest, VerifyEmailRequest} from "@/types/auth"
import { proxyRequest } from "@/services/proxy-service"
import { getAuthUrl } from "@/lib/api-config"

export class AuthService {
    static async login(data: LoginRequest): Promise<any> {
        try {
            // Explizit die Rolle im Request-Body setzen
            const requestBody = {
                ...data,
                role: data.role || (data.isCompany ? "COMPANY" : data.isContentCreator ? "CONTENT_CREATOR" : undefined),
            }

            console.log("Login request with role:", requestBody.role)

            // Überprüfe, ob die API-URL gesetzt ist
            const API_URL = process.env.NEXT_PUBLIC_API_URL
            if (!API_URL) {
                console.error("NEXT_PUBLIC_API_URL ist nicht gesetzt!")
                throw new Error("API URL is not configured. Please set NEXT_PUBLIC_API_URL environment variable.")
            }

            // Verwende die konfigurierbare Auth-URL
            const loginUrl = getAuthUrl("/login")
            console.log(`Sending login request to: ${loginUrl}`)

            // Verwende den Proxy-Service für die Anfrage
            const proxyResponse = await proxyRequest({
                url: loginUrl,
                method: "POST",
                body: requestBody,
            })

            if (!proxyResponse.success) {
                throw new Error(proxyResponse.message || "Login failed")
            }

            const responseData = proxyResponse.data

            if (responseData.success && responseData.data) {
                // Save token to localStorage
                localStorage.setItem("token", responseData.data.token)

                // Save user data
                localStorage.setItem("user", JSON.stringify(responseData.data.user))

                // Speichere die Rolle explizit
                if (data.role) {
                    localStorage.setItem("userRole", data.role)
                } else if (data.isCompany) {
                    localStorage.setItem("userRole", "COMPANY")
                } else if (data.isContentCreator) {
                    localStorage.setItem("userRole", "CONTENT_CREATOR")
                }

                return responseData.data
            } else {
                throw new Error(responseData.message || "Login failed")
            }
        } catch (error) {
            console.error("Login error:", error)
            throw error
        }
    }

    static async registerCompany(data: RegistrationRequest): Promise<any> {
        try {
            // Stelle sicher, dass die Rolle explizit als COMPANY gesetzt ist
            const requestBody = {
                ...data,
                role: "COMPANY",
                userType: "COMPANY",
            }

            console.log("Registering company with data:", requestBody)

            // Überprüfe, ob die API-URL gesetzt ist
            const API_URL = process.env.NEXT_PUBLIC_API_URL
            if (!API_URL) {
                console.error("NEXT_PUBLIC_API_URL ist nicht gesetzt!")
                throw new Error("API URL is not configured. Please set NEXT_PUBLIC_API_URL environment variable.")
            }

            // Verwende die konfigurierbare Auth-URL
            const registerUrl = getAuthUrl("/register/company")
            console.log(`Sending company registration request to: ${registerUrl}`)

            // Verwende den Proxy-Service für die Anfrage
            const proxyResponse = await proxyRequest({
                url: registerUrl,
                method: "POST",
                body: requestBody,
            })

            if (!proxyResponse.success) {
                throw new Error(proxyResponse.message || "Registration failed")
            }

            return { success: true, ...proxyResponse.data }
        } catch (error) {
            console.error("Company registration error:", error)
            throw error
        }
    }

    static async registerContentCreator(data: RegistrationRequest): Promise<any> {
        try {
            // Stelle sicher, dass die Rolle explizit als CONTENT_CREATOR gesetzt ist
            const requestBody = {
                ...data,
                role: "CONTENT_CREATOR",
                userType: "CONTENT_CREATOR",
                isContentCreator: true,
            }

            console.log("Registering content creator with data:", JSON.stringify(requestBody, null, 2))

            // Überprüfe, ob die API-URL gesetzt ist
            const API_URL = process.env.NEXT_PUBLIC_API_URL
            if (!API_URL) {
                console.error("NEXT_PUBLIC_API_URL ist nicht gesetzt!")
                throw new Error("API URL is not configured. Please set NEXT_PUBLIC_API_URL environment variable.")
            }

            // Verwende die konfigurierbare Auth-URL
            const registerUrl = getAuthUrl("/register/content_creator")
            console.log(`Sending content creator registration request to: ${registerUrl}`)

            // Verwende den Proxy-Service für die Anfrage
            const proxyResponse = await proxyRequest({
                url: registerUrl,
                method: "POST",
                body: requestBody,
            })

            console.log("Content creator registration proxy response:", proxyResponse)

            if (!proxyResponse.success) {
                throw new Error(proxyResponse.message || "Registration failed")
            }

            return { success: true, ...proxyResponse.data }
        } catch (error) {
            console.error("Content creator registration error:", error)
            throw error
        }
    }

    static async verifyEmailWithCode(data: VerifyEmailRequest): Promise<void> {
        try {
            // Überprüfe, ob die API-URL gesetzt ist
            const API_URL = process.env.NEXT_PUBLIC_API_URL
            if (!API_URL) {
                console.error("NEXT_PUBLIC_API_URL ist nicht gesetzt!")
                throw new Error("API URL is not configured. Please set NEXT_PUBLIC_API_URL environment variable.")
            }

            // Verwende die konfigurierbare Auth-URL
            const verifyUrl = getAuthUrl("/verify-email-code")

            // Verwende den Proxy-Service für die Anfrage
            const proxyResponse = await proxyRequest({
                url: verifyUrl,
                method: "POST",
                body: data,
            })

            if (!proxyResponse.success) {
                throw new Error(proxyResponse.message || "Verification failed")
            }
        } catch (error) {
            console.error("Email verification error:", error)
            throw error
        }
    }

    static async resendVerificationEmail(email: string): Promise<void> {
        try {
            // Überprüfe, ob die API-URL gesetzt ist
            const API_URL = process.env.NEXT_PUBLIC_API_URL
            if (!API_URL) {
                console.error("NEXT_PUBLIC_API_URL ist nicht gesetzt!")
                throw new Error("API URL is not configured. Please set NEXT_PUBLIC_API_URL environment variable.")
            }

            // Verwende die konfigurierbare Auth-URL
            const resendUrl = getAuthUrl("/resend-verification")

            // Verwende den Proxy-Service für die Anfrage
            const proxyResponse = await proxyRequest({
                url: resendUrl,
                method: "POST",
                body: { email },
            })

            if (!proxyResponse.success) {
                throw new Error(proxyResponse.message || "Failed to resend verification email")
            }
        } catch (error) {
            console.error("Resend verification error:", error)
            throw error
        }
    }

    static async forgotPassword(email: string, role?: string): Promise<void> {
        try {
            const requestBody = { email }

            // Füge die Rolle hinzu, wenn sie angegeben wurde
            if (role) {
                Object.assign(requestBody, { role })
            }

            // Überprüfe, ob die API-URL gesetzt ist
            const API_URL = process.env.NEXT_PUBLIC_API_URL
            if (!API_URL) {
                console.error("NEXT_PUBLIC_API_URL ist nicht gesetzt!")
                throw new Error("API URL is not configured. Please set NEXT_PUBLIC_API_URL environment variable.")
            }

            // Verwende die konfigurierbare Auth-URL
            const forgotUrl = getAuthUrl("/forgot-password")

            // Verwende den Proxy-Service für die Anfrage
            const proxyResponse = await proxyRequest({
                url: forgotUrl,
                method: "POST",
                body: requestBody,
            })

            if (!proxyResponse.success) {
                throw new Error(proxyResponse.message || "Failed to send password reset email")
            }
        } catch (error) {
            console.error("Forgot password error:", error)
            throw error
        }
    }

    static async resetPassword(data: PasswordResetRequest): Promise<void> {
        try {
            // Überprüfe, ob die API-URL gesetzt ist
            const API_URL = process.env.NEXT_PUBLIC_API_URL
            if (!API_URL) {
                console.error("NEXT_PUBLIC_API_URL ist nicht gesetzt!")
                throw new Error("API URL is not configured. Please set NEXT_PUBLIC_API_URL environment variable.")
            }

            // Verwende die konfigurierbare Auth-URL
            const resetUrl = getAuthUrl("/reset-password")

            // Verwende den Proxy-Service für die Anfrage
            const proxyResponse = await proxyRequest({
                url: resetUrl,
                method: "POST",
                body: data,
            })

            if (!proxyResponse.success) {
                throw new Error(proxyResponse.message || "Failed to reset password")
            }
        } catch (error) {
            console.error("Reset password error:", error)
            throw error
        }
    }

    static isAuthenticated(): boolean {
        if (typeof window === "undefined") return false

        const token = localStorage.getItem("token")
        if (!token) return false

        // In a real app, you would check if the token is expired
        // For now, we'll just check if it exists
        return true
    }

    static getUserRole(): string | null {
        if (typeof window === "undefined") return null

        // Versuche zuerst, die Rolle aus dem expliziten userRole-Feld zu lesen
        const explicitRole = localStorage.getItem("userRole")
        if (explicitRole) {
            return explicitRole
        }

        // Fallback: Versuche, die Rolle aus den Benutzerdaten zu lesen
        const userStr = localStorage.getItem("user")
        if (!userStr) return null

        try {
            const user = JSON.parse(userStr)
            return user.role
        } catch (error) {
            return null
        }
    }

    static getCurrentUser(): any {
        if (typeof window === "undefined") return null

        const userStr = localStorage.getItem("user")
        if (!userStr) return null

        try {
            return JSON.parse(userStr)
        } catch (error) {
            return null
        }
    }

    static logout(): void {
        if (typeof window === "undefined") return

        localStorage.removeItem("token")
        localStorage.removeItem("user")
        localStorage.removeItem("userRole")
        localStorage.removeItem("userType")
        localStorage.removeItem("isCompany")
        localStorage.removeItem("isContentCreator")

        // Cookies löschen
        document.cookie = "user_role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
        document.cookie = "user_role_raw=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
        document.cookie = "user_type=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
        document.cookie = "user_is_content_creator=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
        document.cookie = "user_is_company=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT"
    }

    // Instanzmethoden für die Verwendung mit der exportierten Instanz
    async login(data: LoginRequest): Promise<any> {
        return AuthService.login(data)
    }

    async registerCompany(data: RegistrationRequest): Promise<any> {
        return AuthService.registerCompany(data)
    }

    async registerContentCreator(data: RegistrationRequest): Promise<any> {
        return AuthService.registerContentCreator(data)
    }

    async verifyEmailWithCode(data: VerifyEmailRequest): Promise<void> {
        return AuthService.verifyEmailWithCode(data)
    }

    async resendVerificationEmail(email: string): Promise<void> {
        return AuthService.resendVerificationEmail(email)
    }

    async forgotPassword(email: string, role?: string): Promise<void> {
        return AuthService.forgotPassword(email, role)
    }

    async resetPassword(data: PasswordResetRequest): Promise<void> {
        return AuthService.resetPassword(data)
    }

    isAuthenticated(): boolean {
        return AuthService.isAuthenticated()
    }

    getUserRole(): string | null {
        return AuthService.getUserRole()
    }

    getCurrentUser(): any {
        return AuthService.getCurrentUser()
    }

    logout(): void {
        AuthService.logout()
    }
}

export const authService = new AuthService()

