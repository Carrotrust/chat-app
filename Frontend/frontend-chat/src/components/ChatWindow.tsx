import { useState, useEffect, useRef } from "react"
import { Send } from "lucide-react"
import { useWebSocket } from "../hooks/useWebSocket"
import { useAuthStore } from "../store/auth"
import { format } from "date-fns"

interface MessageType {
  content: string
  sender: string
  room: string
  timestamp: string
}

const ChatWindow = ({ room }: { room: string }) => {
  const [messages, setMessages] = useState<MessageType[]>([])
  const [input, setInput] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const token = useAuthStore((state) => state.token) // Get token from Zustand
  const user = useAuthStore((state) => state.user)
  const socket = useWebSocket(token)

  useEffect(() => {
    if (!socket || !room) return

    // Ensure user joins the room when they enter
    socket.emit("joinRoom", room)
    console.log(`✅ Joined room: ${room}`)

    // 🛠️ Clear messages when switching rooms
    setMessages([])

    // Fetch past messages from server
    socket.on("roomMessages", (history: MessageType[]) => {
      console.log("📜 Fetched previous messages:", history)
      setMessages(history) // Set past messages
    })

    socket.on("receiveMessage", (message: MessageType) => {
      console.log("📩 Received message:", message)

      if (message.room === room) {
        setMessages((prev) => [...prev, message])
      }
    })

    return () => {
      socket.off("receiveMessage")
    }
  }, [socket, room]) // Runs when `room` changes

  // Auto-scroll to the latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const sendMessage = () => {
    if (!input.trim()) return
    if (!socket) {
      console.error("Socket is not connected!")
      return
    }
    if (!room) {
      console.error("Room is undefined!")
      return
    }
    if (!user?.email) {
      console.error("User is undefined!")
      return
    }

    const newMessage = {
      content: input,
      sender: user?.email, // Later, this will be dynamic
      room,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    }

    socket.emit("Message", newMessage)
    setInput("") // 🔥 Removed local state update to avoid duplication
  }

  return (
    <div className="flex flex-col flex-1 md:max-w-7xl  mx-auto bg-gray-700 text-white h-full">
      {/* Chat Header */}
      <div className="p-4 bg-gray-800 text-lg font-semibold flex justify-center items-center">
        <span className="flex items-center justify-center">{room}</span>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-[calc(100vh-8rem)]">
        {messages.length === 0 ? (
          <p className="text-center text-gray-400">
            No messages yet. Start chatting!
          </p>
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.sender === user?.email ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`p-3 rounded-lg max-w-[75%] md:max-w-[60%] ${
                  msg.sender === user?.email
                    ? "bg-blue-600 text-white"
                    : "bg-green-600 text-white"
                }`}
              >
                <p className="text-sm">{msg.content}</p>
                <span className="text-xs text-gray-300 block mt-1">
                  {format(new Date(msg.timestamp), "hh:mm a")}
                </span>
              </div>
            </div>
          ))
        )}

        {/* Invisible div to scroll to bottom */}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-3 md:p-4 bg-gray-800 flex items-center fixed bottom-0 left-0 w-full md:relative">
        <input
          type="text"
          className="flex-1 p-3 bg-gray-700 rounded outline-none text-white"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          className="ml-3 bg-blue-600 p-3 cursor-pointer rounded hover:bg-blue-500"
          onClick={sendMessage}
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  )
}

export default ChatWindow
