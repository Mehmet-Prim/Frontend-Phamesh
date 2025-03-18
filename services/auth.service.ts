import api from "@/lib/api"
import type { ApiResponse } from "@/types/auth"

export const AuthService = {
    // Resend verification email
    resendVerificationEmail: async (email: string) => {
        try {
            const response = await api.post<ApiResponse<void>>("/auth/resend-verification", null, {
                params: { email },
            })
            return response.data
        } catch (error: any) {
            throw error.response?.data || { success: false, message: "An error occurred" }
        }
    },

    // Verify email with code
    verifyEmailWithCode: async (email: string, code: string) => {
        try {
            const response = await api.post<ApiResponse<void>>("/auth/verify-email-code", {
                email,
                code,
            })
            return response.data
        } catch (error: any) {
            throw error.response?.data || { success: false, message: "An error occurred" }
        }
    },
}

