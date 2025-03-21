import { useState } from "react"
import ChatSidebar from "../components/ChatSidebar.tsx"
import ChatWindow from "../components/ChatWindow.tsx"

const ChatApp = () => {
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null)

  return (
    <div className="flex h-screen">
      {/* Pass the function to ChatSidebar */}
      <ChatSidebar onSelectRoom={setSelectedRoom} />
      {/* Show the chat window only if a room is selected */}
      {selectedRoom ? (
        <ChatWindow room={selectedRoom} />
      ) : (
        <div className="flex flex-col items-center justify-center h-full text-center  px-4">
          <h2 className="text-2xl md:text-5xl bg-gradient-to-r from-gray-600 to gray-700 bg-clip-text text-transparent font-semibold">
            Welcome to the Chat App
          </h2>
          <p className="text-xl md:2xl text-gray-500 mt-2">
            Select a room from the sidebar to start chatting.
          </p>
        </div>
      )}
    </div>
  )
}

export default ChatApp
