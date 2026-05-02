import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { createServer } from 'http';
import { Server } from 'socket.io';
import connectDB from './config/db.js';
import { cloudinary } from './config/cloudinary.js';
import authRoutes from './routes/authRoutes.js';
import contentRoutes from './routes/contentRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import contactRoutes from './routes/contactRoutes.js';

// Initialize Express
const app = express();
const httpServer = createServer(app);

const allowedOrigins = [
  process.env.FRONTEND_URL,
  ...(process.env.ADDITIONAL_ORIGINS ? process.env.ADDITIONAL_ORIGINS.split(',') : [])
].filter(Boolean);

// Fallback for local development if FRONTEND_URL is not set
if (allowedOrigins.length === 0) {
  allowedOrigins.push('http://localhost:3000');
}

// Initialize Socket.io
const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins,
    credentials: true
  }
});

// Connect to Database
connectDB();

// Middleware
app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Attach io to req for controllers
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Routes
console.log('Registering routes...');
app.use('/api/auth', authRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/contacts', contactRoutes);
console.log('Routes registered: /api/auth, /api/content, /api/projects, /api/contacts');

// Socket.io Connection
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);
  
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Health Check Route
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'Server is running',
        mongodb: 'connected',
        socket: 'active',
        cloudinary: cloudinary.config().cloud_name ? 'configured' : 'not configured'
    });
});

// Root Route
app.get('/', (req, res) => {
    res.send('API is running...');
});

// Error Handling Middleware
app.use((err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode).json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
});

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
