const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const tokenBlacklist = new Set(); // simple in-memory blacklist for demo

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email and password are required.' });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) return res.status(409).json({ error: 'Email already registered.' });

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = new User({ name, email: email.toLowerCase(), passwordHash });
    await user.save();

    return res.status(201).json({ message: 'Registration successful.' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error during registration.' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required.' });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(401).json({ error: 'Invalid credentials.' });

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials.' });

    const payload = { userId: user._id, email: user.email, name: user.name };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '2h' });

    // for demo, return token in body. In production use secure cookie or refresh tokens.
    return res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error during login.' });
  }
};

const logout = async (req, res) => {
  try {
    // Expect token in Authorization header 'Bearer <token>'
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.status(400).json({ error: 'Authorization token required.' });

    const token = authHeader.split(' ')[1];
    if (!token) return res.status(400).json({ error: 'Authorization token required.' });

    // Add to blacklist (demo). Note: memory lost on restart.
    tokenBlacklist.add(token);
    return res.json({ message: 'Logged out successfully.' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error during logout.' });
  }
};

const isBlacklisted = (token) => tokenBlacklist.has(token);

module.exports = { register, login, logout, isBlacklisted };
