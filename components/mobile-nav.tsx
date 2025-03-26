"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { MessageSquare, LayoutDashboard, User, Settings, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export function MobileNav() {
    const [open, setOpen] = useState(false)
    const pathname = usePathname()

    const navItems = [
        {
            name: "Dashboard",
            href: "/dashboard",
            icon: LayoutDashboard,
        },
        {
            name: "Messages",
            href: "/dashboard/messages",
            icon: MessageSquare,
        },
        {
            name: "Profile",
            href: "/dashboard/profile",
            icon: User,
        },
        {
            name: "Settings",
            href: "/dashboard/settings",
            icon: Settings,
        },
    ]

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button
                    variant="ghost"
                    className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
                >
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Toggle Menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="pr-0">
                <div className="flex items-center gap-2 font-bold text-xl mb-8">
                    <MessageSquare className="h-6 w-6" />
                    <span>Phamesh</span>
                </div>
                <div className="grid gap-2 py-6">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md",
                                    isActive
                                        ? "text-primary bg-primary/10"
                                        : "text-muted-foreground hover:text-primary hover:bg-primary/10",
                                )}
                                onClick={() => setOpen(false)}
                            >
                                <item.icon className="h-5 w-5" />
                                {item.name}
                            </Link>
                        )
                    })}
                </div>
            </SheetContent>
        </Sheet>
    )
}

