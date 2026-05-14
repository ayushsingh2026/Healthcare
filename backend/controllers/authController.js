import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

const authPayload = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  age: user.age,
  gender: user.gender,
  sex: user.sex,
  phone: user.phone,
  address: user.address,
  disease: user.disease,
  profilePhoto: user.profilePhoto || user.photoUrl || "",
  token: generateToken(user._id),
});

export const registerUser = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role,
      age,
      gender,
      sex,
      phone,
      address,
      disease,
      specialization,
      qualification,
      experience,
      hospitalName,
      hospitalLocation,
      availabilityTime,
      bio,
      city,
      workingHours,
    } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const uploadedPhoto = req.file ? req.file.path.replace(/\\/g, "/") : "";
    const normalizedRole = role || "patient";
    const baseData = {
      name,
      email,
      password: hashedPassword,
      role: normalizedRole,
      age,
      gender,
      sex,
      phone,
      address,
      profilePhoto: uploadedPhoto,
      photoUrl: uploadedPhoto,
    };

    if (normalizedRole === "patient") {
      Object.assign(baseData, { disease });
    } else if (normalizedRole === "doctor") {
      Object.assign(baseData, {
        specialization,
        qualification,
        education: qualification,
        experience,
        hospitalName,
        hospitalLocation,
        availabilityTime,
        bio,
      });
    } else if (normalizedRole === "lab") {
      Object.assign(baseData, { city, workingHours });
    }

    const user = await User.create(baseData);

    res.status(201).json(authPayload(user));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    const user = await User.findOne({ email, role });

    if (!user)
      return res.status(400).json({ message: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);

    if (!match)
      return res.status(400).json({ message: "Invalid credentials" });

    res.json(authPayload(user));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMe = async (req, res) => {
  res.json(req.user);
};

export const uploadMyProfilePhoto = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "Photo is required" });
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });
    const photoPath = req.file.path.replace(/\\/g, "/");
    user.profilePhoto = photoPath;
    user.photoUrl = photoPath;
    await user.save();
    res.json(authPayload(user));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
