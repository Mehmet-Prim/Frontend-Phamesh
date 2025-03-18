"use client"

import Image from "next/image"
import Logo from "@/public/LogoVoll.png"
import LogoKlein from "@/public/Logo.png"
import Link from "next/link"
import { useEffect, useState } from "react"

export function Footer() {
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
                <div className="bg-[#A7A7A7] py-12 w-full">
                    <footer className="max-w-7xl mx-auto px-6 lg:px-8">
                        <div className="flex flex-row justify-between items-center gap-8">
                            {/* Logo Section */}
                            <div className="flex flex-col items-center md:items-start space-y-4">
                                <Image
                                    src={LogoKlein || "/placeholder.svg"}
                                    alt="Phamesh Logo"
                                    className="h-16 w-auto transition-opacity hover:opacity-80"
                                />
                                <p className="text-2xl text-[#454545] font-light text-nowrap">
                                    © {new Date().getFullYear()} Phamesh.inc
                                </p>
                            </div>

                            {/* Navigation Links */}
                            <nav className="flex flex-row gap-6 md:gap-12 text-center">
                                <div className="space-y-2">
                                    <Link href="/" className="group inline-block">
                                        <h2 className="text-4xl text-[#454545] hover:text-black transition-colors font-medium">Home</h2>
                                    </Link>
                                </div>

                                <div className="space-y-2">
                                    <Link href="/" className="group inline-block">
                                        <h2 className="text-4xl text-[#454545] hover:text-black transition-colors font-medium">Products</h2>
                                    </Link>
                                </div>

                                <div className="space-y-2">
                                    <Link href="/" className="group inline-block">
                                        <h2 className="text-4xl text-[#454545] hover:text-black transition-colors font-medium">Company</h2>
                                    </Link>
                                </div>
                            </nav>
                        </div>

                        {/* Bottom Copyright */}
                        <div className="mt-12 border-t border-[#909090] pt-8 text-center">
                            <p className="text-2xl text-[#454545]">All rights reserved | Terms of Service | Privacy Policy</p>
                        </div>
                    </footer>
                </div>
            </>
        )
    }

    return (
        <div className="bg-[#A7A7A7] h-64 w-full flex flex-col justify-center items-center">
            <footer className="max-w-7xl w-full flex justify-between items-center px-6">
                {/* Linke Seite - Logo */}
                <div className="flex flex-col items-start">
                    <Image src={Logo || "/placeholder.svg"} alt="Phamesh Logo" className="h-20 w-auto" />
                    <p className="text-2xl text-black mt-2">© {new Date().getFullYear()} Phamesh.inc</p>
                </div>

                {/* Mittlerer Bereich - Navigation */}
                <div className="flex space-x-12 text-black">
                    {/* Products */}
                    <div>
                        <h3 className="text-4xl text-[#454545]">products</h3>
                        <ul className="space-y-1">
                            <li>
                                <Link href="" className="text-4xl">
                                    pricing
                                </Link>
                            </li>
                            <li>
                                <Link href="" className="text-4xl">
                                    news
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Company */}
                    <div className="border-l border-black pl-4">
                        <h3 className="text-4xl text-[#454545]">company</h3>
                        <ul className="space-y-1">
                            <li>
                                <Link href="" className="text-4xl">
                                    about us
                                </Link>
                            </li>
                            <li>
                                <Link href="" className="text-4xl">
                                    terms
                                </Link>
                            </li>
                            <li>
                                <Link href="" className="text-4xl">
                                    privacy
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Resources */}
                    <div className="border-l border-black pl-4">
                        <h3 className="text-4xl text-[#454545]">resources</h3>
                        <ul className="space-y-1">
                            <li>
                                <Link href="" className="text-4xl">
                                    tutorials
                                </Link>
                            </li>
                            <li>
                                <Link href="" className="text-4xl">
                                    help center
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Rechte Seite - Buttons */}
                <div className="flex flex-col space-y-5">
                    <Link href="/">
                        <button className="bg-[#3282B8] text-white px-6 py-1 rounded-md text-4xl">Sign in</button>
                    </Link>
                    <Link href="/">
                        <button className="bg-[#C21F39] text-white px-[30px] py-1 rounded-md text-4xl">log in</button>
                    </Link>
                </div>
            </footer>
            <div className="flex justify-center items-center max-w-7xl">
                <ul className="flex items-center justify-center space-x-12 mt-5">
                    <li>
                        <Link href="" className="text-3xl text-[#454545]">
                            privacy hub
                        </Link>
                    </li>
                    <li>
                        <Link href="" className="text-3xl text-[#454545]">
                            disclaimer
                        </Link>
                    </li>
                    <li>
                        <Link href="" className="text-3xl text-[#454545]">
                            return policy
                        </Link>
                    </li>
                </ul>
            </div>
        </div>
    )
}