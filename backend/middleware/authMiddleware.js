// backend/middleware/authMiddleware.js
const { verifyToken } = require("../utils/jwt");

const authMiddleware = (roles) => {
  return (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    try {
      const decoded = verifyToken(token);
      if (!roles.includes(decoded.role)) {
        return res.status(403).json({ error: "Unauthorized access" });
      }
      req.user = decoded;
      next();
    } catch (error) {
      return res.status(401).json({ error: "Invalid token" });
    }
  };
};

module.exports = authMiddleware;
