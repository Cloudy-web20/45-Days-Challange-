const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
const cors = require("cors");
const morgan = require("morgan");

const app = express();
const PORT = 3000;

const mongoUrl = "mongodb://localhost:27017";
const dbName = "WorkDB";
let db;

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

const validateWorkExperience = (req, res, next) => {
  const { company, position, startDate, endDate } = req.body;
  const errors = [];

  if (!company || !company.trim()) errors.push("Company name is required");
  if (!position || !position.trim()) errors.push("Position is required");
  if (!startDate) errors.push("Start date is required");
  if (endDate && startDate && new Date(endDate) < new Date(startDate))
    errors.push("End date must be after start date");

  if (errors.length > 0)
    return res.status(400).json({ success: false, message: "Validation failed", errors });

  next();
};

const validateObjectId = (req, res, next) => {
  const { id } = req.params;
  if (!ObjectId.isValid(id)) return res.status(400).json({ success: false, error: "Invalid ID" });
  next();
};


app.post("/api/work-experiences", validateWorkExperience, async (req, res) => {
  try {
    const result = await db.collection("work_experiences").insertOne(req.body);
    res.json({ success: true, insertedId: result.insertedId.toString() });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});


app.get("/api/work-experiences", async (req, res) => {
  try {
    const data = await db.collection("work_experiences").find().toArray();
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get("/api/work-experiences/:id", validateObjectId, async (req, res) => {
  try {
    const work = await db
      .collection("work_experiences")
      .findOne({ _id: new ObjectId(req.params.id) });
    if (!work) return res.status(404).json({ success: false, error: "Work experience not found" });
    res.json({ success: true, data: work });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.put("/api/work-experiences/:id", validateObjectId, validateWorkExperience, async (req, res) => {
  try {
    const result = await db
      .collection("work_experiences")
      .updateOne({ _id: new ObjectId(req.params.id) }, { $set: req.body });
    if (result.matchedCount === 0)
      return res.status(404).json({ success: false, error: "Work experience not found" });
    res.json({ success: true, modifiedCount: result.modifiedCount });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.delete("/api/work-experiences/:id", validateObjectId, async (req, res) => {
  try {
    const result = await db.collection("work_experiences").deleteOne({ _id: new ObjectId(req.params.id) });
    if (result.deletedCount === 0)
      return res.status(404).json({ success: false, error: "Work experience not found" });
    res.json({ success: true, deletedCount: result.deletedCount });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

MongoClient.connect(mongoUrl)
  .then((client) => {
    db = client.db(dbName);
    console.log("Connected to MongoDB:", dbName);
    app.listen(PORT, () =>
      console.log(`Server running at http://localhost:${PORT}/api/work-experiences`)
    );
  })
  .catch((err) => console.error("MongoDB connection failed:", err));