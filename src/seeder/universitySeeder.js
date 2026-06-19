import dotenv from "dotenv";
import connectDB from "../config/db.js";
import University from "../models/University.js";
import universities from "../data/universities.js";

dotenv.config();

const seedData = async () => {
  try {
    await connectDB();

    await University.deleteMany();

    await University.insertMany(universities);

    console.log("11 Universities Imported Successfully");

    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedData();