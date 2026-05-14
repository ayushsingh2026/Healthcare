import express from "express";
import protect, { authorize } from "../middleware/authMiddleware.js";
import {
  bookAppointment,
  getDoctorAppointments,
  getPatientAppointments,
} from "../controllers/appointmentController.js";

const router = express.Router();

router.post("/book", protect, authorize("patient"), bookAppointment);
router.get("/doctor", protect, authorize("doctor"), getDoctorAppointments);
router.get("/patient", protect, authorize("patient"), getPatientAppointments);

export default router;
