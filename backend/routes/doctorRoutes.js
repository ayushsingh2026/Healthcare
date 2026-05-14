import express from "express";
import protect, { authorize } from "../middleware/authMiddleware.js";
import { getDoctors, getDoctorById } from "../controllers/doctorController.js";

const router = express.Router();

router.get("/", protect, authorize("patient", "admin", "lab", "doctor"), getDoctors);
router.get("/:id", protect, authorize("patient", "admin", "lab", "doctor"), getDoctorById);

export default router;
