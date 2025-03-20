import { Client, type IMessage } from "@stomp/stompjs"
import { WEBSOCKET_ENDPOINTS } from "./api-endpoints"

interface WebSocketOptions {
    onConnect?: () => void
    onDisconnect?: () => void
    onError?: (error: any) => void
}

interface MessageHandler {
    topic: string
    callback: (message: any) => void
}

class WebSocketService {
    private client: Client | null = null
    private messageHandlers: MessageHandler[] = []
    private connected = false
    private options: WebSocketOptions = {}

    constructor() {
        this.initClient()
    }

    private initClient() {
        this.client = new Client({
            brokerURL: WEBSOCKET_ENDPOINTS.CONNECT,
            connectHeaders: {
                Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
            },
            debug: (str) => {
                console.log("STOMP: " + str)
            },
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
        })

        this.client.onConnect = () => {
            this.connected = true
            console.log("WebSocket connected")

            // Abonniere alle registrierten Handler
            this.messageHandlers.forEach((handler) => {
                this.subscribe(handler.topic, handler.callback)
            })

            if (this.options.onConnect) {
                this.options.onConnect()
            }
        }

        this.client.onDisconnect = () => {
            this.connected = false
            console.log("WebSocket disconnected")

            if (this.options.onDisconnect) {
                this.options.onDisconnect()
            }
        }

        this.client.onStompError = (frame) => {
            console.error("WebSocket error:", frame)

            if (this.options.onError) {
                this.options.onError(frame)
            }
        }
    }

    connect(options: WebSocketOptions = {}) {
        this.options = options

        if (this.client && !this.connected) {
            this.client.activate()
        }
    }

    disconnect() {
        if (this.client && this.connected) {
            this.client.deactivate()
            this.connected = false
        }
    }

    subscribe(topic: string, callback: (message: any) => void) {
        if (!this.client) {
            console.error("WebSocket client not initialized")
            return
        }

        // Speichere den Handler für spätere Wiederverbindungen
        this.messageHandlers.push({ topic, callback })

        if (this.connected) {
            this.client.subscribe(topic, (message: IMessage) => {
                try {
                    const payload = JSON.parse(message.body)
                    callback(payload)
                } catch (error) {
                    console.error("Error parsing message:", error)
                }
            })
        }
    }

    unsubscribe(topic: string) {
        this.messageHandlers = this.messageHandlers.filter((handler) => handler.topic !== topic)

        if (this.client && this.connected) {
            // Hier müssten wir die Subscription-ID speichern, um sie korrekt abzumelden
            // Für jetzt entfernen wir nur den Handler
        }
    }

    send(destination: string, body: any) {
        if (!this.client || !this.connected) {
            console.error("WebSocket not connected")
            return
        }

        this.client.publish({
            destination,
            body: JSON.stringify(body),
        })
    }

    // Hilfsmethode für Chat-Nachrichten
    sendChatMessage(recipientId: number, content: string) {
        this.send(WEBSOCKET_ENDPOINTS.SEND_ENDPOINT, {
            recipientId,
            content,
        })
    }

    // Hilfsmethode zum Abonnieren von Chat-Nachrichten
    subscribeToChatMessages(userId: number, callback: (message: any) => void) {
        this.subscribe(WEBSOCKET_ENDPOINTS.CHAT_TOPIC(userId), callback)
    }

    // Aktualisiere das Token (z.B. nach Login)
    updateToken(token: string) {
        if (this.client) {
            this.client.connectHeaders = {
                Authorization: `Bearer ${token}`,
            }

            // Wenn bereits verbunden, neu verbinden mit neuem Token
            if (this.connected) {
                this.disconnect()
                this.connect(this.options)
            }
        }
    }
}

export const websocketService = new WebSocketService()

