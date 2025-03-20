"use client"

import { useEffect, useState } from "react"
import { MessageSquare } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { MessageService } from "@/lib/services/message-service"
import { useAuth } from "@/hooks/useAuth"

export function ChatNotification() {
    const [unreadCount, setUnreadCount] = useState(0)
    const { user, isAuthenticated } = useAuth()

    useEffect(() => {
        if (!isAuthenticated || !user?.id) return

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
    }, [isAuthenticated, user])

    return (
        <div className="relative">
            <MessageSquare className="h-5 w-5" />
            {unreadCount > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs bg-[#DB134C]">
                    {unreadCount > 9 ? "9+" : unreadCount}
                </Badge>
            )}
        </div>
    )
}

