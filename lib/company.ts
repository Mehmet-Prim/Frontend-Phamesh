import api, { API_PREFIX } from "./api"
import type { ApiResponse } from "@/types/auth"
import type { Company } from "@/types/models"

export const CompanyService = {
    // Get company profile
    getProfile: async (): Promise<ApiResponse<Company>> => {
        try {
            return await api.get<ApiResponse<Company>>(`${API_PREFIX}/company/profile`)
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw { success: false, message: error.message }
            }
            throw { success: false, message: "Fehler beim Abrufen des Unternehmensprofils" }
        }
    },

    // Get company dashboard data
    getDashboard: async (): Promise<ApiResponse<string>> => {
        try {
            return await api.get<ApiResponse<string>>(`${API_PREFIX}/company/dashboard`)
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw { success: false, message: error.message }
            }
            throw { success: false, message: "Fehler beim Abrufen der Dashboard-Daten" }
        }
    },

    // Update company profile
    updateProfile: async (companyDetails: Partial<Company>): Promise<ApiResponse<Company>> => {
        try {
            return await api.put<ApiResponse<Company>>(`${API_PREFIX}/company/profile`, companyDetails)
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw { success: false, message: error.message }
            }
            throw { success: false, message: "Fehler beim Aktualisieren des Unternehmensprofils" }
        }
    },

    // Search companies
    searchCompanies: async (name: string): Promise<ApiResponse<Company[]>> => {
        try {
            return await api.get<ApiResponse<Company[]>>(`${API_PREFIX}/company/search`, {
                params: { name },
            })
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw { success: false, message: error.message }
            }
            throw { success: false, message: "Fehler bei der Unternehmenssuche" }
        }
    },

    // Get companies by industry
    getCompaniesByIndustry: async (industry: string): Promise<ApiResponse<Company[]>> => {
        try {
            return await api.get<ApiResponse<Company[]>>(`${API_PREFIX}/company/industry/${industry}`)
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw { success: false, message: error.message }
            }
            throw { success: false, message: "Fehler beim Abrufen der Unternehmen nach Branche" }
        }
    },

    // Get all companies with pagination
    getAllCompanies: async (
        page = 0,
        size = 10,
        sortBy = "companyName",
        sortDir = "asc",
    ): Promise<ApiResponse<{ content: Company[]; totalElements: number; totalPages: number }>> => {
        try {
            return await api.get<ApiResponse<{ content: Company[]; totalElements: number; totalPages: number }>>(
                `${API_PREFIX}/company`,
                {
                    params: { page, size, sortBy, sortDir },
                },
            )
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw { success: false, message: error.message }
            }
            throw { success: false, message: "Fehler beim Abrufen aller Unternehmen" }
        }
    },
}

