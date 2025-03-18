"use client"

import { useState, useEffect } from "react"
import { Navbar } from "@/app/components/Navbar"
import { Footer } from "@/app/components/Footer"
import api from "@/lib/api"
import Link from "next/link"

interface VerificationCode {
    [email: string]: string
}

export default function VerificationCodesPage() {
    const [codes, setCodes] = useState<VerificationCode>({})
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        const fetchCodes = async () => {
            try {
                const response = await api.get("/auth/dev/verification-codes")
                if (response.data.success) {
                    setCodes(response.data.data || {})
                } else {
                    setError(response.data.message || "Failed to fetch verification codes")
                }
            } catch (err: any) {
                setError(err.message || "An error occurred")
            } finally {
                setLoading(false)
            }
        }

        fetchCodes()
    }, [])

    return (
        <>
            <Navbar />
            <main className="max-w-7xl mx-auto min-h-screen py-12 px-4">
                <div className="bg-gray-900 p-6 rounded-lg shadow-md">
                    <h1 className="text-4xl font-bold text-white mb-6">Entwickler-Tool: Verifizierungscodes</h1>
                    <p className="text-xl text-gray-300 mb-6">
                        Diese Seite ist nur für Entwicklungszwecke. Hier werden alle aktiven Verifizierungscodes angezeigt.
                    </p>

                    {loading ? (
                        <div className="flex justify-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
                        </div>
                    ) : error ? (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                            <span className="block sm:inline">{error}</span>
                        </div>
                    ) : Object.keys(codes).length === 0 ? (
                        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative">
                            <span className="block sm:inline">Keine aktiven Verifizierungscodes gefunden.</span>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full bg-gray-800 rounded-lg overflow-hidden">
                                <thead className="bg-gray-700">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                        E-Mail
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                        Verifizierungscode
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                        Aktion
                                    </th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-700">
                                {Object.entries(codes).map(([email, code]) => (
                                    <tr key={email}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{email}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{code}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                            <Link
                                                href={`/verify-email?email=${encodeURIComponent(email)}&code=${code}`}
                                                className="text-blue-400 hover:text-blue-300"
                                            >
                                                Verifizieren
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </>
    )
}

