import { type NextRequest, NextResponse } from "next/server"
import { NextApiRequest, NextApiResponse } from "next";
import fetch from "node-fetch";

// Maximale Dauer für die Ausführung der Route
export const maxDuration = 60 // 60 Sekunden

export async function POST(request: NextRequest) {
    try {
        // Extrahiere die Ziel-URL und Anfragedaten aus dem Request-Body
        const { url, method, body, headers: customHeaders } = await request.json()

        if (!url) {
            return NextResponse.json({ success: false, message: "URL is required" }, { status: 400 })
        }

        console.log(`Proxying request to: ${url} with method: ${method || "GET"}`)

        // Erstelle die Headers für die Anfrage
        const headers = new Headers()
        headers.set("Content-Type", "application/json")

        // Füge benutzerdefinierte Headers hinzu, falls vorhanden
        if (customHeaders) {
            Object.entries(customHeaders).forEach(([key, value]) => {
                if (typeof value === "string") {
                    headers.set(key, value)
                }
            })
        }

        // Führe die Anfrage durch
        const response = await fetch(url, {
            method: method || "GET",
            headers,
            body: body ? JSON.stringify(body) : undefined,
        })

        // Lese die Antwort als Text
        const responseText = await response.text()
        console.log(`Raw response from ${url}:`, responseText.substring(0, 200) + (responseText.length > 200 ? "..." : ""))

        // Versuche, die Antwort als JSON zu parsen
        let responseData
        try {
            responseData = responseText ? JSON.parse(responseText) : {}
        } catch (e) {
            console.error("Error parsing response as JSON:", e)
            // Wenn es kein JSON ist, geben wir den Text zurück
            responseData = {
                text: responseText.substring(0, 1000), // Begrenzen auf 1000 Zeichen
                isHtml: responseText.trim().startsWith("<!"),
            }
        }

        // Gib die Antwort zurück
        return NextResponse.json({
            success: response.ok,
            status: response.status,
            statusText: response.statusText,
            data: responseData,
            headers: Object.fromEntries(response.headers.entries()),
        })
    } catch (error: any) {
        console.error("Proxy error:", error)
        return NextResponse.json(
            {
                success: false,
                message: error.message || "An error occurred while proxying the request",
                error: error.toString(),
            },
            { status: 500 },
        )
    }
}

// OPTIONS-Anfrage für CORS-Preflight
export async function OPTIONS() {
    return new NextResponse(null, {
        status: 200,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
    })
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { url, method, body } = req.body;

    try {
        const response = await fetch(url, {
            method,
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
        });

        const data = await response.json();
        res.status(response.status).json(data);
    } catch (error) {
        console.error("Proxy request error:", error);
        res.status(500).json({ success: false, message: "Proxy request failed" });
    }
}