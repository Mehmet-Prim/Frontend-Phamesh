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

    // Neue Funktionen für die Weiterleitung mit Rollenparameter
    const handleCompanySelect = () => {
        // Zur einheitlichen Registrierungsseite mit Rollenparameter weiterleiten
        router.push("/register?role=COMPANY")
    }

    const handleContentCreatorSelect = () => {
        // Zur einheitlichen Registrierungsseite mit Rollenparameter weiterleiten
        router.push("/register?role=CONTENT_CREATOR")
    }

    if (isMobile) {
        return (
            <>
                <div className="dark:bg-[#161616] bg-[#F2EFE7]">
                    <Navbar />
                    <main className="max-w-7xl mx-auto mb-24 mt-24 px-4 sm:px-6 lg:px-8 min-h-screen">
                        <div className="flex flex-col items-center justify-center text-center mb-20">
                            <h1 className="text-3xl sm:text-4xl font-bold text-black dark:text-white mb-6">
                                Before you can start, we need to know whether you are a...
                            </h1>
                        </div>

                        <div className="space-y-12">
                            {/* Company Card */}
                            <div className="relative flex justify-start -left-10">
                                <div className="relative flex items-center justify-center">
                                    <div className="blur-lg absolute w-[300px] h-[200px] bg-gradient-to-br from-[#DDB40C] to-[#EA6907] border-2 border-white rounded-lg"></div>
                                    <div className="blur-xs absolute w-[290px] h-[190px] bg-white rounded-lg"></div>
                                    <div
                                        className="w-72 h-48 bg-gradient-to-br from-[#DDB40C] to-[#EA6907] rounded-lg relative flex flex-col items-center justify-center shadow-2xl hover:shadow-3xl transition-shadow duration-300"
                                        onClick={handleCompanySelect}
                                        style={{ cursor: "pointer" }}
                                    >
                                        <Image
                                            className="mb-3"
                                            src={Company || "/placeholder.svg"}
                                            alt={"Company Icon"}
                                            width={60}
                                            height={60}
                                        />
                                        <h6 className="text-center text-2xl font-semibold text-white">...company</h6>
                                    </div>
                                </div>
                            </div>

                            {/* Content Creator Card */}
                            <div className="relative flex justify-end -right-10">
                                <div className="relative flex items-center justify-center">
                                    <div className="blur-lg absolute w-[300px] h-[200px] bg-gradient-to-br from-[#DB134C] to-[#7B0A2A] border-2 border-white rounded-lg"></div>
                                    <div className="blur-xs absolute w-[290px] h-[190px] bg-white rounded-lg"></div>
                                    <div
                                        className="w-72 h-48 bg-gradient-to-br from-[#DB134C] to-[#7B0A2A] rounded-lg relative flex flex-col items-center justify-center shadow-2xl hover:shadow-3xl transition-shadow duration-300"
                                        onClick={handleContentCreatorSelect}
                                        style={{ cursor: "pointer" }}
                                    >
                                        <Image
                                            className="mb-3"
                                            src={ContentCreator || "/placeholder.svg"}
                                            alt={"Content Creator Icon"}
                                            width={60}
                                            height={60}
                                        />
                                        <h6 className="text-center text-2xl font-semibold text-white">...content creator</h6>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </main>
                    <Footer />
                </div>
            </>
        )
    }

    return (
        <>
            <div className="dark:bg-[#161616] bg-[#F2EFE7]">
                <Navbar />
                <main className="max-w-7xl mx-auto min-h-screen mt-60 flex flex-col items-center px-8">
                    <h1 className="text-5xl text-center dark:text-white">
                        before you can start we <br /> need to know whether you are a...
                    </h1>
                    <div className="relative mt-16 flex flex-col items-center justify-center w-full">
                        <div className="size-6 bg-black rounded-full dark:bg-[#F2EFE7]"></div>
                        <div className="h-[200px] w-1 bg-black dark:bg-[#F2EFE7]"></div>
                        <div className="w-3/12 h-1 bg-black dark:bg-[#F2EFE7]"></div>
                        <div className="flex justify-between items-center w-full relative">
                            <div className="absolute">
                                <div className="relative flex items-center justify-center">
                                    <div className="blur-lg absolute w-[404px] h-[276px] bg-gradient-to-br from-[#DDB40C] to-[#EA6907] border-2 border-white rounded-lg"></div>
                                    <div className="blur-xs absolute w-[394px] h-[266px] bg-white rounded-lg"></div>
                                    <div
                                        className=" w-96 h-64 bg-gradient-to-br from-[#DDB40C] to-[#EA6907] rounded-lg relative flex flex-col items-center justify-center shadow-xl"
                                        onClick={handleCompanySelect}
                                        style={{ cursor: "pointer" }}
                                    >
                                        <Image className="" src={Company || "/placeholder.svg"} alt={"Company Icon"} />
                                        <h6 className="text-center text-3xl text-white">...company</h6>
                                    </div>
                                </div>
                            </div>
                            <div className="absolute right-0">
                                <div className="relative flex items-center justify-center">
                                    <div className="blur-lg absolute w-[404px] h-[276px] bg-gradient-to-br from-[#DB134C] to-[#7B0A2A] border-2 border-white rounded-lg"></div>
                                    <div className="blur-xs absolute w-[394px] h-[266px] bg-white rounded-lg"></div>
                                    <div
                                        className=" w-96 h-64 bg-gradient-to-br from-[#DB134C] to-[#7B0A2A] rounded-lg relative flex flex-col items-center justify-center shadow-xl"
                                        onClick={handleContentCreatorSelect}
                                        style={{ cursor: "pointer" }}
                                    >
                                        <Image className="" src={ContentCreator || "/placeholder.svg"} alt={"Content Creator Icon"} />
                                        <h6 className="text-center text-3xl text-white">...content creator</h6>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        </>
    )
}

