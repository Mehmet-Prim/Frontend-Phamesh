import { Client, type IFrame, type StompHeaders } from "@stomp/stompjs"
import SockJS from "sockjs-client"
import { AuthService } from "./services/auth-service"
import { API_URL } from "./api-client"

type MessageCallback = (message: any) => void

class WebSocketService {
    private client: Client | null = null
    private subscriptions: Map<string, { id: string; callback: MessageCallback }> = new Map()
    private connected = false
    private connecting = false
    private reconnectTimeout: NodeJS.Timeout | null = null
    private reconnectAttempts = 0
    private maxReconnectAttempts = 5

    constructor() {
        // Nur im Browser initialisieren
        if (typeof window !== "undefined") {
            this.initializeClient()
        }
    }

    private initializeClient() {
        this.client = new Client({
            webSocketFactory: () => new SockJS(`${API_URL}/ws`),
            connectHeaders: this.getConnectHeaders(),
            debug:
                process.env.NODE_ENV === "development"
                    ? (str) => {
                        console.log("STOMP: " + str)
                    }
                    : undefined,
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
        })

        this.client.onConnect = this.onConnect.bind(this)
        this.client.onStompError = this.onStompError.bind(this)
        this.client.onWebSocketClose = this.onWebSocketClose.bind(this)
    }

    private getConnectHeaders(): StompHeaders {
        // Sicherstellen, dass wir im Browser sind
        if (typeof window === "undefined") {
            return {}
        }

        const token = AuthService.getToken()
        return token ? { Authorization: token } : {}
    }

    private onConnect() {
        console.log("Connected to WebSocket")
        this.connected = true
        this.connecting = false
        this.reconnectAttempts = 0

        // Resubscribe to all previous subscriptions
        this.subscriptions.forEach((subscription, destination) => {
            this.subscribeToDestination(destination, subscription.callback)
        })
    }

    private onStompError(frame: IFrame) {
        console.error("STOMP error", frame)
        this.connected = false
        this.connecting = false
        this.attemptReconnect()
    }

    private onWebSocketClose() {
        console.log("WebSocket connection closed")
        this.connected = false
        this.connecting = false
        this.attemptReconnect()
    }

    private attemptReconnect() {
        if (this.reconnectTimeout) {
            clearTimeout(this.reconnectTimeout)
        }

        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++
            console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`)

            this.reconnectTimeout = setTimeout(() => {
                this.connect()
            }, 5000) // Wait 5 seconds before reconnecting
        } else {
            console.error("Max reconnect attempts reached")
        }
    }

    public connect() {
        // Nur im Browser verbinden
        if (typeof window === "undefined") return
        if (!this.client || this.connected || this.connecting) return

        this.connecting = true
        this.client.activate()
    }

    public disconnect() {
        if (typeof window === "undefined") return
        if (!this.client || !this.connected) return

        this.client.deactivate()
        this.connected = false
        this.subscriptions.clear()
    }

    public subscribe(destination: string, callback: MessageCallback): string {
        // Nur im Browser abonnieren
        if (typeof window === "undefined") return ""

        if (!this.connected) {
            this.connect()
        }

        return this.subscribeToDestination(destination, callback)
    }

    private subscribeToDestination(destination: string, callback: MessageCallback): string {
        if (typeof window === "undefined") return ""
        if (!this.client) return ""

        // Check if already subscribed
        const existingSubscription = this.subscriptions.get(destination)
        if (existingSubscription) {
            return existingSubscription.id
        }

        // Create new subscription
        const subscriptionId = `sub-${Date.now()}-${Math.floor(Math.random() * 1000)}`

        if (this.connected) {
            const subscription = this.client.subscribe(
                destination,
                (message) => {
                    try {
                        const parsedBody = JSON.parse(message.body)
                        callback(parsedBody)
                    } catch (e) {
                        console.error("Error parsing message", e)
                        callback(message.body)
                    }
                },
                { id: subscriptionId },
            )

            this.subscriptions.set(destination, {
                id: subscription.id,
                callback,
            })

            return subscription.id
        } else {
            // Store for later when connection is established
            this.subscriptions.set(destination, {
                id: subscriptionId,
                callback,
            })
            return subscriptionId
        }
    }

    public unsubscribe(destination: string) {
        if (typeof window === "undefined") return
        if (!this.client || !this.connected) return

        const subscription = this.subscriptions.get(destination)
        if (subscription) {
            this.client.unsubscribe(subscription.id)
            this.subscriptions.delete(destination)
        }
    }

    public send(destination: string, body: any) {
        if (typeof window === "undefined") return
        if (!this.client || !this.connected) {
            console.error("Cannot send message: not connected")
            return
        }

        const headers = this.getConnectHeaders()

        this.client.publish({
            destination,
            body: JSON.stringify(body),
            headers,
        })
    }
}

// Create a singleton instance
const webSocketService = new WebSocketService()
export default webSocketService

