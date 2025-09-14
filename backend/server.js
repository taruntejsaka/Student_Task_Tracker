require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const authRoutes = require('./routes/auth');
const auth = require('./middleware/auth');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect DB
connectDB(process.env.MONGO_URI);

// Routes
app.use('/api/auth', authRoutes);

// Simple protected test route
app.get('/api/me', auth, (req, res) => {
  res.json({ user: req.user });
});

// Define PORT before using it
const PORT = process.env.PORT || 5000;

// Only listen if this file is run directly (not during tests)
if (require.main === module) {
  app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
}

// Export app for testing
module.exports = app;
