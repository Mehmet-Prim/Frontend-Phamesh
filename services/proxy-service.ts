/**
 * Proxy-Service für API-Anfragen
 * Umgeht CORS-Probleme, indem Anfragen über den eigenen Server geleitet werden
 */

interface ProxyRequestOptions {
    url: string
    method?: "GET" | "POST" | "PUT" | "DELETE"
    body?: any
    headers?: Record<string, string>
}

// Aktualisieren Sie die ProxyResponse-Schnittstelle, um headers einzuschließen
interface ProxyResponse<T = any> {
    success: boolean
    status?: number
    statusText?: string
    data?: T
    message?: string
    error?: string
    headers?: Record<string, string>
}

export async function proxyRequest<T = any>(options: ProxyRequestOptions): Promise<ProxyResponse<T>> {
    try {
        console.log(`Sending proxy request to: ${options.url}`)

        const response = await fetch("/api/proxy", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(options),
        })

        const result = await response.json()

        console.log(`Proxy response:`, result)

        return result
    } catch (error: any) {
        console.error("Proxy request error:", error)
        return {
            success: false,
            message: error.message || "An error occurred while making the proxy request",
            error: error.toString(),
        }
    }
}

