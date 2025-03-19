"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { exploreApiPaths } from "@/lib/api-path-explorer"
import { AlertCircle, CheckCircle, RefreshCw, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"

export default function ApiPathExplorer() {
    const [results, setResults] = useState<any>(null)
    const [loading, setLoading] = useState(false)
    const [apiUrl, setApiUrl] = useState<string | null>(null)
    const [customApiPrefix, setCustomApiPrefix] = useState("")
    const [customAuthPrefix, setCustomAuthPrefix] = useState("")
    const [appliedChanges, setAppliedChanges] = useState(false)

    // Überprüfe die API-URL beim Laden der Komponente
    useEffect(() => {
        const url = process.env.NEXT_PUBLIC_API_URL || "Not set"
        setApiUrl(url)
    }, [])

    const runExplorer = async () => {
        setLoading(true)
        try {
            const explorerResults = await exploreApiPaths()
            setResults(explorerResults)

            // Setze die empfohlenen Präfixe als Standardwerte
            if (explorerResults.recommendedApiPrefix) {
                setCustomApiPrefix(explorerResults.recommendedApiPrefix)
            }
            if (explorerResults.recommendedAuthPrefix) {
                setCustomAuthPrefix(explorerResults.recommendedAuthPrefix)
            }
        } catch (error) {
            console.error("Error running API path explorer:", error)
        } finally {
            setLoading(false)
        }
    }

    const applyCustomPaths = () => {
        // In einer echten Anwendung würden wir diese Werte in localStorage oder einem globalen Zustand speichern
        localStorage.setItem("customApiPrefix", customApiPrefix)
        localStorage.setItem("customAuthPrefix", customAuthPrefix)
        setAppliedChanges(true)

        // Nach 3 Sekunden die Erfolgsmeldung ausblenden
        setTimeout(() => {
            setAppliedChanges(false)
        }, 3000)
    }

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Search className="h-5 w-5" />
                    API Path Explorer
                </CardTitle>
                <CardDescription>Discover available API endpoints and configure custom paths</CardDescription>
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
                        <Button onClick={runExplorer} disabled={loading}>
                            {loading ? (
                                <>
                                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                                    Exploring...
                                </>
                            ) : (
                                "Explore API Paths"
                            )}
                        </Button>
                    </div>

                    {results && (
                        <div className="mt-4 space-y-4">
                            {/* Empfohlene Pfade */}
                            <div className="rounded-md border p-4">
                                <h3 className="text-lg font-medium">Recommended API Paths</h3>
                                <div className="mt-2 space-y-2">
                                    <p>
                                        <span className="font-medium">API Prefix:</span>{" "}
                                        {results.recommendedApiPrefix ? (
                                            <Badge variant="outline" className="ml-2">
                                                {results.recommendedApiPrefix}
                                            </Badge>
                                        ) : (
                                            <span className="text-red-500 font-medium">Not detected</span>
                                        )}
                                    </p>
                                    <p>
                                        <span className="font-medium">Auth Prefix:</span>{" "}
                                        {results.recommendedAuthPrefix ? (
                                            <Badge variant="outline" className="ml-2">
                                                {results.recommendedAuthPrefix}
                                            </Badge>
                                        ) : (
                                            <span className="text-red-500 font-medium">Not detected</span>
                                        )}
                                    </p>
                                </div>
                            </div>

                            {/* Benutzerdefinierte Pfade */}
                            <div className="rounded-md border p-4">
                                <h3 className="text-lg font-medium">Custom API Paths</h3>
                                <p className="text-sm text-muted-foreground mt-1 mb-4">
                                    Configure custom API paths if the recommended ones don&#39;t work
                                </p>

                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="apiPrefix">API Prefix</Label>
                                            <Input
                                                id="apiPrefix"
                                                value={customApiPrefix}
                                                onChange={(e) => setCustomApiPrefix(e.target.value)}
                                                placeholder="/api"
                                            />
                                            <p className="text-xs text-muted-foreground">Example: /api, /v1, /app</p>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="authPrefix">Auth Prefix</Label>
                                            <Input
                                                id="authPrefix"
                                                value={customAuthPrefix}
                                                onChange={(e) => setCustomAuthPrefix(e.target.value)}
                                                placeholder="/api/auth"
                                            />
                                            <p className="text-xs text-muted-foreground">Example: /api/auth, /auth, /users</p>
                                        </div>
                                    </div>

                                    <Button onClick={applyCustomPaths}>Apply Custom Paths</Button>

                                    {appliedChanges && (
                                        <Alert className="mt-2 bg-green-50 border-green-200">
                                            <CheckCircle className="h-4 w-4 text-green-600" />
                                            <AlertDescription className="text-green-600">
                                                Custom paths applied successfully! Refresh the page to see the changes.
                                            </AlertDescription>
                                        </Alert>
                                    )}
                                </div>
                            </div>

                            {/* Entdeckte Pfade */}
                            <div className="rounded-md border p-4">
                                <h3 className="text-lg font-medium">Discovered Paths</h3>
                                <p className="text-sm text-muted-foreground mt-1 mb-4">These paths were discovered on your server</p>

                                <div className="max-h-60 overflow-y-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Path
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Type
                                            </th>
                                        </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                        {results.discoveredPaths.map((path: any, index: number) => (
                                            <tr key={index}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{path.path}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    <Badge
                                                        variant={
                                                            path.status >= 200 && path.status < 300
                                                                ? "success"
                                                                : path.status >= 400 && path.status < 500
                                                                    ? "destructive"
                                                                    : "outline"
                                                        }
                                                    >
                                                        {path.status}
                                                    </Badge>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {path.isJson && (
                                                        <Badge variant="outline" className="mr-1">
                                                            JSON
                                                        </Badge>
                                                    )}
                                                    {path.isHtml && <Badge variant="outline">HTML</Badge>}
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

