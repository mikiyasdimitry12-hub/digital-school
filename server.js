const express = require('express');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);

// Important: Socket.io with CORS (this often fixes connection issues)
const io = new Server(server, {
  cors: {
    origin: "*",                  // For now use * (later you can restrict it)
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Middleware
app.use(express.json());

// Serve all static files (HTML, CSS, JS inside HTML)
app.use(express.static(__dirname));   // ← This is very important

// Load your route files (adjust the paths if needed)
app.use('/api/auth', require('./routes/auth'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/teacher', require('./routes/teacher'));
app.use('/api/student', require('./routes/student'));
// Add any other routes you have...

// Serve the HTML files directly
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin.html'));
});

app.get('/student', (req, res) => {
  res.sendFile(path.join(__dirname, 'student.html'));
});

app.get('/teacher', (req, res) => {
  res.sendFile(path.join(__dirname, 'teacher.html'));
});

// Catch-all for 404 (optional but helpful)
app.use((req, res) => {
  res.status(404).send('Page not found');
});

// Socket.io connection
io.on('connection', (socket) => {
  console.log('User connected');

  socket.on('join-school', (schoolCode) => {
    socket.join(schoolCode);
  });

  socket.on('send-message', (data) => {
    io.to(data.schoolCode).emit('new-message', data);
  });
});

// Use PORT from Railway (very important)
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});