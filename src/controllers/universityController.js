import University from "../models/University.js";
import { generateUniversityPDF } from "../services/pdfGenerator.js";
import path from "path";

// @desc    Get all universities with summaries
// @route   GET /api/universities
// @access  Public
export const getUniversities = async (req, res) => {
  try {
    // We select basic info first to keep the initial load lightweight
    const universities = await University.find({}).select("-courses");
    res.json(universities);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving universities", error: error.message });
  }
};

// @desc    Get a single university with full course fees
// @route   GET /api/universities/:id
// @access  Public
export const getUniversityById = async (req, res) => {
  try {
    const university = await University.findById(req.params.id);
    if (!university) {
      return res.status(404).json({ message: "University not found" });
    }
    res.json(university);
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving university details",
      error: error.message,
    });
  }
};

// @desc    Download fee structure PDF for a university
// @route   GET /api/universities/:id/download
// @access  Public
export const downloadUniversityPDF = async (req, res) => {
  try {
    const university = await University.findById(req.params.id);
    if (!university) {
      return res.status(404).json({ message: "University not found" });
    }

    const filePath = path.join(
      process.cwd(),
      "src",
      "uploads",
      "fee-structures",
      university.pdfFile,
    );

    res.download(filePath);
  } catch (error) {
    console.error("PDF Download Error:", error);
    res
      .status(500)
      .json({ message: "Error generating PDF", error: error.message });
  }
};
