import express from "express";
import multer from "multer";
import path from "path";
import { registerUser, loginUser, getMe, uploadMyProfilePhoto } from "../controllers/authController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

const profileStorage = multer.diskStorage({
  destination: "uploads/profiles",
  filename: (req, file, cb) => {
    const safe = file.originalname.replace(/\s+/g, "-");
    cb(null, `${Date.now()}-${safe}`);
  },
});

const profileUpload = multer({
  storage: profileStorage,
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname || "").toLowerCase();
    if (![".jpg", ".jpeg", ".png"].includes(ext)) {
      return cb(new Error("Only JPG, JPEG and PNG files are allowed"));
    }
    return cb(null, true);
  },
  limits: { fileSize: 5 * 1024 * 1024 },
});

router.post("/register", profileUpload.single("profilePhoto"), registerUser);
router.post("/login", loginUser);
router.get("/me", protect, getMe);
router.post("/profile/photo", protect, profileUpload.single("profilePhoto"), uploadMyProfilePhoto);

export default router;
