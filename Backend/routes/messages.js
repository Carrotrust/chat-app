const express = require("express")
const verifyToken = require("../middleware/apiToken")
const Message = require("../models/messages")

const router = express.Router()

// Get all messages for a specific room
router.get("/:room", verifyToken, async (req, res) => {
  try {
    const messages = await Message.find({ room: req.params.room }).sort({
      createdAt: 1,
    })
    res.json(messages)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
