import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["patient", "doctor", "lab", "admin"],
      required: true,
    },

    age: Number,
    gender: String,
    sex: String,
    phone: String,
    address: String,
    disease: String,
    specialization: String,
    experience: Number,
    education: String,
    reviews: String,
    hospitalLocation: String,
    availabilityTime: String,
    photoUrl: String,
    profilePhoto: String,
    qualification: String,
    bio: String,
    hospitalName: String,
    city: String,
    workingHours: String,
    bloodGroup: String,
    medicalHistory: String,
    symptoms: String,
    emergencyContact: String,
    accountStatus: {
      type: String,
      enum: ["Active", "Inactive", "Blocked"],
      default: "Active",
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
