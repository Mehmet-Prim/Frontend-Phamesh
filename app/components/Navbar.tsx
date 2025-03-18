"use client"

import { useState, useEffect } from "react"
import Logo from "@/public/Logo.png"
import Link from "next/link"
import Image from "next/image"
import { Menu, X } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import { ThemeToggle } from "./ThemeToggle"
import { getUserRole, getAuthToken } from "@/lib/api"

export function Navbar() {
    const [nav, setNav] = useState(false)
    const { user, logout, isAuthenticated } = useAuth()
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [userRoleState, setUserRoleState] = useState<string | null>(null)

    // Überprüfen Sie den Authentifizierungsstatus bei jedem Rendern
    useEffect(() => {
        const checkAuthStatus = () => {
            const token = getAuthToken()
            const role = getUserRole()
            console.log("Navbar auth check - Token:", !!token, "Role:", role)
            setIsLoggedIn(!!token)
            setUserRoleState(role)
        }

        checkAuthStatus()

        // Überprüfen Sie den Status auch, wenn das Fenster den Fokus erhält
        window.addEventListener("focus", checkAuthStatus)
        return () => {
            window.removeEventListener("focus", checkAuthStatus)
        }
    }, [isAuthenticated, user])

    const handleNav = () => {
        setNav(!nav)
    }

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) {
                setNav(false)
            }
        }

        window.addEventListener("resize", handleResize)

        return () => {
            window.removeEventListener("resize", handleResize)
        }
    }, [])

    // Bestimmen Sie das richtige Dashboard basierend auf der Rolle
    const getDashboardLink = () => {
        const role = userRoleState?.toUpperCase() || ""
        if (role.includes("COMPANY")) {
            return "/dashboard/company"
        } else if (role.includes("CONTENT_CREATOR")) {
            return "/dashboard/content-creator"
        }
        return "/dashboard" // Fallback
    }

    return (
        <div className="bg-[#A7A7A7] z-[50] sticky top-0">
            <header className="relative flex justify-between items-center h-24 max-w-7xl mx-auto px-4">
                <Link href="/">
                    <Image src={Logo || "/placeholder.svg"} alt="Phamesh Logo" className="h-16 w-auto" priority />
                </Link>

                <ul className="hidden md:flex items-center">
                    <li className="p-4 text-4xl">
                        <Link href="/" className="hover:text-gray-700 transition-colors">
                            home
                        </Link>
                    </li>
                    <li className="p-4 text-4xl">
                        <Link href="/services" className="hover:text-gray-700 transition-colors">
                            services
                        </Link>
                    </li>
                    <li className="p-4 text-4xl">
                        <Link href="/news" className="hover:text-gray-700 transition-colors">
                            news
                        </Link>
                    </li>
                    <li className="p-4 text-4xl">
                        <Link href="/about" className="hover:text-gray-700 transition-colors">
                            about
                        </Link>
                    </li>
                    <li className="p-4 text-4xl">
                        <Link href="/contact" className="hover:text-gray-700 transition-colors">
                            contact
                        </Link>
                    </li>
                    <li className="p-4">
                        <ThemeToggle />
                    </li>
                    <li className="p-4 text-4xl">
                        {isLoggedIn ? (
                            <div className="flex items-center gap-4">
                                <Link href={getDashboardLink()} className="hover:text-gray-700 transition-colors">
                                    Dashboard
                                </Link>
                                <button
                                    onClick={logout}
                                    className="bg-red-600 px-4 py-1 text-white rounded-lg hover:bg-red-700 transition-colors"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <Link href="/select-role">
                                <button className="bg-cyan-600 px-4 py-1 text-white rounded-lg hover:bg-cyan-700 transition-colors">
                                    Try Phamesh
                                </button>
                            </Link>
                        )}
                    </li>
                </ul>

                <div className="flex items-center gap-5 md:hidden">
                    <ThemeToggle />
                    {isLoggedIn ? (
                        <Link href={getDashboardLink()}>
                            <button className="text-4xl bg-cyan-600 px-4 py-1 text-white rounded-lg">Dashboard</button>
                        </Link>
                    ) : (
                        <Link href="/select-role">
                            <button className="text-4xl bg-cyan-600 px-4 py-1 text-white rounded-lg">Try Phamesh</button>
                        </Link>
                    )}
                    <div onClick={handleNav} className="z-20 cursor-pointer">
                        {nav ? <X size={30} /> : <Menu size={30} />}
                    </div>
                </div>

                <div
                    className={`${
                        nav
                            ? "fixed left-0 top-0 w-[75%] sm:w-[60%] md:w-[40%] h-full bg-[#616161] border-r border-gray-900 ease-in-out duration-500 z-30"
                            : "fixed left-[-100%]"
                    }`}
                >
                    <div className="flex justify-between items-center p-4">
                        <Image src={Logo || "/placeholder.svg"} alt="Phamesh Logo" className="h-16 w-auto" />
                        <button onClick={handleNav} className="p-2">
                            <X size={30} />
                        </button>
                    </div>
                    <ul className="p-4">
                        <li className="p-4 text-4xl border-b border-gray-600 cursor-pointer">
                            <Link href="/" onClick={handleNav}>
                                home
                            </Link>
                        </li>
                        <li className="p-4 text-4xl border-b border-gray-600 cursor-pointer">
                            <Link href="/services" onClick={handleNav}>
                                services
                            </Link>
                        </li>
                        <li className="p-4 text-4xl border-b border-gray-600 cursor-pointer">
                            <Link href="/news" onClick={handleNav}>
                                news
                            </Link>
                        </li>
                        <li className="p-4 text-4xl border-b border-gray-600 cursor-pointer">
                            <Link href="/about" onClick={handleNav}>
                                about
                            </Link>
                        </li>
                        <li className="p-4 text-4xl border-b border-gray-600 cursor-pointer">
                            <Link href="/contact" onClick={handleNav}>
                                contact
                            </Link>
                        </li>
                        {isLoggedIn && (
                            <>
                                <li className="p-4 text-4xl border-b border-gray-600 cursor-pointer">
                                    <Link href={getDashboardLink()} onClick={handleNav}>
                                        Dashboard
                                    </Link>
                                </li>
                                <li className="p-4 text-4xl border-b border-gray-600 cursor-pointer">
                                    <button onClick={logout} className="text-red-300">
                                        Logout
                                    </button>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </header>
        </div>
    )
}

