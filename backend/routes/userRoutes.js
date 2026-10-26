import { Router } from "express";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { protect, requireAdmin } from "../middleware/authMiddleware.js";

const router = Router();

router.use(protect, requireAdmin);

router.get("/", async (req, res) => {
  const users = await User.find()
    .select("name username email role createdAt")
    .sort({ createdAt: -1 });

  res.json({ users });
});

router.post("/", async (req, res) => {
  const { name, username, email, password } = req.body;

  if (
    typeof name !== "string" ||
    name.trim().length < 2 ||
    name.trim().length > 80 ||
    typeof username !== "string" ||
    !/^[a-zA-Z0-9._-]{3,30}$/.test(username.trim()) ||
    typeof email !== "string" ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) ||
    typeof password !== "string" ||
    password.length < 8 ||
    password.length > 72
  ) {
    return res.status(400).json({
      message: "Enter a valid name, username, email, and password (8-72 characters).",
    });
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  const user = await User.create({
    name: name.trim(),
    username: username.trim().toLowerCase(),
    email: email.trim().toLowerCase(),
    password: hashedPassword,
    role: "staff",
  });

  return res.status(201).json({
    user: {
      id: user._id,
      name: user.name,
      username: user.username,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    },
  });
});

export default router;
