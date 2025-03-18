"use client"

import { useState, useEffect } from "react"
import { Navbar } from "@/app/components/Navbar"
import Link from "next/link"
import { motion } from "framer-motion"
import { Footer } from "@/app/components/Footer"

const partners = [
    "red",
    "green",
    "yellow",
    "red",
    "green",
    "yellow",
    "red",
    "green",
    "yellow",
    "red",
    "green",
    "yellow",
]

export default function Home() {
    const [isMobile, setIsMobile] = useState(false)

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
                <main className="max-w-7xl mx-auto px-4">
                    <div className="flex flex-col justify-between items-center mt-24">
                        <div className="max-w-[400px]">
                            <h1 className="text-7xl">finding cooperations was never that easy before</h1>
                            <div className="max-w-[500px]">
                                <p className="text-3xl text-center text-white">
                                    Connect your socials, find the cooperations that suit you the most, and you are ready to go. It
                                    doesn&#39;t matter if you are a content creator or a company.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="w-full mt-24 relative">
                        <div className="flex justify-center relative z-10">
                            <Link href="/select-role">
                                <button className="text-5xl bg-red-600 px-4 py-2 rounded-lg text-white">Sign up for free</button>
                            </Link>
                        </div>

                        <div className="w-full flex justify-center">
                            <div className="flex w-full">
                                <div className="w-1/2"></div>
                                <div className="w-1/2 pr-4">
                                    <div className="h-1 bg-white -mt-8 w-full"></div>
                                </div>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="flex justify-end pr-4">
                                <div className="h-20 w-1 bg-white -mt-8"></div>
                            </div>

                            <div className="absolute top-1/4 left-0 right-0 px-4 md:px-8 lg:px-12">
                                <div className="flex flex-col md:flex-row items-center justify-between gap-8"></div>
                            </div>
                        </div>

                        <div className="relative">
                            <div className="pr-4">
                                <div className="w-full h-1 bg-white"></div>
                            </div>

                            <div className="absolute left-4 translate-y-1/8 w-full h-full">
                                <div className="flex justify-end gap-8">
                                    <div className="bg-gradient-to-r from-[#DDB40C] to-[#D18B0A] w-[365px] h-[200px] rounded-l-lg"></div>
                                </div>
                            </div>

                            <div className="flex justify-start mt-8">
                                <div className="h-[270px] w-1 bg-white -mt-8"></div>
                            </div>

                            <div className="flex justify-start mt-8">
                                <div className="w-full h-1 bg-white -mt-8"></div>
                            </div>
                        </div>

                        <div className="relative">
                            <div className="flex justify-end -mt-8">
                                <div className="bg-white w-1 h-96"></div>
                            </div>
                            <div className="">
                                <div className="absolute top-1/12 left-0 right-0 px-4">
                                    <div className="flex flex-col">
                                        <p className="max-w-64 text-4xl">connect with companies from all over the world</p>
                                    </div>
                                </div>
                                <div className="absolute right-4 top-28 w-full h-full">
                                    <div className="flex justify-start items-center">
                                        <div className="bg-gradient-to-r from-[#1390B1] to-[#1357B1] w-[365px] h-[250px] rounded-r-lg shrink-0"></div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white w-full h-1"></div>
                        </div>

                        <div className="relative">
                            <div className="flex justify-start">
                                <div className="bg-white w-1 h-[330px]"></div>
                            </div>

                            <div className="">
                                <div className="absolute top-4 left-0 right-0 px-4">
                                    <div className="flex justify-end w-full">
                                        <p className="max-w-64 text-4xl text-left ml-auto">
                                            choose from a big variety of cooperation offers
                                        </p>
                                    </div>
                                </div>

                                <div className="absolute left-4 top-24 w-full">
                                    <div className="flex justify-end gap-8">
                                        <div className="bg-gradient-to-r from-[#DB134C] to-[#A31113] w-[365px] h-[200px] rounded-l-lg"></div>
                                    </div>
                                    <div className="flex items-center justify-between max-w-[250px] ml-auto mr-20">
                                        <div>
                                            <Link href="">
                                                <p className="underline text-[#4C4C4C] text-3xl">learn more</p>
                                            </Link>
                                        </div>
                                        <div>
                                            <Link href="">
                                                <p className="underline text-[#4C4C4C] text-3xl">partners</p>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-start pr-4">
                                <div className="size-6 bg-white flex justify-start rounded-full absolute bottom-0 -translate-x-2.5"></div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-4 w-full overflow-hidden">
                        <h1 className="text-5xl mb-4 text-left">Our Partners:</h1>
                        <div className="relative w-full">
                            <motion.div
                                className="flex space-x-6 whitespace-nowrap"
                                animate={{
                                    x: ["0%", "-50%"],
                                }}
                                transition={{
                                    ease: "linear",
                                    duration: 10,
                                    repeat: Number.POSITIVE_INFINITY,
                                }}
                            >
                                {[...partners, ...partners].map((color, index) => (
                                    <div key={index} className="min-w-[50px] h-[50px] rounded-lg" style={{ backgroundColor: color }} />
                                ))}
                            </motion.div>
                        </div>
                    </div>

                    <div className="relative mt-10">
                        <div className="flex justify-end">
                            <div className="bg-white rounded-full size-6"></div>
                        </div>
                        <div className="flex justify-end pr-2.5">
                            <div className="h-32 w-1 bg-white"></div>
                        </div>
                        <div className="pr-2.5">
                            <div className="w-full h-1 bg-white"></div>
                        </div>
                    </div>
                    <div className="relative">
                        <div className="flex justify-start">
                            <div className="bg-white h-[555px] w-1"></div>
                        </div>

                        <div className="absolute top-1 right-1/2 left-1/2">
                            <div className="flex justify-center items-center text-5xl whitespace-nowrap">
                                <h1>a content creator</h1>
                            </div>
                            <div className="space-y-10 flex flex-col items-center justify-center">
                                <div className="bg-gradient-to-r from-[#DDB40C] to-[#D18B0A] w-[250px] h-[130px] rounded-lg"></div>
                                <div className="bg-gradient-to-r from-[#1390B1] to-[#1357B1] w-[250px] h-[130px] rounded-lg"></div>
                                <div className="bg-gradient-to-r from-[#DB134C] to-[#A31113] w-[250px] h-[130px] rounded-lg"></div>
                            </div>
                        </div>
                    </div>
                    <div className="w-full h-1 bg-white"></div>
                    <div className="relative">
                        <div className="flex justify-end">
                            <div className="bg-white h-[555px] w-1"></div>
                        </div>

                        <div className="absolute top-1 right-1/2 left-1/2">
                            <div className="flex justify-center items-center text-5xl whitespace-nowrap">
                                <h1>a company</h1>
                            </div>
                            <div className="space-y-10 flex flex-col items-center justify-center">
                                <div className="bg-gradient-to-r from-[#DDB40C] to-[#D18B0A] w-[250px] h-[130px] rounded-lg"></div>
                                <div className="bg-gradient-to-r from-[#1390B1] to-[#1357B1] w-[250px] h-[130px] rounded-lg"></div>
                                <div className="bg-gradient-to-r from-[#DB134C] to-[#A31113] w-[250px] h-[130px] rounded-lg"></div>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <div className="flex justify-end">
                            <div className="w-1/2 bg-white h-1"></div>
                        </div>
                        <div className="flex justify-center">
                            <div className="h-20 w-1 -mt-1 bg-white"></div>
                        </div>
                    </div>
                    <div className="mt-4 w-full">
                        <h1 className="text-5xl text-center">
                            ...choose of a varietey of offers and explore the world of cooperations and partnerships with Phamesh
                        </h1>
                    </div>
                    <div className="mt-4 flex justify-center items-center mb-10">
                        <Link href="">
                            <button className="text-4xl py-1 px-4 bg-red-600 text-white rounded-lg">start today</button>
                        </Link>
                    </div>
                </main>
                <Footer />
            </>
        )
    }

    return (
        <>
            <Navbar />
            <main className="max-w-7xl mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-center mt-24">
                    <div className="max-w-[350px]">
                        <h1 className="text-7xl">Cooperations was never that easy before</h1>
                        <p className="text-3xl text-white">
                            Connect your socials, find the cooperations that suit you the most, and you are ready to go. It
                            doesn&#39;t matter if you are a content creator or a company.
                        </p>
                    </div>
                    <div className="hidden md:block bg-gradient-to-r from-[#DDB40C] to-[#D18B0A] md:w-[475px] md:h-[365px] md:rounded-lg"></div>
                </div>

                <div className="w-full mt-24 relative">
                    <div className="flex justify-center relative z-10">
                        <Link href="/select-role">
                            <button className="text-5xl bg-red-600 px-4 py-2 rounded-lg text-white">Sign up for free</button>
                        </Link>
                    </div>

                    <div className="w-full flex justify-center">
                        <div className="flex w-full">
                            <div className="w-1/2"></div>
                            <div className="w-1/2 pr-4">
                                <div className="h-1 bg-white -mt-8 w-full"></div>
                            </div>
                        </div>
                    </div>

                    <div className="relative">
                        <div className="flex justify-end pr-4">
                            <div className="h-[800px] w-1 bg-white -mt-8"></div>
                        </div>

                        <div className="absolute top-1/4 left-0 right-0 px-4 md:px-8 lg:px-12">
                            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                                <div className="order-1 bg-gradient-to-r from-[#1390B1] to-[#1357B1] w-full md:w-[475px] h-[365px] rounded-lg shrink-0"></div>
                                <div className="order-2 max-w-[350px]">
                                    <h1 className="text-4xl">Connect with companies from all over the world</h1>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="relative pl-4">
                        <div className="flex pr-4 pt-8">
                            <div className="h-1 w-full bg-white -mt-8"></div>
                        </div>

                        <div className="absolute top-1/4 left-0 right-0 px-4 md:px-8 lg:px-12">
                            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                                <div className="order-2 bg-gradient-to-r from-[#DB134C] to-[#A31113] w-full md:w-[475px] h-[365px] rounded-lg shrink-0"></div>
                                <div className="order-1 max-w-[350px]">
                                    <h1 className="text-4xl">Choose from a big variety of cooperation offers</h1>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-start pr-4">
                            <div className="h-[800px] w-1 bg-white -mt-8"></div>
                            <div className="size-6 bg-white flex justify-start rounded-full absolute bottom-0 -translate-x-2.5"></div>
                        </div>
                    </div>
                </div>
                <div className="mt-4 w-full overflow-hidden">
                    <h1 className="text-5xl mb-4 text-left">Our Partners:</h1>
                    <div className="relative w-full">
                        <motion.div
                            className="flex space-x-6 whitespace-nowrap"
                            animate={{
                                x: ["0%", "-50%"],
                            }}
                            transition={{
                                ease: "linear",
                                duration: 10,
                                repeat: Number.POSITIVE_INFINITY,
                            }}
                        >
                            {[...partners, ...partners].map((color, index) => (
                                <div key={index} className="min-w-[50px] h-[50px] rounded-lg" style={{ backgroundColor: color }} />
                            ))}
                        </motion.div>
                    </div>
                </div>

                <div className="relative pr-4 mt-8">
                    <div className="flex justify-end">
                        <div className="size-6 bg-white rounded-lg"></div>
                    </div>
                    <div className="absolute w-full top-1/3">
                        <div className="flex justify-center items-center">
                            <p className="text-5xl">it doesn&#39;t matter whether you are...</p>
                        </div>
                    </div>
                    <div className="flex justify-end pr-2.5 mt-4">
                        <div className="h-[200px] w-1 bg-white -mt-8"></div>
                    </div>
                    <div className="pr-2.5 flex justify-end">
                        <div className="h-1 w-[calc(50%-12px)] bg-white"></div>
                    </div>
                </div>

                <div className="relative flex justify-center -mt-1">
                    {/* Mittlere Linie */}
                    <div className="h-[1500px] w-1 bg-white mx-10"></div>

                    <div className="absolute max-w-7xl mx-auto w-full mt-10">
                        <div className="flex justify-between items-start w-full">
                            {/* Linke Seite */}
                            <div className="flex-1 flex flex-col items-center space-y-10">
                                <h2 className="text-6xl">...a company</h2>
                                <div className="bg-gradient-to-r from-[#DDB40C] to-[#D18B0A] w-[430px] h-[300px] rounded-lg"></div>
                                <div className="space-y-40 mt-20">
                                    <div className="bg-gradient-to-r from-[#1390B1] to-[#1357B1] w-[430px] h-[300px] rounded-lg"></div>
                                    <div className="bg-gradient-to-r from-[#DB134C] to-[#A31113] w-[430px] h-[300px] rounded-lg"></div>
                                </div>
                            </div>

                            {/* Rechte Seite */}
                            <div className="flex-1 flex flex-col items-center space-y-10">
                                <h2 className="text-6xl">...a content creator</h2>
                                <div className="bg-gradient-to-r from-[#DDB40C] to-[#D18B0A] w-[430px] h-[300px] rounded-lg"></div>
                                <div className="space-y-40 mt-20">
                                    <div className="bg-gradient-to-r from-[#1390B1] to-[#1357B1] w-[430px] h-[300px] rounded-lg"></div>
                                    <div className="bg-gradient-to-r from-[#DB134C] to-[#A31113] w-[430px] h-[300px] rounded-lg"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col justify-center items-center mt-10">
                    <h1 className="text-7xl max-w-3xl text-center">
                        ...choose of a varietey of offers and explore the world of cooperations and partnerships with Phamesh
                    </h1>
                    <Link href="">
                        <button className="text-5xl mt-10 mb-44 px-8 py-2 bg-red-600 rounded-lg text-white">start today</button>
                    </Link>
                </div>
            </main>
            <Footer />
        </>
    )
}

