import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const mongoUri = process.env.ATLASDB_URL || process.env.MONGO_URI;
    await mongoose.connect(mongoUri);

    console.log("MongoDB Connected");
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
};

export default connectDB;
