import { Server } from "socket.io"
import { createServer } from "http"

// Mock scheduled notifications
const mockNotifications = [
    {
        userId: "cm5nzfp470002xhxglwqc31ok", // change to an actual user id
        orderId: "order123",
        status: "SHIPPED",
        message: "Your order has been shipped!",
        scheduledTime: new Date(Date.now() + 5000) // 5 seconds from now
    },
    {
        userId: "cm5nzfp470002xhxglwqc31ok", // change to an actual user id
        orderId: "order124",
        status: "DELIVERED",
        message: "Your order has been delivered!",
        scheduledTime: new Date(Date.now() + 10000) // 10 seconds from now
    },
    {
        userId: "cm5nzfp470002xhxglwqc31ok", // change to an actual user id
        orderId: "order125",
        status: "PENDING",
        message: "Your order is being processed",
        scheduledTime: new Date(Date.now() + 15000) // 15 seconds from now
    }
]

const httpServer = createServer()
const io = new Server(httpServer, {
    cors: {
        origin: process.env.FRONTEND_URL || "http://localhost:3000",
        methods: ["GET", "POST"]
    }
})

// Send mock notifications
const sendScheduledNotifications = () => {
    mockNotifications.forEach(notification => {
        const timeUntilNotification = notification.scheduledTime.getTime() - Date.now()
        if (timeUntilNotification > 0) {
            setTimeout(() => {
                io.emit("orderStatusUpdate", notification)
                console.log("Sent scheduled notification:", notification)
            }, timeUntilNotification)
        }
    })
}

io.on("connection", (socket) => {
    const userId = socket.handshake.auth.userId
    console.log("WebSocket: User connected", userId)
    
    // Start sending mock notifications when user connects
    sendScheduledNotifications()

    socket.on("disconnect", () => {
        console.log("WebSocket: User disconnected", userId)
    })

    socket.on("orderStatusUpdate", (data) => {
        console.log("WebSocket: Order status update received", data)
        io.emit("orderStatusUpdate", data)
    })
})

const PORT = process.env.WEBSOCKET_PORT || 3001
httpServer.listen(PORT, () => {
    console.log(`WebSocket server running on port ${PORT}`)
}) 