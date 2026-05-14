import express from "express";
import protect, { authorize } from "../middleware/authMiddleware.js";
import { makePayment } from "../controllers/paymentController.js";

const router = express.Router();

router.post("/", protect, authorize("patient"), makePayment);

export default router;
