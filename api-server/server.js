const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// 🔒 Security & Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['*'],
  credentials: true
}));

// 📊 Logging
app.use(morgan('combined'));

// 🚦 Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests, please try again later.'
});
app.use('/api/', limiter);

// 📝 Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// 🏠 Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    service: 'Wee Saviya AI Assistant'
  });
});

// 🤖 AI Assistant Routes
app.use('/api/ai', require('./routes/ai'));
app.use('/api/knowledge', require('./routes/knowledge'));
app.use('/api/tour', require('./routes/tour'));

// 🌐 WebSocket for real-time chat
const http = require('http');
const socketIo = require('socket.io');
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// WebSocket connection handling
io.on('connection', (socket) => {
  console.log('📱 User connected:', socket.id);
  
  socket.on('ai-message', async (data) => {
    try {
      // Process message through AI service
      const response = await processAIMessage(data);
      socket.emit('ai-response', response);
    } catch (error) {
      socket.emit('ai-error', { message: 'Sorry, I encountered an error.' });
    }
  });

  socket.on('disconnect', () => {
    console.log('📱 User disconnected:', socket.id);
  });
});

// 🚫 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    message: 'The requested endpoint does not exist.'
  });
});

// 🚨 Error handler
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.stack);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong!'
  });
});

// 🚀 Start server
server.listen(PORT, () => {
  console.log(`
🌾 Wee Saviya AI Assistant Server
🚀 Server running on port ${PORT}
🌐 Environment: ${process.env.NODE_ENV || 'development'}
📡 API endpoint: http://localhost:${PORT}/api
🏥 Health check: http://localhost:${PORT}/health
  `);
});

// Placeholder AI processing function
async function processAIMessage(data) {
  // This will be connected to n8n workflows
  return {
    message: "Hello! I'm your agricultural assistant. How can I help you today?",
    language: data.language || 'en',
    timestamp: new Date().toISOString()
  };
}

module.exports = app;