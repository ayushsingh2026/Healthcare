import bcrypt from "bcryptjs";
import User from "../models/User.js";
import Lab from "../models/Lab.js";
import Appointment from "../models/Appointment.js";
import Payment from "../models/Payment.js";
import LabBooking from "../models/LabBooking.js";
import Report from "../models/Report.js";
import Notification from "../models/Notification.js";
import Setting from "../models/Setting.js";

const toInt = (v, d = 1) => {
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : d;
};

const buildPagination = (page, limit, total) => ({
  page,
  limit,
  total,
  totalPages: Math.max(1, Math.ceil(total / limit)),
});

export const getDashboardStats = async (req, res) => {
  try {
    const [doctors, patients, labs, appointments, payments, paymentRows, reports, notifications] = await Promise.all([
      User.countDocuments({ role: "doctor" }),
      User.countDocuments({ role: "patient" }),
      User.countDocuments({ role: "lab" }),
      Appointment.countDocuments(),
      Payment.countDocuments(),
      Payment.find().select("amount status createdAt").sort({ createdAt: -1 }),
      Report.countDocuments(),
      Notification.find().sort({ createdAt: -1 }).limit(10),
    ]);

    const pendingPayments = paymentRows.filter((p) => p.status !== "Paid").length;
    const completedAppointments = await Appointment.countDocuments({ status: "Completed" });
    const cancelledAppointments = await Appointment.countDocuments({ status: "Cancelled" });
    const totalRevenue = paymentRows
      .filter((p) => p.status === "Paid")
      .reduce((sum, p) => sum + Number(p.amount || 0), 0);

    const recentAppointments = await Appointment.find()
      .populate("patientId", "name")
      .populate("doctorId", "name")
      .sort({ createdAt: -1 })
      .limit(8);

    const recentRegistrations = await User.find()
      .select("name role email createdAt")
      .sort({ createdAt: -1 })
      .limit(8);

    const latestPayments = await Payment.find()
      .populate("patientId", "name")
      .sort({ createdAt: -1 })
      .limit(8);

    const monthlyPayments = new Array(12).fill(0);
    paymentRows.forEach((p) => {
      if (p.status === "Paid") {
        const month = new Date(p.createdAt).getMonth();
        monthlyPayments[month] += Number(p.amount || 0);
      }
    });

    const appointmentsOverview = {
      pending: await Appointment.countDocuments({ status: "Pending" }),
      confirmed: await Appointment.countDocuments({ status: "Confirmed" }),
      inConsultation: await Appointment.countDocuments({ status: "In Consultation" }),
      completed: completedAppointments,
      cancelled: cancelledAppointments,
    };

    const doctorVsPatientRegistrations = {
      doctors,
      patients,
    };

    res.json({
      cards: {
        doctors,
        patients,
        labs,
        appointments,
        payments,
        pendingPayments,
        completedAppointments,
        cancelledAppointments,
        totalRevenue,
        reports,
      },
      widgets: {
        recentAppointments,
        recentRegistrations,
        latestPayments,
        systemActivity: notifications,
      },
      charts: {
        appointmentsOverview,
        monthlyPayments,
        doctorVsPatientRegistrations,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getLabAssistants = async (req, res) => {
  try {
    const assistants = await User.find({ role: "lab" }).select("_id name email phone");
    res.json(assistants);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAdminDoctors = async (req, res) => {
  try {
    const { q = "", specialization = "", sort = "name", page = 1, limit = 10, status = "" } = req.query;
    const filter = { role: "doctor" };
    if (q) filter.name = new RegExp(q, "i");
    if (specialization) filter.specialization = new RegExp(`^${specialization}$`, "i");
    if (status) filter.accountStatus = status;
    const pg = toInt(page, 1);
    const lim = toInt(limit, 10);
    const sortObj = sort === "experience" ? { experience: -1 } : { name: 1 };
    const total = await User.countDocuments(filter);
    const items = await User.find(filter).select("-password").sort(sortObj).skip((pg - 1) * lim).limit(lim);
    res.json({ items, pagination: buildPagination(pg, lim, total) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createAdminDoctor = async (req, res) => {
  try {
    const {
      name, email, password, age, gender, specialization, qualification, experience, hospitalName,
      hospitalLocation, availabilityTime, phone, bio,
    } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: "Name, email and password are required" });
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "Email already exists" });
    const hashed = await bcrypt.hash(password, 10);
    const profilePhoto = req.file ? req.file.path.replace(/\\/g, "/") : "";
    const doc = await User.create({
      role: "doctor",
      name,
      email,
      password: hashed,
      age,
      gender,
      sex: gender,
      specialization,
      qualification,
      education: qualification,
      experience,
      hospitalName,
      hospitalLocation,
      availabilityTime,
      phone,
      bio,
      profilePhoto,
      photoUrl: profilePhoto,
      accountStatus: "Active",
    });
    res.status(201).json({ ...doc.toObject(), password: undefined });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAdminDoctorById = async (req, res) => {
  try {
    const doctor = await User.findOne({ _id: req.params.id, role: "doctor" }).select("-password");
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });
    const [appointmentsCount, completedCount, pendingCount] = await Promise.all([
      Appointment.countDocuments({ doctorId: doctor._id }),
      Appointment.countDocuments({ doctorId: doctor._id, status: "Completed" }),
      Appointment.countDocuments({ doctorId: doctor._id, status: "Pending" }),
    ]);
    res.json({ doctor, metrics: { appointmentsCount, completedCount, pendingCount, rating: 4.9 } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateAdminDoctor = async (req, res) => {
  try {
    const doctor = await User.findOne({ _id: req.params.id, role: "doctor" });
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });
    const fields = ["name", "age", "gender", "specialization", "qualification", "experience", "hospitalName", "hospitalLocation", "availabilityTime", "phone", "email", "bio", "accountStatus"];
    fields.forEach((f) => {
      if (req.body[f] !== undefined) doctor[f] = req.body[f];
    });
    if (req.body.gender !== undefined) doctor.sex = req.body.gender;
    if (req.body.qualification !== undefined) doctor.education = req.body.qualification;
    if (req.file) {
      const profilePhoto = req.file.path.replace(/\\/g, "/");
      doctor.profilePhoto = profilePhoto;
      doctor.photoUrl = profilePhoto;
    }
    await doctor.save();
    res.json({ ...doctor.toObject(), password: undefined });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteAdminDoctor = async (req, res) => {
  try {
    const doctor = await User.findOne({ _id: req.params.id, role: "doctor" });
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });
    await Appointment.deleteMany({ doctorId: doctor._id });
    await doctor.deleteOne();
    res.json({ message: "Doctor deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAdminPatients = async (req, res) => {
  try {
    const { q = "", gender = "", appointmentStatus = "", page = 1, limit = 10 } = req.query;
    const filter = { role: "patient" };
    if (q) filter.name = new RegExp(q, "i");
    if (gender) filter.gender = new RegExp(`^${gender}$`, "i");
    const pg = toInt(page, 1);
    const lim = toInt(limit, 10);
    const total = await User.countDocuments(filter);
    const patients = await User.find(filter).select("-password").sort({ createdAt: -1 }).skip((pg - 1) * lim).limit(lim);

    const patientIds = patients.map((p) => p._id);
    const appointments = await Appointment.find({ patientId: { $in: patientIds } }).populate("doctorId", "name").sort({ createdAt: -1 });
    const latestMap = new Map();
    appointments.forEach((a) => {
      if (!latestMap.has(String(a.patientId))) latestMap.set(String(a.patientId), a);
    });

    const items = patients
      .map((p) => {
        const appt = latestMap.get(String(p._id));
        return { ...p.toObject(), latestAppointment: appt || null };
      })
      .filter((p) => (appointmentStatus ? p.latestAppointment?.status === appointmentStatus : true));

    res.json({ items, pagination: buildPagination(pg, lim, total) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAdminPatientById = async (req, res) => {
  try {
    const patient = await User.findOne({ _id: req.params.id, role: "patient" }).select("-password");
    if (!patient) return res.status(404).json({ message: "Patient not found" });
    const [appointments, labTests, payments] = await Promise.all([
      Appointment.find({ patientId: patient._id }).populate("doctorId", "name specialization").sort({ createdAt: -1 }),
      LabBooking.find({ patientId: patient._id }).sort({ createdAt: -1 }),
      Payment.find({ patientId: patient._id }).sort({ createdAt: -1 }),
    ]);
    res.json({ patient, appointments, labTests, payments });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateAdminPatient = async (req, res) => {
  try {
    const patient = await User.findOne({ _id: req.params.id, role: "patient" });
    if (!patient) return res.status(404).json({ message: "Patient not found" });
    const fields = ["name", "age", "gender", "sex", "phone", "email", "address", "disease", "bloodGroup", "medicalHistory", "emergencyContact", "accountStatus"];
    fields.forEach((f) => {
      if (req.body[f] !== undefined) patient[f] = req.body[f];
    });
    if (req.file) {
      const photo = req.file.path.replace(/\\/g, "/");
      patient.profilePhoto = photo;
      patient.photoUrl = photo;
    }
    await patient.save();
    res.json({ ...patient.toObject(), password: undefined });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteAdminPatient = async (req, res) => {
  try {
    const patient = await User.findOne({ _id: req.params.id, role: "patient" });
    if (!patient) return res.status(404).json({ message: "Patient not found" });
    await Appointment.deleteMany({ patientId: patient._id });
    await LabBooking.deleteMany({ patientId: patient._id });
    await Payment.deleteMany({ patientId: patient._id });
    await patient.deleteOne();
    res.json({ message: "Patient deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAdminLabs = async (req, res) => {
  try {
    const labs = await Lab.find().populate("assistantId", "name email phone").sort({ createdAt: -1 });
    res.json(labs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createAdminLab = async (req, res) => {
  try {
    const {
      name,
      city,
      address,
      phone,
      workingHours,
      availableTests = [],
      assistantId,
      assistantName,
      assistantEmail,
      assistantPassword,
    } = req.body;

    let finalAssistantId = assistantId;
    if (!finalAssistantId && assistantEmail) {
      let assistant = await User.findOne({ email: assistantEmail });
      if (assistant && assistant.role !== "lab") {
        return res.status(400).json({ message: "Email already exists with non-lab role" });
      }
      if (!assistant) {
        if (!assistantName || !assistantPassword) {
          return res.status(400).json({ message: "Assistant name and password are required for new lab assistant" });
        }
        const hashed = await bcrypt.hash(assistantPassword, 10);
        assistant = await User.create({
          role: "lab",
          name: assistantName,
          email: assistantEmail,
          password: hashed,
          phone: phone || "",
          accountStatus: "Active",
        });
      }
      finalAssistantId = assistant._id;
    }

    if (!finalAssistantId) {
      return res.status(400).json({ message: "Select existing lab assistant or provide assistant email/password" });
    }

    const assignedLab = await Lab.findOne({ assistantId: finalAssistantId });
    if (assignedLab) {
      return res.status(400).json({ message: "This lab assistant is already assigned to another lab" });
    }

    const lab = await Lab.create({
      name, city, address, phone, workingHours, availableTests, assistantId: finalAssistantId,
      status: req.body.status || "Active",
      logo: req.file ? req.file.path.replace(/\\/g, "/") : "",
    });
    res.status(201).json(lab);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateAdminLab = async (req, res) => {
  try {
    const lab = await Lab.findById(req.params.id);
    if (!lab) return res.status(404).json({ message: "Lab not found" });
    ["name", "city", "address", "phone", "workingHours", "assistantId", "status"].forEach((f) => {
      if (req.body[f] !== undefined) lab[f] = req.body[f];
    });
    if (Array.isArray(req.body.availableTests)) lab.availableTests = req.body.availableTests;
    if (req.file) lab.logo = req.file.path.replace(/\\/g, "/");
    await lab.save();
    res.json(lab);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteAdminLab = async (req, res) => {
  try {
    const lab = await Lab.findById(req.params.id);
    if (!lab) return res.status(404).json({ message: "Lab not found" });
    await LabBooking.deleteMany({ labId: lab._id });
    await lab.deleteOne();
    res.json({ message: "Lab deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAdminAppointments = async (req, res) => {
  try {
    const { q = "", status = "", when = "" } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (q) filter.$or = [{ patientName: new RegExp(q, "i") }, { condition: new RegExp(q, "i") }];
    const now = new Date();
    if (when === "today") {
      const start = new Date(now.toISOString().slice(0, 10));
      const end = new Date(start);
      end.setDate(end.getDate() + 1);
      filter.appointmentDate = { $gte: start, $lt: end };
    } else if (when === "week") {
      const end = new Date(now);
      end.setDate(end.getDate() + 7);
      filter.appointmentDate = { $gte: now, $lte: end };
    }
    const items = await Appointment.find(filter).populate("patientId", "name").populate("doctorId", "name specialization").sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateAdminAppointment = async (req, res) => {
  try {
    const appt = await Appointment.findById(req.params.id);
    if (!appt) return res.status(404).json({ message: "Appointment not found" });
    ["status", "paymentStatus", "appointmentDate", "appointmentTime", "condition", "notes"].forEach((f) => {
      if (req.body[f] !== undefined) appt[f] = req.body[f];
    });
    await appt.save();
    res.json(appt);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteAdminAppointment = async (req, res) => {
  try {
    const appt = await Appointment.findById(req.params.id);
    if (!appt) return res.status(404).json({ message: "Appointment not found" });
    await appt.deleteOne();
    res.json({ message: "Appointment deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAdminPayments = async (req, res) => {
  try {
    const { status = "" } = req.query;
    const filter = status ? { status } : {};
    const items = await Payment.find(filter).populate("patientId", "name").sort({ createdAt: -1 });
    const revenue = items.filter((p) => p.status === "Paid").reduce((s, p) => s + Number(p.amount || 0), 0);
    res.json({ items, summary: { revenue, pending: items.filter((p) => p.status !== "Paid").length } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateAdminPayment = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (!payment) return res.status(404).json({ message: "Payment not found" });
    ["status", "paymentMethod", "amount"].forEach((f) => {
      if (req.body[f] !== undefined) payment[f] = req.body[f];
    });
    await payment.save();
    res.json(payment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAdminReports = async (req, res) => {
  try {
    const items = await Report.find()
      .populate("patientId", "name")
      .populate("doctorId", "name")
      .populate("labId", "name")
      .sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteAdminReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) return res.status(404).json({ message: "Report not found" });
    await report.deleteOne();
    res.json({ message: "Report deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAdminSettings = async (req, res) => {
  try {
    const doc = await Setting.findOne({ key: "system" });
    res.json(doc?.value || {});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateAdminSettings = async (req, res) => {
  try {
    const doc = await Setting.findOneAndUpdate(
      { key: "system" },
      { value: req.body || {} },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    res.json(doc.value);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAdminNotifications = async (req, res) => {
  try {
    const items = await Notification.find().sort({ createdAt: -1 }).limit(30);
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
