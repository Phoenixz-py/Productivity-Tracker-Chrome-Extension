const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/productivity_tracker", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1); // Exit process if connection fails
  });

// Schema and Model
const UserSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  blockedSites: { type: [String], default: [] },
  timeLogs: [
    {
      site: String,
      duration: Number,
      date: { type: Date, default: Date.now },
    },
  ],
});

const User = mongoose.model("User", UserSchema);

// API Endpoints
app.post("/api/block-site", async (req, res) => {
  const { userId, site } = req.body;

  // Check for required fields
  if (!userId || !site) {
    return res.status(400).json({ message: "User ID and site are required" });
  }

  try {
    let user = await User.findOne({ userId });
    if (!user) {
      user = new User({ userId });
    }

    if (!user.blockedSites.includes(site)) {
      user.blockedSites.push(site);
      await user.save();
      return res.status(200).json({ message: "Site blocked successfully" });
    } else {
      return res.status(400).json({ message: "Site is already blocked" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred while blocking the site" });
  }
});

app.get("/api/blocked-sites/:userId", async (req, res) => {
  try {
    const user = await User.findOne({ userId: req.params.userId });
    res.status(200).json(user ? user.blockedSites : []);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred while fetching blocked sites" });
  }
});
app.post("/api/log-time", async (req, res) => {
  const { userId, site, duration } = req.body;
  if (!userId || !site || typeof duration !== "number") {
    return res.status(400).json({ message: "Invalid data" });
  }
  try {
    let user = await User.findOne({ userId });
    if (!user) user = new User({ userId, timeLogs: [] });
    user.timeLogs.push({ site, duration });
    await user.save();
    res.status(200).json({ message: "Time logged successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// app.post("/api/log-time", async (req, res) => {
//   const { userId, site, duration } = req.body;

//   // Validate input fields
//   if (!userId || !site || typeof duration !== 'number') {
//     return res.status(400).json({ message: "User ID, site, and duration are required" });
//   }

//   try {
//     let user = await User.findOne({ userId });
//     if (!user) {
//       user = new User({ userId, timeLogs: [] });
//     }

//     user.timeLogs.push({ site, duration });
//     await user.save();

//     res.status(200).json({ message: "Time logged successfully" });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "An error occurred while logging time" });
//   }
// });

app.get("/api/productivity-report/:userId", async (req, res) => {
  try {
    const user = await User.findOne({ userId: req.params.userId });
    res.status(200).json(user ? user.timeLogs : []);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "An error occurred while fetching productivity report" });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
