import { apiRequest } from "@/lib/api-client"
import type { ContentCreator, SocialMedia } from "@/lib/types"

export const CreatorService = {
    getCreatorProfile: async (): Promise<ContentCreator> => {
        return apiRequest<ContentCreator>("/content-creator/profile")
    },

    updateCreatorProfile: async (creatorData: Partial<ContentCreator>): Promise<ContentCreator> => {
        return apiRequest<ContentCreator>("/content-creator/profile", {
            method: "PUT",
            body: JSON.stringify(creatorData),
        })
    },

    updateSocialMedia: async (socialMediaData: Partial<SocialMedia>): Promise<ContentCreator> => {
        return apiRequest<ContentCreator>("/content-creator/social-media", {
            method: "PUT",
            body: JSON.stringify(socialMediaData),
        })
    },

    searchCreators: async (query: string): Promise<ContentCreator[]> => {
        return apiRequest<ContentCreator[]>(`/content-creator/search?query=${encodeURIComponent(query)}`)
    },

    getCreatorsByContentType: async (contentType: string): Promise<ContentCreator[]> => {
        return apiRequest<ContentCreator[]>(`/content-creator/content-type/${encodeURIComponent(contentType)}`)
    },

    getFeaturedCreators: async (limit = 5): Promise<ContentCreator[]> => {
        return apiRequest<ContentCreator[]>(`/content-creator/featured?limit=${limit}`)
    },

    getCreatorsWithSocialMedia: async (platform: string): Promise<ContentCreator[]> => {
        return apiRequest<ContentCreator[]>(`/content-creator/social-media/${platform}`)
    },

    getAllCreators: async (
        page = 0,
        size = 10,
        sortBy = "firstName",
        sortDir = "asc",
    ): Promise<{
        content: ContentCreator[]
        totalElements: number
        totalPages: number
        size: number
        number: number
    }> => {
        return apiRequest<any>(`/content-creator?page=${page}&size=${size}&sortBy=${sortBy}&sortDir=${sortDir}`)
    },

    getCreatorById: async (id: number): Promise<ContentCreator> => {
        return apiRequest<ContentCreator>(`/content-creator/${id}`)
    },

    resendVerificationEmail: async (email: string): Promise<void> => {
        await apiRequest<void>(`/content-creator/resend-verification?email=${encodeURIComponent(email)}`, {
            method: "POST",
        })
    },

    verifyEmailWithCode: async (email: string, code: string): Promise<void> => {
        await apiRequest<void>("/content-creator/verify-email-code", {
            method: "POST",
            body: JSON.stringify({ email, code }),
        })
    },
}

