import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useAuthStore } from "../store/auth"

const API_URL = "http://localhost:3500/api/auth/"

const SignIn = () => {
  const [isSignUp, setIsSignUp] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const setToken = useAuthStore((state) => state.setToken)
  const setUser = useAuthStore((state) => state.setUser)

  const navigate = useNavigate()

  const toggleSignIn = () => setIsSignUp(!isSignUp)

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const endpoint = isSignUp ? `${API_URL}register` : `${API_URL}login`
      const payload = isSignUp
        ? { username, email, password }
        : { email, password }

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!res.ok) throw new Error("Failed to sign in")

      const data = await res.json()
      console.log("Auth response:", data) // Debugging line

      if (isSignUp) {
        setIsSignUp(false)
      } else {
        setToken(data.token) // Store JWT token in Zustand
        setUser(data.user) // Store User
        console.log("User stored in Zustand:", data.user)
        navigate("/chat") // Redirect to chat page
      }
    } catch (error) {
      console.error(error)
    }
  }

  const handleBlur = (e: any) => {
    if (e.relatedTarget?.id === "toogle-password") {
      setIsFocused(false)
    }
  }

  return (
    <div className="flex h-screen items-center justify-center bg-gray-900 ">
      <div className="w-full md:max-w-lg p-6 md:bg-gray-800 md:rounded-lg md:shadow-md">
        <h2 className="text-3xl lg:text-4xl font-semibold text-white text-center mb-6">
          {isSignUp ? "Sign Up" : "Sign In"}
        </h2>
        <form onSubmit={handleSignIn} className="flex flex-col gap-4">
          {isSignUp && (
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              className="p-3 focus:outline-none rounded bg-gray-700 text-white"
              required
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-3 focus:outline-none rounded bg-gray-700 text-white"
            required
          />
          <div className="relative w-full ">
            <input
              type={showPassword ? "text" : "password"}
              onFocus={() => setIsFocused(true)}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="p-3 w-full focus:outline-none rounded bg-gray-700 text-white"
              required
            />
            {isFocused && (
              <button
                id="toogle-password"
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => setShowPassword(!showPassword)}
                onBlur={handleBlur}
                className="absolute cursor-pointer inset-y-0 right-2 flex items-center text-[#7e7f82] hover:text-white"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            )}
          </div>
          <button
            type="submit"
            className="p-3  cursor-pointer bg-blue-600 hover:bg-blue-500 rounded text-white font-semibold"
          >
            {isSignUp ? "Create Account" : "Sign In"}
          </button>
        </form>
        <p className="text-sm text-gray-400 text-center mt-4">
          {isSignUp ? "Already have an account?" : "Don't have an account?"}
          <button
            onClick={toggleSignIn}
            className="text-blue-400 cursor-pointer hover:underline ml-2"
          >
            {isSignUp ? "Sign In" : "Sign Up"}
          </button>
        </p>
      </div>
    </div>
  )
}

export default SignIn
