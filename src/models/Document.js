import mongoose from "mongoose";

const documentSchema = new mongoose.Schema(
  {
    // 🔗 OWNER (USER)
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // 📄 FILE NAME
    name: {
      type: String,
      required: true,
    },

    // ☁️ CLOUDINARY URL
    fileUrl: {
      type: String,
      required: true,
    },

    // 📦 FILE SIZE (in bytes)
    size: {
      type: Number,
    },

    // 📂 TYPE (for filter)
    type: {
      type: String,
      enum: ["certificate", "transcript", "notes"],
      default: "notes",
    },

    // 🔗 SHARE FEATURE (future use)
    shared: {
      type: Boolean,
      default: false,
    },

    // 🏷️ TAGS (future AI / filtering)
    tags: {
      type: [String],
      default: [],
    },

    shareToken: {
      type: String,
      default: null,
    },

    shareExpires: {
      type: Date,
      default: null,
    },

  },
  {
    timestamps: true,
  }
);

const Document = mongoose.model("Document", documentSchema);

export default Document;