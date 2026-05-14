import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    amount: Number,

    paymentMethod: {
      type: String,
      enum: ["online", "offline"],
    },

    status: {
      type: String,
      default: "Pending",
    },

    sourceType: {
      type: String,
      enum: ["appointment", "lab"],
    },

    sourceId: {
      type: mongoose.Schema.Types.ObjectId,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Payment", paymentSchema);
