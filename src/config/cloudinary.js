import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

// 🔐 CONFIG
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 📦 STORAGE CONFIG
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "rs_documents", // folder name in cloudinary
    resource_type: "auto", // auto detect (pdf, docx, etc.)
  },
});

export { cloudinary, storage };