const express = require('express');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
const conversionRoutes = require('./routes/conversionRoutes');
const aiRoutes = require('./routes/aiRoutes');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// MongoDB URI
const MONGODB_URI = process.env.MONGODB_URL || "";

// Middleware
app.use(cors());
app.use(express.json());

// Debugging middleware to log incoming requests
app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.path}`);
  next();
});

// API Routes
app.use('/api/convert', conversionRoutes);
app.use('/api/ai', aiRoutes);

// Fallback for unmatched API routes
app.all('/api/*', (req, res) => {
  res.status(404).json({ error: 'API route not found' });
});

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB:', err));

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../dist')));

  app.get('*', (req, res) => {
    if (req.path.startsWith('/api/')) {
      return res.status(404).json({ error: 'API route not found' });
    }
    res.sendFile(path.join(__dirname, '../dist/index.html'));
  });
}

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});