import mongoose from "mongoose";

const ALLOWED_STATUSES = ["Pending", "Sample Collected", "Processing", "Completed"];

const labBookingSchema = new mongoose.Schema(
  {
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    patientName: { type: String, required: true, trim: true },
    labId: { type: mongoose.Schema.Types.ObjectId, ref: "Lab", required: true, index: true },
    labName: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    testName: { type: String, required: true, trim: true },
    appointmentDate: { type: Date, required: true },
    timeSlot: { type: String, required: true, trim: true },
    status: { type: String, enum: ALLOWED_STATUSES, default: "Pending" },
    reportFile: { type: String, default: "" },
  },
  { timestamps: true }
);

export { ALLOWED_STATUSES };
export default mongoose.model("LabBooking", labBookingSchema);
