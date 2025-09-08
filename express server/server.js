// server.js
const express = require('express');
const app = express();

// /api route
app.get('/api', (req, res) => {
  res.json({ message: 'API is running!' });
});

// Start server
app.listen(3000, () => {
  console.log(' Server running at http://localhost:3000');
});
