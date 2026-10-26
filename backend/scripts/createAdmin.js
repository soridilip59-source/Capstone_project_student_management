import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import connectDatabase from "../config/db.js";
import User from "../models/User.js";

const { ADMIN_USERNAME, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;

if (
  !ADMIN_USERNAME ||
  !/^[a-zA-Z0-9._-]{3,30}$/.test(ADMIN_USERNAME) ||
  !ADMIN_EMAIL ||
  !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(ADMIN_EMAIL) ||
  !ADMIN_PASSWORD ||
  ADMIN_PASSWORD.length < 12 ||
  ADMIN_PASSWORD.length > 72
) {
  throw new Error(
    "Set valid ADMIN_USERNAME, ADMIN_EMAIL, and ADMIN_PASSWORD (12-72 characters) in backend/.env."
  );
}

try {
  await connectDatabase();

  const existingAdmin = await User.findOne({ role: "admin" });
  if (existingAdmin) {
    const normalizedUsername = ADMIN_USERNAME.toLowerCase();
    const usernameOwner = await User.exists({
      _id: { $ne: existingAdmin._id },
      username: normalizedUsername,
    });

    if (!existingAdmin.username && !usernameOwner) {
      existingAdmin.username = normalizedUsername;
      await existingAdmin.save();
      console.log("Added the configured username to the existing administrator.");
    } else {
      console.log("An administrator already exists; no account or password was changed.");
    }
  } else {
    const normalizedUsername = ADMIN_USERNAME.toLowerCase();
    const normalizedEmail = ADMIN_EMAIL.trim().toLowerCase();
    const existingAccount = await User.exists({
      $or: [{ username: normalizedUsername }, { email: normalizedEmail }],
    });

    if (existingAccount) {
      throw new Error("The configured admin username or email is already used by a non-admin account.");
    }

    const password = await bcrypt.hash(ADMIN_PASSWORD, 12);
    await User.create({
      name: ADMIN_USERNAME,
      username: normalizedUsername,
      email: normalizedEmail,
      password,
      role: "admin",
    });
    console.log("Administrator account created. Sign in using its username or email.");
  }
} finally {
  await mongoose.disconnect();
}
