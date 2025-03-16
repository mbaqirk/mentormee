const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);

module.exports = app;