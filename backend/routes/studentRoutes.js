import { Router } from "express";
import Student from "../models/Student.js";
import { protect, requireAdmin } from "../middleware/authMiddleware.js";

const router = Router();

router.use(protect);

router.get("/stats", async (req, res) => {
  const [total, active] = await Promise.all([
    Student.countDocuments(),
    Student.countDocuments({ status: "Active" }),
  ]);

  res.json({ total, active });
});

router.get("/", async (req, res) => {
  const page = Math.max(Number.parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(Math.max(Number.parseInt(req.query.limit, 10) || 10, 1), 100);
  const search = typeof req.query.search === "string" ? req.query.search.trim() : "";
  const status = req.query.status;
  const filter = {};

  if (search) {
    const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    filter.$or = [
      { name: { $regex: escapedSearch, $options: "i" } },
      { email: { $regex: escapedSearch, $options: "i" } },
      { course: { $regex: escapedSearch, $options: "i" } },
    ];
  }

  if (status === "Active" || status === "Inactive") {
    filter.status = status;
  }

  const [students, total] = await Promise.all([
    Student.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    Student.countDocuments(filter),
  ]);

  res.json({
    students,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  });
});

router.get("/:id", async (req, res) => {
  const student = await Student.findById(req.params.id);
  if (!student) {
    return res.status(404).json({ message: "Student not found." });
  }
  return res.json({ student });
});

router.post("/", requireAdmin, async (req, res) => {
  const student = await Student.create(req.body);
  res.status(201).json({ student });
});

router.put("/:id", requireAdmin, async (req, res) => {
  const student = await Student.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!student) {
    return res.status(404).json({ message: "Student not found." });
  }

  return res.json({ student });
});

router.delete("/:id", requireAdmin, async (req, res) => {
  const student = await Student.findByIdAndDelete(req.params.id);
  if (!student) {
    return res.status(404).json({ message: "Student not found." });
  }
  return res.json({ message: "Student deleted successfully." });
});

export default router;
