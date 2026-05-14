import Appointment from "../models/Appointment.js";

export const bookAppointment = async (req, res) => {
  try {
    const {
      doctorId,
      disease,
      appointmentDate,
      appointmentTime,
      patientName,
      patientAge,
      patientSex,
      condition,
      patientLocation,
    } = req.body;

    if (!doctorId) {
      return res.status(400).json({ message: "doctorId is required" });
    }

    const appointment = await Appointment.create({
      patientId: req.user._id,
      doctorId,
      patientName,
      patientAge,
      patientSex,
      condition,
      patientLocation,
      disease: disease || condition,
      appointmentDate,
      appointmentTime: appointmentTime || "",
      status: "Pending",
      paymentStatus: "Pending",
    });

    res.status(201).json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getDoctorAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({
      doctorId: req.user._id,
    })
      .populate("patientId", "name email disease")
      .sort({ createdAt: -1 });

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPatientAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({
      patientId: req.user._id,
    })
      .populate("doctorId", "name specialization experience")
      .sort({ createdAt: -1 });

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
