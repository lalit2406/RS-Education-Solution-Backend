import SavedCollege from "../models/SavedCollege.js";

/* =========================================================
   🔹 SAVE COLLEGE
========================================================= */
export const saveCollege = async (req, res) => {
  try {
    const userId = req.user._id;

    const {
      name,
      city,
      state,
      type,
      fees_per_year,
      placement_avg_lpa,
      naac_grade,
      reason,
      collegeId,
    } = req.body;

    // 🔥 prevent duplicate save
    const exists = await SavedCollege.findOne({
      user: userId,
      collegeId,
    });

    if (exists) {
      return res.status(400).json({
        message: "College already saved",
      });
    }

    const newCollege = await SavedCollege.create({
      user: userId,
      name,
      city,
      state,
      type,
      fees_per_year,
      placement_avg_lpa,
      naac_grade,
      reason,
      collegeId,
    });

    res.status(201).json(newCollege);
  } catch (error) {
    res.status(500).json({
      message: "Failed to save college",
    });
  }
};

/* =========================================================
   🔹 UNSAVE COLLEGE
========================================================= */
export const unsaveCollege = async (req, res) => {
  try {
    const userId = req.user._id;
    const { collegeId } = req.params;

    const deleted = await SavedCollege.findOneAndDelete({
      user: userId,
      collegeId,
    });

    if (!deleted) {
      return res.status(404).json({
        message: "College not found",
      });
    }

    res.json({
      message: "College removed successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to remove college",
    });
  }
};

/* =========================================================
   🔹 GET SAVED COLLEGES
========================================================= */
export const getSavedColleges = async (req, res) => {
  try {
    const userId = req.user._id;

    const colleges = await SavedCollege.find({
      user: userId,
    }).sort({ createdAt: -1 });

    res.json(colleges);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch saved colleges",
    });
  }
};