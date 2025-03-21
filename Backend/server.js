const express = require("express")
const cors = require("cors")
const { Server } = require("socket.io")
const http = require("http")
const PORT = process.env.PORT || 3500
const mongoose = require("mongoose")
const socketAuth = require("./middleware/socketAuth")
require("dotenv").config()
const Message = require("./models/messages")

// mongoose connection
try {
  mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  console.log(" MongoDB Connected")
} catch (err) {
  console.error(" MongoDB Connection Error:", err)
}
// initialization of cors, express etc
const app = express()
app.use(cors())
app.use(express.json())

const server = http.createServer(app)

// Authentications routes
app.use("/api/auth", require("./routes/auth"))
app.use("/api/messages", require("./routes/messages"))

// Socket io connection and allow CORS
const io = new Server(server, {
  cors: {
    // Connect to the frontend
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  },
})

// authentication middleware for web sockets
io.use(socketAuth)

server.listen(PORT, () => console.log(`Server running on port ${PORT}`))

// make connections
io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id} `)

  // Join room
  socket.on("joinRoom", async (room) => {
    socket.join(room)
    console.log(`${socket.id} joined room: ${room}`)

    // Fetch past messages from the database
    const messages = await Message.find({ room }).sort({ timestamp: 1 })

    // Send past messages to the user
    socket.emit("roomMessages", messages)
  })

  socket.on("Message", async (data) => {
    console.log("📩 Received message data:", data) // Debug log

    if (!data.content || !data.room || !data.sender) {
      console.log("❌ Missing required fields:", data)
      return
    }

    try {
      const newMessage = new Message({
        sender: data.sender,
        content: data.content,
        room: data.room,
      })

      await newMessage.save()
      io.to(data.room).emit("receiveMessage", newMessage) // Sends to everyone, including sender
    } catch (error) {
      console.error("❌ Error saving message:", error)
    }
  })

  socket.on("typing", (room) => {
    io.to(room).emit("typing", { user: socket.user._id })
  })

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`)
  })
})
