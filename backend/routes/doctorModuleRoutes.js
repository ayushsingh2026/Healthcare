import express from "express";
import multer from "multer";
import path from "path";
import protect, { authorize } from "../middleware/authMiddleware.js";
import {
  getDoctorDashboard,
  getDoctorAppointmentsModule,
  getDoctorPatients,
  getDoctorPatientByAppointmentId,
  updateAppointmentStatus,
  updateAppointmentPaymentStatus,
  getDoctorProfile,
  updateDoctorProfile,
  updateDoctorPhoto,
} from "../controllers/doctorModuleController.js";

const router = express.Router();

const photoStorage = multer.diskStorage({
  destination: "uploads/doctor-profiles",
  filename: (req, file, cb) => {
    const safe = file.originalname.replace(/\s+/g, "-");
    cb(null, `${Date.now()}-${safe}`);
  },
});

const photoUpload = multer({
  storage: photoStorage,
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname || "").toLowerCase();
    if (![".jpg", ".jpeg", ".png"].includes(ext)) {
      return cb(new Error("Only JPG, JPEG and PNG files are allowed"));
    }
    return cb(null, true);
  },
  limits: { fileSize: 5 * 1024 * 1024 },
});

router.use(protect, authorize("doctor"));
router.get("/dashboard", getDoctorDashboard);
router.get("/appointments", getDoctorAppointmentsModule);
router.get("/patients", getDoctorPatients);
router.get("/patients/:id", getDoctorPatientByAppointmentId);
router.patch("/appointments/:id/status", updateAppointmentStatus);
router.patch("/appointments/:id/payment-status", updateAppointmentPaymentStatus);
router.get("/profile", getDoctorProfile);
router.patch("/profile", updateDoctorProfile);
router.post("/profile/photo", photoUpload.single("profilePhoto"), updateDoctorPhoto);

export default router;

