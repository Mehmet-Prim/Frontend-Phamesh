import { apiRequest } from "@/lib/api-client"
import webSocketService from "@/lib/websocket"
import type { ChatMessageDto, ConversationDto } from "@/lib/types"

export const MessageService = {
    getConversations: async (): Promise<ConversationDto[]> => {
        return apiRequest<ConversationDto[]>("/chat/conversations")
    },

    getConversation: async (conversationId: string): Promise<ConversationDto> => {
        return apiRequest<ConversationDto>(`/chat/conversations/${conversationId}`)
    },

    getMessages: async (
        conversationId: string,
        page = 0,
        size = 20,
    ): Promise<{
        content: ChatMessageDto[]
        totalElements: number
        totalPages: number
        size: number
        number: number
    }> => {
        return apiRequest<any>(`/chat/conversations/${conversationId}/messages?page=${page}&size=${size}`)
    },

    sendMessage: async (conversationId: string, content: string): Promise<ChatMessageDto> => {
        return apiRequest<ChatMessageDto>(`/chat/send`, {
            method: "POST",
            body: JSON.stringify({
                conversationId: Number.parseInt(conversationId),
                content,
            }),
        })
    },

    startConversation: async (recipientId: number, content: string): Promise<ConversationDto> => {
        return apiRequest<ConversationDto>(`/chat/send`, {
            method: "POST",
            body: JSON.stringify({
                recipientId,
                content,
            }),
        })
    },

    markConversationAsRead: async (conversationId: string): Promise<void> => {
        await apiRequest<void>(`/chat/conversations/${conversationId}/read`, {
            method: "POST",
        })
    },

    getUnreadCount: async (): Promise<number> => {
        const response = await apiRequest<{ count: number }>("/chat/unread-count")
        return response.count
    },

    getUnreadConversationCount: async (): Promise<number> => {
        const response = await apiRequest<{ count: number }>("/chat/unread-count")
        return response.count
    },

    // WebSocket-Methoden
    subscribeToConversation: (conversationId: string, callback: (message: ChatMessageDto) => void) => {
        const destination = `/topic/conversation.${conversationId}`
        return webSocketService.subscribe(destination, callback)
    },

    subscribeToUserMessages: (userId: number, callback: (message: ChatMessageDto) => void) => {
        const destination = `/user/${userId}/queue/messages`
        return webSocketService.subscribe(destination, callback)
    },

    unsubscribeFromConversation: (conversationId: string) => {
        const destination = `/topic/conversation.${conversationId}`
        webSocketService.unsubscribe(destination)
    },

    unsubscribeFromUserMessages: (userId: number) => {
        const destination = `/user/${userId}/queue/messages`
        webSocketService.unsubscribe(destination)
    },
}

