"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ConversationList } from "@/components/conversation-list"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import type { ConversationDto } from "@/lib/types"
import { MessageService } from "@/lib/services/message-service"
import { useToast } from "@/hooks/use-toast"
import webSocketService from "@/lib/websocket"
import { AuthService } from "@/lib/services/auth-service"

export default function MessagesPage() {
    const { toast } = useToast()
    const [conversations, setConversations] = useState<ConversationDto[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [currentUser, setCurrentUser] = useState<any>(null)

    // Connect to WebSocket when component mounts
    useEffect(() => {
        webSocketService.connect()

        return () => {
            // No need to disconnect on unmount as other components might need the connection
        }
    }, [])

    // Load current user
    useEffect(() => {
        async function loadCurrentUser() {
            try {
                const user = await AuthService.getCurrentUser()
                setCurrentUser(user)
            } catch (error) {
                console.error("Failed to load current user:", error)
                toast({
                    title: "Error",
                    description: "Failed to load user profile",
                    variant: "destructive",
                })
            }
        }

        loadCurrentUser()
    }, [toast])

    // Aktualisiere die Ladelogik für Konversationen, um Echtzeit-Daten zu verwenden
    useEffect(() => {
        if (!currentUser) return

        const handleNewMessage = () => {
            // Lade Konversationen neu, wenn eine neue Nachricht empfangen wird
            loadConversations()
        }

        // Abonniere benutzerspezifische Nachrichten
        MessageService.subscribeToUserMessages(currentUser.id, handleNewMessage)

        // Lade Konversationen initial
        loadConversations()

        return () => {
            // Abmelden, wenn die Komponente unmontiert wird
            if (currentUser) {
                MessageService.unsubscribeFromUserMessages(currentUser.id)
            }
        }
    }, [currentUser])

    const loadConversations = async () => {
        setIsLoading(true)
        try {
            const data = await MessageService.getConversations()
            setConversations(data)
        } catch (error) {
            console.error("Failed to load conversations:", error)
            toast({
                title: "Fehler",
                description: "Konversationen konnten nicht geladen werden",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if (currentUser) {
            loadConversations()
        }
    }, [currentUser, toast])

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Messages</h1>
                <Link href="/dashboard/messages/new">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        New Conversation
                    </Button>
                </Link>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Conversations</CardTitle>
                    <CardDescription>Manage your conversations with companies and content creators</CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="space-y-2">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex items-start gap-4 rounded-lg border p-4">
                                    <div className="h-10 w-10 rounded-full bg-muted animate-pulse" />
                                    <div className="flex-1 space-y-2">
                                        <div className="flex items-center justify-between">
                                            <div className="h-5 w-32 bg-muted animate-pulse rounded" />
                                            <div className="h-4 w-16 bg-muted animate-pulse rounded" />
                                        </div>
                                        <div className="h-4 w-full bg-muted animate-pulse rounded" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <ConversationList conversations={conversations} />
                    )}
                </CardContent>
            </Card>
        </div>
    )
}

