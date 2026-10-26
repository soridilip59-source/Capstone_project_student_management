import { Router } from "express";
import Course from "../models/Course.js";
import { protect, requireAdmin } from "../middleware/authMiddleware.js";

const router = Router();

router.use(protect);

router.get("/", async (req, res) => {
  const page = Math.max(Number.parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(Number.parseInt(req.query.limit, 10) || 10, 1), 100);
  const [courses, total] = await Promise.all([
    Course.find().sort({ name: 1 }).skip((page - 1) * limit).limit(limit),
    Course.countDocuments(),
  ]);

  res.json({
    courses,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  });
});

router.get("/:id", async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course) {
    return res.status(404).json({ message: "Course not found." });
  }
  return res.json({ course });
});

router.post("/", requireAdmin, async (req, res) => {
  const course = await Course.create(req.body);
  res.status(201).json({ course });
});

router.put("/:id", requireAdmin, async (req, res) => {
  const course = await Course.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!course) {
    return res.status(404).json({ message: "Course not found." });
  }

  return res.json({ course });
});

router.delete("/:id", requireAdmin, async (req, res) => {
  const course = await Course.findByIdAndDelete(req.params.id);
  if (!course) {
    return res.status(404).json({ message: "Course not found." });
  }
  return res.json({ message: "Course deleted successfully." });
});

export default router;
