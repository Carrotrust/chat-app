import { BrowserRouter } from "react-router-dom"
import { Routes, Route } from "react-router-dom"
import SignIn from "./pages/SignIn"
import ChatApp from "./pages/chatApp"

const App = () => {
  return (
    <BrowserRouter>
      <div>
        <Routes>
          <Route path="/" element={<SignIn />} />
          <Route path="/chat" element={<ChatApp />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
