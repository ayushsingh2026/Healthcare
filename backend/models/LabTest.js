import mongoose from "mongoose";

const labTestSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    testType: String,

    testDate: Date,

    status: {
      type: String,
      default: "Payment Pending",
    },

    reportUrl: String,
  },
  { timestamps: true }
);

export default mongoose.model("LabTest", labTestSchema);
