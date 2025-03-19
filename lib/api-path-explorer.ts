/**
 * API-Pfad-Explorer
 * Versucht, gängige Spring Boot-Endpunkte zu finden
 */
import { proxyRequest } from "@/services/proxy-service"

interface PathExplorerResult {
    baseUrl: string
    discoveredPaths: {
        path: string
        status: number
        contentType?: string
        isJson?: boolean
        isHtml?: boolean
    }[]
    possibleContextPaths: string[]
    recommendedApiPrefix: string | null
    recommendedAuthPrefix: string | null
}

export async function exploreApiPaths(): Promise<PathExplorerResult> {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"
    const result: PathExplorerResult = {
        baseUrl: API_URL,
        discoveredPaths: [],
        possibleContextPaths: [],
        recommendedApiPrefix: null,
        recommendedAuthPrefix: null,
    }

    // Gängige Spring Boot-Kontextpfade
    const commonContextPaths = [
        "",
        "/api",
        "/rest",
        "/v1",
        "/v2",
        "/app",
        "/service",
        "/services",
        "/phamesh",
        "/phamesh-api",
    ]

    // Gängige Spring Boot-Endpunkte
    const commonEndpoints = [
        "",
        "/health",
        "/info",
        "/actuator",
        "/actuator/health",
        "/actuator/info",
        "/swagger-ui.html",
        "/v3/api-docs",
        "/error",
    ]

    // Gängige Auth-Endpunkte
    const commonAuthEndpoints = ["/auth", "/auth/login", "/auth/register", "/login", "/register", "/oauth", "/users"]

    // Teste alle Kombinationen von Kontextpfaden und Endpunkten
    for (const contextPath of commonContextPaths) {
        let foundValidEndpoint = false

        // Teste allgemeine Endpunkte
        for (const endpoint of commonEndpoints) {
            const path = `${contextPath}${endpoint}`
            try {
                const response = await proxyRequest({
                    url: `${API_URL}${path}`,
                    method: "GET",
                })

                const contentType = response.headers?.["content-type"] || ""
                const isJson = contentType.includes("application/json")
                const isHtml = contentType.includes("text/html")

                result.discoveredPaths.push({
                    path,
                    status: response.status || 0,
                    contentType,
                    isJson,
                    isHtml,
                })

                // Wenn wir einen erfolgreichen Endpunkt finden oder einen, der JSON zurückgibt
                if (response.status === 200 || isJson) {
                    foundValidEndpoint = true
                }
            } catch (error) {
                console.error(`Error exploring path ${path}:`, error)
            }
        }

        // Teste Auth-Endpunkte
        for (const authEndpoint of commonAuthEndpoints) {
            const path = `${contextPath}${authEndpoint}`
            try {
                const response = await proxyRequest({
                    url: `${API_URL}${path}`,
                    method: "GET",
                })

                const contentType = response.headers?.["content-type"] || ""
                const isJson = contentType.includes("application/json")
                const isHtml = contentType.includes("text/html")

                result.discoveredPaths.push({
                    path,
                    status: response.status || 0,
                    contentType,
                    isJson,
                    isHtml,
                })

                // Wenn wir einen erfolgreichen Auth-Endpunkt finden
                if (response.status === 200 || response.status === 401 || response.status === 403 || isJson) {
                    // Merke diesen Pfad als möglichen Auth-Pfad
                    if (!result.recommendedAuthPrefix && authEndpoint.startsWith("/auth")) {
                        result.recommendedAuthPrefix = `${contextPath}/auth`
                    }
                }
            } catch (error) {
                console.error(`Error exploring path ${path}:`, error)
            }
        }

        // Wenn wir gültige Endpunkte unter diesem Kontextpfad gefunden haben
        if (foundValidEndpoint) {
            result.possibleContextPaths.push(contextPath)

            // Setze den empfohlenen API-Präfix, wenn noch keiner gesetzt ist
            if (!result.recommendedApiPrefix) {
                result.recommendedApiPrefix = contextPath
            }
        }
    }

    // Wenn wir keinen empfohlenen API-Präfix gefunden haben, aber mögliche Kontextpfade haben
    if (!result.recommendedApiPrefix && result.possibleContextPaths.length > 0) {
        result.recommendedApiPrefix = result.possibleContextPaths[0]
    }

    // Wenn wir keinen empfohlenen Auth-Präfix gefunden haben, aber einen API-Präfix haben
    if (!result.recommendedAuthPrefix && result.recommendedApiPrefix) {
        result.recommendedAuthPrefix = `${result.recommendedApiPrefix}/auth`
    }

    return result
}

