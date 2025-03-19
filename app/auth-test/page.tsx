import { Navbar } from "@/app/components/Navbar"
import { Footer } from "@/app/components/Footer"
import AuthTest from "@/components/auth-test"

export default function AuthTestPage() {
    return (
        <>
            <Navbar />
            <main className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto">
                    <h1 className="text-4xl font-bold mb-8 text-center">Authentication Test</h1>
                    <AuthTest />
                </div>
            </main>
            <Footer />
        </>
    )
}

