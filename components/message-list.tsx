"use client"

import { useEffect, useRef } from "react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Building, User } from "lucide-react"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { type ChatMessageDto, UserRole } from "@/lib/types"
import { MessageService } from "@/lib/services/message-service"

interface MessageListProps {
    messages: ChatMessageDto[]
    currentUserId: number
    conversationId: string
}

export function MessageList({ messages, currentUserId, conversationId }: MessageListProps) {
    const messagesEndRef = useRef<HTMLDivElement>(null)

    // Scroll to bottom when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages])

    // Subscribe to real-time messages for this conversation
    useEffect(() => {
        const handleNewMessage = (message: ChatMessageDto) => {
            // This would be handled by the parent component through a callback
            console.log("New message received:", message)
        }

        // Subscribe to conversation updates
        MessageService.subscribeToConversation(conversationId, handleNewMessage)

        // Subscribe to user-specific messages
        MessageService.subscribeToUserMessages(currentUserId, handleNewMessage)

        return () => {
            // Unsubscribe when component unmounts
            MessageService.unsubscribeFromConversation(conversationId)
            MessageService.unsubscribeFromUserMessages(currentUserId)
        }
    }, [conversationId, currentUserId])

    return (
        <div className="space-y-4">
            {messages.map((message) => {
                const isCurrentUser = message.senderId === currentUserId
                const isCompany = message.senderRole === UserRole.COMPANY

                // Format the timestamp
                const formattedTime = format(new Date(message.sentAt), "h:mm a")

                return (
                    <div
                        key={message.id}
                        className={cn("flex items-start gap-2", isCurrentUser ? "flex-row-reverse" : "flex-row")}
                    >
                        <Avatar className="h-8 w-8">
                            <AvatarFallback>
                                {isCompany ? <Building className="h-4 w-4" /> : <User className="h-4 w-4" />}
                            </AvatarFallback>
                        </Avatar>
                        <div
                            className={cn(
                                "rounded-lg px-4 py-2 max-w-[80%]",
                                isCurrentUser ? "bg-primary text-primary-foreground" : "bg-muted",
                            )}
                        >
                            <p>{message.content}</p>
                            <div
                                className={cn(
                                    "flex text-xs mt-1",
                                    isCurrentUser ? "text-primary-foreground/70 justify-end" : "text-muted-foreground",
                                )}
                            >
                                {formattedTime}
                                {isCurrentUser && (
                                    <span className="ml-2">
                    {message.status === "READ" ? "Read" : message.status === "DELIVERED" ? "Delivered" : "Sent"}
                  </span>
                                )}
                            </div>
                        </div>
                    </div>
                )
            })}
            <div ref={messagesEndRef} />
        </div>
    )
}

