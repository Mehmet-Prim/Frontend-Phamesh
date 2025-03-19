"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { testApiConnection } from "@/lib/api-connection-helper"
import { AlertCircle, CheckCircle, Server, RefreshCw } from "lucide-react"

export default function ApiConnectionDebugger() {
    const [results, setResults] = useState<any>(null)
    const [loading, setLoading] = useState(false)
    const [apiUrl, setApiUrl] = useState<string | null>(null)

    // Überprüfe die API-URL beim Laden der Komponente
    useState(() => {
        const url = process.env.NEXT_PUBLIC_API_URL || "Not set"
        setApiUrl(url)
    })

    const runTests = async () => {
        setLoading(true)
        try {
            const testResults = await testApiConnection()
            setResults(testResults)
        } catch (error) {
            console.error("Error running API tests:", error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Server className="h-5 w-5" />
                    API Connection Debugger
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
                            <Tabs defaultValue="proxy">
                                <TabsList className="grid w-full grid-cols-2">
                                    <TabsTrigger value="proxy">Proxy Tests</TabsTrigger>
                                    <TabsTrigger value="direct">Direct Tests</TabsTrigger>
                                </TabsList>

                                <TabsContent value="proxy" className="space-y-4">
                                    {Object.entries(results.proxyTests).map(([endpoint, test]: [string, any]) => (
                                        <div key={endpoint} className="rounded-md border p-4">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    {test.success ? (
                                                        <CheckCircle className="h-5 w-5 text-green-500" />
                                                    ) : (
                                                        <AlertCircle className="h-5 w-5 text-red-500" />
                                                    )}
                                                    <span className="font-medium">{endpoint}</span>
                                                </div>
                                                <span className={`text-sm ${test.success ? "text-green-500" : "text-red-500"}`}>
                                                  {test.status ? `Status: ${test.status}` : test.message}
                                                </span>
                                            </div>

                                            {test.htmlResponse && (
                                                <div className="mt-2">
                                                    <details>
                                                        <summary className="cursor-pointer text-sm text-blue-500">View HTML Response</summary>
                                                        <pre className="mt-2 max-h-40 overflow-auto rounded bg-gray-100 p-2 text-xs">
                                                          {test.htmlResponse}
                                                        </pre>
                                                    </details>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </TabsContent>

                                <TabsContent value="direct" className="space-y-4">
                                    {Object.entries(results.tests).map(([endpoint, test]: [string, any]) => (
                                        <div key={endpoint} className="rounded-md border p-4">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    {test.success ? (
                                                        <CheckCircle className="h-5 w-5 text-green-500" />
                                                    ) : (
                                                        <AlertCircle className="h-5 w-5 text-red-500" />
                                                    )}
                                                    <span className="font-medium">{endpoint}</span>
                                                </div>
                                                <span className={`text-sm ${test.success ? "text-green-500" : "text-red-500"}`}>
                                                  {test.status ? `Status: ${test.status}` : test.message}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </TabsContent>
                            </Tabs>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}

