"use client"

import type React from "react"

import { RoleGuard } from "@/components/role-guard"

export default function CompanyLayout({
                                          children,
                                      }: {
    children: React.ReactNode
}) {
    return (
        <RoleGuard allowedRole="COMPANY" fallbackPath="/dashboard/content-creator" forceRole={true}>
            {children}
        </RoleGuard>
    )
}

