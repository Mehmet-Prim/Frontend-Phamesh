"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { proxyRequest } from "@/services/proxy-service"
import { AlertCircle, CheckCircle, Server, RefreshCw } from "lucide-react"

export default function EnhancedApiDebugger() {
    const [results, setResults] = useState<any>(null)
    const [loading, setLoading] = useState(false)
    const [apiUrl, setApiUrl] = useState<string | null>(null)
    const [customEndpoint, setCustomEndpoint] = useState("")
    const [customMethod, setCustomMethod] = useState<"GET" | "POST" | "PUT" | "DELETE">("GET")
    const [customBody, setCustomBody] = useState("")
    const [customResponse, setCustomResponse] = useState<any>(null)
    const [customLoading, setCustomLoading] = useState(false)

    // Überprüfe die API-URL beim Laden der Komponente
    useEffect(() => {
        const url = process.env.NEXT_PUBLIC_API_URL || "Not set"
        setApiUrl(url)
    }, [])

    // Definiere verschiedene Pfadkombinationen zum Testen
    const pathCombinations = [
        { name: "Root", path: "/" },
        { name: "API Root", path: "/api" },
        { name: "API Health", path: "/api/health" },
        { name: "Auth Root", path: "/auth" },
        { name: "API Auth Root", path: "/api/auth" },
        { name: "Auth Login", path: "/auth/login" },
        { name: "API Auth Login", path: "/api/auth/login" },
        { name: "Auth Register Company", path: "/auth/register/company" },
        { name: "API Auth Register Company", path: "/api/auth/register/company" },
        { name: "Auth Register Content Creator", path: "/auth/register/content_creator" },
        { name: "API Auth Register Content Creator", path: "/api/auth/register/content_creator" },
        { name: "Actuator", path: "/actuator" },
        { name: "API Actuator", path: "/api/actuator" },
    ]

    const runTests = async () => {
        setLoading(true)
        const testResults: any = {
            apiUrl: apiUrl,
            tests: {},
            serverInfo: {
                isRunning: false,
                serverType: "unknown",
                possibleIssues: [] as string[],
            },
        }

        try {
            // Teste alle Pfadkombinationen
            for (const { name, path } of pathCombinations) {
                try {
                    const url = `${apiUrl}${path}`
                    console.log(`Testing connection to: ${url}`)

                    const proxyResponse = await proxyRequest({
                        url,
                        method: "GET",
                    })

                    // Speichere HTML-Antwort, wenn vorhanden
                    let htmlResponse
                    if (proxyResponse.data && proxyResponse.data.isHtml && proxyResponse.data.text) {
                        htmlResponse = proxyResponse.data.text
                    }

                    testResults.tests[name] = {
                        path,
                        success: proxyResponse.success,
                        status: proxyResponse.status,
                        message: proxyResponse.message || `Status: ${proxyResponse.status} ${proxyResponse.statusText}`,
                        htmlResponse,
                        headers: proxyResponse.headers,
                        data: proxyResponse.data,
                    }

                    // Wenn wir einen erfolgreichen Endpunkt finden
                    if (proxyResponse.status === 200) {
                        testResults.serverInfo.isRunning = true
                    } else if (proxyResponse.status === 403 || proxyResponse.status === 401) {
                        testResults.serverInfo.isRunning = true
                        testResults.serverInfo.possibleIssues.push("Spring Security blockiert Anfragen ohne Authentifizierung")
                    }

                    // Analysiere die Antwort, um Informationen über den Server zu sammeln
                    if (path === "/" && htmlResponse) {
                        // Prüfe, ob es sich um eine Spring Boot Whitelabel Error Page handelt
                        if (htmlResponse.includes("Whitelabel Error Page")) {
                            testResults.serverInfo.isRunning = true
                            testResults.serverInfo.serverType = "Spring Boot"
                            testResults.serverInfo.possibleIssues.push(
                                "Spring Boot läuft, aber die Hauptseite ist nicht konfiguriert",
                            )
                        }
                        // Prüfe, ob es sich um eine Tomcat-Seite handelt
                        else if (htmlResponse.includes("Apache Tomcat")) {
                            testResults.serverInfo.isRunning = true
                            testResults.serverInfo.serverType = "Tomcat"
                            testResults.serverInfo.possibleIssues.push(
                                "Tomcat läuft, aber die Spring-Anwendung ist möglicherweise nicht gestartet",
                            )
                        }
                        // Prüfe, ob es sich um eine Spring Security Fehlerseite handelt
                        else if (htmlResponse.includes("This page is no longer available")) {
                            testResults.serverInfo.isRunning = true
                            testResults.serverInfo.serverType = "Spring Security"
                            testResults.serverInfo.possibleIssues.push(
                                "Spring Security blockiert den Zugriff, Authentifizierung erforderlich",
                            )
                        }
                    }
                } catch (error: any) {
                    testResults.tests[name] = {
                        path,
                        success: false,
                        message: error.message || "Unknown error",
                    }
                }
            }

            // Analysiere die Ergebnisse, um mögliche Probleme zu identifizieren
            if (Object.values(testResults.tests).every((test: any) => !test.success)) {
                if (Object.values(testResults.tests).some((test: any) => test.status === 403)) {
                    if (
                        !testResults.serverInfo.possibleIssues.includes("Spring Security blockiert Anfragen ohne Authentifizierung")
                    ) {
                        testResults.serverInfo.possibleIssues.push("Der Server blockiert alle Anfragen (403 Forbidden)")
                    }
                }
                if (Object.values(testResults.tests).some((test: any) => test.status === 404)) {
                    testResults.serverInfo.possibleIssues.push(
                        "Die API-Endpunkte existieren nicht an den angegebenen Pfaden (404 Not Found)",
                    )
                }
                if (!testResults.serverInfo.isRunning) {
                    testResults.serverInfo.possibleIssues.push("Der Server scheint nicht zu laufen oder ist nicht erreichbar")
                }
            }

            setResults(testResults)
        } catch (error) {
            console.error("Error running API tests:", error)
        } finally {
            setLoading(false)
        }
    }

    const testCustomEndpoint = async () => {
        if (!customEndpoint) return

        setCustomLoading(true)
        try {
            const url = `${apiUrl}${customEndpoint}`
            console.log(`Testing custom endpoint: ${url} with method: ${customMethod}`)

            const body = customBody ? JSON.parse(customBody) : undefined
            const proxyResponse = await proxyRequest({
                url,
                method: customMethod,
                body,
            })

            setCustomResponse(proxyResponse)
        } catch (error: any) {
            setCustomResponse({
                success: false,
                message: error.message || "Error testing custom endpoint",
                error: String(error),
            })
        } finally {
            setCustomLoading(false)
        }
    }

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Server className="h-5 w-5" />
                    Enhanced API Debugger
                </CardTitle>
                <CardDescription>Diagnose API connection issues and test endpoints</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {apiUrl === "Not set" && (
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Configuration Error</AlertTitle>
                            <AlertDescription>
                                NEXT_PUBLIC_API_URL environment variable is not set. API requests will fail.
                            </AlertDescription>
                        </Alert>
                    )}

                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium">API URL:</p>
                            <p className="text-sm text-muted-foreground">{apiUrl}</p>
                        </div>
                        <Button onClick={runTests} disabled={loading}>
                            {loading ? (
                                <>
                                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                                    Testing...
                                </>
                            ) : (
                                "Run Connection Tests"
                            )}
                        </Button>
                    </div>

                    {/* Custom Endpoint Tester */}
                    <div className="rounded-md border p-4 mt-4">
                        <h3 className="text-lg font-medium mb-4">Custom Endpoint Tester</h3>
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div className="md:col-span-2">
                                    <Label htmlFor="customEndpoint">Endpoint</Label>
                                    <Input
                                        id="customEndpoint"
                                        value={customEndpoint}
                                        onChange={(e) => setCustomEndpoint(e.target.value)}
                                        placeholder="/api/auth/login"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="customMethod">Method</Label>
                                    <select
                                        id="customMethod"
                                        value={customMethod}
                                        onChange={(e) => setCustomMethod(e.target.value as any)}
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        <option value="GET">GET</option>
                                        <option value="POST">POST</option>
                                        <option value="PUT">PUT</option>
                                        <option value="DELETE">DELETE</option>
                                    </select>
                                </div>
                                <div>
                                    <div className="h-8"></div>
                                    <Button onClick={testCustomEndpoint} disabled={customLoading} className="w-full">
                                        {customLoading ? (
                                            <>
                                                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                                                Testing...
                                            </>
                                        ) : (
                                            "Test Endpoint"
                                        )}
                                    </Button>
                                </div>
                            </div>

                            {(customMethod === "POST" || customMethod === "PUT") && (
                                <div>
                                    <Label htmlFor="customBody">Request Body (JSON)</Label>
                                    <textarea
                                        id="customBody"
                                        value={customBody}
                                        onChange={(e) => setCustomBody(e.target.value)}
                                        placeholder='{"email": "test@example.com", "password": "password123"}'
                                        className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    />
                                </div>
                            )}

                            {customResponse && (
                                <div className="mt-4">
                                    <h4 className="text-md font-medium mb-2">Response</h4>
                                    <div className={`p-4 rounded-md ${customResponse.success ? "bg-green-50" : "bg-red-50"}`}>
                                        <div className="flex items-center gap-2 mb-2">
                                            {customResponse.success ? (
                                                <CheckCircle className="h-5 w-5 text-green-500" />
                                            ) : (
                                                <AlertCircle className="h-5 w-5 text-red-500" />
                                            )}
                                            <span className={`font-medium ${customResponse.success ? "text-green-700" : "text-red-700"}`}>
                        {customResponse.success ? "Success" : "Error"}
                      </span>
                                            {customResponse.status && (
                                                <Badge variant={customResponse.success ? "success" : "destructive"}>
                                                    Status: {customResponse.status}
                                                </Badge>
                                            )}
                                        </div>
                                        <pre className="mt-2 max-h-60 overflow-auto rounded bg-gray-100 p-2 text-xs">
                      {JSON.stringify(customResponse, null, 2)}
                    </pre>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {results && (
                        <div className="mt-4 space-y-4">
                            {/* Server Info */}
                            <div className="rounded-md border p-4">
                                <h3 className="text-lg font-medium">Server Diagnosis</h3>
                                <div className="mt-2 space-y-2">
                                    <p>
                                        <span className="font-medium">Server Status:</span>{" "}
                                        {results.serverInfo.isRunning ? (
                                            <span className="text-green-500 font-medium">Running</span>
                                        ) : (
                                            <span className="text-red-500 font-medium">Not Detected</span>
                                        )}
                                    </p>
                                    {results.serverInfo.serverType !== "unknown" && (
                                        <p>
                                            <span className="font-medium">Server Type:</span> {results.serverInfo.serverType}
                                        </p>
                                    )}
                                    {results.serverInfo.possibleIssues.length > 0 && (
                                        <div>
                                            <p className="font-medium">Possible Issues:</p>
                                            <ul className="list-disc pl-5 mt-1">
                                                {results.serverInfo.possibleIssues.map((issue: string, index: number) => (
                                                    <li key={index} className="text-sm text-red-500">
                                                        {issue}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Test Results */}
                            <div className="rounded-md border p-4">
                                <h3 className="text-lg font-medium mb-4">Endpoint Test Results</h3>
                                <div className="max-h-96 overflow-y-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Endpoint
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Path
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Details
                                            </th>
                                        </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                        {Object.entries(results.tests).map(([name, test]: [string, any]) => (
                                            <tr key={name}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{name}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{test.path}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {test.status ? (
                                                        <Badge
                                                            variant={
                                                                test.status >= 200 && test.status < 300
                                                                    ? "success"
                                                                    : test.status >= 400 && test.status < 500
                                                                        ? "destructive"
                                                                        : "outline"
                                                            }
                                                        >
                                                            {test.status}
                                                        </Badge>
                                                    ) : (
                                                        <Badge variant="outline">Failed</Badge>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-500">
                                                    <details>
                                                        <summary className="cursor-pointer text-blue-500">View Details</summary>
                                                        <div className="mt-2 p-2 bg-gray-50 rounded">
                                                            <p>
                                                                <strong>Message:</strong> {test.message}
                                                            </p>
                                                            {test.headers && (
                                                                <div className="mt-1">
                                                                    <p>
                                                                        <strong>Headers:</strong>
                                                                    </p>
                                                                    <pre className="text-xs mt-1 bg-gray-100 p-1 rounded">
                                      {JSON.stringify(test.headers, null, 2)}
                                    </pre>
                                                                </div>
                                                            )}
                                                            {test.data && (
                                                                <div className="mt-1">
                                                                    <p>
                                                                        <strong>Data:</strong>
                                                                    </p>
                                                                    <pre className="text-xs mt-1 bg-gray-100 p-1 rounded">
                                      {JSON.stringify(test.data, null, 2)}
                                    </pre>
                                                                </div>
                                                            )}
                                                            {test.htmlResponse && (
                                                                <div className="mt-1">
                                                                    <p>
                                                                        <strong>HTML Response:</strong>
                                                                    </p>
                                                                    <pre className="text-xs mt-1 bg-gray-100 p-1 rounded max-h-40 overflow-auto">
                                      {test.htmlResponse}
                                    </pre>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </details>
                                                </td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}

