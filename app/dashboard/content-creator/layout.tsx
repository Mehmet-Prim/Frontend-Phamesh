"use client"

import type React from "react"

import { RoleGuard } from "@/components/role-guard"

export default function ContentCreatorLayout({
                                                 children,
                                             }: {
    children: React.ReactNode
}) {
    return (
        <RoleGuard allowedRole="CONTENT_CREATOR" fallbackPath="/dashboard/company">
            {children}
        </RoleGuard>
    )
}

