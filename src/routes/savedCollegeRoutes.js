import express from "express";
import {
  saveCollege,
  unsaveCollege,
  getSavedColleges,
} from "../controllers/savedCollegeController.js";

// 🔥 IMPORTANT: your auth middleware
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/* =========================================================
   🔹 SAVE COLLEGE
   POST /api/save-college
========================================================= */
router.post("/save-college", protect, saveCollege);

/* =========================================================
   🔹 GET SAVED COLLEGES
   GET /api/saved-colleges
========================================================= */
router.get("/saved-colleges", protect, getSavedColleges);

/* =========================================================
   🔹 UNSAVE COLLEGE
   DELETE /api/unsave-college/:collegeId
========================================================= */
router.delete("/unsave-college/:collegeId", protect, unsaveCollege);

export default router;