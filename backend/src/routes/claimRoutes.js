const express = require("express")
const router = express.Router()

router.get("/", (req, res) => {
  res.json({ message: "Claims list fetched" })
})

module.exports = router