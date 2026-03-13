const express = require("express")
const router = express.Router()

router.post("/trigger-event", (req, res) => {
  res.json({
    message: "Disruption event triggered successfully"
  })
})

module.exports = router