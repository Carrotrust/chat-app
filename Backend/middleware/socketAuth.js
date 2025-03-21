const jwt = require("jsonwebtoken")
const User = require("../models/users")

// Middleware to authenticate users, before they connect to socket.io
const socketAuth = async (socket, next) => {
  const token = socket.handshake.auth?.token // get token from frontend

  if (!token) return next(new Error("Authentication Error")) // Reject if no token

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET) // verify jwt token
    const user = await User.findById(decoded.userId) // find user in DB
    if (!user) return next(new Error("Not User")) // Reject if user not found

    socket.user = user //Attach user data to  socket
    next()
  } catch (error) {
    next(new Error("Invalid Token"))
  }
}

module.exports = socketAuth
