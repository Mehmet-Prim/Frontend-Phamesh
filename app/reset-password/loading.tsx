import { Navbar } from "@/app/components/Navbar"
import { Footer } from "@/app/components/Footer"

export default function ResetPasswordLoading() {
    return (
        <>
            <Navbar />
            <main className="max-w-7xl mx-auto min-h-screen flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="w-full max-w-md">
                    <div className="flex justify-center">
                        <div className="animate-pulse rounded-full bg-gray-700 h-24 w-24"></div>
                    </div>
                    <div className="mt-6 text-center">
                        <div className="animate-pulse h-8 bg-gray-700 rounded w-3/4 mx-auto"></div>
                    </div>
                    <div className="mt-2 text-center">
                        <div className="animate-pulse h-4 bg-gray-700 rounded w-1/2 mx-auto"></div>
                    </div>
                    <div className="mt-8 space-y-6">
                        <div>
                            <div className="animate-pulse h-4 bg-gray-700 rounded w-1/4 mb-2"></div>
                            <div className="animate-pulse h-10 bg-gray-700 rounded w-full"></div>
                        </div>
                        <div>
                            <div className="animate-pulse h-4 bg-gray-700 rounded w-1/3 mb-2"></div>
                            <div className="animate-pulse h-10 bg-gray-700 rounded w-full"></div>
                        </div>
                        <div className="pt-4">
                            <div className="animate-pulse h-10 bg-gray-700 rounded w-full"></div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    )
}

