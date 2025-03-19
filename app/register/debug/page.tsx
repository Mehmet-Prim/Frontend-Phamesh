"use client"

import { Navbar } from "@/app/components/Navbar"
import { Footer } from "@/app/components/Footer"
import RegistrationFormWithDebug from "@/components/registration-form-with-debug"

export default function RegisterDebugPage() {
    return (
        <>
            <Navbar />
            <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-b from-gray-50 to-gray-100">
                <div className="w-full max-w-4xl space-y-8 py-8">
                    <div className="text-center">
                        <h1 className="text-3xl font-bold">Join Phamesh (Debug Mode)</h1>
                        <p className="mt-2 text-gray-600">Create your account to get started</p>
                        <p className="mt-1 text-sm text-red-500">This page includes enhanced debugging tools</p>
                    </div>

                    <RegistrationFormWithDebug />
                </div>
            </main>
            <Footer />
        </>
    )
}

