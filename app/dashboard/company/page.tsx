"use client"

import { useEffect, useState } from "react"
import { forceCompanyRole } from "@/lib/auth-debug"
import { debugAuthState } from "@/lib/debug-auth"
import { useAuth } from "@/hooks/useAuth"

export default function CompanyDashboard() {
    const { syncRole } = useAuth()
    const [syncStatus, setSyncStatus] = useState<string | null>(null)

    useEffect(() => {
        // Debug-Informationen anzeigen, wenn die Seite geladen wird
        debugAuthState()
    }, [])

    const handleForceCompanyRole = () => {
        forceCompanyRole()
        setSyncStatus("Die Rolle wurde auf COMPANY gesetzt. Die Seite wird neu geladen.")
        setTimeout(() => {
            window.location.reload()
        }, 1500)
    }

    const handleSyncWithBackend = async () => {
        setSyncStatus("Synchronisiere mit Backend...")
        try {
            const role = await syncRole()
            setSyncStatus(`Synchronisierung abgeschlossen. Erkannte Rolle: ${role}`)
            setTimeout(() => {
                window.location.reload()
            }, 1500)
        } catch (error) {
            setSyncStatus("Fehler bei der Synchronisierung. Bitte versuchen Sie es erneut.")
        }
    }

    return (
        <>
            <div className="min-h-screen p-8">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-4xl font-bold mb-8">Company Dashboard</h1>

                    <div className="p-6 rounded-lg shadow-md mb-8">
                        <h2 className="text-2xl font-semibold mb-4">Willkommen im Unternehmens-Dashboard</h2>
                        <p className="mb-4">
                            Hier können Sie Ihre Kampagnen verwalten, Content Creator finden und Ihre Analysen einsehen.
                        </p>

                        <div className="mt-8 p-4 border border-yellow-200 rounded-md">
                            <h3 className="text-lg font-medium text-yellow-800 mb-2">Probleme mit der Rollenweiterleitung?</h3>
                            <p className="text-yellow-700 mb-4">
                                Wenn Sie Probleme haben, auf dieses Dashboard zuzugreifen, können Sie die Rolle manuell auf COMPANY
                                setzen oder mit dem Backend synchronisieren.
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <button
                                    onClick={handleForceCompanyRole}
                                    className="px-4 py-2 bg-yellow-600 rounded hover:bg-yellow-700 transition-colors"
                                >
                                    Rolle auf COMPANY setzen
                                </button>
                                <button
                                    onClick={handleSyncWithBackend}
                                    className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 transition-colors"
                                >
                                    Mit Backend synchronisieren
                                </button>
                            </div>
                            {syncStatus && <div className="mt-4 p-2 rounded border border-yellow-300">{syncStatus}</div>}
                        </div>
                    </div>

                    {/* Weitere Dashboard-Inhalte hier */}
                </div>
            </div>
        </>
    )
}

