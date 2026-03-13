const express = require("express")
const cors = require("cors")
require("dotenv").config()

const authRoutes = require("./src/routes/authRoutes")
const policyRoutes = require("./src/routes/policyRoutes")
const claimRoutes = require("./src/routes/claimRoutes")
const adminRoutes = require("./src/routes/adminRoutes")

const app = express()

app.use(cors())
app.use(express.json())

app.get("/", (req, res) => {
  res.send("Gig Insurance Backend Running 🚀")
})

app.use("/api/auth", authRoutes)
app.use("/api/policy", policyRoutes)
app.use("/api/claims", claimRoutes)
app.use("/api/admin", adminRoutes)

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})