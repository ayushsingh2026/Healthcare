import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
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

connectDB();

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
        <style>
          body {
            margin: 0;
            font-family: Arial, sans-serif;
            background: #f4f7fb;
            color: #0f172a;
            display: grid;
            place-items: center;
            min-height: 100vh;
          }
          .card {
            background: #ffffff;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            padding: 24px;
            width: min(680px, 92vw);
            box-shadow: 0 10px 25px rgba(2, 6, 23, 0.08);
          }
          h1 { margin-top: 0; font-size: 1.6rem; }
          p { margin: 8px 0; line-height: 1.5; }
          a { color: #2563eb; text-decoration: none; }
          a:hover { text-decoration: underline; }
          code {
            background: #eff6ff;
            padding: 2px 6px;
            border-radius: 6px;
          }
        </style>
      </head>
      <body>
        <main class="card">
          <h1>Healthcare API is running</h1>
          <p>Backend status is healthy and ready to serve requests.</p>
          <p>Health check: <a href="/api/health"><code>/api/health</code></a></p>
          <p>Base API path: <code>/api/*</code></p>
        </main>
      </body>
    </html>
  `);
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
