const express = require('express');
const path = require('path');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
  cors: { origin: "*", methods: ["GET", "POST"] }   // Important for Socket.io
});

// Serve static HTML files
app.use(express.static(__dirname));   // This serves admin.html, student.html, teacher.html directly

// Example routes for your HTML files (add these)
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'admin.html')));
app.get('/student', (req, res) => res.sendFile(path.join(__dirname, 'student.html')));
app.get('/teacher', (req, res) => res.sendFile(path.join(__dirname, 'teacher.html')));

// Your existing API routes here (e.g. app.post('/api/school/register', ...))

// Important: Use process.env.PORT
const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});