import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "./models/User.js";
import Appointment from "./models/Appointment.js";
import Payment from "./models/Payment.js";
import Lab from "./models/Lab.js";
import LabBooking from "./models/LabBooking.js";
import Report from "./models/Report.js";
import Notification from "./models/Notification.js";
import Setting from "./models/Setting.js";

dotenv.config();

const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URI);
};

const doctorSeeds = [
  ["Dr. Amit Sharma", "doctor1@healthcare.com", "Cardiologist", 12, "Apollo Hospital", "Noida Sector 62", "Mon-Sat, 10 AM - 5 PM", "MD Cardiology"],
  ["Dr. Neha Kapoor", "doctor2@healthcare.com", "Dermatologist", 9, "Fortis Hospital", "Delhi", "Mon-Fri, 11 AM - 6 PM", "MD Dermatology"],
  ["Dr. Rohan Mehta", "doctor3@healthcare.com", "Neurologist", 14, "Max Healthcare", "Ghaziabad", "Mon-Sat, 9 AM - 3 PM", "DM Neurology"],
  ["Dr. Sana Qureshi", "doctor4@healthcare.com", "Pediatrician", 8, "City Care Hospital", "Lucknow", "Mon-Sat, 10 AM - 4 PM", "MD Pediatrics"],
  ["Dr. Vivek Arora", "doctor5@healthcare.com", "Orthopedic", 15, "Medanta", "Kanpur", "Mon-Fri, 12 PM - 7 PM", "MS Orthopedics"],
  ["Dr. Karan Malhotra", "doctor6@healthcare.com", "ENT", 7, "Apollo Hospital", "Delhi", "Mon-Sat, 9 AM - 1 PM", "MS ENT"],
  ["Dr. Isha Nanda", "doctor7@healthcare.com", "Gynecologist", 10, "Fortis", "Noida", "Mon-Fri, 10 AM - 4 PM", "MD OBG"],
  ["Dr. Zoya Ali", "doctor8@healthcare.com", "Psychiatrist", 11, "Max Healthcare", "Ghaziabad", "Mon-Sat, 11 AM - 6 PM", "MD Psychiatry"],
  ["Dr. Arpit Jain", "doctor9@healthcare.com", "Pulmonologist", 13, "City Care", "Lucknow", "Mon-Sat, 8 AM - 2 PM", "DM Pulmonology"],
  ["Dr. Meera Sood", "doctor10@healthcare.com", "General Physician", 16, "Medanta", "Kanpur", "Mon-Sat, 9 AM - 5 PM", "MBBS MD"],
];

const patientNames = [
  "Rahul Sharma", "Priya Singh", "Aman Verma", "Pooja Gupta", "Ritika Jain",
  "Saurabh Tiwari", "Anjali Yadav", "Mohit Arora", "Komal Mishra", "Deepak Bansal",
  "Nitin Saxena", "Shreya Gupta", "Kunal Arora", "Ayesha Khan", "Rohit Sharma",
  "Sneha Das", "Tarun Malhotra", "Ishita Roy", "Vikas Saini", "Meenal Joshi",
  "Ravi Nigam", "Parul Jain", "Dhruv Yadav", "Mansi Kapoor", "Aditya Rana",
  "Harsh Tyagi", "Nisha Batra", "Siddhant Roy", "Pallavi Das", "Gaurav Khanna",
  "Rhea Sen", "Ankit Goel", "Juhi Arora", "Prakash Singh", "Divya Puri",
];

const conditions = [
  "Fever, Body Pain", "Migraine", "Chest Pain", "Skin Rash", "Back Pain",
  "Thyroid Symptoms", "Allergy", "Joint Pain", "Diabetes Follow-up", "General Weakness",
];

const statuses = ["Pending", "Confirmed", "In Consultation", "Completed", "Cancelled"];
const paymentStatuses = ["Pending", "Paid"];

const runSeed = async () => {
  try {
    await connectDB();

    const createdUsers = {};
    const users = [];

    users.push({
      name: "Admin User",
      email: "admin@healthcare.com",
      password: "Admin@123",
      role: "admin",
      phone: "9876500030",
    });

    users.push(
      { name: "Lab Assistant Ravi", email: "lab1@healthcare.com", password: "Lab@123", role: "lab", phone: "9876500020" },
      { name: "Lab Assistant Meera", email: "lab2@healthcare.com", password: "Lab@123", role: "lab", phone: "9876500021" },
      { name: "Lab Assistant Arjun", email: "lab3@healthcare.com", password: "Lab@123", role: "lab", phone: "9876500022" },
      { name: "Lab Assistant Sana", email: "lab4@healthcare.com", password: "Lab@123", role: "lab", phone: "9876500023" },
      { name: "Lab Assistant Kunal", email: "lab5@healthcare.com", password: "Lab@123", role: "lab", phone: "9876500024" }
    );

    doctorSeeds.forEach(([name, email, specialization, experience, hospitalName, hospitalLocation, availabilityTime, qualification], i) => {
      users.push({
        name,
        email,
        password: "Doctor@123",
        role: "doctor",
        age: 35 + i,
        gender: i % 2 ? "Female" : "Male",
        sex: i % 2 ? "Female" : "Male",
        specialization,
        experience,
        hospitalName,
        hospitalLocation,
        availabilityTime,
        qualification,
        education: qualification,
        bio: `${specialization} specialist with ${experience} years of experience.`,
        photoUrl: `https://i.pravatar.cc/300?img=${i + 10}`,
        profilePhoto: `https://i.pravatar.cc/300?img=${i + 10}`,
        phone: `98765010${i + 10}`,
      });
    });

    patientNames.forEach((name, i) => {
      users.push({
        name,
        email: `patient${i + 1}@healthcare.com`,
        password: "Patient@123",
        role: "patient",
        age: 22 + (i % 35),
        gender: i % 2 ? "Female" : "Male",
        sex: i % 2 ? "Female" : "Male",
        phone: `98766000${String(i + 1).padStart(2, "0")}`,
        address: ["Delhi", "Noida", "Ghaziabad", "Lucknow", "Kanpur"][i % 5],
        disease: conditions[i % conditions.length],
        bloodGroup: ["A+", "B+", "O+", "AB+", "A-"][i % 5],
        medicalHistory: "No major history",
        symptoms: conditions[i % conditions.length],
        emergencyContact: `9811100${String(i + 1).padStart(3, "0")}`,
        photoUrl: `https://i.pravatar.cc/300?img=${i + 30}`,
        profilePhoto: `https://i.pravatar.cc/300?img=${i + 30}`,
      });
    });

    for (const user of users) {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      const dbUser = await User.findOneAndUpdate(
        { email: user.email },
        { ...user, password: hashedPassword },
        { upsert: true, returnDocument: "after", setDefaultsOnInsert: true }
      );
      createdUsers[user.email] = dbUser;
    }

    const labNames = [
      ["Dr Lal PathLabs", "Noida", "Noida Sector 18", "+91 9876543210", "9 AM - 8 PM", "lab1@healthcare.com"],
      ["Apollo Diagnostics", "Delhi", "Connaught Place, New Delhi", "+91 9876543211", "8 AM - 9 PM", "lab2@healthcare.com"],
      ["Thyrocare", "Ghaziabad", "Raj Nagar, Ghaziabad", "+91 9876543212", "9 AM - 7 PM", "lab3@healthcare.com"],
      ["Redcliffe Labs", "Lucknow", "Hazratganj, Lucknow", "+91 9876543213", "8 AM - 8 PM", "lab4@healthcare.com"],
      ["HealthFirst Diagnostics", "Kanpur", "Civil Lines, Kanpur", "+91 9876543214", "9 AM - 6 PM", "lab5@healthcare.com"],
    ];

    for (const [name, city, address, phone, workingHours, assistantEmail] of labNames) {
      await Lab.findOneAndUpdate(
        { assistantId: createdUsers[assistantEmail]._id },
        {
          name,
          city,
          address,
          phone,
          workingHours,
          assistantId: createdUsers[assistantEmail]._id,
          availableTests: ["CBC Test", "Blood Sugar", "LFT", "KFT", "Thyroid Profile", "Vitamin D"],
        },
        { upsert: true, returnDocument: "after", setDefaultsOnInsert: true }
      );
    }

    const doctorEmails = doctorSeeds.map((d) => d[1]);
    const patientEmails = patientNames.map((_, i) => `patient${i + 1}@healthcare.com`);

    const appointmentDocs = [];
    for (let i = 0; i < 50; i += 1) {
      const patient = createdUsers[patientEmails[i % patientEmails.length]];
      const doctor = createdUsers[doctorEmails[i % doctorEmails.length]];
      const date = new Date("2026-06-01");
      date.setDate(date.getDate() + i);
      appointmentDocs.push({
        patientId: patient._id,
        doctorId: doctor._id,
        patientName: patient.name,
        patientAge: patient.age,
        patientSex: patient.sex,
        condition: conditions[i % conditions.length],
        disease: conditions[i % conditions.length],
        patientLocation: patient.address,
        appointmentDate: date,
        appointmentTime: `${9 + (i % 8)}:30 AM`,
        status: statuses[i % statuses.length],
        paymentStatus: paymentStatuses[i % paymentStatuses.length],
        notes: "Follow-up required if symptoms persist.",
      });
    }

    await Appointment.deleteMany({});
    const createdAppointments = await Appointment.insertMany(appointmentDocs);

    const paymentDocs = [];
    for (let i = 0; i < 40; i += 1) {
      const appt = createdAppointments[i % createdAppointments.length];
      paymentDocs.push({
        patientId: appt.patientId,
        amount: 300 + (i % 8) * 100,
        paymentMethod: i % 3 === 0 ? "offline" : "online",
        status: ["Pending", "Paid", "Failed", "Refunded"][i % 4],
        sourceType: "appointment",
        sourceId: appt._id,
      });
    }
    await Payment.deleteMany({});
    await Payment.insertMany(paymentDocs);

    const firstPatient = createdUsers[patientEmails[0]];

    const sampleLab = await Lab.findOne({ name: "Dr Lal PathLabs" });
    await LabBooking.findOneAndUpdate(
      { patientId: firstPatient._id, labId: sampleLab._id, testName: "CBC Test" },
      {
        patientId: firstPatient._id,
        patientName: firstPatient.name,
        labId: sampleLab._id,
        labName: sampleLab.name,
        city: sampleLab.city,
        testName: "CBC Test",
        appointmentDate: new Date("2026-06-10"),
        timeSlot: "10:00 AM - 10:30 AM",
        status: "Pending",
      },
      { upsert: true, returnDocument: "after" }
    );

    const allLabs = await Lab.find();
    const reports = [];
    for (let i = 0; i < 20; i += 1) {
      reports.push({
        reportType: ["Lab Report", "Prescription", "Medical Record"][i % 3],
        patientId: createdUsers[patientEmails[i % patientEmails.length]]._id,
        doctorId: createdUsers[doctorEmails[i % doctorEmails.length]]._id,
        labId: allLabs[i % allLabs.length]._id,
        filePath: `/uploads/reports/dummy-report-${i + 1}.pdf`,
        notes: "Seeded report record",
      });
    }
    await Report.deleteMany({});
    await Report.insertMany(reports);

    await Notification.deleteMany({});
    await Notification.insertMany([
      { type: "appointment", message: "New appointment booked", isRead: false },
      { type: "doctor", message: "New doctor registration approved", isRead: false },
      { type: "payment", message: "Payment completed successfully", isRead: false },
      { type: "report", message: "Report uploaded", isRead: true },
      { type: "lab", message: "Lab booking created", isRead: false },
    ]);

    await Setting.findOneAndUpdate(
      { key: "system" },
      {
        value: {
          adminName: "Admin User",
          adminEmail: "admin@healthcare.com",
          adminPhone: "9876500030",
          hospitalName: "Healthcare Central",
          brandLogo: "",
          contactDetails: "support@healthcare.com",
          emailConfig: "smtp enabled",
          paymentConfig: "razorpay",
        },
      },
      { upsert: true, new: true }
    );

    console.log("Dummy data seeded successfully (10 doctors, 30 patients, 50 appointments, 40 payments, 20 reports).");
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error.message);
    process.exit(1);
  }
};

runSeed();
