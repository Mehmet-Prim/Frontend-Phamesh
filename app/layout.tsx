import type React from "react"
import type { Metadata } from "next"
import { Geist_Mono } from "next/font/google"
import "./globals.css"
import { Jomhuria } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import {AuthProvider} from "@/hooks/useAuth"

const jomhuria = Jomhuria({
    weight: "400",
    variable: "--font-jomhuria",
    subsets: ["latin"],
})

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
})

export const metadata: Metadata = {
    title: "Phamesh",
    description: "",
}

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
        <body className={`${jomhuria.variable} ${geistMono.variable} antialiased`}>
        <AuthProvider>
            <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
                {children}
                <Toaster />
            </ThemeProvider>
        </AuthProvider>
        </body>
        </html>
    )
}

