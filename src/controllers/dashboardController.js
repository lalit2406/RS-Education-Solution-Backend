import Document from "../models/Document.js";
import Task from "../models/Task.js";

export const getDashboardData = async (req, res) => {
  try {
    const user = req.user;

    const documents = await Document.countDocuments({
      user: user._id,
    });

    const tasks = await Task.find({ user: user._id }).sort({
      createdAt: -1,
    });

    const completed = tasks.filter(t => t.status === "completed").length;

    const progress = tasks.length
      ? Math.round((completed / tasks.length) * 100)
      : 0;

    res.json({
      user,
      stats: {
        documents,
        tasks: tasks.length,
        progress,
      },
      tasks: tasks.slice(0, 3),
    });

  } catch (err) {
    res.status(500).json({ message: "Dashboard error" });
  }
};