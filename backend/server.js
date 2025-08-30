// backend/server.js

const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const path = require("path"); // Import path module
require("dotenv").config();

const authRoutes = require("./routes/auth");
const customerRoutes = require("./routes/customer");
const userRoutes = require("./routes/user");
const optiRoutes = require("./routes/opti");
const salesRoutes = require("./routes/sales");
const trainingRoutes = require("./routes/training");
const projectRoutes = require("./routes/project");
const outsourceRoutes = require("./routes/outsource");
const skillRoutes = require("./routes/skill");
const adminRoutes = require("./routes/admin");
const expertRoutes = require("./routes/expert");

const app = express();

app.use(cors());
app.use(express.json());

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: "Too many login attempts, please try again later.",
});
app.use("/api/auth/login", loginLimiter);

app.use("/api/auth", authRoutes);
app.use("/api/customer", customerRoutes);
app.use("/api/user", userRoutes);
app.use("/api/opti", optiRoutes);
app.use("/api/sales", salesRoutes);
app.use("/api/training", trainingRoutes);
app.use("/api/project", projectRoutes);
app.use("/api/outsource", outsourceRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/admin", adminRoutes);

// Route to force download for proposal PDFs
app.get('/uploads/proposals/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, 'uploads', 'proposals', filename);
  res.download(filePath, (err) => {
    if (err) {
      console.error('Error downloading file:', err);
      console.error('Attempted file path:', filePath);
      if (err.code === 'ENOENT') {
        res.status(404).send('File not found.');
      } else if (err.code === 'EACCES') {
        res.status(403).send('Permission denied to access file.');
      } else {
        res.status(500).send('Server error during download.');
      }
    }
  });
});
app.use("/api/expert", expertRoutes);

app.use('/uploads', express.static('uploads'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
