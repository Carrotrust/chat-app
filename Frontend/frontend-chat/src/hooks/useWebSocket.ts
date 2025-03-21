import { useEffect, useState } from "react"
import { io, Socket } from "socket.io-client"

const SOCKET_URL = "http://localhost:3500"

export const useWebSocket = (token:string | null) => {
    const [socket, setSocket] = useState<Socket | null>(null)

    useEffect(() => {
      if (!token){
        console.error("No token found. WebSocket will not connect.")
         return
      }

        const newSocket = io(SOCKET_URL, {
            transports: ["websocket"], auth: { token }
                // Ensure WebSocket transport
          });
      
          newSocket.on("connect", () => {
            console.log("✅ Connected to WebSocket server");
          });
      
          newSocket.on("connect_error", (err) => {
            console.error("❌ WebSocket connection error:", err);
          });

        setSocket(newSocket);

        return() => {
            newSocket.disconnect()
        }
    }, [token])

    return socket
    
}
