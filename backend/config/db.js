import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const mongoUri = process.env.ATLASDB_URL || process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error("Missing MongoDB URI. Set ATLASDB_URL or MONGO_URI.");
    }

    if (mongoose.connection.readyState === 1) {
      return mongoose.connection;
    }

    await mongoose.connect(mongoUri);

    console.log("MongoDB Connected");
    return mongoose.connection;
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    throw error;
  }
};

export default connectDB;
