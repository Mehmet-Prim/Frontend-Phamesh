"use client"

import Image from "next/image"
import Logo from "@/public/LogoVoll.png"
import Link from "next/link"

export function Footer() {
    return (
        <>
            <footer className="w-full px-4 sm:px-6 md:px-10 py-6 bg-[#D0C9C1] dark:bg-[#363636] md:rounded-full rounded-[5rem] mx-auto lg:px-8 max-w-7xl">
                <div className="flex flex-row justify-between items-center gap-8 max-w-5xl mx-auto">
                    {/* Left Side - Logo */}
                    <div className="flex flex-col items-center md:items-start justify-end">
                        <Image src={Logo || "/placeholder.svg"} alt="Phamesh Logo" className="h-16 sm:h-20 w-auto" />
                        <p className="text-sm mt-2 dark:text-[#9A9A9A]">© {new Date().getFullYear()} Phamesh.inc</p>
                    </div>

                    {/* Middle Section - Navigation */}
                    <div className="md:flex flex-col sm:flex-row space-y-6 sm:space-y-0 sm:space-x-6 md:space-x-12 hidden text-black">
                        {/* Products */}
                        <div className="text-center sm:text-left">
                            <h3 className="text-[#454545] dark:text-[#9A9A9A] font-medium">products</h3>
                            <ul className="space-y-1 mt-2">
                                <li>
                                    <Link href="" className="dark:text-[#F2EFE7]">
                                        pricing
                                    </Link>
                                </li>
                                <li>
                                    <Link href="" className="dark:text-[#F2EFE7]">
                                        news
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Company */}
                        <div className="text-center sm:text-left sm:border-l sm:border-black sm:dark:border-[#F2EFE7] sm:pl-4">
                            <h3 className="text-[#454545] dark:text-[#9A9A9A] font-medium">company</h3>
                            <ul className="space-y-1 mt-2">
                                <li>
                                    <Link href="" className="dark:text-[#F2EFE7]">
                                        about us
                                    </Link>
                                </li>
                                <li>
                                    <Link href="" className="dark:text-[#F2EFE7]">
                                        terms
                                    </Link>
                                </li>
                                <li>
                                    <Link href="" className="dark:text-[#F2EFE7]">
                                        privacy
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Resources */}
                        <div className="text-center sm:text-left sm:border-l sm:border-black sm:dark:border-[#F2EFE7] sm:pl-4">
                            <h3 className="text-[#454545] dark:text-[#9A9A9A] font-medium">resources</h3>
                            <ul className="space-y-1 mt-2">
                                <li>
                                    <Link href="" className="dark:text-[#F2EFE7]">
                                        tutorials
                                    </Link>
                                </li>
                                <li>
                                    <Link href="" className="dark:text-[#F2EFE7]">
                                        help center
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Right Side - Buttons */}
                    <div className="flex flex-col space-x-3 space-y-3">
                        <Link href="/">
                            <button className="bg-[#3282B8] text-white px-4 sm:px-6 py-1 rounded-md text-sm sm:text-base text-nowrap">
                                Sign in
                            </button>
                        </Link>
                        <Link href="/">
                            <button className="bg-[#C21F39] text-white px-5 sm:px-[30px] py-1 rounded-md text-sm sm:text-base">
                                log in
                            </button>
                        </Link>
                    </div>
                </div>

                {/* Middle Section - Navigation */}
                <div className="grid grid-cols-3 gap-2 sm:gap-4 text-black md:hidden justify-items-center mt-5 mb-5">
                    {/* Products */}
                    <div className="text-left border-l border-black dark:border-[#F2EFE7] pl-2 sm:pl-4">
                        <h3 className="text-[#454545] dark:text-[#9A9A9A] font-medium text-sm sm:text-base">products</h3>
                        <ul className="space-y-1 mt-1 sm:mt-2">
                            <li>
                                <Link href="" className="dark:text-[#F2EFE7] text-xs sm:text-sm">
                                    pricing
                                </Link>
                            </li>
                            <li>
                                <Link href="" className="dark:text-[#F2EFE7] text-xs sm:text-sm">
                                    news
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Company */}
                    <div className="text-left border-l border-black dark:border-[#F2EFE7] pl-2 sm:pl-4">
                        <h3 className="text-[#454545] dark:text-[#9A9A9A] font-medium text-sm sm:text-base">company</h3>
                        <ul className="space-y-1 mt-1 sm:mt-2">
                            <li>
                                <Link href="" className="dark:text-[#F2EFE7] text-xs sm:text-sm">
                                    about us
                                </Link>
                            </li>
                            <li>
                                <Link href="" className="dark:text-[#F2EFE7] text-xs sm:text-sm">
                                    terms
                                </Link>
                            </li>
                            <li>
                                <Link href="" className="dark:text-[#F2EFE7] text-xs sm:text-sm">
                                    privacy
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Resources */}
                    <div className="text-left border-l border-black dark:border-[#F2EFE7] pl-2 sm:pl-4">
                        <h3 className="text-[#454545] dark:text-[#9A9A9A] font-medium text-sm sm:text-base">resources</h3>
                        <ul className="space-y-1 mt-1 sm:mt-2">
                            <li>
                                <Link href="" className="dark:text-[#F2EFE7] text-xs sm:text-sm">
                                    tutorials
                                </Link>
                            </li>
                            <li>
                                <Link href="" className="dark:text-[#F2EFE7] text-xs sm:text-sm">
                                    help center
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Section - Additional Links */}
                <div className="flex justify-center items-center max-w-7xl mt-6 md:mt-5">
                    <ul className="flex flex-row items-center justify-center space-x-4 space-y-0 md:space-x-12">
                        <li>
                            <Link href="" className="text-[#454545] dark:text-[#9A9A9A] text-sm">
                                privacy hub
                            </Link>
                        </li>
                        <li>
                            <Link href="" className="text-[#454545] dark:text-[#9A9A9A] text-sm">
                                disclaimer
                            </Link>
                        </li>
                        <li>
                            <Link href="" className="text-[#454545] dark:text-[#9A9A9A] text-sm">
                                return policy
                            </Link>
                        </li>
                    </ul>
                </div>
            </footer>
        </>
    )
}

