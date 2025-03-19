import { api } from "@/lib/api"
import { API_PREFIX } from "@/lib/api-constants"
import type { ApiResponse } from "@/types/api"
import type { ContentCreator } from "@/types/models"

export const ContentCreatorService = {
    // Get content creator profile
    getProfile: async (): Promise<ApiResponse<ContentCreator>> => {
        try {
            return await api.get<ApiResponse<ContentCreator>>(`${API_PREFIX}/content-creator/profile`)
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw { success: false, message: error.message }
            }
            throw { success: false, message: "Fehler beim Abrufen des Content-Creator-Profils" }
        }
    },

    // Get content creator dashboard data
    getDashboard: async (): Promise<ApiResponse<string>> => {
        try {
            return await api.get<ApiResponse<string>>(`${API_PREFIX}/content-creator/dashboard`)
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw { success: false, message: error.message }
            }
            throw { success: false, message: "Fehler beim Abrufen der Dashboard-Daten" }
        }
    },

    // Update content creator profile
    updateProfile: async (creatorDetails: Partial<ContentCreator>): Promise<ApiResponse<ContentCreator>> => {
        try {
            return await api.put<ApiResponse<ContentCreator>>(`${API_PREFIX}/content-creator/profile`, creatorDetails)
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw { success: false, message: error.message }
            }
            throw { success: false, message: "Fehler beim Aktualisieren des Content-Creator-Profils" }
        }
    },

    // Search content creators
    searchContentCreators: async (name: string): Promise<ApiResponse<ContentCreator[]>> => {
        try {
            return await api.get<ApiResponse<ContentCreator[]>>(`${API_PREFIX}/content-creator/search`, {
                params: { name },
            })
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw { success: false, message: error.message }
            }
            throw { success: false, message: "Fehler bei der Content-Creator-Suche" }
        }
    },

    // Get content creators by type
    getContentCreatorsByType: async (contentType: string): Promise<ApiResponse<ContentCreator[]>> => {
        try {
            return await api.get<ApiResponse<ContentCreator[]>>(`${API_PREFIX}/content-creator/type/${contentType}`)
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw { success: false, message: error.message }
            }
            throw { success: false, message: "Fehler beim Abrufen der Content-Creator nach Typ" }
        }
    },

    // Get all content creators with pagination
    getAllContentCreators: async (
        page = 0,
        size = 10,
        sortBy = "username",
        sortDir = "asc",
    ): Promise<ApiResponse<{ content: ContentCreator[]; totalElements: number; totalPages: number }>> => {
        try {
            return await api.get<ApiResponse<{ content: ContentCreator[]; totalElements: number; totalPages: number }>>(
                `${API_PREFIX}/content-creator`,
                {
                    params: { page, size, sortBy, sortDir },
                },
            )
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw { success: false, message: error.message }
            }
            throw { success: false, message: "Fehler beim Abrufen aller Content-Creator" }
        }
    },
}

