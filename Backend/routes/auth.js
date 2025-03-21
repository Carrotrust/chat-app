const express = require("express")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const User = require("../models/users")
const router = express.Router()
// const authMiddleware = require("../middleware/authMiddleware")

// Register routes
router.post("/register", async (req, res) => {
  console.log("Request Body:", req.body) //
  try {
    const { username, email, password } = req.body

    // Check if user exists
    let user = await User.findOne({ email })
    if (user) return res.status(400).json({ message: "User already exists" })

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create a new User
    user = new User({ username, email, password: hashedPassword })
    await user.save()
    return res.status(201).json({ message: "User created successfully" })
  } catch (err) {
    res.status(500).json({ err: err.message })
  }
})

//Login Route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body

    //check if user exists
    let user = await User.findOne({ email })
    if (!user) return res.sendStatus(403)

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) return res.sendStatus(403)

    // Generate Tokens
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    })

    res.json({ token, user: { email: user.email } })
  } catch (err) {
    res.sendStatus(500).json({ err: err.message })
  }
})

module.exports = router
