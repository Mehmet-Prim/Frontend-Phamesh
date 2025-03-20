import { AUTH_ENDPOINTS, COMPANY_ENDPOINTS, CONTENT_CREATOR_ENDPOINTS, CHAT_ENDPOINTS } from "./api-endpoints"

// Typen für API-Anfragen und -Antworten
export interface ApiResponse<T> {
    success: boolean
    message: string
    data?: T
}

export interface LoginRequest {
    email: string
    password: string
}

export interface LoginResponse {
    token: string
    user: any // Wir könnten hier einen spezifischeren Typ definieren
}

export interface RegistrationRequest {
    email: string
    password: string
    confirmPassword: string
    termsAgreed: boolean
    // Für Unternehmen
    companyName?: string
    contactName?: string
    companySize?: string
    industry?: string
    website?: string
    // Für Content Creator
    firstName?: string
    lastName?: string
    username?: string
    contentType?: string
    bio?: string
    instagram?: string
    youtube?: string
    tiktok?: string
    twitter?: string
}

export interface VerifyEmailRequest {
    email: string
    code: string
}

export interface ForgotPasswordRequest {
    email: string
}

export interface PasswordResetRequest {
    token: string
    email: string
    password: string
    confirmPassword: string
}

export interface SendMessageRequest {
    recipientId: number
    content: string
}

// API-Service-Klasse
class ApiService {
    private getAuthHeader(): Record<string, string> {
        const token = localStorage.getItem("token")
        return token ? { Authorization: `Bearer ${token}` } : {}
    }

    private async request<T>(url: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
        try {
            // Korrigierte Header-Erstellung
            const authHeader = this.getAuthHeader()
            const headers = new Headers({
                "Content-Type": "application/json",
                ...((options.headers as Record<string, string>) || {}),
            })

            // Füge Auth-Header hinzu, wenn vorhanden
            if (authHeader.Authorization) {
                headers.append("Authorization", authHeader.Authorization)
            }

            const response = await fetch(url, {
                ...options,
                headers,
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.message || "Ein Fehler ist aufgetreten")
            }

            return data
        } catch (error) {
            console.error("API-Fehler:", error)
            throw error
        }
    }

    // Auth-Methoden
    async login(credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> {
        return this.request<LoginResponse>(AUTH_ENDPOINTS.LOGIN, {
            method: "POST",
            body: JSON.stringify(credentials),
        })
    }

    async registerCompany(data: RegistrationRequest): Promise<ApiResponse<void>> {
        return this.request<void>(AUTH_ENDPOINTS.REGISTER_COMPANY, {
            method: "POST",
            body: JSON.stringify(data),
        })
    }

    async registerContentCreator(data: RegistrationRequest): Promise<ApiResponse<void>> {
        return this.request<void>(AUTH_ENDPOINTS.REGISTER_CONTENT_CREATOR, {
            method: "POST",
            body: JSON.stringify(data),
        })
    }

    async verifyEmail(token: string): Promise<ApiResponse<void>> {
        return this.request<void>(`${AUTH_ENDPOINTS.VERIFY_EMAIL}?token=${token}`)
    }

    async verifyEmailWithCode(data: VerifyEmailRequest): Promise<ApiResponse<void>> {
        return this.request<void>(AUTH_ENDPOINTS.VERIFY_EMAIL_CODE, {
            method: "POST",
            body: JSON.stringify(data),
        })
    }

    async verifyOtp(code: string): Promise<ApiResponse<{ role: string }>> {
        return this.request<{ role: string }>(AUTH_ENDPOINTS.VERIFY_OTP, {
            method: "POST",
            body: JSON.stringify({ code }),
        })
    }

    async resendVerification(email: string): Promise<ApiResponse<void>> {
        return this.request<void>(AUTH_ENDPOINTS.RESEND_VERIFICATION, {
            method: "POST",
            body: JSON.stringify({ email }),
        })
    }

    async forgotPassword(email: string): Promise<ApiResponse<void>> {
        return this.request<void>(AUTH_ENDPOINTS.FORGOT_PASSWORD, {
            method: "POST",
            body: JSON.stringify({ email }),
        })
    }

    async resetPassword(data: PasswordResetRequest): Promise<ApiResponse<void>> {
        return this.request<void>(AUTH_ENDPOINTS.RESET_PASSWORD, {
            method: "POST",
            body: JSON.stringify(data),
        })
    }

    async getCurrentUser(): Promise<ApiResponse<any>> {
        return this.request<any>(AUTH_ENDPOINTS.ME)
    }

    // Company-Methoden
    async getCompanyProfile(): Promise<ApiResponse<any>> {
        return this.request<any>(COMPANY_ENDPOINTS.PROFILE)
    }

    async getCompanyDashboard(): Promise<ApiResponse<any>> {
        return this.request<any>(COMPANY_ENDPOINTS.DASHBOARD)
    }

    async updateCompanyProfile(data: any): Promise<ApiResponse<any>> {
        return this.request<any>(COMPANY_ENDPOINTS.UPDATE_PROFILE, {
            method: "PUT",
            body: JSON.stringify(data),
        })
    }

    async searchCompanies(name: string): Promise<ApiResponse<any[]>> {
        return this.request<any[]>(`${COMPANY_ENDPOINTS.SEARCH}?name=${encodeURIComponent(name)}`)
    }

    async getCompaniesByIndustry(industry: string): Promise<ApiResponse<any[]>> {
        return this.request<any[]>(`${COMPANY_ENDPOINTS.BY_INDUSTRY}/${encodeURIComponent(industry)}`)
    }

    async getAllCompanies(page = 0, size = 10, sortBy = "companyName", sortDir = "asc"): Promise<ApiResponse<any>> {
        return this.request<any>(`${COMPANY_ENDPOINTS.ALL}?page=${page}&size=${size}&sortBy=${sortBy}&sortDir=${sortDir}`)
    }

    // Content Creator-Methoden
    async getContentCreatorProfile(): Promise<ApiResponse<any>> {
        return this.request<any>(CONTENT_CREATOR_ENDPOINTS.PROFILE)
    }

    async getContentCreatorDashboard(): Promise<ApiResponse<any>> {
        return this.request<any>(CONTENT_CREATOR_ENDPOINTS.DASHBOARD)
    }

    async updateContentCreatorProfile(data: any): Promise<ApiResponse<any>> {
        return this.request<any>(CONTENT_CREATOR_ENDPOINTS.UPDATE_PROFILE, {
            method: "PUT",
            body: JSON.stringify(data),
        })
    }

    async updateSocialMedia(data: any): Promise<ApiResponse<any>> {
        return this.request<any>(CONTENT_CREATOR_ENDPOINTS.UPDATE_SOCIAL_MEDIA, {
            method: "PUT",
            body: JSON.stringify(data),
        })
    }

    async searchContentCreators(query: string): Promise<ApiResponse<any[]>> {
        return this.request<any[]>(`${CONTENT_CREATOR_ENDPOINTS.SEARCH}?query=${encodeURIComponent(query)}`)
    }

    async getContentCreatorsByContentType(contentType: string): Promise<ApiResponse<any[]>> {
        return this.request<any[]>(`${CONTENT_CREATOR_ENDPOINTS.BY_CONTENT_TYPE}/${encodeURIComponent(contentType)}`)
    }

    async getFeaturedContentCreators(limit = 5): Promise<ApiResponse<any[]>> {
        return this.request<any[]>(`${CONTENT_CREATOR_ENDPOINTS.FEATURED}?limit=${limit}`)
    }

    async getContentCreatorsWithSocialMedia(platform: string): Promise<ApiResponse<any[]>> {
        return this.request<any[]>(`${CONTENT_CREATOR_ENDPOINTS.BY_SOCIAL_MEDIA}/${encodeURIComponent(platform)}`)
    }

    async getAllContentCreators(page = 0, size = 10, sortBy = "firstName", sortDir = "asc"): Promise<ApiResponse<any>> {
        return this.request<any>(
            `${CONTENT_CREATOR_ENDPOINTS.ALL}?page=${page}&size=${size}&sortBy=${sortBy}&sortDir=${sortDir}`,
        )
    }

    // Chat-Methoden
    async getConversations(): Promise<ApiResponse<any[]>> {
        return this.request<any[]>(CHAT_ENDPOINTS.CONVERSATIONS)
    }

    async getMessages(conversationId: number, page = 0, size = 20): Promise<ApiResponse<any>> {
        return this.request<any>(`${CHAT_ENDPOINTS.MESSAGES(conversationId)}?page=${page}&size=${size}`)
    }

    async sendMessage(data: SendMessageRequest): Promise<ApiResponse<any>> {
        return this.request<any>(CHAT_ENDPOINTS.SEND, {
            method: "POST",
            body: JSON.stringify(data),
        })
    }

    async markConversationAsRead(conversationId: number): Promise<ApiResponse<void>> {
        return this.request<void>(CHAT_ENDPOINTS.MARK_READ(conversationId), {
            method: "POST",
        })
    }

    async getUnreadCount(): Promise<ApiResponse<{ count: number }>> {
        return this.request<{ count: number }>(CHAT_ENDPOINTS.UNREAD_COUNT)
    }
}

export const apiService = new ApiService()

