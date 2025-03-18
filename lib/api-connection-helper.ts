/**
 * API Connection Helper
 *
 * This utility provides functions to help diagnose and fix API connection issues.
 */

import { API_PREFIX } from "./api"

/**
 * Tests if the API server is reachable and returns diagnostic information
 */
export async function testApiConnection() {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"

    console.log("Testing API connection...")
    console.log("API URL:", API_URL)
    console.log("API Prefix:", API_PREFIX)

    // Store all test results
    const results = {
        apiUrl: API_URL,
        apiPrefix: API_PREFIX,
        tests: [] as any[],
        overallSuccess: false,
        recommendations: [] as string[],
    }

    // Test 1: Basic connectivity with fetch
    try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 5000)

        const response = await fetch(`${API_URL}/health`, {
            method: "GET",
            signal: controller.signal,
        })

        clearTimeout(timeoutId)

        results.tests.push({
            name: "Basic connectivity",
            success: true,
            status: response.status,
            statusText: response.statusText,
        })
    } catch (error: any) {
        results.tests.push({
            name: "Basic connectivity",
            success: false,
            error: error.message,
        })

        // Add recommendations based on the error
        if (error.name === "AbortError") {
            results.recommendations.push(
                "The API server is taking too long to respond. Check if it's overloaded or if there are network issues.",
            )
        } else if (error.message === "Failed to fetch") {
            results.recommendations.push("Cannot connect to the API server. Ensure it's running and the URL is correct.")
            results.recommendations.push(`Verify that ${API_URL} is accessible from your browser.`)
        }
    }

    // Test 2: API endpoint with prefix
    try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 5000)

        const response = await fetch(`${API_URL}${API_PREFIX}/health`, {
            method: "GET",
            signal: controller.signal,
        })

        clearTimeout(timeoutId)

        results.tests.push({
            name: "API with prefix",
            success: true,
            status: response.status,
            statusText: response.statusText,
        })
    } catch (error: any) {
        results.tests.push({
            name: "API with prefix",
            success: false,
            error: error.message,
        })

        // Add recommendations based on the error
        if (error.message === "Failed to fetch") {
            results.recommendations.push(`The API endpoint ${API_URL}${API_PREFIX}/health is not accessible.`)
            results.recommendations.push("Check if your API prefix is correct. It's currently set to: " + API_PREFIX)
        }
    }

    // Test 3: CORS check
    try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 5000)

        const response = await fetch(`${API_URL}${API_PREFIX}/health`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            signal: controller.signal,
        })

        clearTimeout(timeoutId)

        results.tests.push({
            name: "CORS check",
            success: true,
            status: response.status,
            statusText: response.statusText,
        })
    } catch (error: any) {
        results.tests.push({
            name: "CORS check",
            success: false,
            error: error.message,
        })

        // Check if it's a CORS error
        if (error.message.includes("CORS")) {
            results.recommendations.push(
                "CORS issue detected. Your API server needs to allow requests from your frontend origin.",
            )
            results.recommendations.push("Add appropriate CORS headers to your API responses.")
        }
    }

    // Determine overall success
    results.overallSuccess = results.tests.some((test) => test.success)

    // Add general recommendations if all tests failed
    if (!results.overallSuccess) {
        results.recommendations.push("All connection tests failed. Check your network connection.")
        results.recommendations.push("Verify that your API server is running and accessible.")
        results.recommendations.push("Ensure your NEXT_PUBLIC_API_URL environment variable is set correctly.")
    }

    return results
}

/**
 * Attempts to make an API request using multiple strategies
 * This is useful when you're not sure why your API requests are failing
 */
export async function multiStrategyRequest<T>(
    endpoint: string,
    method: "GET" | "POST" | "PUT" | "DELETE",
    data?: any,
): Promise<{ success: boolean; data?: T; error?: string; strategy?: string }> {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"
    const fullUrl = `${API_URL}${API_PREFIX}${endpoint}`

    console.log(`Attempting multi-strategy request to: ${fullUrl}`)

    // Strategy 1: Standard fetch with JSON
    try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 5000)

        const response = await fetch(fullUrl, {
            method,
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: data ? JSON.stringify(data) : undefined,
            signal: controller.signal,
        })

        clearTimeout(timeoutId)

        if (response.ok) {
            const responseData = await response.json()
            return { success: true, data: responseData as T, strategy: "standard" }
        }
    } catch (error) {
        console.log("Standard strategy failed:", error)
        // Continue to next strategy
    }

    // Strategy 2: Fetch without Content-Type header (avoids preflight for simple requests)
    try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 5000)

        const response = await fetch(fullUrl, {
            method,
            headers: {
                Accept: "application/json",
            },
            body: data ? JSON.stringify(data) : undefined,
            signal: controller.signal,
        })

        clearTimeout(timeoutId)

        if (response.ok) {
            const responseData = await response.json()
            return { success: true, data: responseData as T, strategy: "no-content-type" }
        }
    } catch (error) {
        console.log("No-content-type strategy failed:", error)
        // Continue to next strategy
    }

    // Strategy 3: XMLHttpRequest (sometimes works when fetch doesn't)
    try {
        const result = await new Promise<{ success: boolean; data?: T; error?: string }>((resolve) => {
            const xhr = new XMLHttpRequest()
            xhr.open(method, fullUrl)
            xhr.setRequestHeader("Accept", "application/json")

            // Fix: Only set Content-Type for non-GET requests
            if (method !== "GET") {
                xhr.setRequestHeader("Content-Type", "application/json")
            }

            xhr.timeout = 5000

            xhr.onload = () => {
                if (xhr.status >= 200 && xhr.status < 300) {
                    try {
                        const data = JSON.parse(xhr.responseText)
                        resolve({ success: true, data: data as T })
                    } catch (e) {
                        resolve({ success: true, data: xhr.responseText as unknown as T })
                    }
                } else {
                    resolve({
                        success: false,
                        error: `Server responded with status: ${xhr.status}`,
                    })
                }
            }

            xhr.onerror = () => {
                resolve({ success: false, error: "Network error occurred" })
            }

            xhr.ontimeout = () => {
                resolve({ success: false, error: "Request timed out" })
            }

            // Fix: Only send data for non-GET requests
            if (data && method !== "GET") {
                xhr.send(JSON.stringify(data))
            } else {
                xhr.send()
            }
        })

        if (result.success) {
            return { ...result, strategy: "xhr" }
        }
    } catch (error) {
        console.log("XHR strategy failed:", error)
        // Continue to next strategy
    }

    // Strategy 4: No-cors mode (limited, but might work for POST)
    if (method === "POST" || method === "PUT") {
        try {
            const controller = new AbortController()
            const timeoutId = setTimeout(() => controller.abort(), 5000)

            await fetch(fullUrl, {
                method,
                headers: {
                    "Content-Type": "text/plain", // Changed for no-cors
                },
                body: data ? JSON.stringify(data) : undefined,
                mode: "no-cors",
                signal: controller.signal,
            })

            clearTimeout(timeoutId)

            // With no-cors, we can't read the response, so we assume success
            return {
                success: true,
                data: { message: "Request sent with no-cors mode" } as unknown as T,
                strategy: "no-cors",
            }
        } catch (error) {
            console.log("No-cors strategy failed:", error)
            // This was our last strategy
        }
    }

    // All strategies failed
    return {
        success: false,
        error: "All request strategies failed. The server may be down or unreachable.",
    }
}

