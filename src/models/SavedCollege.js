import mongoose from "mongoose";

const savedCollegeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    name: {
      type: String,
      required: true,
    },

    city: String,
    state: String,
    type: String,

    fees_per_year: String,
    placement_avg_lpa: Number,
    naac_grade: String,

    reason: String,

    // 🔥 important unique identifier
    collegeId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("SavedCollege", savedCollegeSchema);