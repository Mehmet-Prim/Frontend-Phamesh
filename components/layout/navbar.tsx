"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { authService } from "@/services/auth-service"
import { Menu, X } from "lucide-react"

export default function Navbar() {
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [userRole, setUserRole] = useState<string | null>(null)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const pathname = usePathname()

    useEffect(() => {
        const checkAuth = () => {
            const isAuth = authService.isAuthenticated()
            setIsLoggedIn(isAuth)
            if (isAuth) {
                setUserRole(authService.getUserRole())
            }
        }

        checkAuth()

        // Check auth on focus (in case user logs in/out in another tab)
        window.addEventListener("focus", checkAuth)
        return () => window.removeEventListener("focus", checkAuth)
    }, [pathname])

    const handleLogout = () => {
        authService.logout()
        window.location.href = "/"
    }

    const getInitials = () => {
        const user = authService.getCurrentUser()
        if (!user) return "U"

        if (userRole === "COMPANY" && user.companyName) {
            return user.companyName.charAt(0)
        } else if (user.firstName && user.lastName) {
            return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`
        }
        return "U"
    }

    const getDashboardLink = () => {
        if (userRole === "COMPANY") return "/company/dashboard"
        if (userRole === "CONTENT_CREATOR") return "/content-creator/dashboard"
        return "/dashboard"
    }

    return (
        <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
            <div className="container mx-auto px-4">
                <div className="flex h-16 items-center justify-between">
                    <div className="flex items-center">
                        <Link href={isLoggedIn ? getDashboardLink() : "/"} className="text-xl font-bold">
                            Phamesh
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-4">
                        {isLoggedIn ? (
                            <>
                                <Link href={getDashboardLink()} className="text-sm font-medium hover:text-primary">
                                    Dashboard
                                </Link>
                                {userRole === "COMPANY" && (
                                    <Link href="/content-creators" className="text-sm font-medium hover:text-primary">
                                        Find Creators
                                    </Link>
                                )}
                                {userRole === "CONTENT_CREATOR" && (
                                    <Link href="/opportunities" className="text-sm font-medium hover:text-primary">
                                        Opportunities
                                    </Link>
                                )}
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                                            <Avatar className="h-8 w-8">
                                                <AvatarFallback>{getInitials()}</AvatarFallback>
                                            </Avatar>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem asChild>
                                            <Link href={getDashboardLink()}>Dashboard</Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem asChild>
                                            <Link href={userRole === "COMPANY" ? "/company/profile" : "/content-creator/profile"}>
                                                Profile
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem asChild>
                                            <Link href="/settings">Settings</Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </>
                        ) : (
                            <>
                                <Link href="/" className="text-sm font-medium hover:text-primary">
                                    Login
                                </Link>
                                <Button asChild size="sm">
                                    <Link href="/register">Register</Link>
                                </Button>
                            </>
                        )}
                    </nav>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </Button>
                    </div>
                </div>

                {/* Mobile Navigation */}
                {mobileMenuOpen && (
                    <div className="md:hidden py-4 space-y-2">
                        {isLoggedIn ? (
                            <>
                                <Link
                                    href={getDashboardLink()}
                                    className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-100"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Dashboard
                                </Link>
                                {userRole === "COMPANY" && (
                                    <Link
                                        href="/content-creators"
                                        className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-100"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        Find Creators
                                    </Link>
                                )}
                                {userRole === "CONTENT_CREATOR" && (
                                    <Link
                                        href="/opportunities"
                                        className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-100"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        Opportunities
                                    </Link>
                                )}
                                <Link
                                    href={userRole === "COMPANY" ? "/company/profile" : "/content-creator/profile"}
                                    className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-100"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Profile
                                </Link>
                                <Link
                                    href="/settings"
                                    className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-100"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Settings
                                </Link>
                                <button
                                    onClick={() => {
                                        handleLogout()
                                        setMobileMenuOpen(false)
                                    }}
                                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium hover:bg-gray-100"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    href="/"
                                    className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-100"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Login
                                </Link>
                                <Link
                                    href="/register?type=company"
                                    className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-100"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Register as Company
                                </Link>
                                <Link
                                    href="/register?type=content-creator"
                                    className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-100"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Register as Content Creator
                                </Link>
                            </>
                        )}
                    </div>
                )}
            </div>
        </header>
    )
}

