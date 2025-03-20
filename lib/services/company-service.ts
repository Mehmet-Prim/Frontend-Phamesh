import { apiRequest } from "@/lib/api-client"
import type { Company } from "@/lib/types"

export const CompanyService = {
    getCompanyProfile: async (): Promise<Company> => {
        return apiRequest<Company>("/company/profile")
    },

    updateCompanyProfile: async (companyData: Partial<Company>): Promise<Company> => {
        return apiRequest<Company>("/company/profile", {
            method: "PUT",
            body: JSON.stringify(companyData),
        })
    },

    searchCompanies: async (name: string): Promise<Company[]> => {
        return apiRequest<Company[]>(`/company/search?name=${encodeURIComponent(name)}`)
    },

    getCompaniesByIndustry: async (industry: string): Promise<Company[]> => {
        return apiRequest<Company[]>(`/company/industry/${encodeURIComponent(industry)}`)
    },

    getAllCompanies: async (
        page = 0,
        size = 10,
        sortBy = "companyName",
        sortDir = "asc",
    ): Promise<{
        content: Company[]
        totalElements: number
        totalPages: number
        size: number
        number: number
    }> => {
        return apiRequest<any>(`/company?page=${page}&size=${size}&sortBy=${sortBy}&sortDir=${sortDir}`)
    },

    getCompanyById: async (id: number): Promise<Company> => {
        return apiRequest<Company>(`/company/${id}`)
    },
}

