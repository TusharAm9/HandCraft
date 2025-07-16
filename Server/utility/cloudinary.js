import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import dotenv from "dotenv";
dotenv.config();

import { CloudinaryStorage } from "multer-storage-cloudinary";

if (
  !process.env.CLOUDINARY_CLOUD_NAME ||
  !process.env.CLOUDINARY_API_KEY ||
  !process.env.CLOUDINARY_API_SECRET
) {
  throw new Error("Cloudinary configuration is missing. Check .env variables.");
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "Artician Crafts",
    allowed_formats: ["jpg", "jpeg", "png"],
    transformation: [
      {
        quality: "auto:best", // Best quality with auto optimization
        fetch_format: "auto", // Auto format selection (WebP for supported browsers)
        flags: "progressive", // Progressive JPEG loading
      },
    ],
    // Optional: Add timestamp to filename for uniqueness
    public_id: (req, file) => {
      const timestamp = Date.now();
      const originalName = file.originalname.split(".")[0];
      return `product_${timestamp}_${originalName}`;
    },
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"), false);
    }
  },
});

export default upload;
