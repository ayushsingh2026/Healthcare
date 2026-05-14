import Payment from "../models/Payment.js";
import Appointment from "../models/Appointment.js";
import LabTest from "../models/LabTest.js";

export const makePayment = async (req, res) => {
  try {
    const { amount, paymentMethod, sourceType, sourceId } = req.body;

    if (!sourceType || !sourceId) {
      return res.status(400).json({ message: "sourceType and sourceId are required" });
    }

    const payment = await Payment.create({
      patientId: req.user._id,
      amount,
      paymentMethod,
      sourceType,
      sourceId,
      status: paymentMethod === "online" ? "Paid" : "Pending",
    });

    if (paymentMethod === "online") {
      if (sourceType === "appointment") {
        await Appointment.findOneAndUpdate(
          { _id: sourceId, patientId: req.user._id },
          { status: "Confirmed" }
        );
      }

      if (sourceType === "lab") {
        await LabTest.findOneAndUpdate(
          { _id: sourceId, patientId: req.user._id },
          { status: "Confirmed" }
        );
      }
    }

    res.status(201).json(payment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
