"use client"

import { useState, useEffect } from "react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"
import { User, LogOut, Settings, Bell } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { MessageService } from "@/lib/services/message-service"
import { Badge } from "@/components/ui/badge"

export function UserNav() {
    const router = useRouter()
    const { user, logout } = useAuth()
    const [unreadCount, setUnreadCount] = useState(0)

    // Lade ungelesene Nachrichten
    useEffect(() => {
        if (!user) return

        const loadUnreadCount = async () => {
            try {
                const count = await MessageService.getUnreadCount()
                setUnreadCount(count)
            } catch (error) {
                console.error("Failed to load unread count:", error)
            }
        }

        // Lade initial
        loadUnreadCount()

        // Abonniere Benutzer-Nachrichten für Aktualisierungen
        const handleNewMessage = () => {
            loadUnreadCount()
        }

        MessageService.subscribeToUserMessages(user.id, handleNewMessage)

        return () => {
            if (user) {
                MessageService.unsubscribeFromUserMessages(user.id)
            }
        }
    }, [user])

    const handleLogout = async () => {
        await logout()
    }

    if (!user) {
        return null
    }

    const displayName =
        user.role === "COMPANY"
            ? (user as any).companyName || user.email
            : `${(user as any).firstName || ""} ${(user as any).lastName || ""}`.trim() || user.email

    return (
        <DropdownMenu>
            <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                    <Button variant="ghost" size="icon" className="relative" onClick={() => router.push("/dashboard/messages")}>
                        <Bell className="h-5 w-5" />
                        <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                            {unreadCount > 9 ? "9+" : unreadCount}
                        </Badge>
                        <span className="sr-only">Ungelesene Nachrichten</span>
                    </Button>
                )}
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                        <Avatar className="h-8 w-8">
                            <AvatarFallback>{displayName.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                    </Button>
                </DropdownMenuTrigger>
            </div>
            <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{displayName}</p>
                        <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuItem onClick={() => router.push("/dashboard/profile")}>
                        <User className="mr-2 h-4 w-4" />
                        <span>Profil</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push("/dashboard/messages")}>
                        <Bell className="mr-2 h-4 w-4" />
                        <span>Nachrichten</span>
                        {unreadCount > 0 && <Badge className="ml-auto">{unreadCount}</Badge>}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push("/dashboard/settings")}>
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Einstellungen</span>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Abmelden</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

