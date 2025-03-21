import { useState } from "react"
import { Menu, X } from "lucide-react"
import { useNavigate } from "react-router-dom"

const ChatSidebar = ({
  onSelectRoom,
}: {
  onSelectRoom: (room: string) => void
}) => {
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)

  const rooms = [
    "General",
    "Tech Talk",
    "Random",
    "Relationships",
    "Science",
    "Sports",
    "Music",
  ]

  const handleLogout = () => {
    navigate("/")
  }

  return (
    <>
      {/* Mobile toggle button */}
      <button
        className="md:hidden fixed top-2 left-2 z-20 bg-gray-800 p-2 rounded text-white"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed md:relative top-0 left-0 w-64 h-full bg-gray-800 p-4 text-white transform transition-transform md:translate-x-0 ${
          isOpen ? "translate-x-0 z-20" : "-translate-x-full"
        }`}
      >
        <h2 className="text-xl font-semibold mb-6 mt-2 md:mt-0">Rooms</h2>
        <ul className="space-y-3">
          {rooms.map((room) => (
            <li
              key={room}
              className="p-3 bg-gray-700 rounded cursor-pointer hover:bg-gray-600"
              onClick={() => {
                onSelectRoom(room)
                setIsOpen(false) // Close sidebar on mobile
              }}
            >
              {room}
            </li>
          ))}
        </ul>

        {/* Logout Button (Fixed at Bottom) */}
        <button
          className="absolute bottom-4 left-4 w-[85%] p-3 bg-red-600 hover:bg-red-500 rounded text-white cursor-pointer font-semibold"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </>
  )
}

export default ChatSidebar
