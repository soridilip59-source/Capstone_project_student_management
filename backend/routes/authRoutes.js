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
    email: user.email,
    role: user.role,
  };
}

router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  if (
    typeof name !== "string" ||
    name.trim().length < 2 ||
    name.trim().length > 80 ||
    typeof email !== "string" ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) ||
    typeof password !== "string" ||
    password.length < 8
  ) {
    return res.status(400).json({
      message: "Enter a valid name, email, and password of at least 8 characters.",
    });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const existingUser = await User.exists({ email: normalizedEmail });

  if (existingUser) {
    return res.status(409).json({ message: "An account with this email already exists." });
  }

  const role = (await User.countDocuments()) === 0 ? "admin" : "staff";
  const hashedPassword = await bcrypt.hash(password, 12);
  const userDetails = {
    name: name.trim(),
    email: normalizedEmail,
    password: hashedPassword,
    role,
  };
  let user;

  try {
    user = await User.create(userDetails);
  } catch (error) {
    if (role !== "admin" || error.code !== 11000 || !error.keyPattern?.role) {
      throw error;
    }
    user = await User.create({ ...userDetails, role: "staff" });
  }

  return res.status(201).json({
    token: createToken(user),
    user: userResponse(user),
  });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (typeof email !== "string" || typeof password !== "string") {
    return res.status(400).json({ message: "Email and password are required." });
  }

  const user = await User.findOne({ email: email.trim().toLowerCase() }).select("+password");
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
