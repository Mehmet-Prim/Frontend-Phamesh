import { API_PREFIX } from "./api"
import type { ApiResponse } from "@/types/auth"

/**
 * Sends a direct request to the API without middleware
 * This function is designed to work even when CORS might be an issue
 */
export async function directApiRequest<T>(
    endpoint: string,
    method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
    data?: any,
): Promise<ApiResponse<T>> {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"
    const url = `${API_URL}${API_PREFIX}${endpoint}`

    console.log(`Direkte API-Anfrage an: ${url}`, { method, data })

    const options: RequestInit = {
        method,
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
        credentials: "include", // Include cookies
        mode: "cors", // Explicitly set CORS mode
    }

    if (data && (method === "POST" || method === "PUT")) {
        options.body = JSON.stringify(data)
    }

    try {
        // Add timeout to fetch request
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout

        const response = await fetch(url, {
            ...options,
            signal: controller.signal,
        })

        clearTimeout(timeoutId)

        console.log(`Antwort-Status: ${response.status}`)

        const responseText = await response.text()
        console.log(`Rohe Antwort: ${responseText}`)

        let responseData
        try {
            responseData = responseText ? JSON.parse(responseText) : {}
            console.log("Geparste Antwort:", responseData)
        } catch (e) {
            console.error("Fehler beim Parsen der Antwort als JSON:", e)
            return {
                success: false,
                message: "Ungültige Antwort vom Server",
                data: null,
                timestamp: new Date().toISOString(),
            }
        }

        if (!response.ok) {
            return {
                success: false,
                message: responseData?.message || `Fehler: ${response.status}`,
                data: null,
                timestamp: new Date().toISOString(),
            }
        }

        return responseData as ApiResponse<T>
    } catch (error) {
        console.error("API-Anfrage fehlgeschlagen:", error)
        if (error instanceof TypeError && error.message === "Failed to fetch") {
            return {
                success: false,
                message:
                    "Verbindung zum Server fehlgeschlagen. Bitte überprüfe deine Internetverbindung oder versuche es später erneut.",
                data: null,
                timestamp: new Date().toISOString(),
            }
        }
        if (error instanceof Error) {
            return {
                success: false,
                message: error.message,
                data: null,
                timestamp: new Date().toISOString(),
            }
        }
        return {
            success: false,
            message: "Ein unbekannter Fehler ist aufgetreten",
            data: null,
            timestamp: new Date().toISOString(),
        }
    }
}

/**
 * Alternative API request function that uses no-cors mode
 * This is a last resort when CORS is blocking requests
 * Note: This will not return JSON data, only success/failure
 */
export async function noCorsApiRequest(
    endpoint: string,
    method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
    data?: any,
): Promise<{ success: boolean; message: string }> {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"
    const url = `${API_URL}${API_PREFIX}${endpoint}`

    console.log(`No-CORS API-Anfrage an: ${url}`, { method, data })

    const options: RequestInit = {
        method,
        headers: {
            "Content-Type": "text/plain", // Changed from application/json for no-cors
        },
        mode: "no-cors", // This will prevent reading the response but might allow the request to go through
    }

    if (data && (method === "POST" || method === "PUT")) {
        options.body = JSON.stringify(data)
    }

    try {
        const response = await fetch(url, options)

        // With no-cors, we can't actually read the response
        // We can only know if the request didn't throw an error
        return {
            success: true,
            message: "Request sent successfully (no-cors mode - actual response unknown)",
        }
    } catch (error) {
        console.error("No-CORS API-Anfrage fehlgeschlagen:", error)
        return {
            success: false,
            message: "Verbindung zum Server fehlgeschlagen im no-cors Modus.",
        }
    }
}

