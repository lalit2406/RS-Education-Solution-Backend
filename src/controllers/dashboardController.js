import Document from "../models/Document.js";
import Task from "../models/Task.js";
import User from "../models/User.js";
import SavedCollege from "../models/SavedCollege.js";

export const getDashboardData = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("name");

    const documents = await Document.countDocuments({
      user: req.user._id,
    });

    const savedColleges = await SavedCollege.countDocuments({
  user: req.user._id,
});

    const tasks = await Task.find({ user: req.user._id }).sort({
      createdAt: -1,
    });

    const completed = tasks.filter(t => t.status === "completed").length;

    const progress = tasks.length
      ? Math.round((completed / tasks.length) * 100)
      : 0;

    res.json({
      user,
      savedColleges,
      stats: {
        documents,
        tasks: tasks.length,
        progress,
      },
      tasks: tasks.slice(0, 3),
    });

  } catch (err) {
    console.log(err); // 👈 ADD THIS (important)
    res.status(500).json({ message: "Dashboard error" });
  }
};