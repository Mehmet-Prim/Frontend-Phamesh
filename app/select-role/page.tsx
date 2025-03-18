"use client"

import { Navbar } from "@/app/components/Navbar"
import { Footer } from "@/app/components/Footer"
import ContentCreator from "@/public/icons/contentCreatorIcon.png"
import Company from "@/public/icons/companyIcon.png"
import Image from "next/image"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function SelectRole() {
    const [isMobile, setIsMobile] = useState(false)
    const router = useRouter()

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 900)
        }

        handleResize()
        window.addEventListener("resize", handleResize)
        return () => window.removeEventListener("resize", handleResize)
    }, [])

    if (isMobile) {
        return (
            <>
                <Navbar />
                <main className="max-w-7xl mx-auto mb-36 mt-36">
                    <div className="flex flex-col items-center justify-center">
                        <h1 className="text-5xl max-w-[600px] text-center">
                            Before you can start, we need to know whether you are a
                        </h1>
                        <div className="size-6 bg-white rounded-full mt-5"></div>
                        <div className="h-10 w-1 bg-white"></div>
                    </div>
                    <div className="pl-10">
                        <div className="flex justify-start w-full">
                            <div className="w-[calc(50%-18px)] h-1 bg-white"></div>
                        </div>

                        <div className="relative w-full flex">
                            <div className="flex flex-col items-start">
                                <div className="h-[400px] w-1 bg-white"></div>

                                <div className="flex flex-col min-w-full w-full">
                                    <div className="w-[30%] h-1 bg-white absolute top-1/2"></div>
                                    <div className="w-[30%] h-1 bg-white absolute"></div>

                                    <div className="absolute top-[28%] right-0">
                                        <div
                                            className="bg-gradient-to-r from-[#DDB40C] to-[#D18B0A] w-90 h-48 flex items-center justify-between rounded-l-4xl gap-4"
                                            onClick={() => router.push("/login/company")}
                                            style={{ cursor: "pointer" }}
                                        >
                                            <h6 className="text-center text-5xl ml-5">...company</h6>
                                            <Image className="w-24 mr-5" src={Company || "/placeholder.svg"} alt={"Company Icon"} />
                                        </div>
                                    </div>

                                    <div className="absolute top-[78%] right-0">
                                        <div
                                            className="bg-gradient-to-r from-[#DB134C] to-[#A31113] w-90 h-48 flex items-center justify-between rounded-l-4xl gap-4"
                                            onClick={() => router.push("/login/content-creator")}
                                            style={{ cursor: "pointer" }}
                                        >
                                            <h6 className="text-center text-5xl ml-5">...content creator</h6>
                                            <Image className="w-24 mr-5" src={ContentCreator || "/placeholder.svg"} alt={"Company Icon"} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
                <Footer />
            </>
        )
    }

    return (
        <>
            <Navbar />
            <main className="max-w-7xl mx-auto min-h-screen mt-60 flex flex-col items-center px-8">
                <h1 className="text-5xl w-[450px] text-center">before you can start we need to know whether you are a...</h1>
                <div className="relative mt-16 flex flex-col items-center justify-center w-full">
                    <div className="size-6 bg-white rounded-full"></div>
                    <div className="h-[200px] w-1 bg-white"></div>
                    <div className="w-3/12 h-1 bg-white"></div>
                    <div className="flex justify-between items-center w-full relative">
                        <div className="absolute">
                            <div
                                className="bg-gradient-to-r from-[#DDB40C] to-[#D18B0A] w-96 h-64 flex flex-col items-center justify-center rounded-lg"
                                onClick={() => router.push("/login/company")}
                                style={{ cursor: "pointer" }}
                            >
                                <Image className="" src={Company || "/placeholder.svg"} alt={"Company Icon"} />
                                <h6 className="text-center text-5xl">...company</h6>
                            </div>
                        </div>
                        <div className="absolute right-0">
                            <div
                                className="bg-gradient-to-r from-[#DB134C] to-[#A31113] w-96 h-64 flex flex-col items-center justify-center rounded-lg"
                                onClick={() => router.push("/login/content-creator")}
                                style={{ cursor: "pointer" }}
                            >
                                <Image className="" src={ContentCreator || "/placeholder.svg"} alt={"Content Creator Icon"} />
                                <h6 className="text-center text-5xl">...content creator</h6>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    )
}

