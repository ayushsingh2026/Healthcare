import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    reportType: {
      type: String,
      enum: ["Lab Report", "Prescription", "Medical Record"],
      required: true,
    },
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    labId: { type: mongoose.Schema.Types.ObjectId, ref: "Lab" },
    filePath: { type: String, required: true },
    notes: { type: String, default: "" },
    status: { type: String, default: "Active" },
  },
  { timestamps: true }
);

export default mongoose.model("Report", reportSchema);

