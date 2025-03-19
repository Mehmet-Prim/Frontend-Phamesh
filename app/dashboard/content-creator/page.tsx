"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/hooks/useAuth"
import { ContentCreatorService } from "@/services/content-creator"
import type { ContentCreator } from "@/types/models"
import {AuthService} from "@/services/auth-service";
import {router} from "next/client";

export default function DashboardContentCreator() {
    const { user, loading: authLoading } = useAuth()
    const [contentCreator, setContentCreator] = useState<ContentCreator | null>(null)
    const [dashboardData, setDashboardData] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")

    useEffect(() => {
        const fetchData = async () => {
            if (authLoading) return

            try {
                setLoading(true)

                // Fetch content creator profile
                const profileResponse = await ContentCreatorService.getProfile()
                if (profileResponse.success && profileResponse.data) {
                    setContentCreator(profileResponse.data)
                }

                // Fetch dashboard data
                const dashboardResponse = await ContentCreatorService.getDashboard()
                if (dashboardResponse.success && dashboardResponse.data) {
                    setDashboardData(dashboardResponse.data)
                }
            } catch (err: any) {
                if (err.message?.includes("Unauthorized") || err.message?.includes("authentifiziert")) {
                    AuthService.logout()
                    router.push("/login/content-creator")
                }

                setError(err.message || "Failed to load dashboard data")
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [authLoading])

    if (loading || authLoading) {
        return (
            <>
                <main className="max-w-7xl mx-auto min-h-screen py-12 px-4">
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
                    </div>
                </main>
            </>
        )
    }

    return (
        <>
            <main className="max-w-7xl mx-auto min-h-screen py-12 px-4">
                {error ? (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                        <span className="block sm:inline">{error}</span>
                    </div>
                ) : (
                    <>
                        <div className="bg-gray-900 rounded-lg shadow-md p-6 mb-6">
                            <h1 className="text-5xl font-bold text-white mb-4">
                                Welcome, {contentCreator?.firstName || "Content Creator"}
                            </h1>
                            <p className="text-2xl text-gray-300">This is your content creator dashboard</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                            <div className="bg-gradient-to-r from-[#DB134C] to-[#A31113] rounded-lg shadow-md p-6">
                                <h2 className="text-3xl font-bold text-white mb-2">Profile</h2>
                                <p className="text-xl text-white">Manage your creator profile</p>
                            </div>

                            <div className="bg-gradient-to-r from-[#1390B1] to-[#1357B1] rounded-lg shadow-md p-6">
                                <h2 className="text-3xl font-bold text-white mb-2">Collaborations</h2>
                                <p className="text-xl text-white">View your active collaborations</p>
                            </div>

                            <div className="bg-gradient-to-r from-[#DDB40C] to-[#D18B0A] rounded-lg shadow-md p-6">
                                <h2 className="text-3xl font-bold text-white mb-2">Analytics</h2>
                                <p className="text-xl text-white">View your performance metrics</p>
                            </div>
                        </div>

                        <div className="bg-gray-900 rounded-lg shadow-md p-6">
                            <h2 className="text-3xl font-bold text-white mb-4">Social Media</h2>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                {contentCreator?.socialMedia?.instagram && (
                                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg p-4">
                                        <h3 className="text-2xl font-bold text-white">Instagram</h3>
                                        <p className="text-white">@{contentCreator.socialMedia.instagram}</p>
                                    </div>
                                )}

                                {contentCreator?.socialMedia?.youtube && (
                                    <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-lg p-4">
                                        <h3 className="text-2xl font-bold text-white">YouTube</h3>
                                        <p className="text-white">{contentCreator.socialMedia.youtube}</p>
                                    </div>
                                )}

                                {contentCreator?.socialMedia?.tiktok && (
                                    <div className="bg-gradient-to-r from-black to-gray-800 rounded-lg p-4">
                                        <h3 className="text-2xl font-bold text-white">TikTok</h3>
                                        <p className="text-white">@{contentCreator.socialMedia.tiktok}</p>
                                    </div>
                                )}

                                {contentCreator?.socialMedia?.twitter && (
                                    <div className="bg-gradient-to-r from-blue-400 to-blue-600 rounded-lg p-4">
                                        <h3 className="text-2xl font-bold text-white">Twitter</h3>
                                        <p className="text-white">@{contentCreator.socialMedia.twitter}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </>
                )}
            </main>
        </>
    )
}

