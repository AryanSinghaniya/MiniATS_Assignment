require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const connectDB = require('./config/db');
const candidateRoutes = require('./routes/candidates');
const dashboardRoutes = require('./routes/dashboard');
const errorHandler = require('./middleware/errorHandler');

// Connect to MongoDB
connectDB();

const app = express();

// ─── Core Middleware ───────────────────────────────────────────────────────
// Allow configured CLIENT_URL (supports comma-separated list of origins) plus localhost in dev
const rawClientUrls = process.env.CLIENT_URL || 'http://localhost:5173';
const allowedOrigins = rawClientUrls.split(',').map((url) => url.trim()).filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    if (
      !origin ||
      allowedOrigins.includes(origin) ||
      (process.env.NODE_ENV !== 'production' && origin.startsWith('http://localhost'))
    ) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// ─── Routes ───────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'ATS API is running', timestamp: new Date() });
});

app.use('/api/candidates', candidateRoutes);
app.use('/api/dashboard', dashboardRoutes);

// 404 handler for unmatched routes
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Central error handler (must be last)
app.use(errorHandler);

// ─── Start Server ──────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
