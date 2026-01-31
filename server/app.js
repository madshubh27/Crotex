const express = require("express");
const cors = require("cors");
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/auth');
const drawingRoutes = require('./routes/drawings');
const { checkDBConnection } = require('./config/database');

const app = express();

// Enable CORS for all routes
app.use(
  cors({
    origin: "*", // Allow all origins for testing
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: false,
  })
);

// Parse JSON bodies
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/drawings', drawingRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  const dbStatus = checkDBConnection();
  res.json({
    success: true,
    status: 'Server is running',
    database: dbStatus,
    timestamp: new Date().toISOString()
  });
});

app.get("/", (req, res) => {
    res.send("<h1>Synthezy API</h1><p>Server is running.</p>");
});

module.exports = app;
