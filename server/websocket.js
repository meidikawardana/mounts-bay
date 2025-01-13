import { Server } from "socket.io"
import { createServer } from "http"

const httpServer = createServer()
const io = new Server(httpServer, {
    cors: {
        origin: process.env.FRONTEND_URL || "http://localhost:3000",
        methods: ["GET", "POST"]
    }
})

io.on("connection", (socket) => {
    const userId = socket.handshake.auth.userId
    console.log("WebSocket: User connected", userId)

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