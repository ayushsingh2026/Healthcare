import express from "express";
import multer from "multer";
import path from "path";
import protect, { authorize } from "../middleware/authMiddleware.js";
import {
  getLabsByCity,
  getLabTests,
  getAllLabsForAdmin,
  bookLabTest,
  getLabBookings,
  getPatientLabBookings,
  updateLabBookingStatus,
  uploadLabReport,
  createLab,
  updateLab,
  deleteLab,
} from "../controllers/labController.js";

const router = express.Router();

const reportStorage = multer.diskStorage({
  destination: "uploads/reports",
  filename: (req, file, cb) => {
    const safe = file.originalname.replace(/\s+/g, "-");
    cb(null, `${Date.now()}-${safe}`);
  },
});

const reportUpload = multer({
  storage: reportStorage,
  fileFilter: (req, file, cb) => {
    const allowedExt = [".pdf", ".jpg", ".jpeg", ".png"];
    const ext = path.extname(file.originalname || "").toLowerCase();
    if (!allowedExt.includes(ext)) {
      return cb(new Error("Only PDF, JPG, JPEG and PNG files are allowed"));
    }
    return cb(null, true);
  },
  limits: { fileSize: 10 * 1024 * 1024 },
});

router.get("/labs", protect, authorize("patient", "admin"), getLabsByCity);
router.get("/admin/labs", protect, authorize("admin"), getAllLabsForAdmin);
router.post("/admin/labs", protect, authorize("admin"), createLab);
router.patch("/admin/labs/:id", protect, authorize("admin"), updateLab);
router.delete("/admin/labs/:id", protect, authorize("admin"), deleteLab);
router.get("/labs/:id/tests", protect, authorize("patient", "admin"), getLabTests);
router.post("/bookings", protect, authorize("patient"), bookLabTest);
router.get("/patient/bookings", protect, authorize("patient"), getPatientLabBookings);
router.get("/bookings", protect, authorize("lab", "admin"), getLabBookings);
router.patch("/bookings/:id/status", protect, authorize("lab"), updateLabBookingStatus);
router.patch(
  "/bookings/:id/report",
  protect,
  authorize("lab"),
  reportUpload.single("reportFile"),
  uploadLabReport
);

export default router;
