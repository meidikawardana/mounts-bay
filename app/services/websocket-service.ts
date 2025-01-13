import { io, Socket } from "socket.io-client"

type OrderStatusCallback = (data: { orderId: string, status: string, message: string }) => void

class WebSocketService {
    private socket: Socket | null = null
    private static instance: WebSocketService
    private orderStatusCallbacks: OrderStatusCallback[] = []

    private constructor() {
        console.log("WebSocketService: Initializing...")
        this.socket = io(process.env.NEXT_PUBLIC_WEBSOCKET_URL || 'ws://localhost:3001', {
            autoConnect: false,
            reconnection: true,
            transports: ['websocket']
        })

        // Set up event listeners
        this.socket.on("connect", () => {
            console.log("WebSocketService: Connected")
        })

        this.socket.on("disconnect", () => {
            console.log("WebSocketService: Disconnected")
        })

        this.socket.on("orderStatusUpdate", (data) => {
            console.log("WebSocketService: Received orderStatusUpdate", data)
            // Notify all registered callbacks
            this.orderStatusCallbacks.forEach(callback => callback(data))
        })

        // Debug all events
        this.socket.onAny((event, ...args) => {
            console.log("WebSocketService: Event received", event, args)
        })
    }

    public static getInstance(): WebSocketService {
        if (!WebSocketService.instance) {
            WebSocketService.instance = new WebSocketService()
        }
        return WebSocketService.instance
    }

    public connect(userId: string) {
        if (!this.socket) return
        console.log("WebSocketService: Connecting with userId:", userId)

        this.socket.auth = { userId }
        this.socket.connect()
    }

    public disconnect() {
        if (this.socket) {
            console.log("WebSocketService: Disconnecting")
            this.socket.disconnect()
        }
    }

    public onOrderStatusUpdate(callback: OrderStatusCallback) {
        console.log("WebSocketService: Registering orderStatusUpdate callback")
        this.orderStatusCallbacks.push(callback)
        return () => {
            this.orderStatusCallbacks = this.orderStatusCallbacks.filter(cb => cb !== callback)
        }
    }

    public emitOrderStatusUpdate(data: {
        userId: string,
        orderId: string,
        status: string,
        message: string
    }) {
        if (!this.socket?.connected) {
            console.log("WebSocketService: Socket not connected, connecting now...")
            this.connect(data.userId)
        }

        console.log("WebSocketService: Emitting orderStatusUpdate", data)
        this.socket?.emit("orderStatusUpdate", data)
    }

    public removeOrderStatusCallback(callback: OrderStatusCallback) {
        this.orderStatusCallbacks = this.orderStatusCallbacks.filter(cb => cb !== callback)
    }
}

export const webSocketService = WebSocketService.getInstance()