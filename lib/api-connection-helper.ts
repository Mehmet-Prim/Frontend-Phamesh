/**
 * Hilfsfunktion zum Testen der API-Verbindung
 */
import { proxyRequest } from "@/services/proxy-service"

export async function testApiConnection() {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"
    const results = {
        apiUrl: API_URL,
        tests: {} as Record<string, { success: boolean; status?: number; message: string }>,
        proxyTests: {} as Record<string, { success: boolean; status?: number; message: string; htmlResponse?: string }>,
        serverInfo: {
            isRunning: false,
            serverType: "unknown",
            possibleIssues: [] as string[],
        },
        overallSuccess: false, // Neue Eigenschaft hinzugefügt
    }

    // Test-Endpunkte
    const endpoints = [
        "/",
        "/api",
        "/api/health",
        "/auth/health",
        "/auth/register/company",
        "/auth/register/content_creator",
    ]

    // Direkte Tests (werden wahrscheinlich fehlschlagen wegen CORS)
    for (const endpoint of endpoints) {
        try {
            const url = `${API_URL}${endpoint}`
            console.log(`Testing direct connection to: ${url}`)

            const controller = new AbortController()
            const timeoutId = setTimeout(() => controller.abort(), 5000) // 5 second timeout

            const response = await fetch(url, {
                method: "GET",
                headers: {
                    Accept: "application/json",
                },
                mode: "cors",
                signal: controller.signal,
            })

            clearTimeout(timeoutId)

            results.tests[endpoint] = {
                success: response.ok,
                status: response.status,
                message: `Status: ${response.status} ${response.statusText}`,
            }
        } catch (error: any) {
            results.tests[endpoint] = {
                success: false,
                message: error.message || "Unknown error",
            }
        }
    }

    // Proxy-Tests (sollten funktionieren, da sie CORS umgehen)
    for (const endpoint of endpoints) {
        try {
            const url = `${API_URL}${endpoint}`
            console.log(`Testing proxy connection to: ${url}`)

            const proxyResponse = await proxyRequest({
                url,
                method: "GET",
            })

            // Speichere HTML-Antwort, wenn vorhanden
            let htmlResponse
            if (proxyResponse.data && proxyResponse.data.isHtml && proxyResponse.data.text) {
                htmlResponse = proxyResponse.data.text
            }

            results.proxyTests[endpoint] = {
                success: proxyResponse.success,
                status: proxyResponse.status,
                message: proxyResponse.message || `Status: ${proxyResponse.status} ${proxyResponse.statusText}`,
                htmlResponse,
            }

            // Analysiere die Antwort, um Informationen über den Server zu sammeln
            if (endpoint === "/" && htmlResponse) {
                // Prüfe, ob es sich um eine Spring Boot Whitelabel Error Page handelt
                if (htmlResponse.includes("Whitelabel Error Page")) {
                    results.serverInfo.isRunning = true
                    results.serverInfo.serverType = "Spring Boot"
                    results.serverInfo.possibleIssues.push("Spring Boot läuft, aber die Hauptseite ist nicht konfiguriert")
                }
                // Prüfe, ob es sich um eine Tomcat-Seite handelt
                else if (htmlResponse.includes("Apache Tomcat")) {
                    results.serverInfo.isRunning = true
                    results.serverInfo.serverType = "Tomcat"
                    results.serverInfo.possibleIssues.push(
                        "Tomcat läuft, aber die Spring-Anwendung ist möglicherweise nicht gestartet",
                    )
                }
                // Prüfe, ob es sich um eine Spring Security Fehlerseite handelt
                else if (htmlResponse.includes("This page is no longer available")) {
                    results.serverInfo.isRunning = true
                    results.serverInfo.serverType = "Spring Security"
                    results.serverInfo.possibleIssues.push(
                        "Spring Security blockiert den Zugriff, Authentifizierung erforderlich",
                    )
                }
            }
        } catch (error: any) {
            results.proxyTests[endpoint] = {
                success: false,
                message: error.message || "Unknown error",
            }
        }
    }

    // Analysiere die Ergebnisse, um mögliche Probleme zu identifizieren
    if (Object.values(results.proxyTests).every((test) => !test.success)) {
        if (Object.values(results.proxyTests).some((test) => test.status === 403)) {
            results.serverInfo.possibleIssues.push("Der Server blockiert alle Anfragen (403 Forbidden)")
        }
        if (Object.values(results.proxyTests).some((test) => test.status === 404)) {
            results.serverInfo.possibleIssues.push(
                "Die API-Endpunkte existieren nicht an den angegebenen Pfaden (404 Not Found)",
            )
        }
        if (!results.serverInfo.isRunning) {
            results.serverInfo.possibleIssues.push("Der Server scheint nicht zu laufen oder ist nicht erreichbar")
        }
    }

    // Berechne overallSuccess basierend auf mindestens einem erfolgreichen Proxy-Test
    results.overallSuccess = Object.values(results.proxyTests).some((test) => test.success)

    return results
}

