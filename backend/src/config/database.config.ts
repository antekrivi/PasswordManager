import mongoose from 'mongoose';

export const dbConnect = async () => {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    throw new Error("❌ MONGO_URI is not defined in .env");
  }

  try {
    await mongoose.connect(mongoUri);
    console.log("✅ MongoDB connected!");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  }
};
