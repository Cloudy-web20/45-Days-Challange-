const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");

const app = express();
const PORT = 3000;

// === Mongo Connection ===
const mongoUrl = "mongodb://127.0.0.1:27017";
const dbName = "day12crud";
let db;

app.use(express.json());

// ✅ Create
app.post("/api/projects", async (req, res) => {
  try {
    const result = await db.collection("projects").insertOne({
      ...req.body,
      createdAt: new Date()
    });
    res.status(201).json({
      success: true,
      message: "Project created successfully",
      projectId: result.insertedId
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Create failed" });
  }
});

// ✅ Read All
app.get("/api/projects", async (_req, res) => {
  try {
    const projects = await db.collection("projects").find().toArray();
    res.json({ success: true, projects });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Fetch failed" });
  }
});

// ✅ Update
app.put("/api/projects/:id", async (req, res) => {
  try {
    const result = await db.collection("projects").updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: { ...req.body, updatedAt: new Date() } }
    );
    if (!result.matchedCount) {
      return res.status(404).json({ success: false, error: "Project not found" });
    }
    res.json({
      success: true,
      message: "Project updated successfully",
      modifiedCount: result.modifiedCount
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Update failed" });
  }
});

// ✅ Delete
app.delete("/api/projects/:id", async (req, res) => {
  try {
    const result = await db.collection("projects").deleteOne({
      _id: new ObjectId(req.params.id)
    });
    if (!result.deletedCount) {
      return res.status(404).json({ success: false, error: "Project not found" });
    }
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Delete failed" });
  }
});

// === Start Server ===
MongoClient.connect(mongoUrl)
  .then((client) => {
    db = client.db(dbName);
    console.log("✅ MongoDB connected");
    app.listen(PORT, () =>
      console.log(`🚀 Server running at http://localhost:${PORT}`)
    );
  })
  .catch((err) => console.error("Mongo connection error:", err));
