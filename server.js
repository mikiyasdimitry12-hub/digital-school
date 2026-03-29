const express = require('express');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));   // Serve HTML files

// Make io accessible in routes
app.set('io', io);

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/teacher', require('./routes/teacher'));
app.use('/api/student', require('./routes/student'));

// Important: Add this if you have /api/school routes
// app.use('/api/school', require('./routes/school'));   // ← Add if you have this file

// Serve HTML pages
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'admin.html')));
app.get('/student', (req, res) => res.sendFile(path.join(__dirname, 'student.html')));
app.get('/teacher', (req, res) => res.sendFile(path.join(__dirname, 'teacher.html')));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI || 'your-mongodb-connection-string-here')
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Socket.io
io.on('connection', (socket) => {
  console.log('User connected');

  socket.on('join-school', (schoolCode) => {
    if (schoolCode) socket.join(schoolCode);
  });

  socket.on('send-message', (data) => {
    if (data.schoolCode) {
      io.to(data.schoolCode).emit('new-message', data);
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});