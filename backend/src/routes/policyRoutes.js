const express = require("express")
const router = express.Router()

router.post("/buy", (req, res) => {
  res.json({ message: "Policy purchased successfully" })
})

router.get("/my-policy", (req, res) => {
  res.json({ message: "User policy details" })
})

module.exports = router