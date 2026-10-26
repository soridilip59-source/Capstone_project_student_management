import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

function createToken(user) {
  return jwt.sign(
    { sub: user._id.toString() },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
  );
}

function userResponse(user) {
  return {
    id: user._id,
    name: user.name,
    username: user.username,
    email: user.email,
    role: user.role,
  };
}

router.post("/register", async (req, res) => {
  return res.status(403).json({
    message: "Public registration is disabled. Ask an administrator to create your account.",
  });
});

router.post("/login", async (req, res) => {
  const { identifier, password } = req.body;

  if (typeof identifier !== "string" || typeof password !== "string") {
    return res.status(400).json({ message: "Username or email and password are required." });
  }

  const normalizedIdentifier = identifier.trim().toLowerCase();
  const user = await User.findOne({
    $or: [
      { email: normalizedIdentifier },
      { username: normalizedIdentifier },
    ],
  }).select("+password");
  const passwordMatches = user && await bcrypt.compare(password, user.password);

  if (!passwordMatches) {
    return res.status(401).json({ message: "Invalid email or password." });
  }

  return res.json({
    token: createToken(user),
    user: userResponse(user),
  });
});

router.get("/me", protect, (req, res) => {
  res.json({ user: userResponse(req.user) });
});

export default router;
