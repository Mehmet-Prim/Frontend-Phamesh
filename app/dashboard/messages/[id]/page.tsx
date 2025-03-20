"use client"

import { useEffect, useState, useCallback } from "react"
import { MessageList } from "@/components/message-list"
import { MessageInput } from "@/components/message-input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Building, User, ArrowLeft } from "lucide-react"
import type { ChatMessageDto, ConversationDto } from "@/lib/types"
import { MessageService } from "@/lib/services/message-service"
import { useToast } from "@/hooks/use-toast"
import { AuthService } from "@/lib/services/auth-service"
import webSocketService from "@/lib/websocket"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function ConversationPage({ params }: { params: { id: string } }) {
    const { toast } = useToast()
    const [conversation, setConversation] = useState<ConversationDto | null>(null)
    const [messages, setMessages] = useState<ChatMessageDto[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [currentUser, setCurrentUser] = useState<any>(null)
    const [page, setPage] = useState(0)
    const [hasMore, setHasMore] = useState(true)
    const [loadingMore, setLoadingMore] = useState(false)

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

    // Handle new messages from WebSocket
    const handleNewMessage = useCallback(
        (message: ChatMessageDto) => {
            if (message.conversationId.toString() === params.id) {
                setMessages((prev) => {
                    // Check if message already exists to avoid duplicates
                    const exists = prev.some((m) => m.id === message.id)
                    if (exists) return prev
                    return [...prev, message]
                })

                // Mark as read if the message is not from the current user
                if (currentUser && message.senderId !== currentUser.id) {
                    MessageService.markConversationAsRead(params.id)
                }
            }
        },
        [params.id, currentUser],
    )

    const loadMessages = useCallback(
        async (pageNum: number) => {
            if (!currentUser) return

            try {
                setLoadingMore(pageNum > 0)
                const response = await MessageService.getMessages(params.id, pageNum)

                if (pageNum === 0) {
                    setMessages(response.content)
                } else {
                    setMessages((prev) => [...prev, ...response.content])
                }

                setHasMore(pageNum < response.totalPages - 1)
                setPage(pageNum)
            } catch (error) {
                console.error("Failed to load messages:", error)
                toast({
                    title: "Error",
                    description: "Failed to load messages",
                    variant: "destructive",
                })
            } finally {
                setLoadingMore(false)
            }
        },
        [params.id, currentUser, toast],
    )

    useEffect(() => {
        async function loadConversation() {
            setIsLoading(true)
            try {
                const conversationData = await MessageService.getConversation(params.id)
                setConversation(conversationData)

                // Lade initiale Nachrichten
                await loadMessages(0)

                // Markiere Konversation als gelesen
                await MessageService.markConversationAsRead(params.id)

                // Abonniere neue Nachrichten für diese Konversation
                MessageService.subscribeToConversation(params.id, handleNewMessage)

                // Abonniere benutzerspezifische Nachrichten, wenn wir den aktuellen Benutzer haben
                if (currentUser) {
                    MessageService.subscribeToUserMessages(currentUser.id, handleNewMessage)
                }
            } catch (error) {
                console.error("Failed to load conversation:", error)
                toast({
                    title: "Fehler",
                    description: "Konversation konnte nicht geladen werden",
                    variant: "destructive",
                })
            } finally {
                setIsLoading(false)
            }
        }

        if (currentUser) {
            loadConversation()
        }

        return () => {
            // Abmelden, wenn die Komponente unmontiert wird
            MessageService.unsubscribeFromConversation(params.id)
            if (currentUser) {
                MessageService.unsubscribeFromUserMessages(currentUser.id)
            }
        }
    }, [params.id, toast, handleNewMessage, currentUser, loadMessages])

    const handleSendMessage = async (content: string) => {
        if (!currentUser) return

        try {
            const newMessage = await MessageService.sendMessage(params.id, content)

            // Optimistically add the message to the UI
            // The actual message will come through the WebSocket subscription
            setMessages((prev) => [...prev, newMessage])
        } catch (error) {
            console.error("Failed to send message:", error)
            toast({
                title: "Error",
                description: "Failed to send message",
                variant: "destructive",
            })
        }
    }

    const loadMoreMessages = async () => {
        if (hasMore && !loadingMore) {
            await loadMessages(page + 1)
        }
    }

    if (isLoading || !currentUser) {
        return (
            <div className="flex flex-col gap-4 h-[calc(100vh-12rem)]">
                <Card className="flex flex-col h-full">
                    <CardHeader className="border-b px-4 py-3">
                        <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
                            <div className="h-6 w-32 bg-muted animate-pulse rounded" />
                        </div>
                    </CardHeader>
                    <CardContent className="flex-1 overflow-hidden p-0 flex flex-col">
                        <div className="flex-1 overflow-y-auto p-4">
                            <div className="space-y-4">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="flex items-start gap-2">
                                        <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
                                        <div className="h-16 w-64 bg-muted animate-pulse rounded-lg" />
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="border-t p-4">
                            <div className="h-20 bg-muted animate-pulse rounded" />
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    if (!conversation) {
        return (
            <div className="flex flex-col gap-4 h-[calc(100vh-12rem)]">
                <Card className="flex flex-col h-full items-center justify-center">
                    <p className="text-muted-foreground">Conversation not found</p>
                </Card>
            </div>
        )
    }

    const otherPartyName =
        conversation.companyId === currentUser.id ? conversation.contentCreatorName : conversation.companyName

    const isCompany = conversation.companyId === currentUser.id ? false : true

    return (
        <div className="flex flex-col gap-4 h-[calc(100vh-12rem)]">
            <div className="flex items-center gap-2">
                <Link href="/dashboard/messages">
                    <Button variant="ghost" size="sm">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to conversations
                    </Button>
                </Link>
            </div>
            <Card className="flex flex-col h-full">
                <CardHeader className="border-b px-4 py-3">
                    <div className="flex items-center gap-3">
                        <Avatar>
                            <AvatarFallback>
                                {isCompany ? <Building className="h-4 w-4" /> : <User className="h-4 w-4" />}
                            </AvatarFallback>
                        </Avatar>
                        <CardTitle className="text-lg">{otherPartyName}</CardTitle>
                    </div>
                </CardHeader>
                <CardContent className="flex-1 overflow-hidden p-0 flex flex-col">
                    <div className="flex-1 overflow-y-auto p-4">
                        {hasMore && (
                            <div className="flex justify-center mb-4">
                                <Button variant="outline" size="sm" onClick={loadMoreMessages} disabled={loadingMore}>
                                    {loadingMore ? "Loading..." : "Load more messages"}
                                </Button>
                            </div>
                        )}
                        <MessageList messages={messages} currentUserId={currentUser.id} conversationId={params.id} />
                    </div>
                    <div className="border-t p-4">
                        <MessageInput onSendMessage={handleSendMessage} />
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

