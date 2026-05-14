import User from "../models/User.js";
import Appointment from "../models/Appointment.js";

const APPOINTMENT_STATUSES = ["Pending", "Confirmed", "In Consultation", "Completed", "Cancelled"];
const PAYMENT_STATUSES = ["Pending", "Paid"];

const normalizeDoctor = (doctor) => {
  const d = doctor.toObject ? doctor.toObject() : doctor;
  const photoValue = d.profilePhoto || d.photoUrl || "";
  const profilePhoto = photoValue
    ? photoValue.startsWith("http://") || photoValue.startsWith("https://")
      ? photoValue
      : photoValue.startsWith("/")
        ? photoValue
        : `/${photoValue}`
    : "";
  return {
    ...d,
    profilePhoto,
    qualification: d.qualification || d.education || "",
    hospitalName: d.hospitalName || d.hospitalLocation || "",
  };
};

const mapAppointment = (a) => {
  const item = a.toObject ? a.toObject() : a;
  return {
    ...item,
    status: item.status || "Pending",
    paymentStatus: item.paymentStatus || "Pending",
    appointmentTime: item.appointmentTime || "",
  };
};

export const getDoctorDashboard = async (req, res) => {
  try {
    const doctor = await User.findById(req.user._id).select("-password");
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });

    const appointments = await Appointment.find({ doctorId: req.user._id })
      .populate("patientId", "name age sex gender disease address phone email profilePhoto photoUrl bloodGroup medicalHistory symptoms emergencyContact")
      .sort({ appointmentDate: 1, createdAt: -1 });

    const mapped = appointments.map(mapAppointment);
    const stats = {
      totalAppointments: mapped.length,
      pendingAppointments: mapped.filter((x) => x.status === "Pending").length,
      completedAppointments: mapped.filter((x) => x.status === "Completed").length,
      paymentPending: mapped.filter((x) => x.paymentStatus === "Pending").length,
      paymentCompleted: mapped.filter((x) => x.paymentStatus === "Paid").length,
    };

    res.json({
      doctor: normalizeDoctor(doctor),
      stats,
      recentPatients: mapped.slice(0, 12),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getDoctorAppointmentsModule = async (req, res) => {
  try {
    const appointments = await Appointment.find({ doctorId: req.user._id })
      .populate("patientId", "name age sex gender disease address profilePhoto photoUrl")
      .sort({ appointmentDate: 1, createdAt: -1 });
    res.json(appointments.map(mapAppointment));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getDoctorPatients = async (req, res) => {
  try {
    const appointments = await Appointment.find({ doctorId: req.user._id })
      .populate("patientId", "name age sex gender disease address profilePhoto photoUrl bloodGroup phone email medicalHistory symptoms emergencyContact")
      .sort({ appointmentDate: 1, createdAt: -1 });

    res.json(appointments.map(mapAppointment));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getDoctorPatientByAppointmentId = async (req, res) => {
  try {
    const appt = await Appointment.findOne({ _id: req.params.id, doctorId: req.user._id })
      .populate("patientId", "name age sex gender disease address profilePhoto photoUrl bloodGroup phone email medicalHistory symptoms emergencyContact")
      .populate("doctorId", "name email specialization");

    if (!appt) return res.status(404).json({ message: "Patient appointment not found" });
    res.json(mapAppointment(appt));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateAppointmentStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!APPOINTMENT_STATUSES.includes(status)) {
      return res.status(400).json({ message: "Invalid appointment status" });
    }
    const appt = await Appointment.findOne({ _id: req.params.id, doctorId: req.user._id });
    if (!appt) return res.status(404).json({ message: "Appointment not found" });
    appt.status = status;
    await appt.save();
    res.json(mapAppointment(appt));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateAppointmentPaymentStatus = async (req, res) => {
  try {
    const { paymentStatus } = req.body;
    if (!PAYMENT_STATUSES.includes(paymentStatus)) {
      return res.status(400).json({ message: "Invalid payment status" });
    }
    const appt = await Appointment.findOne({ _id: req.params.id, doctorId: req.user._id });
    if (!appt) return res.status(404).json({ message: "Appointment not found" });
    appt.paymentStatus = paymentStatus;
    await appt.save();
    res.json(mapAppointment(appt));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getDoctorProfile = async (req, res) => {
  try {
    const doctor = await User.findById(req.user._id).select("-password");
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });
    res.json(normalizeDoctor(doctor));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateDoctorProfile = async (req, res) => {
  try {
    const fields = [
      "name",
      "age",
      "specialization",
      "experience",
      "hospitalName",
      "hospitalLocation",
      "availabilityTime",
      "phone",
      "email",
      "qualification",
      "bio",
    ];
    const doctor = await User.findById(req.user._id);
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });

    fields.forEach((f) => {
      if (req.body[f] !== undefined) doctor[f] = req.body[f];
    });
    if (req.body.qualification !== undefined) {
      doctor.education = req.body.qualification;
    }
    if (req.body.hospitalName !== undefined && !req.body.hospitalLocation) {
      doctor.hospitalLocation = doctor.hospitalLocation || req.body.hospitalName;
    }

    await doctor.save();
    res.json(normalizeDoctor(doctor));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateDoctorPhoto = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "Photo is required" });
    const doctor = await User.findById(req.user._id);
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });
    const photoPath = req.file.path.replace(/\\/g, "/");
    doctor.profilePhoto = photoPath;
    doctor.photoUrl = photoPath;
    await doctor.save();
    res.json(normalizeDoctor(doctor));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
