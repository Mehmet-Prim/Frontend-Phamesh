import type { Company, ContentCreator, SocialMedia } from "@/lib/types"
import { AuthService } from "./auth-service"

// Base API URL - would be configured from environment variables in a real app
const API_URL = "/api"

export const UserService = {
    getCurrentUser: async (): Promise<Company | ContentCreator> => {
        try {
            const token = AuthService.getToken()
            if (!token) {
                throw new Error("Not authenticated")
            }

            const response = await fetch(`${API_URL}/users/me`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            })

            if (!response.ok) {
                throw new Error("Failed to fetch user profile")
            }

            return await response.json()
        } catch (error) {
            console.error("Get current user error:", error)
            throw error
        }
    },

    updateCompanyProfile: async (companyData: Partial<Company>): Promise<Company> => {
        try {
            const token = AuthService.getToken()
            if (!token) {
                throw new Error("Not authenticated")
            }

            const response = await fetch(`${API_URL}/companies/profile`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(companyData),
            })

            if (!response.ok) {
                throw new Error("Failed to update company profile")
            }

            return await response.json()
        } catch (error) {
            console.error("Update company profile error:", error)
            throw error
        }
    },

    updateCreatorProfile: async (creatorData: Partial<ContentCreator>): Promise<ContentCreator> => {
        try {
            const token = AuthService.getToken()
            if (!token) {
                throw new Error("Not authenticated")
            }

            const response = await fetch(`${API_URL}/creators/profile`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(creatorData),
            })

            if (!response.ok) {
                throw new Error("Failed to update creator profile")
            }

            return await response.json()
        } catch (error) {
            console.error("Update creator profile error:", error)
            throw error
        }
    },

    updateSocialMedia: async (socialMediaData: Partial<SocialMedia>): Promise<SocialMedia> => {
        try {
            const token = AuthService.getToken()
            if (!token) {
                throw new Error("Not authenticated")
            }

            const response = await fetch(`${API_URL}/creators/social-media`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(socialMediaData),
            })

            if (!response.ok) {
                throw new Error("Failed to update social media")
            }

            return await response.json()
        } catch (error) {
            console.error("Update social media error:", error)
            throw error
        }
    },

    changePassword: async (currentPassword: string, newPassword: string): Promise<void> => {
        try {
            const token = AuthService.getToken()
            if (!token) {
                throw new Error("Not authenticated")
            }

            const response = await fetch(`${API_URL}/users/change-password`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    currentPassword,
                    newPassword,
                }),
            })

            if (!response.ok) {
                throw new Error("Failed to change password")
            }
        } catch (error) {
            console.error("Change password error:", error)
            throw error
        }
    },

    getCompanies: async (): Promise<Company[]> => {
        try {
            const token = AuthService.getToken()
            if (!token) {
                throw new Error("Not authenticated")
            }

            const response = await fetch(`${API_URL}/companies`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            })

            if (!response.ok) {
                throw new Error("Failed to fetch companies")
            }

            return await response.json()
        } catch (error) {
            console.error("Get companies error:", error)
            throw error
        }
    },

    getCreators: async (): Promise<ContentCreator[]> => {
        try {
            const token = AuthService.getToken()
            if (!token) {
                throw new Error("Not authenticated")
            }

            const response = await fetch(`${API_URL}/creators`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            })

            if (!response.ok) {
                throw new Error("Failed to fetch creators")
            }

            return await response.json()
        } catch (error) {
            console.error("Get creators error:", error)
            throw error
        }
    },

    getCompany: async (id: number): Promise<Company> => {
        try {
            const token = AuthService.getToken()
            if (!token) {
                throw new Error("Not authenticated")
            }

            const response = await fetch(`${API_URL}/companies/${id}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            })

            if (!response.ok) {
                throw new Error("Failed to fetch company")
            }

            return await response.json()
        } catch (error) {
            console.error("Get company error:", error)
            throw error
        }
    },

    getCreator: async (id: number): Promise<ContentCreator> => {
        try {
            const token = AuthService.getToken()
            if (!token) {
                throw new Error("Not authenticated")
            }

            const response = await fetch(`${API_URL}/creators/${id}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            })

            if (!response.ok) {
                throw new Error("Failed to fetch creator")
            }

            return await response.json()
        } catch (error) {
            console.error("Get creator error:", error)
            throw error
        }
    },
}

