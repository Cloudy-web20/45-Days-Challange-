const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const app = express();
const PORT = 3000;
const mongoUrl = 'mongodb://127.0.0.1:27017';
const dbName = 'resumeData';
let db;
async function connectToMongo() {
  const client = new MongoClient(mongoUrl);
  await client.connect();
  console.log('✅ Connected to MongoDB');
  db = client.db(dbName);
}
connectToMongo().catch(err => {
  console.error('Mongo connect error', err);
  process.exit(1);
});
app.use(express.json());
app.get('/api/projects', async (req, res) => {
  try {
    const projects = await db.collection('projects').find().toArray();
    res.json({ success: true, count: projects.length, data: projects });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});
app.post('/api/projects', async (req, res) => {
  try {
    const project = req.body;
    const result = await db.collection('projects').insertOne(project);
    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      data: { _id: result.insertedId, ...project }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});
app.put('/api/projects/:id', async (req, res) => {
  const { id } = req.params;
  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, error: 'Invalid project ID' });
  }
  const objectId = new ObjectId(id);
  const updates = req.body;
  try {
    const result = await db
      .collection('projects')
      .updateOne({ _id: objectId }, { $set: updates });

    if (result.matchedCount === 0) {
      return res.status(404).json({ success: false, error: 'Project not found' });
    }
    res.json({
      success: true,
      message: 'Project updated successfully',
      modifiedCount: result.modifiedCount
    });
  } catch (err) {
    console.error('Update error:', err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});
app.delete('/api/projects/:id', async (req, res) => {
  const { id } = req.params;
  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, error: 'Invalid project ID' });
  }
  const objectId = new ObjectId(id);
  try {
    const result = await db.collection('projects').deleteOne({ _id: objectId });
    if (result.deletedCount === 0) {
      return res.status(404).json({ success: false, error: 'Project not found' });
    }
    return res.status(204).send();
  } catch (err) {
    console.error('Delete error:', err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});
app.get('/', (req, res) => res.send('API is running. Use /api/projects'));
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
