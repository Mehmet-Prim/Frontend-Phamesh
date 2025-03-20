"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Send } from "lucide-react"

interface MessageInputProps {
    onSendMessage: (content: string) => Promise<void>
}

export function MessageInput({ onSendMessage }: MessageInputProps) {
    const [message, setMessage] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!message.trim()) return

        setIsLoading(true)
        try {
            await onSendMessage(message)
            setMessage("")
        } catch (error) {
            console.error("Failed to send message:", error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="flex items-end gap-2">
            <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                className="min-h-[80px] flex-1 resize-none"
            />
            <Button type="submit" size="icon" disabled={isLoading || !message.trim()}>
                <Send className="h-4 w-4" />
                <span className="sr-only">Send</span>
            </Button>
        </form>
    )
}

