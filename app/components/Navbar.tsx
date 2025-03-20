"use client"

import { useState, useEffect } from "react"
import Logo from "@/public/Logo.png"
import Link from "next/link"
import Image from "next/image"
import { Menu, X, MessageSquare } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"
import { ThemeToggle } from "./ThemeToggle"
import { getUserRole } from "@/lib/api"
import { getToken } from "@/lib/auth"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useTheme } from "next-themes"
import { Badge } from "@/components/ui/badge"
import { MessageService } from "@/lib/services/message-service"

export function Navbar() {
    const [nav, setNav] = useState(false)
    const { user, logout, isAuthenticated } = useAuth()
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [userRoleState, setUserRoleState] = useState<string | null>(null)
    const [dropdownOpen, setDropdownOpen] = useState(false)
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = useState(false)
    const [unreadCount, setUnreadCount] = useState(0)

    // Set mounted to true after component mounts to avoid hydration mismatch
    useEffect(() => {
        setMounted(true)
    }, [])

    // Überprüfen Sie den Authentifizierungsstatus bei jedem Rendern
    useEffect(() => {
        const checkAuthStatus = async () => {
            const token = getToken()
            const role = await getUserRole() // Hier wird await verwendet
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

    // Lade ungelesene Nachrichten, wenn der Benutzer angemeldet ist
    useEffect(() => {
        if (isLoggedIn && user?.id) {
            const fetchUnreadCount = async () => {
                try {
                    const count = await MessageService.getUnreadCount()
                    setUnreadCount(count)
                } catch (error) {
                    console.error("Error fetching unread count:", error)
                }
            }

            fetchUnreadCount()

            // Abonniere Benutzer-Nachrichten für Aktualisierungen
            const handleNewMessage = () => {
                fetchUnreadCount()
            }

            if (user?.id) {
                MessageService.subscribeToUserMessages(user.id, handleNewMessage)
            }

            return () => {
                if (user?.id) {
                    MessageService.unsubscribeFromUserMessages(user.id)
                }
            }
        }
    }, [isLoggedIn, user])

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

    const toggleTheme = () => {
        setTheme(theme === "dark" ? "light" : "dark")
    }

    return (
        <div className="top-0 z-50 w-full">
            <header className="relative flex flex-wrap justify-between items-center h-auto sm:h-20 md:h-24 max-w-7xl mx-auto px-4 py-2">
                <div className="px-3 sm:px-4 md:px-6 py-1 bg-[#D0CAC1] dark:bg-[#363636] rounded-full flex items-center">
                    <Link href="/">
                        <Image
                            src={Logo || "/placeholder.svg"}
                            alt="Phamesh Logo"
                            className="h-8 sm:h-10 md:h-12 w-auto"
                            priority
                        />
                    </Link>
                </div>

                <div className="hidden md:block px-4 sm:px-6 md:px-8 py-1 bg-[#D0CAC1] dark:bg-[#363636] rounded-full">
                    <ul className="flex items-center space-x-1 lg:space-x-2">
                        <li className="p-2 lg:p-3">
                            <Link
                                href="/"
                                className="text-sm lg:text-base hover:text-gray-700 dark:text-white dark:hover:text-gray-300 transition-colors"
                            >
                                home
                            </Link>
                        </li>
                        <li className="p-2 lg:p-3">
                            <Link
                                href="/services"
                                className="text-sm lg:text-base hover:text-gray-700 dark:text-white dark:hover:text-gray-300 transition-colors"
                            >
                                services
                            </Link>
                        </li>
                        <li className="p-2 lg:p-3">
                            <Link
                                href="/news"
                                className="text-sm lg:text-base hover:text-gray-700 dark:text-white dark:hover:text-gray-300 transition-colors"
                            >
                                news
                            </Link>
                        </li>
                        <li className="p-2 lg:p-3">
                            <Link
                                href="/about"
                                className="text-sm lg:text-base hover:text-gray-700 dark:text-white dark:hover:text-gray-300 transition-colors"
                            >
                                about
                            </Link>
                        </li>
                        <li className="p-2 lg:p-3">
                            <Link
                                href="/contact"
                                className="text-sm lg:text-base hover:text-gray-700 dark:text-white dark:hover:text-gray-300 transition-colors"
                            >
                                contact
                            </Link>
                        </li>
                        {isLoggedIn && (
                            <li className="p-2 lg:p-3">
                                <Link
                                    href="/chat"
                                    className="text-sm lg:text-base hover:text-gray-700 dark:text-white dark:hover:text-gray-300 transition-colors relative"
                                >
                                    <div className="relative">
                                        <MessageSquare className="h-5 w-5" />
                                        {unreadCount > 0 && (
                                            <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs bg-[#DB134C]">
                                                {unreadCount > 9 ? "9+" : unreadCount}
                                            </Badge>
                                        )}
                                    </div>
                                </Link>
                            </li>
                        )}
                        <li className="p-2 lg:p-3">
                            <DropdownMenu onOpenChange={setDropdownOpen}>
                                <DropdownMenuTrigger asChild>
                                    <button className="focus:outline-none dark:text-white">
                                        {dropdownOpen ? <X size={24} /> : <Menu size={24} />}
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56 bg-[#D0CAC1] dark:bg-[#363636] dark:text-white">
                                    <DropdownMenuLabel>Settings</DropdownMenuLabel>
                                    <DropdownMenuSeparator className="dark:bg-gray-600" />
                                    <DropdownMenuGroup>
                                        <DropdownMenuItem
                                            onSelect={(e) => {
                                                e.preventDefault()
                                                toggleTheme()
                                            }}
                                            className="flex items-center justify-between cursor-pointer dark:focus:bg-gray-700 dark:focus:text-white"
                                        >
                                            <span>{mounted && theme === "dark" ? "light mode" : "dark mode"}</span>
                                            <ThemeToggle />
                                        </DropdownMenuItem>
                                    </DropdownMenuGroup>
                                    <DropdownMenuSeparator className="dark:bg-gray-600" />
                                    <DropdownMenuGroup>
                                        <DropdownMenuSub>
                                            <DropdownMenuSubTrigger className="dark:focus:bg-gray-700 dark:focus:text-white">
                                                Products
                                            </DropdownMenuSubTrigger>
                                            <DropdownMenuPortal>
                                                <DropdownMenuSubContent className="bg-[#D0CAC1] dark:bg-[#363636] dark:text-white">
                                                    <DropdownMenuItem className="dark:focus:bg-gray-700 dark:focus:text-white">
                                                        Pricing
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="dark:focus:bg-gray-700 dark:focus:text-white">
                                                        update
                                                    </DropdownMenuItem>
                                                </DropdownMenuSubContent>
                                            </DropdownMenuPortal>
                                        </DropdownMenuSub>
                                    </DropdownMenuGroup>
                                    <DropdownMenuSeparator className="dark:bg-gray-600" />
                                    <DropdownMenuGroup>
                                        <DropdownMenuSub>
                                            <DropdownMenuSubTrigger className="dark:focus:bg-gray-700 dark:focus:text-white">
                                                Company
                                            </DropdownMenuSubTrigger>
                                            <DropdownMenuPortal>
                                                <DropdownMenuSubContent className="bg-[#D0CAC1] dark:bg-[#363636] dark:text-white">
                                                    <DropdownMenuItem className="dark:focus:bg-gray-700 dark:focus:text-white">
                                                        About Us
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="dark:focus:bg-gray-700 dark:focus:text-white">
                                                        Terms
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="dark:focus:bg-gray-700 dark:focus:text-white">
                                                        Privacy
                                                    </DropdownMenuItem>
                                                </DropdownMenuSubContent>
                                            </DropdownMenuPortal>
                                        </DropdownMenuSub>
                                    </DropdownMenuGroup>
                                    <DropdownMenuSeparator className="dark:bg-gray-600" />
                                    <DropdownMenuGroup>
                                        <DropdownMenuSub>
                                            <DropdownMenuSubTrigger className="dark:focus:bg-gray-700 dark:focus:text-white">
                                                Resources
                                            </DropdownMenuSubTrigger>
                                            <DropdownMenuPortal>
                                                <DropdownMenuSubContent className="bg-[#D0CAC1] dark:bg-[#363636] dark:text-white">
                                                    <DropdownMenuItem className="dark:focus:bg-gray-700 dark:focus:text-white">
                                                        Tutorials
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="dark:focus:bg-gray-700 dark:focus:text-white">
                                                        Help center
                                                    </DropdownMenuItem>
                                                </DropdownMenuSubContent>
                                            </DropdownMenuPortal>
                                        </DropdownMenuSub>
                                    </DropdownMenuGroup>
                                    <DropdownMenuSeparator className="dark:bg-gray-600" />
                                    <DropdownMenuItem>
                                        <Link className="w-full" href="/login">
                                            <button className="text-xs bg-cyan-600 px-2 py-2 text-white rounded-lg w-full">Log In</button>
                                        </Link>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </li>
                        <li className="p-2 lg:p-3">
                            {isLoggedIn ? (
                                <div className="flex items-center gap-2 lg:gap-3">
                                    <Link
                                        href={getDashboardLink()}
                                        className="text-sm lg:text-base hover:text-gray-700 dark:text-white dark:hover:text-gray-300 transition-colors"
                                    >
                                        Dashboard
                                    </Link>
                                    <button
                                        onClick={logout}
                                        className="bg-red-600 px-2 py-1 lg:px-3 lg:py-1 text-xs lg:text-sm text-white rounded-lg hover:bg-red-700 transition-colors"
                                    >
                                        Logout
                                    </button>
                                </div>
                            ) : (
                                <Link href="/select-role">
                                    <button className="bg-[#DB134C] px-2 py-1 lg:px-3 lg:py-1 text-xs lg:text-sm text-white rounded-lg hover:bg-[#DB134C]/90 transition-colors">
                                        Try Phamesh
                                    </button>
                                </Link>
                            )}
                        </li>
                    </ul>
                </div>

                {/* Mobile Controls */}
                <div className="flex items-center gap-2 md:hidden">
                    <div className="px-2 py-1 bg-[#D0CAC1] dark:bg-[#363636] rounded-full">
                        <ThemeToggle />
                    </div>
                    {isLoggedIn && (
                        <Link href="/chat" className="px-2 py-1 bg-[#D0CAC1] dark:bg-[#363636] rounded-full relative">
                            <MessageSquare className="h-5 w-5" />
                            {unreadCount > 0 && (
                                <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs bg-[#DB134C]">
                                    {unreadCount > 9 ? "9+" : unreadCount}
                                </Badge>
                            )}
                        </Link>
                    )}
                    {isLoggedIn ? (
                        <Link href={getDashboardLink()}>
                            <button className="text-xs bg-cyan-600 px-2 py-3 text-white rounded-lg">Dashboard</button>
                        </Link>
                    ) : (
                        <Link href="/login">
                            <button className="text-xs bg-[#DB134C] px-2 py-3 text-white rounded-lg">Try Phamesh</button>
                        </Link>
                    )}
                    <button onClick={handleNav} className="z-20 cursor-pointer p-2 bg-[#D0CAC1] dark:bg-[#363636] rounded-full">
                        {nav ? <X size={24} className="dark:text-white" /> : <Menu size={24} className="dark:text-white" />}
                    </button>
                </div>

                {/* Mobile Menu */}
                <div
                    className={`${nav ? "fixed left-0 top-0 w-full h-screen bg-black/70 z-40" : "hidden"}`}
                    onClick={handleNav}
                >
                    <div
                        className={`
              fixed left-0 top-0 w-[80%] sm:w-[60%] h-full bg-[#D0CAC1] dark:bg-[#363636] dark:text-white p-4 z-50 overflow-y-auto
              transition-transform duration-300 ease-in-out
              ${nav ? "translate-x-0" : "-translate-x-full"}
            `}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-center mb-6">
                            <Image src={Logo || "/placeholder.svg"} alt="Phamesh Logo" className="h-10 w-auto" />
                            <button onClick={handleNav} className="p-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                                <X size={24} className="dark:text-white" />
                            </button>
                        </div>

                        {mounted && (
                            <div className="flex items-center justify-between mb-6 bg-gray-200 dark:bg-gray-700 p-3 rounded-lg">
                                <span className="font-medium dark:text-white">{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
                                <button onClick={toggleTheme} className="p-1 bg-white dark:bg-gray-800 rounded-full">
                                    {theme === "dark" ? (
                                        <span className="flex items-center gap-1 text-sm dark:text-white">
                      <span>☀️</span> Switch to Light
                    </span>
                                    ) : (
                                        <span className="flex items-center gap-1 text-sm">
                      <span>🌙</span> Switch to Dark
                    </span>
                                    )}
                                </button>
                            </div>
                        )}

                        <ul className="space-y-1">
                            <li className="p-3 text-lg border-b border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md transition-colors">
                                <Link href="/" onClick={handleNav} className="block w-full">
                                    Home
                                </Link>
                            </li>
                            <li className="p-3 text-lg border-b border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md transition-colors">
                                <Link href="/services" onClick={handleNav} className="block w-full">
                                    Services
                                </Link>
                            </li>
                            <li className="p-3 text-lg border-b border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md transition-colors">
                                <Link href="/news" onClick={handleNav} className="block w-full">
                                    News
                                </Link>
                            </li>
                            <li className="p-3 text-lg border-b border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md transition-colors">
                                <Link href="/about" onClick={handleNav} className="block w-full">
                                    About
                                </Link>
                            </li>
                            <li className="p-3 text-lg border-b border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md transition-colors">
                                <Link href="/contact" onClick={handleNav} className="block w-full">
                                    Contact
                                </Link>
                            </li>
                            {isLoggedIn && (
                                <li className="p-3 text-lg border-b border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md transition-colors">
                                    <Link href="/chat" onClick={handleNav} className="flex items-center justify-between w-full">
                                        <span>Chat</span>
                                        <div className="relative">
                                            <MessageSquare className="h-5 w-5" />
                                            {unreadCount > 0 && (
                                                <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs bg-[#DB134C]">
                                                    {unreadCount > 9 ? "9+" : unreadCount}
                                                </Badge>
                                            )}
                                        </div>
                                    </Link>
                                </li>
                            )}

                            <li className="p-3 text-lg font-medium mt-4 dark:text-gray-300">Products</li>
                            <li className="p-3 text-lg border-b border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md transition-colors pl-6">
                                <Link href="#" onClick={handleNav} className="block w-full">
                                    Pricing
                                </Link>
                            </li>
                            <li className="p-3 text-lg border-b border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md transition-colors pl-6">
                                <Link href="#" onClick={handleNav} className="block w-full">
                                    Updates
                                </Link>
                            </li>

                            <li className="p-3 text-lg font-medium mt-4 dark:text-gray-300">Company</li>
                            <li className="p-3 text-lg border-b border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md transition-colors pl-6">
                                <Link href="#" onClick={handleNav} className="block w-full">
                                    About Us
                                </Link>
                            </li>
                            <li className="p-3 text-lg border-b border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md transition-colors pl-6">
                                <Link href="#" onClick={handleNav} className="block w-full">
                                    Terms
                                </Link>
                            </li>
                            <li className="p-3 text-lg border-b border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md transition-colors pl-6">
                                <Link href="#" onClick={handleNav} className="block w-full">
                                    Privacy
                                </Link>
                            </li>

                            <li className="p-3 text-lg font-medium mt-4 dark:text-gray-300">Resources</li>
                            <li className="p-3 text-lg border-b border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md transition-colors pl-6">
                                <Link href="#" onClick={handleNav} className="block w-full">
                                    Tutorials
                                </Link>
                            </li>
                            <li className="p-3 text-lg border-b border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md transition-colors pl-6">
                                <Link href="#" onClick={handleNav} className="block w-full">
                                    Help Center
                                </Link>
                            </li>
                        </ul>

                        {isLoggedIn && (
                            <div className="mt-8 space-y-4">
                                <Link href={getDashboardLink()} onClick={handleNav}>
                                    <button className="w-full bg-cyan-600 py-3 text-white rounded-lg text-lg font-medium">
                                        Dashboard
                                    </button>
                                </Link>
                                <button
                                    onClick={() => {
                                        logout()
                                        handleNav()
                                    }}
                                    className="w-full bg-red-600 py-3 text-white rounded-lg text-lg font-medium"
                                >
                                    Logout
                                </button>
                            </div>
                        )}

                        {!isLoggedIn && (
                            <div className="mt-8">
                                <Link href="/login" onClick={handleNav}>
                                    <button className="w-full bg-cyan-600 py-3 text-white rounded-lg text-lg font-medium">
                                        Try Phamesh
                                    </button>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </header>
        </div>
    )
}

