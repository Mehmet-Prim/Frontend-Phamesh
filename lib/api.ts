import { getToken } from "./auth"
import { getApiUrl } from "./api-config"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"

interface FetchOptions extends RequestInit {
    token?: string | null
    params?: Record<string, any>
}

// Füge eine Fehlerbehandlung hinzu, die mehr Details ausgibt
export async function fetchApi<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
    const { token = getToken(), params, method, ...fetchOptions } = options // Add method to destructured options

    const headers = new Headers(options.headers)

    if (token) {
        headers.set("Authorization", `Bearer ${token}`)
    }

    if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
        headers.set("Content-Type", "application/json")
    }

    // URL mit Query-Parametern erstellen
    let url = getApiUrl(endpoint)

    if (params) {
        const queryParams = new URLSearchParams()
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                queryParams.append(key, String(value))
            }
        })

        const queryString = queryParams.toString()
        if (queryString) {
            url += `?${queryString}`
        }
    }

    try {
        const response = await fetch(url, {
            ...fetchOptions,
            headers,
            method, // Use the method from options
        })

        const data = await response.json()

        if (!response.ok) {
            console.error("API Error:", endpoint, data)
            throw new Error(data.message || "Something went wrong")
        }

        return data
    } catch (error) {
        console.error("Fetch Error:", endpoint, error)
        throw error
    }
}

// Mock implementations or imports for the missing functions
const getAuthToken = () => {
    console.warn("getAuthToken is not implemented")
    return null
}

const getUserRole = () => {
    console.warn("getUserRole is not implemented")
    return null
}

const isContentCreator = () => {
    console.warn("isContentCreator is not implemented")
    return false
}

const isCompany = () => {
    console.warn("isCompany is not implemented")
    return false
}

// Add these named exports at the end of the file, before the api object export
export { getAuthToken, getUserRole, isContentCreator, isCompany }

export const api = {
    get: <T>(endpoint: string, options?: FetchOptions) =>
        fetchApi<T>(endpoint, { method: 'GET', ...options }),

    post: <T>(endpoint: string, data: any, options?: FetchOptions) =>
        fetchApi<T>(endpoint, {
            method: 'POST',
            body: JSON.stringify(data),
            ...options
        }),

    put: <T>(endpoint: string, data: any, options?: FetchOptions) =>
        fetchApi<T>(endpoint, {
            method: 'PUT',
            body: JSON.stringify(data),
            ...options
        }),

    delete: <T>(endpoint: string, options?: FetchOptions) =>
        fetchApi<T>(endpoint, { method: 'DELETE', ...options }),

    isContentCreator,
    isCompany,
    getAuthToken,
    getUserRole
}

