"use client"

import type React from "react"

import { RoleGuard } from "@/components/role-guard"
import { Navbar } from "@/app/components/Navbar"
import { Footer } from "@/app/components/Footer"

export default function ContentCreatorLayout({
                                                 children,
                                             }: {
    children: React.ReactNode
}) {
    return (
        <RoleGuard allowedRole="CONTENT_CREATOR" fallbackPath="/dashboard/company">
            <Navbar />
            {children}
            <Footer />
        </RoleGuard>
    )
}

