const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors()); // This allows your React app (Port 5173) to talk to this API (Port 8000)
app.use(express.json());

const PORT = 8000;

// --- MOCK DATA FOR HACKATHON ---
// In a real app, this would come from a Database
let currentRainLevel = 0; 
let isDisrupted = false;

// 1. Route to check Risk (The React app will call this)
app.get('/api/risk-status', (req, res) => {
    res.json({
        zone: "Sector 62, Noida",
        rainLevel: currentRainLevel,
        isDisrupted: isDisrupted,
        payoutAmount: isDisrupted ? 450 : 0,
        status: isDisrupted ? "CRITICAL" : "STABLE"
    });
});

// 2. Route for your ADMIN to trigger rain (The "Simulate" button)
app.post('/api/simulate-disruption', (req, res) => {
    const { rain } = req.body;
    currentRainLevel = rain;
    isDisrupted = rain > 8; // If rain > 8mm, it's a disruption
    
    res.json({ message: "System state updated", isDisrupted });
});

app.listen(PORT, () => {
    console.log(`🚀 AegisAI Backend running on http://localhost:${PORT}`);
});