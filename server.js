// server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// static frontend (later)
app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 4000;
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    app.listen(PORT, () => console.log(`✅ Server running at http://localhost:${PORT}`));
  })
  .catch(err => console.error('DB connection error:', err));
