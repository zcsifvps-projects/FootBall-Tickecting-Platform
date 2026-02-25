import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretjwtkey";

export const authenticate = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "No authorization token" });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid or expired token" });
  }
};

export const requireVerified = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: "Not authenticated" });
  }
  if (!req.user.isVerified) {
    return res.status(403).json({ error: "Email not verified" });
  }
  next();
};

export const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: "Not authenticated" });
  }
  if (!req.user.isAdmin) {
    return res.status(403).json({ error: "Admin access required" });
  }
  next();
};
