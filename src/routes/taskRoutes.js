import express from "express";
import Task from "../models/Task.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/* =========================
   ➕ CREATE TASK
========================= */
router.post("/", protect, async (req, res) => {
  try {
    const task = await Task.create({
      user: req.user._id,
      title: req.body.title,
      category: req.body.category,
      dueDate: req.body.dueDate,
    });

    res.json(task);
  } catch (err) {
    res.status(500).json({ message: "Task creation failed" });
  }
});

/* =========================
   📥 GET TASKS
========================= */
router.get("/", protect, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user._id }).sort({
      createdAt: -1,
    });

    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: "Fetch failed" });
  }
});

/* =========================
   ✅ COMPLETE TASK
========================= */
router.put("/:id", protect, async (req, res) => {
  try {
    const { title, category, dueDate, status } = req.body;

    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      {
        ...(title && { title }),
        ...(category && { category }),
        ...(dueDate && { dueDate }),
        ...(status && { status }),
      },
      { new: true }
    );

    res.json(task);
  } catch (err) {
    res.status(500).json({ message: "Update failed" });
  }
});

/* =========================
   ❌ DELETE TASK
========================= */
router.delete("/:id", protect, async (req, res) => {
  try {
    await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed" });
  }
});

export default router;