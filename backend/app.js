import express from "express";
import cors from "cors";
import path from "path";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import appointmentRoutes from "./routes/appointmentRoutes.js";
import labRoutes from "./routes/labRoutes.js";
import labBookingRoutes from "./routes/labBookingRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import doctorRoutes from "./routes/doctorRoutes.js";
import doctorModuleRoutes from "./routes/doctorModuleRoutes.js";

dotenv.config();

connectDB().catch((error) => {
  console.error("Initial DB connection failed:", error.message);
});

const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Healthcare API is healthy" });
});

app.use("/api/auth", authRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/lab", labRoutes);
app.use("/api", labBookingRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/doctor", doctorModuleRoutes);

app.get("/", (req, res) => {
  res.status(200).send(`
    <!doctype html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Healthcare Backend</title>
      </head>
      <body style="font-family: Arial, sans-serif; background:#f4f7fb; display:grid; place-items:center; min-height:100vh;">
        <main style="background:#fff; border:1px solid #e2e8f0; border-radius:12px; padding:24px; width:min(680px,92vw);">
          <h1>Healthcare API is running</h1>
          <p>Backend status is healthy and ready to serve requests.</p>
          <p>Health check: <a href="/api/health">/api/health</a></p>
        </main>
      </body>
    </html>
  `);
});

app.use((err, req, res, next) => {
  console.error("Unhandled server error:", err.message);
  res.status(500).json({ message: "Internal server error" });
});

export default app;
