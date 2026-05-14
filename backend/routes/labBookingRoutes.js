import express from "express";
import protect, { authorize } from "../middleware/authMiddleware.js";
import {
  getLabsByCity,
  getLabTests,
  bookLabTest,
  getPatientLabBookings,
} from "../controllers/labController.js";

const router = express.Router();

router.get("/labs", protect, authorize("patient", "admin"), getLabsByCity);
router.get("/labs/:id/tests", protect, authorize("patient", "admin"), getLabTests);
router.post("/lab-bookings", protect, authorize("patient"), bookLabTest);
router.get("/patient/lab-bookings", protect, authorize("patient"), getPatientLabBookings);

export default router;
