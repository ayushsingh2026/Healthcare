import express from "express";
import multer from "multer";
import path from "path";
import protect, { authorize } from "../middleware/authMiddleware.js";
import {
  getDashboardStats,
  getLabAssistants,
  getAdminDoctors,
  createAdminDoctor,
  getAdminDoctorById,
  updateAdminDoctor,
  deleteAdminDoctor,
  getAdminPatients,
  getAdminPatientById,
  updateAdminPatient,
  deleteAdminPatient,
  getAdminLabs,
  createAdminLab,
  updateAdminLab,
  deleteAdminLab,
  getAdminAppointments,
  updateAdminAppointment,
  deleteAdminAppointment,
  getAdminPayments,
  updateAdminPayment,
  getAdminReports,
  deleteAdminReport,
  getAdminSettings,
  updateAdminSettings,
  getAdminNotifications,
} from "../controllers/adminController.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: "uploads/admin-assets",
  filename: (req, file, cb) => {
    const safe = file.originalname.replace(/\s+/g, "-");
    cb(null, `${Date.now()}-${safe}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname || "").toLowerCase();
    if (![".jpg", ".jpeg", ".png", ".pdf"].includes(ext)) {
      return cb(new Error("Only JPG, JPEG, PNG and PDF files are allowed"));
    }
    return cb(null, true);
  },
  limits: { fileSize: 10 * 1024 * 1024 },
});

router.use(protect, authorize("admin"));

router.get("/dashboard", getDashboardStats);
router.get("/lab-assistants", getLabAssistants);
router.get("/notifications", getAdminNotifications);

router.get("/doctors", getAdminDoctors);
router.post("/doctors", upload.single("photo"), createAdminDoctor);
router.get("/doctors/:id", getAdminDoctorById);
router.patch("/doctors/:id", upload.single("photo"), updateAdminDoctor);
router.delete("/doctors/:id", deleteAdminDoctor);

router.get("/patients", getAdminPatients);
router.get("/patients/:id", getAdminPatientById);
router.patch("/patients/:id", upload.single("photo"), updateAdminPatient);
router.delete("/patients/:id", deleteAdminPatient);

router.get("/labs", getAdminLabs);
router.post("/labs", upload.single("logo"), createAdminLab);
router.patch("/labs/:id", upload.single("logo"), updateAdminLab);
router.delete("/labs/:id", deleteAdminLab);

router.get("/appointments", getAdminAppointments);
router.patch("/appointments/:id", updateAdminAppointment);
router.delete("/appointments/:id", deleteAdminAppointment);

router.get("/payments", getAdminPayments);
router.patch("/payments/:id", updateAdminPayment);

router.get("/reports", getAdminReports);
router.delete("/reports/:id", deleteAdminReport);

router.get("/settings", getAdminSettings);
router.patch("/settings", updateAdminSettings);

export default router;

