"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle } from "lucide-react"
import { getAuthUrl } from "@/lib/api-config"
import { proxyRequest } from "@/services/proxy-service"
import { getToken } from "@/lib/auth"

export default function AuthTest() {
    const [testResult, setTestResult] = useState<any>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const testPublicEndpoint = async () => {
        setLoading(true)
        setError(null)
        try {
            const url = getAuthUrl("/test")
            const response = await proxyRequest({
                url,
                method: "GET",
            })
            setTestResult(response)
        } catch (err: any) {
            setError(err.message || "An error occurred")
        } finally {
            setLoading(false)
        }
    }

    const testProtectedEndpoint = async () => {
        setLoading(true)
        setError(null)
        try {
            const token = getToken()
            const url = `${process.env.NEXT_PUBLIC_API_URL}/user/profile`
            const response = await proxyRequest({
                url,
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            setTestResult(response)
        } catch (err: any) {
            setError(err.message || "An error occurred")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Authentication Test</CardTitle>
                <CardDescription>Test your authentication configuration</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {error && (
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    <div className="flex space-x-4">
                        <Button onClick={testPublicEndpoint} disabled={loading}>
                            Test Public Endpoint
                        </Button>
                        <Button onClick={testProtectedEndpoint} disabled={loading}>
                            Test Protected Endpoint
                        </Button>
                    </div>

                    {testResult && (
                        <div className="mt-4">
                            <h3 className="text-lg font-medium mb-2">Test Result:</h3>
                            <div
                                className={`p-4 rounded-md ${
                                    testResult.success ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"
                                }`}
                            >
                                <div className="flex items-center gap-2 mb-2">
                                    {testResult.success ? (
                                        <CheckCircle className="h-5 w-5 text-green-500" />
                                    ) : (
                                        <AlertCircle className="h-5 w-5 text-red-500" />
                                    )}
                                    <span className={`font-medium ${testResult.success ? "text-green-700" : "text-red-700"}`}>
                    {testResult.success ? "Success" : "Error"}
                  </span>
                                </div>
                                <pre className="mt-2 max-h-60 overflow-auto rounded bg-gray-100 p-2 text-xs">
                  {JSON.stringify(testResult, null, 2)}
                </pre>
                            </div>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}

