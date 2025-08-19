// backend/server.js
const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const customerRoutes = require("./routes/customer");
const userRoutes = require("./routes/user");
const optiRoutes = require("./routes/opti");
const salesRoutes = require("./routes/sales"); // Baris ini ditambahkan

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Rate limiting untuk login
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: "Too many login attempts, please try again later.",
});
app.use("/api/auth/login", loginLimiter);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/customer", customerRoutes);
app.use("/api/user", userRoutes);
app.use("/api/opti", optiRoutes);
app.use("/api/sales", salesRoutes); // Baris ini ditambahkan

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});