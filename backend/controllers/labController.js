import path from "path";
import Lab from "../models/Lab.js";
import LabBooking, { ALLOWED_STATUSES } from "../models/LabBooking.js";

const formatBooking = (booking) => {
  const item = booking.toObject ? booking.toObject() : booking;
  return {
    ...item,
    reportUrl: item.reportFile ? `/uploads/reports/${path.basename(item.reportFile)}` : "",
  };
};

export const getLabsByCity = async (req, res) => {
  try {
    const city = (req.query.city || "").trim();
    if (!city) {
      return res.status(400).json({ message: "City is required" });
    }

    const labs = await Lab.find({ city: new RegExp(`^${city}$`, "i") })
      .select("name city address phone workingHours availableTests")
      .sort({ name: 1 });

    return res.json(labs);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getAllLabsForAdmin = async (req, res) => {
  try {
    const labs = await Lab.find().populate("assistantId", "name email").sort({ createdAt: -1 });
    return res.json(labs);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getLabTests = async (req, res) => {
  try {
    const lab = await Lab.findById(req.params.id).select("availableTests");
    if (!lab) {
      return res.status(404).json({ message: "Lab not found" });
    }
    return res.json(lab.availableTests || []);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const bookLabTest = async (req, res) => {
  try {
    const { labId, city, testName, appointmentDate, timeSlot } = req.body;

    if (!labId || !city || !testName || !appointmentDate || !timeSlot) {
      return res.status(400).json({ message: "All booking fields are required" });
    }

    const lab = await Lab.findById(labId);
    if (!lab) {
      return res.status(404).json({ message: "Lab not found" });
    }

    const testAllowed = (lab.availableTests || []).some(
      (t) => t.toLowerCase() === String(testName).toLowerCase()
    );
    if (!testAllowed) {
      return res.status(400).json({ message: "Selected test is not available in this lab" });
    }

    const booking = await LabBooking.create({
      patientId: req.user._id,
      patientName: req.user.name,
      labId: lab._id,
      labName: lab.name,
      city,
      testName,
      appointmentDate,
      timeSlot,
      status: "Pending",
    });

    return res.status(201).json(formatBooking(booking));
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getPatientLabBookings = async (req, res) => {
  try {
    const bookings = await LabBooking.find({ patientId: req.user._id }).sort({ createdAt: -1 });
    return res.json(bookings.map(formatBooking));
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getLabBookings = async (req, res) => {
  try {
    const lab = await Lab.findOne({ assistantId: req.user._id });
    if (!lab) {
      return res.status(404).json({ message: "No lab mapped to this assistant account" });
    }

    const bookings = await LabBooking.find({ labId: lab._id }).sort({ appointmentDate: 1, createdAt: -1 });
    const counts = {
      total: bookings.length,
      completed: bookings.filter((b) => b.status === "Completed").length,
      pending: bookings.filter((b) => b.status !== "Completed").length,
      reportsUploaded: bookings.filter((b) => !!b.reportFile).length,
    };

    return res.json({
      lab: {
        _id: lab._id,
        name: lab.name,
        city: lab.city,
        address: lab.address,
        phone: lab.phone,
        workingHours: lab.workingHours,
        totalTests: (lab.availableTests || []).length,
      },
      counts,
      bookings: bookings.map(formatBooking),
      statusOptions: ALLOWED_STATUSES,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateLabBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!ALLOWED_STATUSES.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const lab = await Lab.findOne({ assistantId: req.user._id });
    if (!lab) {
      return res.status(404).json({ message: "No lab mapped to this assistant account" });
    }

    const booking = await LabBooking.findOne({ _id: req.params.id, labId: lab._id });
    if (!booking) {
      return res.status(404).json({ message: "Booking not found for this lab" });
    }

    booking.status = status;
    await booking.save();
    return res.json(formatBooking(booking));
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const uploadLabReport = async (req, res) => {
  try {
    const lab = await Lab.findOne({ assistantId: req.user._id });
    if (!lab) {
      return res.status(404).json({ message: "No lab mapped to this assistant account" });
    }

    const booking = await LabBooking.findOne({ _id: req.params.id, labId: lab._id });
    if (!booking) {
      return res.status(404).json({ message: "Booking not found for this lab" });
    }
    if (!req.file) {
      return res.status(400).json({ message: "Report file is required" });
    }

    booking.reportFile = req.file.path.replace(/\\/g, "/");
    if (booking.status !== "Completed") {
      booking.status = "Completed";
    }
    await booking.save();
    return res.json(formatBooking(booking));
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const createLab = async (req, res) => {
  try {
    const { name, city, address, phone, availableTests, workingHours, assistantId } = req.body;
    const lab = await Lab.create({
      name,
      city,
      address,
      phone,
      availableTests: Array.isArray(availableTests) ? availableTests : [],
      workingHours,
      assistantId,
    });
    return res.status(201).json(lab);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateLab = async (req, res) => {
  try {
    const { name, city, address, phone, availableTests, workingHours, assistantId } = req.body;
    const lab = await Lab.findById(req.params.id);
    if (!lab) {
      return res.status(404).json({ message: "Lab not found" });
    }
    lab.name = name ?? lab.name;
    lab.city = city ?? lab.city;
    lab.address = address ?? lab.address;
    lab.phone = phone ?? lab.phone;
    lab.workingHours = workingHours ?? lab.workingHours;
    lab.assistantId = assistantId ?? lab.assistantId;
    if (Array.isArray(availableTests)) lab.availableTests = availableTests;
    await lab.save();
    return res.json(lab);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteLab = async (req, res) => {
  try {
    const lab = await Lab.findById(req.params.id);
    if (!lab) {
      return res.status(404).json({ message: "Lab not found" });
    }
    await LabBooking.deleteMany({ labId: lab._id });
    await lab.deleteOne();
    return res.json({ message: "Lab deleted" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
