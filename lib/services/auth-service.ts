import { publicApiRequest, apiRequest } from "@/lib/api-client"
import type {
    LoginRequest,
    LoginResponse,
    RegistrationRequest,
    ForgotPasswordRequest,
    PasswordResetRequest,
    VerifyEmailRequest,
    VerifyOtpRequest,
    User,
    ApiResponseWrapper,
} from "@/lib/types"

export const AuthService = {
    login: async (email: string, password: string, rememberMe = false): Promise<LoginResponse> => {
        const loginRequest: LoginRequest = {
            email,
            password,
            rememberMe,
        }

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"}/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(loginRequest),
                credentials: "include",
            })

            if (!response.ok) {
                const contentType = response.headers.get("content-type")
                if (contentType && contentType.includes("application/json")) {
                    const errorData = await response.json()
                    throw new Error(errorData.message || "Login failed")
                } else {
                    const errorText = await response.text()
                    console.error("Non-JSON response:", errorText)
                    throw new Error(`Login failed: ${response.status} ${response.statusText}`)
                }
            }

            const data: ApiResponseWrapper<{ token: string; email: string; role: string }> = await response.json()

            if (!data.success) {
                throw new Error(data.message || "Login failed")
            }

            const loginResponse: LoginResponse = {
                token: data.data.token,
                user: {
                    id: 0, // Will be populated later with getCurrentUser
                    email: data.data.email,
                    role: data.data.role === "COMPANY" ? "COMPANY" : "CONTENT_CREATOR", // Direkte String-Werte verwenden
                    enabled: true,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                },
            }

            // Store the token in localStorage or sessionStorage based on rememberMe
            if (typeof window !== "undefined") {
                if (rememberMe) {
                    localStorage.setItem("token", loginResponse.token)
                } else {
                    sessionStorage.setItem("token", loginResponse.token)
                }

                // Also store the token in a cookie for middleware access
                document.cookie = `token=${loginResponse.token}; path=/; max-age=${rememberMe ? 30 * 24 * 60 * 60 : 24 * 60 * 60}`
            }

            return loginResponse
        } catch (error) {
            console.error("Login error:", error)
            throw error
        }
    },

    registerCompany: async (
        email: string,
        password: string,
        companyName: string,
        contactName: string,
        companySize?: string,
        industry?: string,
        website?: string,
    ): Promise<void> => {
        const registrationRequest: RegistrationRequest = {
            email,
            password,
            companyName,
            contactName,
            companySize,
            industry,
            website,
            termsAgreed: true,
        }

        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"}/auth/register/company`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(registrationRequest),
                    credentials: "include",
                },
            )

            if (!response.ok) {
                const contentType = response.headers.get("content-type")
                if (contentType && contentType.includes("application/json")) {
                    const errorData = await response.json()
                    throw new Error(errorData.message || "Company registration failed")
                } else {
                    const errorText = await response.text()
                    console.error("Non-JSON response:", errorText)
                    throw new Error(`Company registration failed: ${response.status} ${response.statusText}`)
                }
            }

            const data = await response.json()

            if (!data.success) {
                throw new Error(data.message || "Company registration failed")
            }
        } catch (error) {
            console.error("Registration error:", error)
            throw error
        }
    },

    registerCreator: async (
        email: string,
        password: string,
        firstName: string,
        lastName: string,
        username: string,
        contentType?: string,
        bio?: string,
        instagram?: string,
        youtube?: string,
        tiktok?: string,
        twitter?: string,
    ): Promise<void> => {
        const registrationRequest: RegistrationRequest = {
            email,
            password,
            firstName,
            lastName,
            username,
            contentType,
            bio,
            instagram,
            youtube,
            tiktok,
            twitter,
            termsAgreed: true,
        }

        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"}/auth/register/content_creator`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(registrationRequest),
                    credentials: "include",
                },
            )

            if (!response.ok) {
                const contentType = response.headers.get("content-type")
                if (contentType && contentType.includes("application/json")) {
                    const errorData = await response.json()
                    throw new Error(errorData.message || "Content creator registration failed")
                } else {
                    const errorText = await response.text()
                    console.error("Non-JSON response:", errorText)
                    throw new Error(`Content creator registration failed: ${response.status} ${response.statusText}`)
                }
            }

            const data = await response.json()

            if (!data.success) {
                throw new Error(data.message || "Content creator registration failed")
            }
        } catch (error) {
            console.error("Registration error:", error)
            throw error
        }
    },

    verifyEmail: async (email: string, code: string): Promise<void> => {
        const verifyEmailRequest: VerifyEmailRequest = {
            email,
            code,
        }

        await publicApiRequest<void>("/auth/verify-email-code", {
            method: "POST",
            body: JSON.stringify(verifyEmailRequest),
        })
    },

    verifyOtp: async (code: string): Promise<{ role: string }> => {
        const verifyOtpRequest: VerifyOtpRequest = {
            code,
        }

        return publicApiRequest<{ role: string }>("/auth/verify-otp", {
            method: "POST",
            body: JSON.stringify(verifyOtpRequest),
        })
    },

    resendVerificationCode: async (email: string): Promise<void> => {
        await publicApiRequest<void>("/auth/resend-verification", {
            method: "POST",
            body: JSON.stringify({ email }),
        })
    },

    forgotPassword: async (email: string, role: string): Promise<void> => {
        const forgotPasswordRequest: ForgotPasswordRequest = {
            email,
            role,
        }

        await publicApiRequest<void>("/auth/forgot-password", {
            method: "POST",
            body: JSON.stringify(forgotPasswordRequest),
        })
    },

    resetPassword: async (token: string, email: string, password: string, confirmPassword: string): Promise<void> => {
        const passwordResetRequest: PasswordResetRequest = {
            email,
            token,
            password,
            confirmPassword,
        }

        await publicApiRequest<void>("/auth/reset-password", {
            method: "POST",
            body: JSON.stringify(passwordResetRequest),
        })
    },

    getCurrentUser: async (): Promise<User> => {
        return apiRequest<User>("/auth/me")
    },

    logout: async (): Promise<void> => {
        // Remove token from storage
        if (typeof window !== "undefined") {
            localStorage.removeItem("token")
            sessionStorage.removeItem("token")
        }
    },

    getToken: (): string | null => {
        if (typeof window === "undefined") {
            return null
        }
        return localStorage.getItem("token") || sessionStorage.getItem("token")
    },

    isAuthenticated: (): boolean => {
        return !!AuthService.getToken()
    },

    getAllVerificationCodesForDev: async (): Promise<Record<string, string>> => {
        return publicApiRequest<Record<string, string>>("/auth/dev/verification-codes")
    },

    verifyEmailWithToken: async (token: string): Promise<void> => {
        await publicApiRequest<void>("/auth/verify-email", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
    },
}

