const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
require('dotenv').config();

const app = express();
app.use(cors()); // This allows your React app (Port 5173) to talk to this API (Port 8000)
app.use(express.json());

const PORT = process.env.PORT || 8000;

// PostgreSQL Connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// Initialize Database Table
pool.query(`
  CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    phone VARCHAR(20) UNIQUE,
    password_hash TEXT,
    aadhaar VARCHAR(50),
    dl VARCHAR(50),
    rc VARCHAR(50),
    zone VARCHAR(50),
    upi_id VARCHAR(100)
  )
`).then(() => console.log('✅ Postgres DB initialized'))
  .catch(err => console.log('⚠️ DB Init Error (If no DATABASE_URL set, ignore):', err.message));


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

// --- AUTHENTICATION ROUTES ---

// Sign Up
app.post('/api/signup', async (req, res) => {
  const { name, phone, password, aadhaar, dl, rc, zone, upi } = req.body;
  
  if (!name || !phone || !password) {
      return res.status(400).json({ error: "Required fields missing" });
  }

  try {
    const hash = await bcrypt.hash(password, 10);
    await pool.query(
      `INSERT INTO users (name, phone, password_hash, aadhaar, dl, rc, zone, upi_id) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [name, phone, hash, aadhaar, dl, rc, zone, upi]
    );
    res.status(201).json({ message: "Registration successful" });
  } catch(e) {
    if (e.code === '23505') { // Postgres unique violation (Phone already exists)
        return res.status(409).json({ error: "Phone number already registered" });
    }
    res.status(500).json({ error: e.message });
  }
});

// Sign In
app.post('/api/signin', async (req, res) => {
  const { phone, password } = req.body;

  try {
    const result = await pool.query('SELECT * FROM users WHERE phone = $1', [phone]);
    if (result.rows.length === 0) return res.status(401).json({ error: "User not found" });
    
    const user = result.rows[0];
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return res.status(401).json({ error: "Invalid password" });
    
    // Don't send the password back to frontend
    delete user.password_hash;
    
    res.json({ message: "Logged in successfully", user });
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
});

// Update Settings
app.post('/api/update-settings', async (req, res) => {
  const { phone, name, upi_id } = req.body;
  if (!phone) return res.status(400).json({ error: "Phone number required to identify user" });

  try {
    await pool.query(
      'UPDATE users SET name = COALESCE($1, name), upi_id = COALESCE($2, upi_id) WHERE phone = $3',
      [name, upi_id, phone]
    );
    
    // Fetch updated user
    const result = await pool.query('SELECT * FROM users WHERE phone = $1', [phone]);
    const user = result.rows[0];
    delete user.password_hash;

    res.json({ message: "Settings updated successfully", user });
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
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