const express = require('express');
const { MongoClient } = require('mongodb');
const app = express();
const PORT = 3000;

// MongoDB config
const mongoUrl = 'mongodb://localhost:27017';
const dbName = 'resumeData';
let db;

// Connect to MongoDB
async function connectDB() {
  const client = new MongoClient(mongoUrl);
  await client.connect();
  console.log('✅ Connected to MongoDB');
  db = client.db(dbName);
}

// Middleware
app.use(express.json());

// Root route
app.get('/', (req, res) => {
  res.send('API is running 🚀  Use /api/projects');
});

// GET all projects
app.get('/api/projects', async (req, res) => {
  const projects = await db.collection('projects').find().toArray();
  res.json({ success: true, count: projects.length, data: projects });
});

// POST new project
app.post('/api/projects', async (req, res) => {
  const project = req.body;
  const result = await db.collection('projects').insertOne(project);
  res.json({
    success: true,
    message: 'Project created successfully',
    data: { _id: result.insertedId, ...project }
  });
});

// Start server after DB connect
connectDB().then(() => {
  app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
});
