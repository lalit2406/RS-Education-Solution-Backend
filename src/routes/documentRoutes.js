import express from "express";
import multer from "multer";
import { storage } from "../config/cloudinary.js";
import Document from "../models/Document.js";
import { protect } from "../middleware/authMiddleware.js";
import crypto from "crypto";
import axios from "axios";

const router = express.Router();

const upload = multer({ storage });

/* =========================
   📤 UPLOAD DOCUMENT
========================= */
router.post("/upload", protect, upload.single("file"), async (req, res) => {
  try {

    // 🔐 FILE TYPE VALIDATION
    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
    ];

    if (!allowedTypes.includes(req.file.mimetype)) {
      return res.status(400).json({
        message: "Only PDF, JPG, PNG files are allowed",
      });
    }

    const doc = await Document.create({
      user: req.user, // ✅ from middleware
      name: req.file.originalname,
      fileUrl: req.file.path,
      size: req.file.size,
      type: req.body.type,
    });

    res.json(doc);
  } catch (err) {
    res.status(500).json({ message: "Upload failed" });
  }
});

/* =========================
   📥 GET ALL DOCUMENTS
========================= */
router.get("/", protect, async (req, res) => {
  try {
    const docs = await Document.find({ user: req.user }).sort({
      createdAt: -1,
    });

    res.json(docs); // ✅ MUST return array
  } catch (err) {
    res.status(500).json({ message: "Error fetching documents" });
  }
});

/* =========================
   ❌ DELETE DOCUMENT
========================= */
router.delete("/:id", protect, async (req, res) => {
  try {
    const doc = await Document.findOneAndDelete({
      _id: req.params.id,
      user: req.user,
    });

    if (!doc) {
      return res.status(404).json({ message: "Document not found" });
    }

    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed" });
  }
});

/* =========================
   ✏️ RENAME DOCUMENT
========================= */
router.put("/:id", protect, async (req, res) => {
  try {
    const { name } = req.body;

    const doc = await Document.findOneAndUpdate(
      { _id: req.params.id, user: req.user },
      { name },
      { new: true }
    );

    if (!doc) {
      return res.status(404).json({ message: "Document not found" });
    }

    res.json(doc);
  } catch (err) {
    res.status(500).json({ message: "Rename failed" });
  }
});

/* =========================
   🔐 SECURE DOWNLOAD
========================= */
router.get("/download/:id", protect, async (req, res) => {
  try {
    const doc = await Document.findOne({
      _id: req.params.id,
      user: req.user, // 🔐 only owner
    });

    if (!doc) {
      return res.status(404).json({ message: "Not found" });
    }

    const response = await axios.get(doc.fileUrl, {
      responseType: "stream",
    });

    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${doc.name}"`
    );

    response.data.pipe(res);
  } catch (err) {
    res.status(500).json({ message: "Download failed" });
  }
});


/* =========================
   🔗 GENERATE SHARE LINK (WITH EXPIRY)
========================= */
router.post("/share/:id", protect, async (req, res) => {
  try {
    const doc = await Document.findOne({
      _id: req.params.id,
      user: req.user,
    });

    if (!doc) {
      return res.status(404).json({ message: "Not found" });
    }

    // 🔑 generate token
    const token = crypto.randomBytes(16).toString("hex");

    // ⏳ set expiry (1 hour)
    const expiry = new Date(Date.now() + 60 * 60 * 1000);

    doc.shareToken = token;
    doc.shareExpires = expiry;

    await doc.save();

    const shareLink = `http://localhost:5000/api/documents/shared/${token}`;

    res.json({ shareLink, expiresAt: expiry });

  } catch (err) {
    res.status(500).json({ message: "Share failed" });
  }
});

/* =========================
   🌍 ACCESS SHARED FILE (WITH EXPIRY CHECK)
========================= */
router.get("/shared/:token", async (req, res) => {
  try {
    const doc = await Document.findOne({
      shareToken: req.params.token,
    });

    if (!doc) {
      return res.status(404).json({ message: "Invalid link" });
    }

    // ⏳ CHECK EXPIRY
    if (!doc.shareExpires || doc.shareExpires < new Date()) {
      return res.status(403).json({ message: "Link expired ⏳" });
    }

    const response = await axios.get(doc.fileUrl, {
      responseType: "stream",
    });

    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${doc.name}"`
    );

    response.data.pipe(res);

  } catch (err) {
    res.status(500).json({ message: "Error" });
  }
});

export default router;