import { Server } from "socket.io"
import { createServer } from "http"

console.log("Starting WebSocket server...")

const httpServer = createServer()
const io = new Server(httpServer, {
    cors: {
        origin: process.env.FRONTEND_URL || "http://localhost:3000",
        methods: ["GET", "POST"]
    }
})

const userSockets = new Map()

io.on("connection", (socket) => {
    const userId = socket.handshake.auth.userId
    console.log("WebSocket: User connected", userId)
    userSockets.set(userId, socket)

    socket.on("disconnect", () => {
        console.log("WebSocket: User disconnected", userId)
        userSockets.delete(userId)
    })

    socket.on("orderStatusUpdate", (data) => {
        console.log("WebSocket: Order status update received", data)
        const targetSocket = userSockets.get(data.userId)
        if (targetSocket) {
            console.log("WebSocket: Sending update to user", data.userId)
            targetSocket.emit("orderStatusUpdate", data)
        } else {
            console.log("WebSocket: User socket not found", data.userId)
        }
    })
})

const PORT = process.env.WEBSOCKET_PORT || 3001
httpServer.listen(PORT, () => {
    console.log(`WebSocket server running on port ${PORT}`)
})