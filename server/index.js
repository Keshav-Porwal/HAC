// Express backend for Bake Mate
const express = require('express');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
const conversionRoutes = require('./routes/conversionRoutes');
const aiRoutes = require('./routes/aiRoutes');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Replace with your MongoDB URI
const MONGODB_URI = process.env.MONGODB_URL || "";

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/convert', conversionRoutes);
app.use('/api/ai', aiRoutes);

// Connect to MongoDB (commented out until URI is provided)

mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB:', err));


// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../dist')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
  });
}

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
